# Portfolio copy

The portfolio retains its existing layout, media, personal projects, and experience accordions.
Resume-backed client work lives inside IOA Digital rather than new public project cards.
Blue Pearl, TCAT, The Contractor Consultants, and BKL-Net describe delivered behavior and measured outcomes from the supplied resume transcription.
Oakhart remains, with its unsupported estimated savings removed.
Panago is described as a demonstration, and BlueShift as document translation and analysis workflows.
The hero, about text, technology list, and search metadata focus on AI implementation and full-stack delivery.

## Validation

Use `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:e2e:smoke`.
Browser tests mock GitHub responses and use local-only browser storage.
Proof artifacts belong outside the worktree in the task evidence directory.

## Delivery notes

The lint command now uses ESLint's flat configuration for Next.js 16.
Tailwind's animation plugin uses an ES module import, and the hero observer cleans up the same element it observed.
Vitest covers the rendered positioning and retained accordion entries.
Playwright covers desktop and mobile expansion, resume outcomes, metadata, and text overflow with mocked GitHub responses.
The pull request workflow runs lint, a separate type check, unit tests, a production build, and Chromium smoke tests.
Local browser validation used an already-installed Chromium executable through `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.
The required browser CLI failed with `BRIDGE_NOT_READY`; the approved fallback used real Playwright captures.
A Lavish preview outside the repository showed the proposed copy and rendered desktop/mobile views before approval to commit.
