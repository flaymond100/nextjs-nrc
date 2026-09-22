// deno-lint-ignore-file no-explicit-any
//
// Edge Function: email admins when a rider uploads their signed Mitgliedsantrag
// (registration form).
//
// Triggered by a Supabase Database Webhook on UPDATE of private.riders. The
// webhook fires on every update to that table, so this function checks that
// `registrationFormUrl` was just set (or changed) before sending anything.
//
// Setup (see supabase/sql/notify-mitgliedsantrag-upload-webhook.md for the
// full walkthrough):
//   1. supabase secrets set RESEND_API_KEY=... WEBHOOK_SECRET=... [NOTIFICATION_FROM_EMAIL=...] [NOTIFICATION_RECIPIENTS=...]
//   2. supabase functions deploy notify-mitgliedsantrag-upload --no-verify-jwt
//   3. Database > Webhooks > create one on private.riders (Update) that POSTs
//      to this function with header `x-webhook-secret: <WEBHOOK_SECRET>`.
//

// deno-lint-ignore no-explicit-any
const JSON_HEADERS = { "Content-Type": "application/json" };

const DEFAULT_RECIPIENTS = ["lisa.pankewitz@yahoo.de", "info@nrc-team.com"];

interface RiderRecord {
  uuid?: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  registrationFormUrl?: string | null;
}

interface DbWebhookPayload {
  type?: string;
  table?: string;
  schema?: string;
  record?: RiderRecord;
  old_record?: RiderRecord | null;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: JSON_HEADERS,
    });
  }

  const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
  if (webhookSecret && req.headers.get("x-webhook-secret") !== webhookSecret) {
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

  const record = payload.record;
  const oldRecord = payload.old_record;

  const newUrl = record?.registrationFormUrl ?? null;
  const oldUrl = oldRecord?.registrationFormUrl ?? null;

  // Only notify when a registration form was just uploaded (URL newly set or changed).
  if (!newUrl || newUrl === oldUrl) {
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

  const fromEmail =
    Deno.env.get("NOTIFICATION_FROM_EMAIL") ?? "notifications@nrc-team.com";
  const recipients = (Deno.env.get("NOTIFICATION_RECIPIENTS") ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  const riderName =
    [record?.firstName, record?.lastName].filter(Boolean).join(" ") ||
    "A rider";

  const subject = `New Mitgliedsantrag uploaded - ${riderName}`;
  const html = `
    <p>${riderName} (${record?.email ?? "unknown email"}) just uploaded their signed Mitgliedsantrag.</p>
    <p><a href="${newUrl}">View the uploaded document</a></p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipients.length > 0 ? recipients : DEFAULT_RECIPIENTS,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend error:", errorText);
      return new Response(JSON.stringify({ error: "failed to send email" }), {
        status: 502,
        headers: JSON_HEADERS,
      });
    }

    return new Response(JSON.stringify({ sent: true }), {
      headers: JSON_HEADERS,
    });
  } catch (error) {
    console.error("notify-mitgliedsantrag-upload error:", error);
    return new Response(JSON.stringify({ error: "unexpected error" }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
});
