# Order-placed email notification — setup

Sends an email to `jan.wagebach@nrc-team.com` and `info@nrc-team.com`
whenever a rider places an order in any of the three stores (apparel-store,
4endurance-store, or the general store) — they all write to the same shared
`public.orders` table.

Function: `supabase/functions/notify-order-placed/index.ts`

This reuses `RESEND_API_KEY`, `WEBHOOK_SECRET`, and `NOTIFICATION_FROM_EMAIL`
already set up for `notify-mitgliedsantrag-upload` — no need to set those
again unless you want a different sender/secret for this function.

## 0. Add the user_email column

The checkout pages now write the logged-in user's email directly onto the
order row (avoids the edge function needing access to the `private` schema).
Run this once in the SQL Editor:

```sql
alter table public.orders add column if not exists user_email text;
```

## 1. Set the recipients (optional)

Defaults to `jan.wagebach@nrc-team.com,info@nrc-team.com` if not set:

```bash
supabase secrets set ORDER_NOTIFICATION_RECIPIENTS="jan.wagebach@nrc-team.com,info@nrc-team.com"
```

## 2. Deploy the function

```bash
supabase functions deploy notify-order-placed --no-verify-jwt
```

## 3. Create the Database Webhook

In the Supabase Dashboard: **Database > Webhooks > Create a new hook**.

1. Name: `notify-order-placed`.
2. Table: `orders`, schema `public`.
3. Events: **Insert** only (order creation is always a plain INSERT, never
   an UPDATE — see the code comment in the function for why).
4. Type: **Supabase Edge Functions**.
5. Edge Function: `notify-order-placed`.
6. HTTP Headers: add `x-webhook-secret` with the same value already used
   for `WEBHOOK_SECRET` (the one from the Mitgliedsantrag webhook setup).
7. Save.

## 4. Test it

Place a test order in any store and confirm both inboxes receive the
email. Check function logs with:

```bash
supabase functions logs notify-order-placed
```

Note: `order_items` (the line items) are inserted by the browser in a
second, separate request right after the order itself, so occasionally the
notification email may say "Items not attached yet" if it fires before that
second insert lands — the order id, rider, and total are still correct in
that case, and the full item list is visible in the admin dashboard
(`/dashboard/all-orders`).
