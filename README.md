# Creativa Academy Website

Static website for [Creativa Academy](https://www.creativaacademy.com) — a Reggio Emilia
inspired preschool in West Miami, FL. Hosted on Netlify.

## Structure

- `index.html` — homepage
- `about/`, `tuition-financial-aid/`, `parent-resources/`, `gallery/`, `calendar/`, `contact/` — pages
- `css/site.css` — the single site-wide stylesheet (colors, fonts, layout)
- `assets/img/` — images (`home/` = homepage images, `gallery/` = photo gallery)
- `assets/docs/` — parent resource PDFs
- `netlify.toml` — Netlify config + redirects from the old Wix URLs
- `SITE_INVENTORY.md` — full inventory of the old Wix site captured before migration

## Editing

No build step — every page is plain HTML and the styling lives in `css/site.css`.
Edit a file, commit, push: Netlify deploys automatically.

Common tasks:
- **Update the calendar**: replace `assets/img/calendar-july-2026.jpg` and update `calendar/index.html`
- **Add gallery photos**: drop images in `assets/img/gallery/` and add a matching `<a>` block in `gallery/index.html`
- **Update tuition**: edit the tables in `tuition-financial-aid/index.html`
- **Contact form submissions**: arrive via Netlify Forms (site dashboard → Forms), with email notifications configurable there

## Design system

Fonts: Playfair Display (headings) + Jost (body), via Google Fonts.
Palette: cream `#F7F4EC`, sage `#7C8B5E`, deep sage `#5C6B44`, ink `#3B4430`, gold `#B9A15C`.
