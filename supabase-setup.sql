-- ════════════════════════════════════════════════
-- THE DAILY ARRAY — SUPABASE DATABASE SETUP
-- Run this entire file in your Supabase SQL editor
-- ════════════════════════════════════════════════

-- ── EXTENSIONS ──
create extension if not exists "uuid-ossp";

-- ── CATEGORIES ──
create table if not exists categories (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  name          text not null,
  description   text,
  meta_description text,
  hero_tagline  text,
  display_order int default 0,
  is_active     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── PRODUCTS ──
create table if not exists products (
  id            uuid primary key default uuid_generate_v4(),
  category_id   uuid references categories(id) on delete set null,
  slug          text unique not null,
  name          text not null,
  tagline       text,
  description   text,
  why_we_love_it text,
  best_for      text,
  price_approx  numeric(10,2),
  amazon_asin   text,
  amazon_url    text,
  affiliate_tag text default 'kinmatchwear-20',
  image_url     text,
  og_image_url  text,
  is_featured   boolean default false,
  is_active     boolean default true,
  display_order int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);



-- ── RELATED PRODUCTS ──
create table if not exists related_products (
  id                 uuid primary key default uuid_generate_v4(),
  product_id         uuid references products(id) on delete cascade,
  related_product_id uuid references products(id) on delete cascade,
  unique(product_id, related_product_id)
);

-- ── PINTEREST PINS ──
create table if not exists pinterest_pins (
  id            uuid primary key default uuid_generate_v4(),
  product_id    uuid references products(id) on delete set null,
  category_id   uuid references categories(id) on delete set null,
  board_name    text not null,
  pin_title     text not null,
  pin_description text,
  destination_url text,
  post_time_est text,
  post_date     date,
  is_posted     boolean default false,
  created_at    timestamptz default now()
);

-- ── SITE SETTINGS ──
create table if not exists site_settings (
  id          uuid primary key default uuid_generate_v4(),
  key         text unique not null,
  value       text,
  description text,
  updated_at  timestamptz default now()
);

-- ════════════════════════════════════════════════
-- SEED DATA — CATEGORIES
-- ════════════════════════════════════════════════
insert into categories (slug, name, description, meta_description, hero_tagline, display_order) values
(
  'bedroom-decor',
  'Bedroom Decor & Comfort',
  'Cozy ideas for a bedroom that feels like a retreat.',
  'Beautiful and affordable bedroom decor ideas featuring the best Amazon finds.',
  'Transform your bedroom into the sanctuary you deserve.',
  1
),
(
  'mattress-toppers',
  'Best Mattress Toppers',
  'Amazon sleep picks that make any mattress feel new.',
  'Find the best mattress toppers on Amazon that transform any bed into a luxury sleep experience.',
  'Hotel-quality sleep. No hotel prices.',
  2
),
(
  'pillows-bedding',
  'Best Pillows & Bedding',
  'Sleep better tonight.',
  'Discover the best pillows and bedding on Amazon that actually help you sleep deeper.',
  'The right pillow changes everything.',
  3
),
(
  'budget-upgrades',
  'Budget Bedroom Upgrades',
  'Under $50. Big difference.',
  'Small-dollar finds that quietly transform a room. Perfect for renters, students, and anyone refreshing on a budget.',
  'Big bedroom glow up. Small price tag.',
  4
);

-- ════════════════════════════════════════════════
-- SEED DATA — PRODUCTS
-- ════════════════════════════════════════════════

-- Get category IDs for reference
-- (IDs will be auto-generated — use the slugs to look them up)

insert into products (
  category_id, slug, name, tagline, description,
  why_we_love_it, best_for,
  price_approx, amazon_asin, amazon_url,
  image_url, is_featured, display_order
)
select
  c.id,
  'memory-foam-mattress-topper',
  '3" Cooling Memory Foam Mattress Topper',
  'Hotel-bed feel without a new mattress.',
  'A 3-inch hotel-quality memory foam topper transforms any mattress overnight. Ventilated gel foam stays cool, relieves pressure points, and adds plush comfort without the cost of a new mattress. Available in all standard sizes.',
  'Most cooling pillows aren''t. This one actually is — the ventilated gel layer dissipates heat continuously rather than just feeling cool for 20 minutes.',
  'Anyone who wakes up sore, couples needing motion isolation, hot sleepers.',
  89.00,
  'B08EXAMPLE1',
  'https://www.amazon.com/dp/B08EXAMPLE1?tag=kinmatchwear-20',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop',
  true,
  1
from categories c where c.slug = 'mattress-toppers';

insert into products (
  category_id, slug, name, tagline, description,
  why_we_love_it, best_for,
  price_approx, amazon_asin, amazon_url,
  image_url, is_featured, display_order
)
select
  c.id,
  'cooling-gel-pillow',
  'Cooling Gel Memory Foam Pillow',
  'Stays cool all night, every night.',
  'A good pillow is the cheapest upgrade you can make to your sleep. This one combines a ventilated cooling gel layer with adaptive memory foam, so it cradles your head without going flat or getting hot. Side and back sleepers tend to love it most — the loft is just right and it actually holds its shape after months of use.',
  'Most cooling pillows aren''t. This one actually is, and it doesn''t lose its shape after a few weeks.',
  'Hot sleepers, side sleepers, anyone with neck pain.',
  39.00,
  'B08EXAMPLE2',
  'https://www.amazon.com/dp/B08EXAMPLE2?tag=kinmatchwear-20',
  'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&auto=format&fit=crop',
  true,
  1
from categories c where c.slug = 'pillows-bedding';

insert into products (
  category_id, slug, name, tagline, description,
  why_we_love_it, best_for,
  price_approx, amazon_asin, amazon_url,
  image_url, is_featured, display_order
)
select
  c.id,
  'warm-led-string-lights',
  'Warm White LED String Lights (33ft)',
  'Instant cozy. Under $15.',
  'The quickest bedroom transformation for under $20. Warm amber LED string lights create an instant cozy sanctuary feel. No tools, no renovation — just plug in and transform the mood of your entire bedroom in 10 minutes.',
  'Warm light in the evening signals your brain to produce melatonin. These lights do double duty — they look beautiful AND support better sleep hygiene.',
  'Anyone wanting a cozy bedroom atmosphere on a budget.',
  14.00,
  'B08EXAMPLE3',
  'https://www.amazon.com/dp/B08EXAMPLE3?tag=kinmatchwear-20',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
  true,
  1
from categories c where c.slug = 'bedroom-decor';

insert into products (
  category_id, slug, name, tagline, description,
  why_we_love_it, best_for,
  price_approx, amazon_asin, amazon_url,
  image_url, is_featured, display_order
)
select
  c.id,
  'linen-duvet-cover-set',
  'Washed Linen Duvet Cover Set',
  'The ''just stepped out of a magazine'' duvet.',
  'Washed linen that gets softer and more beautiful with every wash. This duvet cover set has that effortlessly rumpled luxury look — and it breathes better than cotton, keeping you cool in summer and warm in winter.',
  'Unlike regular cotton, washed linen gets softer and more beautiful with every wash. It is the bedding that keeps getting better.',
  'Anyone who sleeps hot, anyone who wants their bedroom to look effortlessly luxurious.',
  79.00,
  'B08EXAMPLE4',
  'https://www.amazon.com/dp/B08EXAMPLE4?tag=kinmatchwear-20',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop',
  false,
  2
from categories c where c.slug = 'pillows-bedding';

insert into products (
  category_id, slug, name, tagline, description,
  why_we_love_it, best_for,
  price_approx, amazon_asin, amazon_url,
  image_url, is_featured, display_order
)
select
  c.id,
  'blackout-curtains',
  'Thermal Blackout Curtains (2 Panels)',
  'Sleep in. Save on heating. Look better doing it.',
  'Blocks 99% of light and reduces outside noise. Available in multiple sizes and neutral colors to match any bedroom aesthetic. The single most impactful bedroom upgrade under $30.',
  'Light is the #1 disruptor of circadian rhythm. Even small amounts of light during sleep suppress melatonin. Blackout curtains are the most evidence-backed bedroom upgrade you can make.',
  'Anyone with street lights outside, early morning sun, or noisy neighbors.',
  32.00,
  'B08EXAMPLE5',
  'https://www.amazon.com/dp/B08EXAMPLE5?tag=kinmatchwear-20',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop',
  false,
  1
from categories c where c.slug = 'budget-upgrades';


-- ════════════════════════════════════════════════
-- SEED DATA — RELATED PRODUCTS
-- ════════════════════════════════════════════════
insert into related_products (product_id, related_product_id)
select p1.id, p2.id
from products p1, products p2
where p1.slug = 'cooling-gel-pillow' and p2.slug = 'linen-duvet-cover-set';

insert into related_products (product_id, related_product_id)
select p1.id, p2.id
from products p1, products p2
where p1.slug = 'memory-foam-mattress-topper' and p2.slug = 'cooling-gel-pillow';

-- ════════════════════════════════════════════════
-- SEED DATA — SITE SETTINGS
-- ════════════════════════════════════════════════
insert into site_settings (key, value, description) values
('affiliate_tag', 'kinmatchwear-20', 'Your Amazon Associates tracking tag'),
('site_name', 'The Daily Array', 'Site display name'),
('site_tagline', 'Better Sleep & Bedroom Comfort', 'Site tagline shown in header'),
('pinterest_url', 'https://pinterest.com/TheDailyArray', 'Pinterest profile URL'),
('tiktok_url', '', 'TikTok profile URL'),
('instagram_url', '', 'Instagram profile URL');

-- ════════════════════════════════════════════════
-- ROW LEVEL SECURITY — allow public read access
-- ════════════════════════════════════════════════
alter table categories enable row level security;
alter table products enable row level security;
alter table related_products enable row level security;
alter table site_settings enable row level security;
alter table pinterest_pins enable row level security;

-- Public can read everything
create policy "Public read categories" on categories for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Public read related_products" on related_products for select using (true);
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read pinterest_pins" on pinterest_pins for select using (true);

-- ════════════════════════════════════════════════
-- INDEXES for fast queries
-- ════════════════════════════════════════════════
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_featured on products(is_featured) where is_featured = true;
create index if not exists idx_categories_slug on categories(slug);
create index if not exists idx_pins_date on pinterest_pins(post_date);
