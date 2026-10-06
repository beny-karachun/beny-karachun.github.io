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

Before you commit site changes, update the asset versions:

```bash
python3 scripts/update_asset_versions.py
```

The script adds a content hash to local CSS, JavaScript, and résumé PDF links.
This lets browsers load the correct files after an update.
Run it again after you regenerate a PDF.

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

## First screen and topic views

The root URL opens a small topic chooser. The five choices use URL fragments:
`#science`, `#software`, `#products`, `#services`, and `#about`.
Each choice shows the relevant sections and project cards. It also sets the hero
and contact text for that topic. `#welcome` returns to the chooser.
`#top` opens the full portfolio from the chooser.

Section links within a topic keep that view. Browser history holds the topic
when visitors use Back, Forward, or reload a section link. A new direct link to
an existing section or project, such as `#circuit-atlas`, opens the full portfolio.
The chooser does not store a visitor preference or track a choice.
Without JavaScript, the chooser links lead to sections in the full page.

## Main files

- `index.html` — portfolio, selected work, project directory, about, and contact
- `styles.css` — responsive visual system and motion
- `script.js` — navigation, reveal effects, progress indicator, and pointer detail
- `resume.html` / `resume.css` — accessible résumé generated from the newer `CV_Draft.md` content
- `benjamin-karachun-resume.pdf` — current one-page A4 download
- `CV_Draft.pdf` — legacy filename kept in sync with the current résumé

## Updating projects

Project cards live under `#work`, and the complete link hub lives under `#directory` in `index.html`. Add new websites to the directory even if they do not need a full visual card.

### Circuit Atlas snapshot

The Circuit Atlas card uses the real full matrix from
[Circuit Atlas](https://brain.technionprep.com/?view=matrix&matrix=full).
The image shows the ipsilateral layer in anatomical division and hierarchy order,
colored by evidence status.
It was captured on 6 October 2026. The collection then reported 1,099 region axes,
1,207,801 cells per laterality layer, 2,992 Allen experiments, about 7.7 million
Allen measurements, and 10 publication or archive sources.
Matrix cells include evidence gaps and overlapping parent and child regions.
They are not a count of confirmed biological connections.
Update the image and the card counts together when the collection changes.

## Regenerating the résumé PDF

With the local server running and Chrome installed:

```bash
google-chrome --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
  --print-to-pdf="$PWD/benjamin-karachun-resume.pdf" \
  http://127.0.0.1:4173/resume.html
```

Copy the new PDF to `CV_Draft.pdf` to keep both download filenames in sync.
Then run `python3 scripts/update_asset_versions.py` before you commit.
