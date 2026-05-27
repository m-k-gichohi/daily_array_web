-- ════════════════════════════════════════════════
-- THE DAILY ARRAY — TRACKING TABLES
-- Run this in Supabase SQL Editor after the main setup
-- ════════════════════════════════════════════════

-- ── PRODUCT PAGE VIEWS ──
create table if not exists product_views (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid references products(id) on delete cascade,
  session_id  text,
  referrer    text,
  country     text,
  device      text check (device in ('mobile', 'desktop', 'tablet')),
  viewed_at   timestamptz default now()
);

-- ── AMAZON LINK CLICKS ──
create table if not exists amazon_clicks (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid references products(id) on delete cascade,
  session_id  text,
  referrer    text,
  country     text,
  device      text check (device in ('mobile', 'desktop', 'tablet')),
  clicked_at  timestamptz default now()
);

-- ── ROW LEVEL SECURITY ──
alter table product_views enable row level security;
alter table amazon_clicks enable row level security;

-- Anyone can insert (your Angular site does this silently)
create policy "Public insert product_views"
  on product_views for insert with check (true);

create policy "Public insert amazon_clicks"
  on amazon_clicks for insert with check (true);

-- Only authenticated users (your Flutter dashboard) can read
create policy "Auth read product_views"
  on product_views for select using (auth.role() = 'authenticated');

create policy "Auth read amazon_clicks"
  on amazon_clicks for select using (auth.role() = 'authenticated');

-- ── INDEXES ──
create index if not exists idx_views_product on product_views(product_id);
create index if not exists idx_views_date on product_views(viewed_at);
create index if not exists idx_clicks_product on amazon_clicks(product_id);
create index if not exists idx_clicks_date on amazon_clicks(clicked_at);


-- ════════════════════════════════════════════════
-- DASHBOARD QUERIES FOR FLUTTER APP
-- ════════════════════════════════════════════════

-- ── 1. Summary stats — total views, clicks, CTR per product this month ──
-- Use this for your main dashboard table
select
  p.name,
  p.slug,
  p.price_approx,
  count(distinct pv.id)  as page_views,
  count(distinct ac.id)  as amazon_clicks,
  round(
    count(distinct ac.id)::numeric
    / nullif(count(distinct pv.id), 0) * 100, 1
  ) as ctr_percent
from products p
left join product_views pv
  on pv.product_id = p.id
  and pv.viewed_at >= date_trunc('month', now())
left join amazon_clicks ac
  on ac.product_id = p.id
  and ac.clicked_at >= date_trunc('month', now())
where p.is_active = true
group by p.id, p.name, p.slug, p.price_approx
order by amazon_clicks desc;


-- ── 2. Daily clicks last 30 days — for line chart in Flutter ──
select
  date(clicked_at) as day,
  count(*)          as clicks
from amazon_clicks
where clicked_at >= now() - interval '30 days'
group by day
order by day asc;


-- ── 3. Daily views last 30 days — for line chart in Flutter ──
select
  date(viewed_at) as day,
  count(*)         as views
from product_views
where viewed_at >= now() - interval '30 days'
group by day
order by day asc;


-- ── 4. Traffic source breakdown this month ──
select
  case
    when referrer ilike '%pinterest%' then 'Pinterest'
    when referrer ilike '%google%'    then 'Google'
    when referrer ilike '%tiktok%'    then 'TikTok'
    when referrer ilike '%instagram%' then 'Instagram'
    when referrer = '' or referrer is null then 'Direct'
    else 'Other'
  end as source,
  count(*) as visits
from product_views
where viewed_at >= date_trunc('month', now())
group by source
order by visits desc;


-- ── 5. Device split — mobile vs desktop ──
select
  device,
  count(*) as clicks
from amazon_clicks
where clicked_at >= date_trunc('month', now())
group by device
order by clicks desc;


-- ── 6. Top performing product today ──
select
  p.name,
  count(ac.id) as clicks_today
from products p
join amazon_clicks ac on ac.product_id = p.id
where date(ac.clicked_at) = current_date
group by p.id, p.name
order by clicks_today desc
limit 1;


-- ── 7. All-time totals for dashboard header cards ──
select
  (select count(*) from product_views)  as total_views,
  (select count(*) from amazon_clicks)  as total_clicks,
  (select count(*) from products where is_active = true) as total_products,
  round(
    (select count(*)::numeric from amazon_clicks)
    / nullif((select count(*)::numeric from product_views), 0) * 100, 1
  ) as overall_ctr;


-- ════════════════════════════════════════════════
-- RPC FUNCTIONS — used by Flutter dashboard
-- ════════════════════════════════════════════════

-- Dashboard header stats
create or replace function get_dashboard_stats()
returns table (
  total_views   bigint,
  total_clicks  bigint,
  total_products bigint,
  overall_ctr   numeric
) language sql security definer as $$
  select
    (select count(*) from product_views)::bigint,
    (select count(*) from amazon_clicks)::bigint,
    (select count(*) from products where is_active = true)::bigint,
    round(
      (select count(*)::numeric from amazon_clicks)
      / nullif((select count(*)::numeric from product_views), 0) * 100, 1
    );
$$;

-- Product analytics
create or replace function get_product_analytics()
returns table (
  name          text,
  slug          text,
  price_approx  numeric,
  page_views    bigint,
  amazon_clicks bigint,
  ctr_percent   numeric
) language sql security definer as $$
  select
    p.name,
    p.slug,
    p.price_approx,
    count(distinct pv.id)::bigint,
    count(distinct ac.id)::bigint,
    round(count(distinct ac.id)::numeric / nullif(count(distinct pv.id), 0) * 100, 1)
  from products p
  left join product_views pv on pv.product_id = p.id
    and pv.viewed_at >= date_trunc('month', now())
  left join amazon_clicks ac on ac.product_id = p.id
    and ac.clicked_at >= date_trunc('month', now())
  where p.is_active = true
  group by p.id, p.name, p.slug, p.price_approx
  order by count(distinct ac.id) desc;
$$;

-- Traffic sources
create or replace function get_traffic_sources()
returns table (source text, visits bigint)
language sql security definer as $$
  select
    case
      when referrer ilike '%pinterest%' then 'Pinterest'
      when referrer ilike '%google%'    then 'Google'
      when referrer ilike '%tiktok%'    then 'TikTok'
      when referrer ilike '%instagram%' then 'Instagram'
      when referrer = '' or referrer is null then 'Direct'
      else 'Other'
    end as source,
    count(*)::bigint as visits
  from product_views
  where viewed_at >= date_trunc('month', now())
  group by source
  order by visits desc;
$$;

-- Supabase Storage bucket for product images
-- Run this separately in the Supabase dashboard under Storage
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
