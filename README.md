# NakshatraAI

Next.js 15 application for verified Vedic charts, sign-based predictions, compatibility matching, AI chat, and paid access.

## Local setup

1. Copy `.env.example` to `.env` and replace every placeholder secret.
2. Run `npm install`.
3. Run `npx prisma migrate deploy && npx prisma generate`.
4. Optionally run `npx prisma db seed` for local demo accounts.
5. Run `npm run dev` and open `http://localhost:3000`.

`ENABLE_DEMO_ASTROLOGY=true` exposes synthetic data and must never be enabled in production. Without a configured `KUNDLI_API_KEY`, genuine astrology generation fails closed with HTTP 503.

## Required production services

- A production SQL database. SQLite is for local development only; migrate the Prisma datasource to PostgreSQL before horizontally scaling.
- KundliAPI credentials and an allowlisted server IP/domain for Vedic calculations.
- Groq credentials for chat (`GROQ_API_KEY`, optionally `GROQ_MODEL`).
- Razorpay keys and webhook secret. Configure the webhook URL as `/api/billing/webhook` and subscribe to `order.paid` and `payment.captured`.

Razorpay credentials stay server-side. A browser can create a checkout order but cannot grant itself an entitlement. Access changes only after a raw-body HMAC-verified, idempotently processed webhook.

## Verification

Run `npm run check` before merging. It executes lint, TypeScript, unit tests, and a production build. `GET /api/health` verifies application/database readiness.

## Security and data handling

- Authentication uses short-lived signed browser cookies backed by revocable database sessions.
- Login and signup abuse counters are database-backed.
- Cookie-authenticated mutations require a same-origin request.
- Account deletion requires the current password.
- Birth data is sent to the configured astrology provider; disclose this in the deployed privacy policy and obtain appropriate consent.
- Chat context and available birth details are sent to Groq; never log API keys or authentication cookies.

## Architecture notes

- `src/lib/auth.ts`: password hashing, JWT validation, revocable sessions.
- `src/lib/astrology-provider.ts`: server-only KundliAPI adapter and normalized results.
- `src/lib/billing.ts`: immutable plan catalog and Razorpay signature validation.
- `src/app/api/`: authenticated route handlers.
- `prisma/migrations/`: ordered database changes; do not edit an applied migration.

The detailed remediation roadmap and audit history are in `IMPLEMENTATION_PLAN.md`.
