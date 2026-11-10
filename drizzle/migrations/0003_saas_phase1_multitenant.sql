CREATE TABLE public.businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  whatsapp text NOT NULL,
  plan text NOT NULL DEFAULT 'start',
  primary_color text NOT NULL DEFAULT '#D4AF37',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.businesses TO anon;
GRANT SELECT, INSERT, UPDATE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "owner insert business" ON public.businesses FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "owner update business" ON public.businesses FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

INSERT INTO public.businesses (id, owner_id, name, slug, whatsapp)
VALUES ('00000000-0000-0000-0000-000000000001',
  (SELECT user_id FROM public.user_roles WHERE role='admin' LIMIT 1),
  'laryssaresende.nails', 'laryssaresende-nails', '557996737776');

CREATE OR REPLACE FUNCTION public.is_business_owner(_business_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ select exists(select 1 from public.businesses where id=_business_id and owner_id=auth.uid()) $$;

CREATE TABLE public.professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.professionals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professionals TO authenticated;
GRANT ALL ON public.professionals TO service_role;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read professionals" ON public.professionals FOR SELECT USING (true);
CREATE POLICY "owner write professionals" ON public.professionals FOR ALL TO authenticated
  USING (public.is_business_owner(business_id)) WITH CHECK (public.is_business_owner(business_id));

INSERT INTO public.professionals (id, business_id, name)
VALUES ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Laryssa');

ALTER TABLE public.services ADD COLUMN business_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES public.businesses(id) ON DELETE CASCADE;
ALTER TABLE public.blocked_dates ADD COLUMN business_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES public.businesses(id) ON DELETE CASCADE;
ALTER TABLE public.business_settings ADD COLUMN business_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES public.businesses(id) ON DELETE CASCADE;
ALTER TABLE public.appointments ADD COLUMN business_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES public.businesses(id) ON DELETE CASCADE;
ALTER TABLE public.appointments ADD COLUMN professional_id uuid DEFAULT '00000000-0000-0000-0000-000000000101' REFERENCES public.professionals(id) ON DELETE SET NULL;
UPDATE public.appointments SET professional_id='00000000-0000-0000-0000-000000000101' WHERE professional_id IS NULL;

CREATE UNIQUE INDEX appointments_pro_slot_unique ON public.appointments (business_id, professional_id, date, time) WHERE status='active';
CREATE INDEX services_business_idx ON public.services(business_id);
CREATE INDEX blocked_dates_business_idx ON public.blocked_dates(business_id);
CREATE INDEX appointments_business_date_idx ON public.appointments(business_id, date);