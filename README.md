# Referral Rescue: The Information Journey

A small, static educational game for John Lemuel Dalisay’s Health Information Management talk at the Regional LHS ML Info 1 Summit. All people and facilities are fictional. **This does not measure official LHS maturity, certify privacy compliance, or provide clinical guidance.**

## Play and edit

Open `index.html` in a modern browser that permits local JavaScript modules, or preview from a local static server:

```sh
python3 -m http.server 8000 --directory .
```

Visit `http://localhost:8000/` from this folder. There are no dependencies or build commands. Edit `scenarios.js` to change cases, choices, and feedback; edit `styles.css` for appearance. Each choice carries `good`, `feedback`, and a four-number `delta` for the illustrative continuity, data quality, privacy, and usefulness indicators. Keep at least one `good:true` choice per step. `tests/validate.mjs` checks structure and branches with `node tests/validate.mjs`.

The game has Quick Play (six decisions), Live Demo (three decisions, explicit reveal), and Practice (three six-decision cases). Wrong choices have an explanation and a retry option in solo modes. The application does not request names or patient data. Progress saving is off by default; opting in saves only completed case IDs on this device. The app makes no game API calls and uses no analytics, ads, remote fonts, or external assets. Outbound source links in About are opened only if selected. Hosting providers may log visits independently.

## Publish from this repository

The game is prepared on a review branch. After reviewing and merging the pull request into `main`:

1. In `jldalisay95/referral-rescue`, choose **Settings → Pages → Build and deployment → Deploy from a branch**. Select `main` and `/ (root)`, then save.
2. Wait for Pages to publish, then visit `https://jldalisay95.github.io/referral-rescue/`. All asset URLs are relative and work under this project subpath.
3. Test Quick Play, Live Demo, Practice, and About on a phone and a projected laptop before using the URL or a QR code at an event.

Merging the pull request and enabling Pages are separate publishing steps. Neither has been performed in this draft. GitHub's current instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

If reusing the game in a repository named `USERNAME.github.io`, place these files at its root and publish from `main`/`(root)`; its default URL will be `https://USERNAME.github.io/`.

## Offline and accessibility

The core app has no remote dependencies. Once the files are present locally, it can be served without external connectivity. It does **not** install a service worker, so a first visit to the hosted URL still needs connectivity and offline caching is browser dependent. For a no-internet room, keep this folder on the facilitator laptop and serve it locally, or use the paper fallback in `docs/FACILITATOR.md`.

Native buttons, visible focus, live feedback, text labels, reduced-motion CSS, and touch-friendly controls support accessibility. This is an implementation target, not a claim of formal WCAG certification. Test with your audience’s devices and assistive technologies before a public event.

## Documents

- `docs/FACILITATOR.md` — live run sheet, speaking lines, and paper fallback.
- `docs/EVIDENCE.md` — source mapping, design rationale, and limits.
- `docs/QA.md` — performed checks and remaining gaps.

Code and original visual design: MIT license (`LICENSE`). Scenario text is supplied for educational adaptation under the same license. Source material linked in the evidence notes retains its own copyright.
