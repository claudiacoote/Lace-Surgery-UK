# Lace Surgery UK — deployment configuration

Static site + Vercel serverless booking request endpoint. **Requests cannot be submitted until the environment variables and Supabase table are configured.**

## Setup
1. Create a Supabase project. Run `supabase/schema.sql` in its SQL editor.
2. Create a Resend account and verify an email-sending domain/address. Set `NOTIFICATION_FROM_EMAIL` to the verified sender (for example, `Lace Surgery UK <bookings@yourdomain.co.uk>`). The requested Gmail address can be used as the reply-to/contact address, but cannot be impersonated without authorised sending configuration.
3. Add these **server-side** Vercel environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `NOTIFICATION_FROM_EMAIL`.
4. Connect the GitHub repository to Vercel and deploy. Do not add secrets to GitHub or browser JavaScript.
5. Test a booking request and verify both notification recipients receive it.

**Current scope:** secure booking request intake, stored in Supabase, with notification attempts to lacesurgeryuk@gmail.com and claudiaacootee@gmail.com. This is NOT a completed approval, Stripe payment, photo-upload, tracking or admin system. Do not advertise payments or automatic approvals until those are implemented and tested.

The Instagram/TikTok gallery requires authorised feed data. No invented customer photos are shown.
