# NakshatraAI Technical Audit and Implementation Plan

Audit date: 2026-09-18

## Implementation status (updated 2026-09-18)

- Completed: release-blocking entitlement and quota fixes, same-origin mutation protection, re-authenticated deletion, strict core validation, working lint/type/test/build gates, dependency security upgrade, revocable sessions, durable auth rate limits, explicit birth timezone/coordinates/unknown-time handling, idempotent durable chat states, provider timeouts, real KundliAPI adapters for Vedic charts/predictions/compatibility, Razorpay checkout and signed idempotent webhooks, entitlement expiry, security headers, health endpoint, CI workflow, onboarding/runbook, and lazy-loaded PDF dependencies.
- Configuration required before external features activate: `KUNDLI_API_KEY`, `GROQ_API_KEY`, and Razorpay credentials/webhook registration. These paths fail closed without credentials.
- Deployment work still required: production PostgreSQL provisioning/migration, provider account setup and reference-chart/domain sign-off, webhook end-to-end testing in Razorpay test mode, privacy/legal copy, backup/restore and monitoring vendor configuration, comprehensive browser/accessibility/localization tests, email provider selection for verification/password reset, and production geocoding/autocomplete provider selection.

## Executive summary

The application builds successfully and has a coherent Next.js/Prisma structure, but it is a prototype rather than a production-ready astrology product. The largest risks are not compilation errors; they are authorization flaws, placeholder domain logic presented as real astrology, bypassable usage limits, incomplete payment handling, weak validation, and the absence of automated tests and operational safeguards.

Do not launch paid plans until Phase 0 and Phase 1 are complete. Do not advertise accurate or personalized astrology until the real calculation engine and its verification suite are complete.

## Current feature inventory

| Feature | Current implementation | Status |
|---|---|---|
| Landing page | Hero, features, workflow, pricing, testimonials, languages, footer | UI complete; several claims do not match implementation |
| Authentication | Email/password signup, login, logout, JWT cookie, protected dashboard | Functional baseline; security and abuse controls incomplete |
| User profile | Name, language, birth date/time/place, account deletion | Functional baseline; weak validation and no geocoding/timezone resolution |
| Dashboard | Counts for charts, daily prediction, chat usage, plan | Functional; day boundaries and stale layout state can be wrong |
| Kundli | Create/list/detail, chart UI, client-side PDF | Mock chart data; Western mode is not Western astrology; incomplete birth data accepted |
| Predictions | Date picker, stored daily result, free history restriction | Three static templates; no transit or birth-chart calculation |
| Compatibility | Partner form, history, premium category details | Pseudo-random score; neither person's actual chart is calculated |
| AI chat | Groq chat, persisted history, daily free limit, clear history | Functional integration; limit bypass/races, weak safety/claims, pagination UX issues |
| Plans/upgrade | Free, monthly, yearly UI and feature flags | No payment integration; Premium can be self-assigned |
| Localization | English, Hindi, Spanish, French, Arabic dictionaries and RTL toggle | Partial; much dashboard text is hard-coded and server/client preference can diverge |
| Quality/operations | Production build succeeds | No tests, no working non-interactive lint, no CI, no observability/runbook |

## Confirmed findings

### P0 — release-blocking security and commercial integrity

1. **Any user can grant themselves a paid plan.** Signup accepts `premium` or `yearly` from the request body (`src/app/api/auth/signup/route.ts`), and an authenticated client can directly PATCH `/api/user/plan` (`src/app/api/user/plan/route.ts`). No payment or webhook is verified.
2. **Free chat limits are bypassable.** Daily usage is calculated from chat messages, while DELETE removes those same messages. Clearing chat resets the counter. Concurrent POST requests can also all pass the count check before any user message is inserted.
3. **Paid/product claims are materially inaccurate.** Kundli, predictions, and compatibility use mock/static/hash-based data while the UI advertises accurate planetary positions, high-precision charts, transits, Ashtakoota analysis, and classical-text training. This is a product, trust, and potentially consumer-protection risk.
4. **Destructive account deletion requires only a valid ambient session.** There is no password re-entry/recent-auth check, CSRF token/origin enforcement, or deletion cooling-off/export flow.

### P1 — core correctness and reliability

