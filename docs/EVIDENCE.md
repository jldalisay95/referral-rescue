# Evidence and design decisions

Checked 24 September 2026. The game adapts the patient story, handoff, OpenHIE, routine-data, and closing commitment from the user’s 28-slide *Regional LHS ML Info 1 HIM Keynote* (24 September 2026). It does not reuse images, official assessment screenshots, or the deck’s unconfirmed updated scoring formulas.

| ID | Source and what it supports | Game use and limit |
| --- | --- | --- |
| NPC | [National Privacy Commission, RA 10173](https://privacy.gov.ph/data-privacy-act/), especially §3(l), §11, §12–13, §20. Health information is sensitive personal information; processing and security have legal requirements. | Fictional examples favor limited, accountable sharing. “Use the designated channel” is a scenario decision, **not** a universal legal rule or legal advice. |
| WHO-DQA | [WHO, Toolkit for analysis and use of routine health facility data](https://www.who.int/publications/i/item/9789240060616), including its data quality assurance module. | Check source totals, definitions, and completeness before interpreting indicators. The manager case’s 300/600 figures are fictional and do not state an official Info 1 formula. |
| WHO-USE | [WHO, Analysis and use of health facility data](https://www.who.int/data/data-collection-tools/analysis-use-health-facility-data). | Aggregated patterns should support a management question and action. The monthly measures are illustrative local improvement measures. |
| OHIE | [OpenHIE architecture overview](https://guides.ohie.org/arch-spec/architecture-specification/overview-of-the-architecture). | The game portrays point-of-service systems, a governed exchange, and relevant shared services conceptually. It is not a live OpenHIE implementation or a Philippine mandate. |
| TALK | User’s 60-minute Summit keynote, especially slides 3–4, 17–22, 24–26, 28. | Ana, “one trusted story,” referral handoff, return path, and 30-day action. These are speaker framing and educational examples, not official criteria. |
| FEEDBACK | [Liu et al. 2025, systematic review and meta-analysis](https://pubmed.ncbi.nlm.nih.gov/40120163/). | Immediate, specific choice consequences and explanation. Review has only eight meta-analyzed studies and notes heterogeneity; it does not validate this game. |
| RETRIEVAL | [Test-enhanced learning in health professions, BEME Guide No. 48](https://pubmed.ncbi.nlm.nih.gov/29390949/). | Repeated application of earlier concepts in new cases. A design inference, not proof of the game’s outcomes. |
| GAMIFICATION | [Gamified feedback in adaptive retrieval practice](https://research-portal.uu.nl/en/publications/gamified-feedback-in-adaptive-retrieval-practice-points-and-progr/). | Progress bars are secondary to reasons and consequences; motivation and learning effects should not be conflated. |
| ACCESS | [W3C WCAG 2.2](https://www.w3.org/TR/wcag/). | Keyboard operation, visible focus, readable text, reduced motion, and labels. No formal conformance audit was performed. |
| PAGES | [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). | Plain static files and relative paths support user and project Pages URLs. Deployment must still be performed and checked. |

## Decision rules and boundaries

- “Good” choices reflect the stated **fictional workflow**. Real access, referral content, routing, and clinical decisions depend on local policies and context.
- The four indicator bars are qualitative game feedback, initialized at the midpoint and adjusted after choices. They are **not validated scales**, patient outcomes, compliance grades, or official LHS ML scores.
- The WHO and OpenHIE sources support broad information-quality and exchange concepts; the exact choice wording and three-minute loop are design interpretations.
- The talk deck flags variation between the 2022 and organizer-supplied updated KRA 3.1 wording and asks to confirm issuance/effectivity of some updated criteria. The game deliberately avoids quoting or scoring those criteria.
- No official event invitation or organizer assessment package was available in this build. The supplied keynote deck and prompt establish the event context. Review with organizers and a Philippine HIM/privacy expert before claiming endorsement.
