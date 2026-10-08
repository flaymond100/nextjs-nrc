-- Adds the NRC T-Shirt (30 €) and Pullover (45 €) to the apparel store.
-- Run once in the Supabase SQL editor. Safe to re-run: existing names are skipped.
--
-- variant_id is required: the apparel checkout drops cart items without one.
-- New ids are taken above the highest variant_id in every store table so they
-- can't collide with Vittoria / 4Endurance items in order summaries.

with next_id as (
  select greatest(
    (select coalesce(max(variant_id), 0) from socks_store),
    (select coalesce(max(variant_id), 0) from endurance_store),
    (select coalesce(max(variant_id), 0) from vittoria_store)
  )::bigint as base
),
new_products (offset_n, name, price) as (
  values
    (1, 'NRC T-Shirt', 30),
    (2, 'NRC Pullover', 45)
)
insert into socks_store (
  name,
  product_item_info,
  price,
  currency,
  available_bool,
  variant_id,
  gender,
  sizes
)
select
  p.name,
  p.name,
  p.price,
  'EUR',
  true,
  n.base + p.offset_n,
  array['Men', 'Women'],
  array['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
from new_products p
cross join next_id n
where not exists (select 1 from socks_store s where s.name = p.name);

-- Check the result
select name, price, variant_id, gender, sizes, available_bool
from socks_store
where name in ('NRC T-Shirt', 'NRC Pullover');