5. **Kundli generation does not calculate a chart.** It selects one of two templates using user ID length and DOB. Time and place are ignored; missing values are silently replaced by noon and `Unknown`. `western` changes only a label and returns the same Vedic template.
6. **Predictions are not personalized astrology.** Results are selected from three static templates. Arbitrary `type` values are accepted, future dates are allowed, and a birth profile is not required.
7. **Compatibility is not Ashtakoota matching.** Scores depend on partner-name length, partner DOB milliseconds, and user-ID length. The user's birth details, both birth times, locations, Moon nakshatras, and actual Koota rules are not used.
8. **Date and daily-limit behavior is timezone-unsafe.** The browser generates dates in UTC with `toISOString()`, while the server resets days in its local timezone. Users near midnight and deployments outside the user's timezone can see the wrong prediction date or usage window. Plain `YYYY-MM-DD` values are stored as `DateTime`, increasing off-by-one risk.
9. **Chat persistence is non-atomic and loses user requests on provider failure.** The external AI call occurs before either message is saved, then user and assistant rows are created separately. Failures can lose prompts or create half-conversations; retries have no idempotency key.
10. **Invalid pagination can cause server errors.** `page=abc` or `limit=abc` produces `NaN`, which can reach Prisma in kundli, compatibility, and chat endpoints.
11. **JSON blobs have no runtime schema or migration strategy.** Corrupt Kundli detail JSON causes a 500; list endpoints silently fabricate fallback values. Prediction and compatibility blobs can drift without detection.
12. **Profile validation is incomplete.** Future DOBs, implausible ages, malformed time strings, blank-name updates, and unsupported body shapes are not consistently rejected. Birth coordinates exist in the schema but are never populated.
13. **Plan and feature enforcement is inconsistent.** PDF download is exposed to free users (with only a visual watermark); advertised Dasha/remedy features do not exist; no subscription state, renewal date, cancellation, invoice, or entitlement history is modeled.
14. **Chat history pagination is logically wrong for a conversation UI.** GET orders ascending and takes the first 30, so long-time users see the oldest messages rather than the latest context. There is no “load older” UI, and the remaining daily quota is not returned on initial load.
15. **AI safety and privacy controls are incomplete.** Personally identifying birth data is sent to a third-party model without an explicit consent/retention disclosure. There is no moderation strategy, prompt-injection policy, provider timeout/retry, cost ceiling, or structured medical/legal/financial escalation behavior beyond prompt text.

### P2 — UX, maintainability, and operations

16. **Authentication abuse protection is process-local.** Login limiting is an in-memory map keyed only by email. It resets on deploy, fails across multiple instances, leaks entries over time, and permits targeted email lockout. Signup and expensive AI endpoints lack robust IP/user rate limiting.
17. **Session controls are minimal.** Seven-day JWTs cannot be revoked individually, lack session/version IDs, and have no issuer/audience validation or key rotation path. Changing a password/session revocation is not implemented.
18. **Client error handling is inconsistent.** Several fetches parse JSON without checking status, 401 responses do not consistently route to login, failed optimistic chat messages remain visible, and logout redirects even if the API failed.
19. **Dashboard shell data can become stale.** The server-rendered shell receives plan/name/language once; profile and plan changes do not reliably refresh it. Local language can override the database indefinitely and selector changes are not necessarily persisted to the profile.
20. **Localization is incomplete.** Many dashboard, error, toast, confirmation, and PDF strings are English-only. RTL is applied globally, but individual layout/icon/chart behavior has not been tested. Locale-aware dates and server-side initial language are missing.
21. **Accessibility needs a dedicated pass.** Icon-only controls and decorative icons need accessible labels/semantics; destructive confirmation uses browser `confirm`; modal focus management, keyboard navigation, error association, live regions, contrast, and reduced-motion behavior need verification.
22. **The PDF is a screenshot, not a report.** It can be blurry, may clip on different screen widths, has no multi-page layout or embedded structured data, and its output depends on the current responsive DOM. The detail bundle is approximately 290 KB first-load JS because PDF libraries load eagerly.
23. **No deletion/history management exists for individual Kundlis or compatibility records.** Repeated generation creates unlimited duplicate rows and there is no retention policy.
24. **Data model uses unrestricted strings for enums.** Plan, language, roles, prediction type, and chart type can contain invalid values. SQLite is acceptable locally but is a poor default for concurrent production/serverless deployment.
25. **Lint and tests are absent.** `npm run lint` launches an interactive ESLint setup; there are no application unit, integration, or end-to-end tests. The build passing therefore gives limited confidence.
26. **Repository and onboarding hygiene are incomplete.** There is no project README/runbook, the workspace root contains a stray lockfile, `.env.example` uses a plausible placeholder secret without validation guidance, and the database ignore rule does not match `prisma/dev.db`.
27. **Performance and observability are undeveloped.** Dashboard queries are sequential; there is no structured logging, request ID, tracing, error monitoring, metrics, audit log, health check, backup/restore procedure, or external-provider telemetry.

## Implementation roadmap

### Phase 0 — freeze misleading and exploitable paths (1–2 days)

