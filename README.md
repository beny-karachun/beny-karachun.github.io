# Beny Karachun — Portfolio

A zero-build static portfolio and project hub. The site is intentionally plain HTML, CSS, and JavaScript so it can be hosted on GitHub Pages, Netlify, Cloudflare Pages, or any standard web server without a build step.

## Publish the main site

The main site is [https://beny-karachun.github.io/](https://beny-karachun.github.io/).
GitHub Pages publishes the root directory of the `main` branch in
[`beny-karachun/beny-karachun.github.io`](https://github.com/beny-karachun/beny-karachun.github.io).
The `.nojekyll` file lets GitHub publish the static files directly.

The local `pages` remote points to this repository. To add it in a new checkout, run:

```bash
git remote add pages https://github.com/beny-karachun/beny-karachun.github.io.git
```

After you commit site changes, publish them with:

```bash
git push pages main
```

The `origin` remote points to the original `benykarachun` repository.
To update that copy, run `git push origin main`.

## Preview locally

From this directory, run:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Main files

- `index.html` — portfolio, selected work, project directory, about, and contact
- `styles.css` — responsive visual system and motion
- `script.js` — navigation, reveal effects, progress indicator, and pointer detail
- `resume.html` / `resume.css` — accessible résumé generated from the newer `CV_Draft.md` content
- `benjamin-karachun-resume.pdf` — current one-page A4 download
- `CV_Draft.pdf` — legacy filename kept in sync with the current résumé

## Updating projects

Project cards live under `#work`, and the complete link hub lives under `#directory` in `index.html`. Add new websites to the directory even if they do not need a full visual card.

## Regenerating the résumé PDF

With the local server running and Chrome installed:

```bash
google-chrome --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
  --print-to-pdf="$PWD/benjamin-karachun-resume.pdf" \
  http://127.0.0.1:4173/resume.html
```
