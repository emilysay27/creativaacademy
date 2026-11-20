# Notes for Claude: Creativa Academy website

The owner edits this site only by asking Claude. She is not technical: explain in plain language and keep replies short.

## How publishing works
- Netlify (project `creativamainsite`) publishes creativaacademy.com automatically from the `main` branch of this repository. **Anything merged or pushed to `main` goes live within a minute or two.**
- Plain static site: no build step (`netlify.toml`: publish `.`, functions in `netlify/functions`).
- The old folder on the owner's computer is retired. Never suggest publishing from it or with the Netlify CLI.

## How to make a change
1. Work on a new branch, not directly on `main`.
2. Change only what was asked. Keep the look and wording of everything else.
3. For anything beyond a small text fix, show the owner what will change and get a clear "yes" before updating `main`.
4. After updating `main`, check the live pages (curl creativaacademy.com) and confirm the change is there and nothing else broke.
5. Tell the owner in plain words what changed and that it is live. Every past version can be restored from Netlify's Deploys tab.

## Don't break
- Form tags must keep `data-netlify="true"` and `netlify-honeypot`. Netlify strips them from served pages, but the forms stop working without them in the source.
- Keep the texting consent line (`class="sms-note"`) under every phone field.
- `SUPABASE_ANON_KEY` in `js/registration.js` is the public "anon" key and is meant to be there. Never add service keys, tokens, `.env` files, or family/staff personal information: this repository is public.

## Facts to keep consistent across pages
- Music and yoga are **monthly**. Spanish circle time is daily.
- No infant care. The youngest classroom is 15–17 months (toddlers).
