# UBTV

## Auth configuration

- Copy `.env.example` to `.env` for development. The local frontend uses `http://localhost:3000`; the local auth backend uses `http://localhost:3355`.
- `NEXT_PUBLIC_API_ENDPOINT` is the backend origin, without `/api` or `/auth`. API functions append the `/auth/...` paths.
- `.env.production` contains public production configuration and overrides `.env` during `npm run build`. Set the same production endpoint in Vercel's environment settings. Rebuild after changing any `NEXT_PUBLIC_*` value because Next.js embeds it at build time.
- Use `.env.development.local` for development-only overrides. `.env.local` also affects production builds, so do not put a local API endpoint there when building for production.
- Keep JWT/OTP/SMTP/database secrets in the backend. Values prefixed with `NEXT_PUBLIC_` are public.

## Browser cookies and CORS

The backend's allowed frontend origin must match the browser's origin exactly, including scheme and port. Local requests need `http://localhost:3000`; production requests need `https://ubtv-production.vercel.app`. Auth requests include credentials, and POST requests send `X-App-Request: 1`.

CORS and cookie policy are separate. If the backend uses `SameSite=Lax`, the frontend and backend must be on the same site for refresh cookies to accompany API requests. `localhost:3000` and `localhost:3355` are the same site over HTTP. The production Vercel and Render domains are different sites; allowing the Vercel origin in CORS alone does not make those refresh cookies work. Confirm the production cookie policy or deploy under the same site before relying on reload/session restoration there.

## Auth flow

- Register sends only `name`, `email`, and `password`. A successful registration leads to the existing six-digit email verification form. Registration and verification do not log the user in.
- Login keeps the access token in browser memory. The backend owns the HttpOnly `ubtv.refresh` cookie. Reload restores the session through `/auth/refresh`; `/auth/me` refreshes profile data and retries once after a 401 and successful token refresh.
- After the initial loading step, authentication has two outcomes: a valid session or an anonymous user. Any session restoration or profile-check failure, including network/server errors, clears local authentication. Protected pages then redirect to login; there is no session-error screen or retry-session action.
- Logout clears local authentication immediately. If the server request fails, a visible retry action remains available.
- The profile page shows the current user's name, email, and verification status. There are no role/admin or profile-editing APIs in this integration.
- Route guards control the interface; the backend must authorize every protected API request. Do not put private server data behind a client guard alone.
- Password recovery uses `src/api/auth.ts` and `src/lib/http.ts`: `POST /auth/forgot-password` sends `{ email }`, `POST /auth/verify-reset-password` sends `{ email, code }` and receives `data.resetToken`, then `POST /auth/reset-password` sends `{ email, resetToken, password }`.
- Reset codes expire after 10 minutes, allow at most 5 incorrect attempts, and can be resent after 60 seconds. Reset tokens are single-use and expire after 10 minutes. The backend enforces these limits; the frontend displays errors through toast notifications and observes resend/retry cooldowns.
- A successful password reset invalidates previous sessions on the backend, clears the local session, and requires a new login.
- Auth responses use `{ statusCode, message, data, timestamp }`; API errors use `HttpError` with the HTTP status, normalized error payload, and optional `Retry-After` header.
- Refresh requests are shared within one tab. Cross-tab session coordination is intentionally omitted.
