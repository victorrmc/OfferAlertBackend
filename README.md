# OfferAlertBackend

Backend for OfferAlert: save clothes from **Zara, Pull&Bear and Bershka** and get an email when they go on sale.

Mobile client: [OfferAlertMobile](https://github.com/victorrmc/OfferAlertMobile)

## How it works

- **Zara**: reads the product JSON (`?ajax=true` on the product URL) and compares `price` with `oldPrice`. No browser needed.
- **Pull&Bear / Bershka**: falls back to opening the page with Puppeteer and looking for a CSS selector stored in `DiscountSelector` for the domain. These sites use strong bot protection, so this may fail from servers.
- You get one email per sale price. If the price drops again you get another one; if it goes back to full price, the next sale is notified again.

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGODB_URI (or DB_PASSWORD), API_KEY_RESEND, NOTIFY_EMAIL
npm start
```

| Script | What it does |
| --- | --- |
| `npm start` | API + in-process cron (`CHECK_CRON`, default every 30 min; `ENABLE_CRON=false` disables it) |
| `npm run check` | Runs one check of all products and exits |
| `npm test` | Unit tests (no network or DB) |
| `npm run test:integration` | Checks the stored store selectors against the real sites (needs DB + internet) |

## Free hosting

- **Database**: MongoDB Atlas free tier.
- **API**: Render free web service with `ENABLE_CRON=false` (it sleeps when idle, so its cron is not reliable; it wakes up when the app calls it).
- **Checks**: the GitHub Action `.github/workflows/check-offers.yml` runs `npm run check` every hour. Add the repository secrets `MONGODB_URI` (or `DB_PASSWORD`), `API_KEY_RESEND` and `NOTIFY_EMAIL`.

## API

| Method | Route | Body / query |
| --- | --- | --- |
| POST | `/api/add-product` | `{ "url": "...", "email": "..." }` (used by the app; checks the product right away) |
| GET | `/api/products` | `?email=you@example.com` – your products with name, price, old price and `onSale` |
| DELETE | `/api/products/:id` | |
| POST | `/api/check-now` | Starts a check of all products |
| POST | `/api/auth/send-code`, `/api/auth/verify-code` | Email verification code |
| POST | `/api/add-discount-selector` | `{ "domain": "bershka.com", "selector": "..." }` for the Puppeteer fallback |
| GET | `/health` | |
