create table public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null default '',
  status text not null check (status in ('draft', 'published', 'archived')),
  collection text not null default '',
  fabric text not null default '',
  fit text not null default '',
  care text not null default '',
  featured boolean not null default false,
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(slug) between 1 and 160),
  check (char_length(name) between 1 and 200),
  check (char_length(description) <= 5000),
  check (char_length(collection) <= 120),
  check (char_length(fabric) <= 500),
  check (char_length(fit) <= 500),
  check (char_length(care) <= 1000),
  check (char_length(seo_title) <= 70),
  check (char_length(seo_description) <= 170)
);

create table public.product_images (
  product_id text not null references public.products(id) on delete cascade,
  position smallint not null check (position between 0 and 19),
  src text not null,
  alt text not null,
  primary key (product_id, position),
  check (char_length(alt) between 1 and 200)
);

create table public.product_variants (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  sku text not null unique,
  size text not null,
  color text not null,
  price_in_cents bigint not null check (price_in_cents between 1 and 9007199254740991),
  stock bigint not null check (stock between 0 and 9007199254740991),
  check (char_length(sku) between 1 and 200),
  check (char_length(size) between 1 and 200),
  check (char_length(color) between 1 and 200)
);

alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;

revoke all on public.products, public.product_images, public.product_variants from public, anon, authenticated;
grant select, insert, update, delete on public.products, public.product_images, public.product_variants to service_role;

create or replace function public.save_catalog_product(p_product jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_product_id text;
  image_record jsonb;
  variant_record jsonb;
  image_position integer := 0;
begin
  if jsonb_typeof(p_product) is distinct from 'object' then
    raise exception 'invalid product payload' using errcode = '22023';
  end if;
    if jsonb_typeof(coalesce(p_product->'images', '[]'::jsonb)) is distinct from 'array'
      or jsonb_typeof(coalesce(p_product->'variants', '[]'::jsonb)) is distinct from 'array' then
    raise exception 'invalid product collections' using errcode = '22023';
  end if;
    if jsonb_array_length(coalesce(p_product->'images', '[]'::jsonb)) > 20
      or jsonb_array_length(coalesce(p_product->'variants', '[]'::jsonb)) > 200 then
     raise exception 'product collections exceed limits' using errcode = '22023';
    end if;

    target_product_id := p_product->>'id';
  insert into public.products (
    id, slug, name, description, status, collection, fabric, fit, care,
    featured, seo_title, seo_description, updated_at
  ) values (
    target_product_id, p_product->>'slug', p_product->>'name', coalesce(p_product->>'description', ''),
    p_product->>'status', coalesce(p_product->>'collection', ''), coalesce(p_product->>'fabric', ''),
    coalesce(p_product->>'fit', ''), coalesce(p_product->>'care', ''),
    coalesce((p_product->>'featured')::boolean, false), coalesce(p_product->>'seoTitle', ''),
    coalesce(p_product->>'seoDescription', ''), now()
  ) on conflict (id) do update set
    slug = excluded.slug,
    name = excluded.name,
    description = excluded.description,
    status = excluded.status,
    collection = excluded.collection,
    fabric = excluded.fabric,
    fit = excluded.fit,
    care = excluded.care,
    featured = excluded.featured,
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description,
    updated_at = now();

  delete from public.product_images where product_images.product_id = target_product_id;
  delete from public.product_variants where product_variants.product_id = target_product_id;

  for image_record in select value from jsonb_array_elements(coalesce(p_product->'images', '[]'::jsonb)) as images(value)
  loop
    insert into public.product_images (product_id, position, src, alt)
    values (target_product_id, image_position, image_record->>'src', image_record->>'alt');
    image_position := image_position + 1;
  end loop;

  for variant_record in select value from jsonb_array_elements(coalesce(p_product->'variants', '[]'::jsonb)) as variants(value)
  loop
    insert into public.product_variants (id, product_id, sku, size, color, price_in_cents, stock)
    values (
      variant_record->>'id', target_product_id, variant_record->>'sku', variant_record->>'size',
      variant_record->>'color', (variant_record->>'priceInCents')::bigint,
      (variant_record->>'stock')::bigint
    );
  end loop;
end;
$$;

revoke all on function public.save_catalog_product(jsonb) from public, anon, authenticated;
grant execute on function public.save_catalog_product(jsonb) to service_role;

notify pgrst, 'reload schema';