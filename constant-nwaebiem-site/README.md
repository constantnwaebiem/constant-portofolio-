# Constant Nwaebiem: personal website

A fast, static personal site built with [Astro](https://astro.build). Every word on the page lives in a few small content files. You can edit them in a simple online editor (Pages CMS), and the site republishes itself.

- **Fast:** static HTML, self-hosted fonts, and the portrait resized automatically to modern WebP.
- **SEO:** page title and description, social share image, structured data (schema.org `Person`), sitemap and robots.txt.
- **CMS:** edit your content in forms at app.pagescms.org. You don't touch any code.
- **Ready to grow:** new sections or pages drop in as components (for example a journal or press page).

---

## Go live on your own domain (about 30 minutes)

### 1. Buy the domain

Buy it from any registrar, for example Namecheap, Cloudflare or GoDaddy. `constantnwaebiem.com` would be the natural choice if it's available.

### 2. Put the code on GitHub

1. Create a free account at github.com.
2. Click **New repository**, name it `constant-nwaebiem-site`, and choose **Private**.
3. Click **uploading an existing file** and drag in **everything inside this folder**, including the hidden `.pages.yml` file. On a Mac, press ⌘⇧. in Finder to show hidden files.
4. Click **Commit changes**.

### 3. Publish with Vercel (free)

1. Go to vercel.com and choose **Sign up with GitHub**.
2. Click **Add New… → Project**, pick `constant-nwaebiem-site`, and click **Import**.
3. Vercel detects Astro automatically. Click **Deploy**.

About a minute later you'll have a working link like `constant-nwaebiem-site.vercel.app`.

### 4. Connect your domain

1. In Vercel, open the project and go to **Settings → Domains**.
2. Add your domain, e.g. `constantnwaebiem.com`. Say yes to also adding `www`.
3. Vercel shows the DNS records to add. Copy them into your registrar's DNS settings.
4. Wait while it connects. This usually takes minutes but can take up to a few hours. HTTPS is set up automatically.

### 5. Set your address in the site

Open `src/content/site.json` and change `"url"` to your real domain, e.g. `"https://constantnwaebiem.com"`. You can do this in the CMS under **Profile & contact → Website address**. The sitemap, share previews and Google data all use this value.

### 6. Tell Google about the site

1. Go to search.google.com/search-console and add your domain.
2. Verify it (the DNS method works well with Vercel).
3. Under **Sitemaps**, submit `sitemap-index.xml`.

---

## Editing the site (Pages CMS)

1. Go to **app.pagescms.org** and choose **Sign in with GitHub**.
2. Install the Pages CMS GitHub App on your account and give it access to `constant-nwaebiem-site`.
3. Open the repository. You'll see these sections:
   - **Profile & contact:** name, intro, tagline, stats, links, CV, contact text, Google title and description
   - **Impact metrics:** the number cards
   - **Experience:** roles, dates and bullet points
   - **Ventures & research:** project cards
   - **Global footprint:** cities, map positions, NOX PRIVÉ network, languages
   - **Education & certifications**
4. Edit and click **Save**. Each save updates GitHub, and Vercel republishes the live site in about a minute.

Tips:
- In the intro, wrap words in `**double asterisks**` to make them **bold**.
- To replace the CV, upload a new PDF in the **CV** field.
- For map coordinates, west longitudes are negative (London is `-0.128`).

## Replacing the portrait

Replace `src/assets/portrait.jpg` with a new portrait-shaped photo, ideally 4:5 and at least 1080 × 1350. Keep the same file name. Resizing and compression happen automatically.

The social share image is `public/og.jpg` (1200 × 630). Replace it too if you change the photo.

---

## For developers

```bash
# Node 22.12 or newer
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
npm run preview   # serve the production build
npm run map       # regenerate the Global map dots (src/data/mapDots.ts)
```

| Path | What it is |
| --- | --- |
| `src/content/*.json` | All site copy and data (edited by the CMS) |
| `src/components/` | One Astro component per section |
| `src/layouts/Base.astro` | `<head>`: SEO, social tags, structured data, fonts |
| `src/styles/global.css` | Design tokens and styles |
| `src/scripts/site.ts` | Interactions: menu, reveals, counters, accordion, map |
| `public/` | Icons, share image, CV (`public/media`) |
| `.pages.yml` | CMS configuration |
| `vercel.json` | Caching and security headers |

Design: white ground, ink type and platinum accents. Headings use Archivo (expanded), body text uses Instrument Sans, italic accents use Instrument Serif, and labels use DM Mono. All fonts are self-hosted through Fontsource, with no Google Fonts requests.
