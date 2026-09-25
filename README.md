# Referral Rescue: The Information Journey

A small, static educational game for a Health Information Management talk at the Regional LHS ML Info 1 Summit. All people and facilities are fictional. **This does not measure official LHS maturity, certify privacy compliance, or provide clinical guidance.**

## Play and edit

Open `index.html` in a modern browser that permits local JavaScript modules, or preview from a local static server:

```sh
python3 -m http.server 8000 --directory .
```

Visit `http://localhost:8000/` from this folder. There are no dependencies or build commands. Edit `scenarios.js` to change cases, choices, and feedback; edit `styles.css` for appearance. Each choice carries `good`, `feedback`, and a four-number `delta` for the illustrative continuity, data quality, privacy, and usefulness indicators. Keep at least one `good:true` choice per step. `tests/validate.mjs` checks structure and branches with `node tests/validate.mjs`.

The game has Quick Play (six decisions), Live Demo (three decisions, explicit reveal), Practice (three six-decision cases), and Team Quest. Wrong choices have an explanation and a retry option in solo modes. The application does not request names or patient data. Progress saving is off by default; opting in saves only completed case IDs on this device. Optional Google Analytics is page-view-only and loads only after visitor consent; it does not receive patient data or gameplay details. The app uses no ads, remote fonts, or external game assets. Outbound source links in About are opened only if selected. Hosting providers may log visits independently.

Team Quest is a multi-device facilitator mode backed by Supabase Realtime, anonymous Auth, RLS, and an Edge Function. It uses generated player IDs, timed questions, server-validated scoring, and 24-hour room expiry. The Free plan is protected by an application-level enable switch, active-room cap, and rolling daily-session cap; Supabase also restricts service use when its Free-plan quotas are reached.

## Publish from this repository

The game publishes automatically whenever changes reach `main`. The deployment workflow is `.github/workflows/deploy-pages.yml` and can also be started manually from the repository's **Actions** tab.

The first time, open `jldalisay95/referral-rescue`, choose **Settings -> Pages**, and set **Build and deployment -> Source** to **GitHub Actions**. After the workflow completes, visit:

`https://jldalisay95.github.io/referral-rescue/`

All asset URLs are relative and work under this project subpath. Before sharing the URL or a QR code at an event, smoke-test Quick Play, Live Demo, Practice, and About on a phone and a projected laptop. Deployment status and the published URL are shown in the workflow run and Pages settings.

For an offline room, keep this folder on the facilitator laptop and serve it locally with the command above, or use the paper fallback in `docs/FACILITATOR.md`.

GitHub's Pages setup instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

### Enable Team Quest with Supabase

The configured project is `referral-rescue` (`glknsljbqofbkchclfba`) in `ap-southeast-1`. Enable **Anonymous sign-ins** in Supabase Auth, run `supabase/migrations/001_team_quest.sql`, and deploy `supabase/functions/team-quest`. Set the Edge Function secret `SUPABASE_SECRET_KEY` to the server-only secret (or use Supabase's default `SUPABASE_SERVICE_ROLE_KEY`); never put it in the browser, GitHub Pages artifact, or repository.

For GitHub Pages, add these repository Actions secrets if you want deployment-time configuration injection:

- `SUPABASE_URL` - `https://glknsljbqofbkchclfba.supabase.co`.
- `SUPABASE_ANON_KEY` - the browser publishable key only.

The optional `Deploy Supabase backend` workflow additionally needs `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, and `SUPABASE_DB_PASSWORD`. The access token and database password are deployment credentials, not browser configuration.

The checked-in `supabase-runtime-config.js` contains the publishable key because publishable keys are intended for browser clients protected by RLS. The Pages workflow overwrites it when both secrets exist. The Supabase CLI is not required to run the solo game, but it is required for `supabase db push` and `supabase functions deploy team-quest`; alternatively paste the migration into the Supabase SQL Editor and deploy the function from its dashboard/CLI workflow.

To disable Team Quest before a quota is reached, set `team_quest_config.enabled` to `false`. The Edge Function also rejects new rooms at the configured active-room and rolling 24-hour session limits. Existing rooms expire after 24 hours. Supabase Free has provider-enforced quotas and restrictions; it does not offer an instantaneous Firebase-style quota-shutdown extension.

If reusing the game in a repository named `USERNAME.github.io`, place these files at its root and publish from `main`/`(root)`; its default URL will be `https://USERNAME.github.io/`.

## Offline and accessibility

The core solo app has no required remote dependencies. Once the files are present locally, it can be served without external connectivity. Analytics is optional and disabled unless a visitor explicitly allows it. Team Quest requires Supabase connectivity and is unavailable offline. The app does **not** install a service worker, so a first visit to the hosted URL still needs connectivity and offline caching is browser dependent.

Native buttons, visible focus, live feedback, text labels, reduced-motion CSS, and touch-friendly controls support accessibility. This is an implementation target, not a claim of formal WCAG certification. Test with your audience's devices and assistive technologies before a public event.

## Documents

- `docs/FACILITATOR.md` - live run sheet, speaking lines, and paper fallback.
- `docs/EVIDENCE.md` - source mapping, design rationale, and limits.
- `docs/QA.md` - performed checks and remaining gaps.

Code and original visual design: MIT license (`LICENSE`). Scenario text is supplied for educational adaptation under the same license. Source material linked in the evidence notes retains its own copyright.