- Force all public signups to `free`; remove `plan` from the signup contract.
- Remove or disable the user-callable plan PATCH route. Put upgrade UI into an explicit “payments unavailable” state until checkout exists.
- Separate immutable usage events/counters from deletable chat history. Add a database-backed, atomic quota reservation keyed by user and UTC/user-local usage period.
- Add server-side origin/CSRF protection to cookie-authenticated mutations and require recent password verification for account deletion.
- Add clear “prototype/demo calculation” labels or disable Kundli/prediction/compatibility generation until real engines are ready. Remove unsupported accuracy/training/payment claims.
- Acceptance: crafted requests cannot create/upgrade paid accounts; clearing history cannot restore quota; parallel requests cannot exceed quota; destructive requests fail without anti-CSRF/re-auth proof.

### Phase 1 — establish contracts, validation, and test infrastructure (3–5 days)

- Add ESLint configuration and make `lint`, `typecheck`, `test`, and `build` non-interactive CI gates.
- Add a schema validator (for example Zod) for every request, query, environment variable, and persisted JSON document. Centralize strict date, time, pagination, enum, and string rules.
- Define typed API success/error envelopes and a shared fetch client that handles non-JSON errors, 401 redirects, aborts/timeouts, and request IDs.
- Add Vitest/Jest unit tests for validation, entitlements, date boundaries, auth helpers, and astrology adapters; add route integration tests with an isolated test database; add Playwright smoke tests for every feature flow.
- Add database enums/check constraints where supported, explicit schema versions for calculation output, and safe JSON parsing without fabricated fallbacks.
- Acceptance: CI fails on lint/type/test/build errors; invalid inputs consistently return 400; malformed stored data is observable and never silently presented as valid astrology.

### Phase 2 — production authentication, sessions, and abuse protection (3–5 days)

- Model sessions with hashed refresh/session tokens, rotation, revocation, last-used timestamps, and a user security version. Add issuer/audience/key-version checks.
- Use a durable rate-limit store (Redis-compatible) with user + IP buckets for login, signup, chat, and generation routes. Avoid account-lockout behavior that attackers can trigger by email alone.
- Add password change/reset, email verification, generic auth responses where enumeration matters, signup uniqueness-race handling, and security event logging.
- Harden cookies (`__Host-` prefix in production where possible), security headers/CSP, request body limits, and secrets validation at startup.
- Acceptance: limits work across instances/restarts; revoked sessions immediately fail; auth race/error cases have automated coverage.

### Phase 3 — normalize birth data and time handling (3–5 days)

- Treat birth date as a calendar date and birth time as validated local wall time, not an implicitly parsed server date.
- Add place autocomplete/geocoding, canonical place ID, latitude, longitude, IANA timezone, timezone offset-at-birth, and user display timezone. Allow an explicit “birth time unknown” state rather than inventing noon.
- Create shared calendar utilities for user-local “today,” daily quota periods, and prediction keys. Validate non-future dates and supported historical ranges.
- Invalidate or version derived charts when birth data changes; preserve the exact normalized input snapshot and engine version with each result.
- Acceptance: boundary tests pass across IST, UTC, DST zones, leap days, and midnight; the same normalized input produces the same calculation everywhere.

### Phase 4 — implement and verify the astrology domain (2–4 weeks; domain review required)

- Define an `AstrologyEngine` interface and choose a licensed/reliable Swiss Ephemeris service or library. Document ayanamsa, zodiac, house system, node mode, coordinate precision, and ephemeris version.
- Kundli: calculate sidereal/Western positions separately, Lagna, houses, nakshatra/pada, aspects, divisional charts as scoped, and deterministic chart rendering from structured output. Require sufficient input or clearly show reduced accuracy.
- Predictions: restrict supported types, derive transits against the natal chart, version the interpretation prompt/rules, prevent future/history access according to entitlements, and store provenance.
- Compatibility: calculate both natal Moon/nakshatra inputs and the eight Kootas using published rules; handle Mangal Dosha and exceptions only after domain sign-off. Do not use names or user IDs as score inputs.
- Build golden-fixture tests from trusted reference charts and have a qualified Vedic astrologer review tolerances and interpretations.
- Acceptance: verified reference charts match expected planetary longitudes/houses within documented tolerance; Vedic and Western outputs differ correctly; all displayed claims are traceable to calculated fields.

### Phase 5 — make AI chat durable, safe, and cost-controlled (4–7 days)

- Persist the user message and reserve quota before provider work in a transaction; track message status (`pending`, `complete`, `failed`) and provider request/idempotency IDs. Refund reservations only under an explicit policy.
- Add provider timeout, bounded retries with jitter, circuit breaker, maximum context/token budgets, model configuration through validated env, and useful fallback UX.
- Fetch the latest N messages correctly, add cursor pagination/load-older behavior, and return quota state on GET.
- Minimize/redact personal data sent to the provider, publish consent and retention information, and add safety classifications/disclaimers for health, legal, financial, crisis, and deterministic-future claims.
- Stop claiming the model is “trained on classical texts” unless that is documented; phrase it as a prompted assistant when appropriate.
- Acceptance: provider failures leave a visible retryable message state; no duplicate billing/messages under retries; quotas remain exact under concurrency; long conversations show latest messages first.

