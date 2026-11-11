
- Multi-tenant: every tenant table carries business_id referencing public.businesses; owner access via is_business_owner(). Why: isolate each subscriber data in one database.
- Tenant #1 (Laryssa) uses fixed id 00000000-0000-0000-0000-000000000001 as column default during migration. Why: keep the live single-tenant app working until frontend passes business_id.
- New businesses use tenant_settings; keep legacy business_settings untouched because its singleton constraint cannot support new businesses.
- Create businesses through the authenticated create_business RPC, which starts the trial and creates settings, services and the first professional atomically.
- Use tenant-scoped booking RPCs and an appointment validation trigger; lock the business row to serialize competing reservations and reject overlapping service durations.
- Keep the legacy booking page at its dedicated slug and the SaaS experience at the root; scope legacy public reads to the fixed tenant ID to prevent mixed catalogs.
- SaaS styling uses scoped semantic tokens; preserve the legacy tenant's original theme.
