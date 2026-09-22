-- Fallback for step 4 in notify-mitgliedsantrag-upload-webhook.md, for
-- projects where the Database > Webhooks UI isn't available. This does the
-- same thing a Database Webhook would do: call the edge function whenever a
-- row in private.riders is updated. The edge function itself filters for
-- rows where registrationFormUrl was newly set.
--
-- Run this in the Supabase Dashboard: SQL Editor > New query.
--
-- Before running, replace:
--   <project-ref>       with your project ref (from the dashboard URL)
--   <WEBHOOK_SECRET>     with the same value you passed to
--                        `supabase secrets set WEBHOOK_SECRET=...`

create extension if not exists pg_net with schema extensions;

create or replace function private.notify_mitgliedsantrag_upload()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  perform net.http_post(
    url := 'https://<project-ref>.supabase.co/functions/v1/notify-mitgliedsantrag-upload',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', '<WEBHOOK_SECRET>'
    ),
    body := jsonb_build_object(
      'type', 'UPDATE',
      'table', 'riders',
      'schema', 'private',
      'record', to_jsonb(new),
      'old_record', to_jsonb(old)
    )
  );
  return new;
end;
$$;

drop trigger if exists trg_notify_mitgliedsantrag_upload on private.riders;

create trigger trg_notify_mitgliedsantrag_upload
after update on private.riders
for each row
execute function private.notify_mitgliedsantrag_upload();