### Phase 6 — real billing and entitlement lifecycle (1–2 weeks)

- Choose one payment provider initially. Create server-side checkout sessions and signed, idempotent webhook handlers; never accept entitlement changes from browsers.
- Model customer/subscription/payment IDs, status, billing interval, period end, cancellation, grace period, webhook event IDs, and entitlement history. Derive access from active subscription state.
- Implement success/cancel/manage-billing flows, invoice links, downgrade behavior, refund/dispute handling, and reconciliation jobs.
- Enforce every entitlement server-side: watermark/export, history, full compatibility, chat, Dasha/remedies. Keep UI gating only as presentation.
- Acceptance: replayed/forged/out-of-order webhooks are safe; cancellation and failed renewal behavior is tested; client requests cannot alter entitlements.

### Phase 7 — frontend consistency, accessibility, and localization (1–2 weeks)

- Introduce a query/cache layer or consistent server actions/fetch hooks; refresh shell/user state after mutations and standardize loading, empty, offline, and error states.
- Replace native confirm with accessible dialogs; add focus trapping/restoration, associated errors, keyboard support, appropriate ARIA/live regions, reduced-motion support, and automated axe checks.
- Move all visible strings into translation resources, persist preference consistently, initialize locale server-side to avoid flashes, and format dates/numbers by locale and timezone.
- Test Arabic RTL layouts explicitly while preserving logical chart orientation where domain conventions require it.
- Dynamically import PDF libraries; generate a print-specific, multi-page report layout with selectable text where practical and enforce export entitlements server-side.
- Acceptance: core flows meet WCAG 2.2 AA checks; each locale has key-parity tests; mobile/desktop/RTL visual regression suites pass.

### Phase 8 — production data and operations (1 week)

- Move production data to PostgreSQL, add migrations for normalized/schema-versioned outputs and usage/billing records, and document rollback/backfill procedures.
- Add structured redacted logs, request IDs, error monitoring, latency/error/quota/provider-cost metrics, audit events, readiness/liveness checks, and alerts.
- Define backup, restore, retention, account export/deletion, privacy policy, provider data-processing disclosures, and incident response.
- Parallelize independent dashboard queries and review database indexes/query plans after realistic load tests.
- Add README, architecture/ADR documents, environment setup, seed/demo warnings, deployment/runbook, and remove/ignore local artifacts correctly.
- Acceptance: restore drill succeeds; load test meets agreed SLOs; alerts fire in a staging failure exercise; a new developer can run the full stack and tests from documentation.

## Recommended test matrix

- **Authentication:** signup/login/logout, duplicate races, expiration, revocation, reset, rate limits, CSRF, cross-user object access.
- **Profile:** all validation boundaries, unknown birth time, geocoding failure, timezone/DST, birth-data change invalidation, deletion re-auth.
- **Kundli:** trusted golden charts, Vedic vs Western, leap/DST/historical dates, missing precision, ownership, corrupted/version-old output.
- **Predictions:** daily/weekly/monthly validation, user-local date boundaries, history entitlement, future-date policy, idempotent generation.
- **Compatibility:** published Koota fixtures, incomplete partner data, premium redaction, duplicate/history behavior, ownership/privacy.
- **Chat:** provider timeout/failure/retry, simultaneous requests, clear-history quota invariance, pagination, prompt injection, safety scenarios, cost ceilings.
- **Billing:** signed/forged/replayed/out-of-order webhooks, success/failure/cancel/refund/dispute, grace periods, entitlement reconciliation.
- **UI:** 320px through desktop, keyboard-only, screen reader landmarks/forms, reduced motion, slow/offline network, all locales and Arabic RTL.

## Suggested delivery order

1. Complete Phases 0–2 before exposing the app to real users.
2. Complete Phase 3 before implementing any real astrology calculation.
3. Complete Phase 4 before restoring accuracy/personalization marketing claims.
4. Complete Phase 5 before scaling AI usage.
5. Complete Phase 6 before charging anyone.
6. Run Phases 7–8 alongside domain work once the API contracts stabilize.

## Baseline verification recorded during this audit

- `npm run build`: passed (Next.js compile, TypeScript validation, and production page generation).
- `npm run lint`: not operational in automation; it opens the ESLint configuration prompt.
- Application tests: none found.
- Audit method: static review of all project-owned TypeScript/TSX, Prisma schema/migration, configuration, feature routes, and build output. Live browser interaction, external Groq behavior, payment behavior, accessibility tooling, and load/security penetration testing remain to be performed.
