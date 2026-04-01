create or replace function log_audit_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_action audit_action;
  v_entity_id uuid;
begin
  if tg_op = 'INSERT' then
    v_action := 'insert';
    v_entity_id := new.id;
  elsif tg_op = 'UPDATE' then
    v_action := 'update';
    v_entity_id := new.id;
  elsif tg_op = 'DELETE' then
    v_action := 'delete';
    v_entity_id := old.id;
  else
    v_action := 'system_event';
    v_entity_id := coalesce(new.id, old.id);
  end if;

  if tg_table_name = 'organizations' then
    v_org_id := coalesce(new.id, old.id);
  else
    v_org_id := coalesce(new.organization_id, old.organization_id);
  end if;

  insert into public.audit_logs (
    organization_id,
    actor_user_id,
    action,
    entity_type,
    entity_id,
    before_data,
    after_data,
    metadata
  )
  values (
    v_org_id,
    auth.uid(),
    v_action,
    tg_table_name,
    v_entity_id,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end,
    jsonb_build_object('table', tg_table_name)
  );

  return coalesce(new, old);
end;
$$;