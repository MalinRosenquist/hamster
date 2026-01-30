# Hamster

Hamster is a modular web application that helps users catalogue items and simplify searching the Swedish second-hand market.
This MVP focuses on LEGO sets and the Tradera marketplace, combining structured catalog data from Rebrickable with matching Tradera listings in one place.

## Key features

- Browse & discover LEGO themes and sets
- Collection: track sets you already own
- Watchlist: track sets you are looking for
- Item details: show set details and matching Tradera listings
- Simple login via localStorage

## Tech stack

![Next](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-%23CD6799.svg?style=for-the-badge&logo=sass&logoColor=white)
![Upstash](https://img.shields.io/badge/Upstash-00E9A3?style=for-the-badge&logo=upstash&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

## Routes

- `/` – Home
- `/login` – Username login
- `/categories` – Browse LEGO themes
- `/categories/:categoryId` – LEGO theme view
- `/items/:itemId` – Item details (LEGO data + Tradera listings)
- `/collection` – Collection
- `/watchlist` – Watchlist
- `/mypage` – Profile + basic stats
- `/faq` – FAQ

## Getting started

### Install & run

```bash
npm install
npm run dev
```

Visit: <http://localhost:3000>

---

### Environment variables

Create a `.env.local` file in the project root

```bash
# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Mockdata (0 = off, 1 = on)
USE_MOCK_DATA=0

# Rebrickable
REBRICKABLE_API_KEY=

# Tradera
TRADERA_APP_ID=
TRADERA_APP_KEY=

# Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

```

Set `USE_MOCK_DATA=1` to run the app without external API keys.  
Upstash is used for server-side caching of Tradera responses. If you don't want to use caching locally, you can leave the Upstash variables empty and run with `USE_MOCK_DATA=1`.

## Testing

- Cypress E2E tests (multiple smaller test cases covering key flows)
- Manual testing of views, empty states, and error/limit messages

Run Cypress

```bash
npx cypress open
```

## Accessibility

Audited with Lighthouse and tested with keyboard navigation (Tab/Shift+Tab) and basic NVDA checks.

## Deployment

Live URL: <https://hamster-virid.vercel.app/>
Recommended: Vercel (supports both the frontend and Next.js API routes)

## Acknowledgements

- Rebrickable API (LEGO catalog data)
- Tradera API (market listings)

## Disclaimer

This project was built as part of a student degree project (examensarbete).  
It is not affiliated with, endorsed by, or sponsored by the LEGO Group, Tradera, or Rebrickable.  
LEGO® is a trademark of the LEGO Group. Tradera is a trademark of their respective owners.

## Contact

Feel free to contact me if you have any questions about the project.

- Email: <malinrosenquist@outlook.com>
- Live demo: <https://hamster-virid.vercel.app/>
