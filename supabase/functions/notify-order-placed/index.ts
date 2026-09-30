// deno-lint-ignore-file no-explicit-any
//
// Edge Function: email admins when a rider places a store order (any of
// apparel-store, 4endurance-store, or the general store — they all write to
// the shared public.orders table).
//
// Triggered by a Supabase Database Webhook on INSERT of public.orders. The
// checkout pages write the logged-in user's email straight onto the order
// row (user_email column) so this function doesn't need to join against
// private.riders (that schema isn't granted to the service_role by
// default). The order_items rows are inserted by the client in a second,
// separate statement right after the order itself, so they may not exist
// yet when this function runs — it makes a best-effort fetch and just
// notes it if none are found yet, rather than blocking on them.
//
// Setup (see supabase/sql/notify-order-placed-webhook.md for the full
// walkthrough):
//   1. supabase secrets set ORDER_NOTIFICATION_RECIPIENTS=... (optional, has a default)
//      (RESEND_API_KEY, WEBHOOK_SECRET, NOTIFICATION_FROM_EMAIL are reused
//      from the notify-mitgliedsantrag-upload function's secrets)
//   2. supabase functions deploy notify-order-placed --no-verify-jwt
//   3. Database > Webhooks > create one on public.orders (Insert) that POSTs
//      to this function with header `x-webhook-secret: <WEBHOOK_SECRET>`.

import { createClient } from "npm:@supabase/supabase-js@2";

const JSON_HEADERS = { "Content-Type": "application/json" };

const DEFAULT_RECIPIENTS = [
  "jan.wagebach@nrc-team.com",
  "info@nrc-team.com",
];

interface OrderRecord {
  id?: number;
  user_id?: string;
  user_email?: string | null;
  total_price?: number | null;
  currency?: string | null;
  status?: string | null;
  created_at?: string | null;
  delivery_requested?: boolean | null;
  delivery_name?: string | null;
  delivery_address?: string | null;
}

interface DbWebhookPayload {
  type?: string;
  table?: string;
  schema?: string;
  record?: OrderRecord;
  old_record?: OrderRecord | null;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: JSON_HEADERS,
    });
  }

  const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
  const incomingSecret = req.headers.get("x-webhook-secret");
  if (webhookSecret && incomingSecret !== webhookSecret) {
    console.error("unauthorized: secret mismatch");
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  let payload: DbWebhookPayload;
  try {
    payload = (await req.json()) as DbWebhookPayload;
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON body" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  console.log("received payload:", JSON.stringify(payload));

  const order = payload.record;
  if (!order?.id || !order?.user_id) {
    console.log("skipping: no order id/user_id on record");
    return new Response(JSON.stringify({ skipped: true }), {
      headers: JSON_HEADERS,
    });
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not configured");
    return new Response(JSON.stringify({ error: "server misconfigured" }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("product_name, quantity, price_at_time, currency, size, gender")
    .eq("order_id", order.id);

  if (itemsError) {
    console.error("order_items lookup error:", JSON.stringify(itemsError));
  }

  const customerLabel = order.user_email || "unknown email";

  const fromEmail =
    Deno.env.get("NOTIFICATION_FROM_EMAIL") ?? "noreply@nrc-team.com";
  const recipients = (Deno.env.get("ORDER_NOTIFICATION_RECIPIENTS") ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const toList = recipients.length > 0 ? recipients : DEFAULT_RECIPIENTS;

  const itemsHtml =
    items && items.length > 0
      ? `<ul>${items
          .map(
            (item: any) =>
              `<li>${item.quantity} x ${item.product_name}${
                item.size ? ` (size: ${item.size})` : ""
              } — ${item.price_at_time} ${item.currency}</li>`
          )
          .join("")}</ul>`
      : "<p><em>Items not attached yet — check the admin dashboard.</em></p>";

  const subject = `New order #${order.id} placed - ${customerLabel}`;
  const html = `
    <p>${customerLabel} just placed order #${order.id}.</p>
    <p>Total: ${order.total_price ?? "?"} ${order.currency ?? ""}</p>
    ${
      order.delivery_requested
        ? `<p>Delivery requested to: ${order.delivery_name ?? ""}, ${
            order.delivery_address ?? ""
          }</p>`
        : ""
    }
    <p>Items:</p>
    ${itemsHtml}
  `;

  try {
    console.log("sending email from", fromEmail, "to", toList);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toList,
        subject,
        html,
      }),
    });

    const responseText = await res.text();
    console.log("Resend response:", res.status, responseText);

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "failed to send email" }), {
        status: 502,
        headers: JSON_HEADERS,
      });
    }

    return new Response(JSON.stringify({ sent: true }), {
      headers: JSON_HEADERS,
    });
  } catch (error) {
    console.error("notify-order-placed error:", error);
    return new Response(JSON.stringify({ error: "unexpected error" }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
});
