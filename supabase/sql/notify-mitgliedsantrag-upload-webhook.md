# Mitgliedsantrag upload email notification — setup

Sends an email to `lisa.pankewitz@yahoo.de` and `info@nrc-team.com` whenever a
rider uploads their signed Mitgliedsantrag (registration form).

Function: `supabase/functions/notify-mitgliedsantrag-upload/index.ts`

## 1. Get a Resend API key

1. Sign up at https://resend.com (free tier is enough for this volume).
2. Verify a sending domain (Domains > Add Domain) so you can send from e.g.
   `noreply@nrc-team.com`. Until a domain is verified, Resend only lets
   you send to the account owner's own email, which isn't useful here.
3. Create an API key (API Keys > Create API Key).

## 2. Set the function secrets

```bash
supabase secrets set \
  RESEND_API_KEY=<your resend api key> \
  WEBHOOK_SECRET=<any random string, e.g. `openssl rand -hex 32`> \
  NOTIFICATION_FROM_EMAIL=noreply@nrc-team.com
```

`NOTIFICATION_RECIPIENTS` is optional — it defaults to
`lisa.pankewitz@yahoo.de,info@nrc-team.com` if not set. Only set it if you
want to change the recipients later without redeploying code:

```bash
supabase secrets set NOTIFICATION_RECIPIENTS="lisa.pankewitz@yahoo.de,info@nrc-team.com"
```

## 3. Deploy the function

```bash
supabase functions deploy notify-mitgliedsantrag-upload --no-verify-jwt
```

`--no-verify-jwt` is required because the Database Webhook calls this
function directly, not through a logged-in user's session.

## 4. Create the Database Webhook

In the Supabase Dashboard:

1. Go to **Database > Webhooks > Create a new hook**.
2. Name: `notify-mitgliedsantrag-upload`.
3. Table: `riders`, schema `private`.
4. Events: **Update** only.
5. Type: **Supabase Edge Functions**.
6. Edge Function: `notify-mitgliedsantrag-upload`.
7. HTTP Headers: add `x-webhook-secret` with the same value you used for
   `WEBHOOK_SECRET` above.
8. Save.

The webhook fires on _every_ update to a rider row (e.g. profile edits,
admin notes), not just uploads — that's fine, the function itself checks
whether `registrationFormUrl` was newly set before sending anything.

**If "Webhooks" isn't in your Database sidebar**, run
`supabase/sql/notify-mitgliedsantrag-upload-trigger.sql` in the Supabase
SQL Editor instead — it creates a Postgres trigger that calls the edge
function directly via `pg_net`, which does the same job without needing
the Webhooks UI. Fill in your project ref and `WEBHOOK_SECRET` at the top
of that file before running it.

## 5. Test it

Upload a Mitgliedsantrag as a test rider account and confirm both inboxes
receive the email. Check function logs with:

```bash
supabase functions logs notify-mitgliedsantrag-upload
```
