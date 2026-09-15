# Migration du portfolio vers Astro

Cette archive contient uniquement les fichiers issus de ton site actuel,
convertis pour Astro. Elle ne contient **aucun** fichier du modèle blog :
rien de ce que `npm create astro` a installé ne sera écrasé, à deux
exceptions près signalées plus bas.

## 1. Copier l'archive dans le projet

Décompresse à la racine de `portfolio-astro/`, en fusionnant les dossiers.

```
portfolio-astro/
├── public/          ← ajouté par l'archive
├── functions/       ← ajouté par l'archive
├── src/
│   ├── components/  ← Header.astro et Footer.astro ajoutés
│   ├── pages/       ← index.astro et 404.astro ajoutés
│   ├── content/     ← inchangé (modèle blog)
│   └── layouts/     ← inchangé (modèle blog)
├── astro.config.mjs ← à modifier à la main, voir étape 2
└── package.json
```

**Deux écrasements volontaires :**

- `src/pages/index.astro` — l'accueil du modèle est remplacé par ton portfolio.
- `src/components/Header.astro` et `Footer.astro` — ceux du modèle sont
  remplacés par les tiens, pour que le blog porte la même navigation que
  le portfolio.

Si le modèle avait un `src/pages/index.astro`, sauvegarde-le avant de
décompresser si tu veux pouvoir y revenir.

## 2. Configurer astro.config.mjs

Ouvre le fichier et vérifie la ligne `site`. Elle doit contenir ton
domaine, sans quoi le sitemap et le flux RSS contiendront de mauvaises
URL :

```js
export default defineConfig({
  site: 'https://theophile.stagebroad.com',
  integrations: [mdx(), sitemap()],
});
```

Ne touche pas aux `integrations` déjà présentes.

## 3. Supprimer le sitemap statique

Si un `sitemap.xml` traîne dans `public/`, supprime-le : il écraserait
celui qu'Astro génère, et tes articles n'y figureraient jamais.
Le `robots.txt` de l'archive pointe déjà vers `/sitemap-index.xml`.

## 4. Vérifier en local

```
npm run dev
```

À contrôler sur `http://localhost:4321` :

- le portfolio s'affiche avec ses styles, la 3D et les animations
- `/blog` liste les articles et affiche **ton** en-tête
- `/une-url-inexistante` affiche ta page 404
- le menu ramène bien au portfolio depuis un article

## 5. Déployer

Dans Cloudflare Pages, le projet passe de site statique à site construit :

- Build command : `npm run build`
- Build output directory : `dist`
- Framework preset : Astro

## Ce qui a été modifié dans ton HTML

**Chemins absolus.** `assets/site.css` est devenu `/assets/site.css`.
Sans ça, une page sous `/blog/mon-article/` chercherait ses styles dans
`/blog/assets/` et ne les trouverait pas.

**Directive `is:inline` sur les `<script>`.** Astro compile et regroupe
les scripts par défaut, ce qui casserait l'importmap three.js, le JSON-LD
et tes fichiers servis depuis `public/`. `is:inline` les laisse
exactement tels quels dans le HTML produit.

**Ancres du menu préfixées.** Dans `Header.astro`, `#projets` est devenu
`/#projets`, pour que les liens fonctionnent depuis une page d'article et
pas seulement depuis l'accueil.

**`<style is:inline>` dans la 404**, pour la même raison : sans la
directive, Astro isolerait les règles au composant et celles qui visent
`body` ne s'appliqueraient plus.

## Points à traiter ensuite

- Ajouter un lien « Blog » dans le menu de `Header.astro`.
- Renseigner le `title`, la `description` et le JSON-LD `Article` de
  chaque article — le modèle gère déjà les deux premiers via le
  frontmatter Markdown.
- Ajouter une section « Articles » dans `llms.txt` une fois les premiers
  articles publiés.
