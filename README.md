# Portfolio — Théophile Doumashie

Site vitrine personnel de Théophile Doumashie, ingénieur systèmes, réseaux et VoIP basé à Lomé, Togo. Construit avec [Astro](https://astro.build) et déployé sur Cloudflare.

Site en production : https://theophile.stagebroad.com

## Stack

- **Astro 7**, sortie statique, avec l'adaptateur `@astrojs/cloudflare`
- **Blog** en collections de contenu Markdown (`src/content/blog`)
- **Formulaire de contact** via Web3Forms
- **Sitemap** (`@astrojs/sitemap`), `robots.txt` et `llms.txt` pour le référencement classique et par agents IA
- Déploiement sur **Cloudflare Workers** via Wrangler (`wrangler.jsonc`)

## Développement

```sh
npm install
npm run dev
```

Le serveur tourne sur `http://localhost:4321`.

## Build et prévisualisation

```sh
npm run build
npm run preview
```

Le build est plus strict que le mode dev : c'est là que se révèlent les erreurs de types et les images introuvables, et c'est aussi à ce moment qu'Astro génère les images optimisées.

## Structure

```text
├── public/                  fichiers statiques (favicon, CSS/JS legacy, robots.txt, llms.txt)
├── src/
│   ├── assets/               images et polices traitées par Astro (badges, fonts)
│   ├── components/           Header, Footer, Certifications, BaseHead...
│   ├── content/blog/         articles de blog (Markdown)
│   ├── data/                 données structurées (certifications, etc.)
│   ├── layouts/               BlogPost.astro, Legal.astro
│   └── pages/
│       ├── index.astro            page d'accueil (une seule page, sections ancrées)
│       ├── blog/                  liste et pages d'articles
│       ├── mentions-legales.md
│       ├── politique-de-confidentialite.md
│       ├── politique-cookies.md
│       └── conditions-utilisation.md
├── astro.config.mjs
├── wrangler.jsonc
└── package.json
```

## Pages légales

Les quatre pages légales (`/mentions-legales`, `/politique-de-confidentialite`, `/politique-cookies`, `/conditions-utilisation`) sont des pages Markdown utilisant le layout `src/layouts/Legal.astro`, liées depuis le pied de page sur tout le site.

Les brouillons et la checklist de mise en conformité (déclaration IPDCP, accessibilité, etc.) vivent dans `politique/`, un dossier volontairement exclu du dépôt (voir `.gitignore`) car destiné à un usage interne, pas à la publication.
