# UMD Garden Crawl

Public campaign website for the UMD Garden Crawl (October 9th - November 8th, 2026). Built with Astro and pnpm. The site explains the event and links out to Proofmode and the Public submission map.

## Commands

| Command         | Action                                  |
| --------------- | --------------------------------------- |
| `pnpm install`  | Install dependencies                    |
| `pnpm dev`      | Dev server at `localhost:4321`          |
| `pnpm test`     | Run Vitest                              |
| `pnpm check`    | `astro check`                           |
| `pnpm build`    | Production build to `./dist/`           |
| `pnpm preview`  | Preview the production build            |

Copy `.env.example` to `.env` to set `PUBLIC_SUBMISSIONS_MAP_URL` locally. Leave it unset to render the Public submission map as coming soon. `PUBLIC_GARDEN_REFERENCE_MAP_URL` is an optional override of the committed Garden reference map Instant App URL; leave it unset to embed the default.
