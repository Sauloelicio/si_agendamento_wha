
- Multi-tenant: every tenant table carries business_id referencing public.businesses; owner access via is_business_owner(). Why: isolate each subscriber data in one database.
- Tenant #1 (Laryssa) uses fixed id 00000000-0000-0000-0000-000000000001 as column default during migration. Why: keep the live single-tenant app working until frontend passes business_id.
