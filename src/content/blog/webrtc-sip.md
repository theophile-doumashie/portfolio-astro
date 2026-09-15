---
title: 'WebRTC pour ceux qui viennent du SIP : ce qui change vraiment'
description: 'SIP over WebSocket, DTLS-SRTP, ICE et TURN expliqués depuis Asterisk. Ce qui reste identique, ce qui change, et les erreurs qui coûtent des heures.'
pubDate: 'Sep 15 2026'
---

Quand on administre des plateformes Asterisk depuis des années, WebRTC a l'air
d'un monde à part. Des acronymes inconnus, des erreurs illisibles dans la
console du navigateur, et l'impression de repartir de zéro.

C'est faux. L'essentiel de ce que vous savez reste valable. Ce qui change est
circonscrit, et se ramène à trois questions : par où passe la signalisation,
comment le média est chiffré, et comment les deux extrémités se trouvent.

Je documente ici ce que j'ai compris en montant une plateforme où le navigateur
de l'agent devient son téléphone. Je ne prétends pas à l'exhaustivité : c'est le
document que j'aurais voulu lire au début.

## La signalisation : même SIP, autre tuyau

Premier soulagement : le SIP ne change pas. Les mêmes `INVITE`, `REGISTER`,
`BYE`, les mêmes en-têtes, le même dialplan. Ce qui change, c'est le transport.

Un softphone classique parle SIP sur UDP 5060, ou sur TCP, ou sur TLS 5061. Un
navigateur ne sait pas ouvrir une socket UDP brute — la sécurité du web
l'interdit. Il parle donc SIP **à l'intérieur d'une connexion WebSocket**, sur
le port 443, via une bibliothèque JavaScript comme SIP.js ou JsSIP.

Côté Asterisk, c'est un transport de plus :

```ini
[transport-wss]
type = transport
protocol = wss
bind = 0.0.0.0
```

Vos traces `pjsip set logger on` restent lisibles, vos dialplans fonctionnent à
l'identique. Un agent WebRTC est un endpoint PJSIP comme un autre.

Point d'attention : `wss` exige du TLS valide, sans exception. Un certificat
auto-signé est refusé par le navigateur, sans message clair. En pratique, la
plupart des déploiements terminent le TLS sur un reverse proxy — Caddy ou nginx
— qui relaie ensuite vers le WebSocket d'Asterisk en clair sur le réseau local.

## Le média : RTP devient SRTP, obligatoirement

Là, le changement est réel. WebRTC impose le chiffrement du média. Pas
d'option, pas de contournement : un navigateur refusera un flux RTP en clair.

Le chiffrement est du SRTP, mais la négociation des clés ne passe pas par SDES
dans le SDP comme en SIP classique. Elle se fait par **DTLS**, une poignée de
main directement entre les deux extrémités du flux média. D'où le nom
DTLS-SRTP : DTLS pour échanger les clés, SRTP pour chiffrer la voix.

Conséquence pratique : votre serveur a besoin d'un certificat pour le média, en
plus de celui du WebSocket, et Asterisk calcule une empreinte qu'il annonce dans
le SDP. Si les empreintes ne correspondent pas, l'appel s'établit côté
signalisation et reste muet. C'est le symptôme classique.

Asterisk simplifie tout cela avec une option unique :

```ini
[agent01]
type = endpoint
webrtc = yes
```

Ce `webrtc = yes` active en une ligne ce qu'il faudrait écrire en sept :
`use_avpf`, `media_encryption = dtls`, `dtls_verify`, `dtls_setup`,
`ice_support`, `media_use_received_transport`, `rtcp_mux`. Commencez par là
avant de régler quoi que ce soit à la main.

## ICE, STUN, TURN : le vrai morceau

C'est la partie qui n'a pas d'équivalent en SIP classique, et celle qui coûte le
plus de temps.

En téléphonie traditionnelle, on résout le NAT en forçant les choses : on
déclare `external_media_address`, on ouvre une plage de ports RTP, et on
s'arrange. WebRTC procède autrement : les deux extrémités **découvrent** les
chemins possibles entre elles, puis testent lequel fonctionne. C'est ICE.

Pour découvrir son adresse publique, un client interroge un serveur **STUN**.
C'est peu coûteux et souvent suffisant.

Quand aucun chemin direct n'existe — NAT symétrique, réseau d'entreprise
verrouillé, opérateur mobile derrière un CGNAT — il faut relayer le flux par un
serveur **TURN**. Et là, attention : TURN fait transiter tout l'audio de l'appel.
Il consomme de la bande passante, ajoute de la latence, et se dimensionne.

La règle que je retiens : STUN pour tout le monde, TURN seulement si vos agents
sont sur des réseaux que vous ne maîtrisez pas. Sur un centre de contacts où les
postes sont sur un LAN connu, on peut souvent s'en passer. Sur du télétravail en
4G, non.

## Les erreurs qui coûtent des heures

**L'appel s'établit mais personne n'entend rien.** Presque toujours le média :
DTLS qui échoue, ou ICE qui ne converge pas. Regardez `chrome://webrtc-internals`
avant de toucher à Asterisk — la page indique l'état de la connexion ICE et les
paires de candidats testées.

**Le navigateur refuse de se connecter en WSS.** Vérifiez le certificat en
premier. Un certificat expiré, une chaîne incomplète ou un nom d'hôte qui ne
correspond pas produisent le même échec silencieux.

**Ça marche au bureau, pas chez l'agent.** C'est la signature d'un TURN manquant.

**L'audio est haché en 4G.** Regardez la gigue avant de blâmer le codec. Sur des
liaisons africaines vers un serveur européen, la latence aller-retour dépasse
facilement les 150 ms, et la gigue devient le facteur limitant bien avant la
bande passante.

## Ce que je retiens

WebRTC n'est pas un remplaçant du SIP, c'est un transport et un mode de
chiffrement de plus. Vos compétences en dialplan, en trunks, en QoS et en
diagnostic restent entièrement pertinentes.

Le vrai apprentissage porte sur ICE. C'est le seul concept sans équivalent dans
la téléphonie classique, et c'est celui qui décide si un appel passe ou non.
Si vous ne devez creuser qu'une chose, creusez celle-là.

---

*Je monte actuellement une plateforme unifiant un CRM et la téléphonie en
WebRTC. Je publierai les arbitrages d'architecture au fur et à mesure. Si vous
travaillez sur un sujet proche, [écrivez-moi](/#contact).*