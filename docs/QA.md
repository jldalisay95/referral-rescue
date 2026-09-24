# Verification record · 24 September 2026

## Passed

- `node tests/validate.mjs`: 3 structured fictional cases, 18 decision nodes, 54 choices, one or more preferred responses per step, complete feedback and four consequence values.
- `node tests/runtime.mjs`: simulated Quick, Live, and Practice flows (27 decisions across the modes), live reveal gate, hints, wrong-answer retry, case progression, and endings.
- `node --check app.js` and `node --check scenarios.js`: JavaScript syntax accepted.
- Local HTTP check at `/referral-rescue/`: `index.html`, JS, CSS, icon, and evidence notes all returned HTTP 200. Relative URLs support the GitHub Pages project path.
- Source review: NPC Data Privacy Act, WHO RHIS data use, OpenHIE architecture, educational feedback research, W3C WCAG 2.2, and GitHub Pages official documentation were checked. The supplied 28-slide keynote PDF was read to align the cases with Ana, the referral handoff, and the return loop.
- Static code inspection: no real identifiers, form for patient data, gameplay analytics, fetch calls, or backend dependency. Optional GA4 is consent-gated, page-view-only, and does not receive patient data or gameplay details. Progress save is opt-in, guarded against unavailable storage, and resettable.

## Not verified in this environment

- Visual desktop and mobile screenshots, actual keyboard and screen-reader behavior, and console output in a running graphical browser. The `agent-browser` CLI was absent, the installed Playwright package had no browser binary, browser download was blocked, and the cloud browser rejected localhost. The flow tests use a lightweight DOM harness; they are not a substitute for browser testing.
- A representative participant or colleague has not tried the game. No usability result is claimed.
- GitHub Pages deployment has been performed for the current release. Test the published URL, including analytics consent behavior, before placing a QR code in the deck.
- Formal WCAG conformance and Philippine HIM/privacy expert review have not been performed.
- The official invitation and organizer assessment package were not supplied here. The game avoids quoting the updated Info 1 criteria that the keynote deck itself marks for confirmation.

## Before public use

Open the site on a phone and a projected laptop screen; play all three modes; tab through buttons, dialog, hints, and replay; use a screen reader if available; check browser console and reduced-motion setting; ask one colleague to play Quick Play without instructions. Review any local referral wording against the approved workflow. Record findings and revise as needed.
