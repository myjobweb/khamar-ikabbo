-- ==============================================================================
-- KHAMARI KABBO (খামারি কাব্য) — COMPLETE SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Description: Full PostgreSQL / Supabase schema for Cattle Farming E-Commerce.
-- Includes 11 core tables, UUID primary keys, foreign keys, constraints,
-- automated updated_at triggers, Row Level Security (RLS), and comprehensive demo seeds.
-- ==============================================================================

-- 1. Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- AUTOMATED TIMESTAMP TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 1. CATEGORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_categories_updated_at ON public.categories;
CREATE TRIGGER tr_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 2. SUBCATEGORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_category_subcategory_slug UNIQUE (category_id, slug)
);

DROP TRIGGER IF EXISTS tr_subcategories_updated_at ON public.subcategories;
CREATE TRIGGER tr_subcategories_updated_at
BEFORE UPDATE ON public.subcategories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 3. PRODUCTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  discount_price NUMERIC(12, 2) CHECK (discount_price IS NULL OR discount_price >= 0),
  unit TEXT NOT NULL DEFAULT 'বস্তা',
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  minimum_order_quantity INT NOT NULL DEFAULT 1 CHECK (minimum_order_quantity >= 1),
  short_description TEXT,
  full_description TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  usage_information TEXT,
  main_image TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_products_updated_at ON public.products;
CREATE TRIGGER tr_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 4. PRODUCT IMAGES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. COMBINATION PACKAGES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.combination_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  regular_price NUMERIC(12, 2) NOT NULL CHECK (regular_price >= 0),
  package_price NUMERIC(12, 2) NOT NULL CHECK (package_price >= 0),
  discount NUMERIC(12, 2) DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_combination_packages_updated_at ON public.combination_packages;
CREATE TRIGGER tr_combination_packages_updated_at
BEFORE UPDATE ON public.combination_packages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 6. COMBINATION ITEMS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.combination_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES public.combination_packages(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. INVENTORY TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID UNIQUE NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  current_stock INT NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  low_stock_threshold INT NOT NULL DEFAULT 10 CHECK (low_stock_threshold >= 0),
  status TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_inventory_updated_at ON public.inventory;
CREATE TRIGGER tr_inventory_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 8. CUSTOMERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  district TEXT,
  upazila TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_customers_updated_at ON public.customers;
CREATE TRIGGER tr_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 9. ORDERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  district TEXT NOT NULL,
  upazila TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  delivery_charge NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_orders_updated_at ON public.orders;
CREATE TRIGGER tr_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 10. ORDER ITEMS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  price_snapshot NUMERIC(12, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity >= 1),
  subtotal NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. SITE SETTINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_name TEXT NOT NULL DEFAULT 'Khamari Kabbo',
  bengali_name TEXT NOT NULL DEFAULT 'খামারি কাব্য',
  tagline TEXT NOT NULL DEFAULT 'খামারের যত্নে, খামারির পাশে',
  logo TEXT,
  hero_image TEXT,
  hero_heading TEXT,
  hero_description TEXT,
  phone TEXT NOT NULL DEFAULT '01712-345678',
  whatsapp TEXT NOT NULL DEFAULT '8801712345678',
  facebook TEXT NOT NULL DEFAULT 'https://facebook.com/khamarikabbo',
  email TEXT NOT NULL DEFAULT 'info@khamarikabbo.com',
  address TEXT NOT NULL DEFAULT 'প্রধান কার্যালয় ও কেন্দ্রীয় ওয়্যারহাউস: শ্রীপুর রোড, মাওনা চৌরাস্তা, গাজীপুর, বাংলাদেশ',
  delivery_charge NUMERIC(12, 2) NOT NULL DEFAULT 120,
  footer_text TEXT NOT NULL DEFAULT '© ২০২৬ খামারি কাব্য — সকল স্বত্ব সংরক্ষিত। গবাদিপশুর নিরাপদ পুষ্টির বিশ্বস্ত ঠিকানা।',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER tr_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combination_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combination_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read access for catalog tables
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Subcategories" ON public.subcategories;
CREATE POLICY "Public Read Subcategories" ON public.subcategories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (status != 'inactive');

DROP POLICY IF EXISTS "Public Read Product Images" ON public.product_images;
CREATE POLICY "Public Read Product Images" ON public.product_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Combination Packages" ON public.combination_packages;
CREATE POLICY "Public Read Combination Packages" ON public.combination_packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Combination Items" ON public.combination_items;
CREATE POLICY "Public Read Combination Items" ON public.combination_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Inventory" ON public.inventory;
CREATE POLICY "Public Read Inventory" ON public.inventory FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);

-- Public Insert access for Customer checkout & Order placement
DROP POLICY IF EXISTS "Public Insert Customers" ON public.customers;
CREATE POLICY "Public Insert Customers" ON public.customers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Customers" ON public.customers;
CREATE POLICY "Public Read Customers" ON public.customers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Order Items" ON public.order_items;
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Order Items" ON public.order_items;
CREATE POLICY "Public Read Order Items" ON public.order_items FOR SELECT USING (true);

-- ==============================================================================
-- INITIAL DEMO DATA SEEDS
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, image, status, display_order)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'রেডিমেড ফিড', 'feed', 'গবাদিপশুর প্রয়োজন অনুযায়ী বিভিন্ন ধরনের প্রস্তুত সুষম দানাদার খাদ্য', 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80', 'active', 1),
  ('c2222222-2222-2222-2222-222222222222', 'ফিড কাঁচামাল', 'raw-materials', 'খামারের খাদ্য তৈরির প্রয়োজনীয় বিভিন্ন খাঁটি ও উন্নত কাঁচামাল', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', 'active', 2),
  ('c3333333-3333-3333-3333-333333333333', 'সাপ্লিমেন্ট', 'supplements', 'গবাদিপশুর পুষ্টি, হজমশক্তি ও রোগ প্রতিরোধে প্রয়োজনীয় সাপ্লিমেন্ট', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', 'active', 3),
  ('c4444444-4444-4444-4444-444444444444', 'ঔষধ', 'medicines', 'গবাদিপশুর প্রয়োজনীয় নিবন্ধিত পশু চিকিৎসা ও স্বাস্থ্য সুরক্ষা পণ্য', 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80', 'active', 4),
  ('c5555555-5555-5555-5555-555555555555', 'কম্বিনেশন', 'combinations', 'একাধিক প্রয়োজনীয় পণ্য একসাথে নিয়ে সাশ্রয়ী মূল্যে তৈরি বিশেষ খামার প্যাকেজ', 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80', 'active', 5)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  display_order = EXCLUDED.display_order;

-- 2. Insert Subcategories for রেডিমেড ফিড
INSERT INTO public.subcategories (id, category_id, name, slug, description, image, status, display_order)
VALUES
  ('s1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'গরু মোটাতাজাকরণ ফিড', 'motatajakaron', 'দ্রুত মাংস ও ওজন বৃদ্ধির জন্য বিশেষ হাই-প্রোটিন পেলিট ও ম্যাশ ফিড', 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80', 'active', 1),
  ('s2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'ষাঁড় গরুর ফিড', 'shar', 'কুরবানি ষাঁড় ও প্রজনন ষাঁড়ের দৈহিক গঠন ও শক্তির জন্য শক্তিশালী ফিড', 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80', 'active', 2),
  ('s3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'গাভীর ফিড', 'gavi', 'দুগ্ধবতী গাভীর দুধের উৎপাদন বৃদ্ধি ও ফ্যাট বৃদ্ধির পুষ্টিকর খাদ্য', 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80', 'active', 3)
ON CONFLICT (category_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  display_order = EXCLUDED.display_order;

-- 3. Insert Initial Demo Products
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, sku, price, discount_price, unit, stock_quantity,
  minimum_order_quantity, short_description, full_description, features, usage_information, main_image, status, featured
) VALUES
  -- READY-MADE FEED (রেডিমেড ফিড)
  ('p1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111',
   'গরু মোটাতাজাকরণ ফিড', 'gorur-motatajakaron-feed', 'KK-FD-001', 2450.00, 2600.00, '৫০ কেজি বস্তা', 120, 1,
   'দ্রুত মাংস ও দৈহিক বৃদ্ধির জন্য উচ্চ প্রোটিনযুক্ত ও হজমযোগ্য সুষম পেলিট ফিড।',
   'খামারি কাব্য গরু মোটাতাজাকরণ স্পেশাল ফিড বিশেষভাবে তৈরি করা হয়েছে কুরবানি ও বাণিজ্যিক ফ্যাটেনিং প্রজেক্টের জন্য। এতে রয়েছে ১৮% এর অধিক অপরিশোধিত প্রোটিন, প্রয়োজনীয় অ্যামিনো এসিড, রুমেন বাফার ও ট্রেস মিনারেলস যা গরুর খাদ্য রূপান্তর হার (FCR) উল্লেখযোগ্য হারে বৃদ্ধি করে।',
   '["উচ্চ অপরিশোধিত প্রোটিন (১৮%+) এবং পর্যাপ্ত শক্তি", "রুমেনের স্বাস্থ্য ভালো রাখে এবং গ্যাস সৃষ্টি প্রতিরোধ করে", "দৈনিক ১.২ কেজি থেকে ১.৮ কেজি পর্যন্ত ওজন বৃদ্ধিতে সহায়তা করে", "১০০% প্রাকৃতিক উপাদান দিয়ে প্রস্তুত, কোনো ক্ষতিকারক হরমোন নেই"]'::jsonb,
   'দৈনিক গরুর দৈহিক ওজনের ১.৫% থেকে ২% হারে দানাদার খাবারের সাথে মিশিয়ে অথবা সরাসরি খেতে দিন। সাথে পর্যাপ্ত তাজা পানি ও আঁশযুক্ত কাঁচা ঘাস সরবরাহ করুন।',
   'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80', 'active', true),

  ('p1111111-1111-1111-1111-111111111112', 'c1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111',
   'ভুট্টার ফিড (ম্যাশ ফ্যাটেনিং)', 'bhutta-mash-feed', 'KK-FD-002', 2350.00, 2500.00, '৫০ কেজি বস্তা', 85, 1,
   'দানাদার ভুট্টার দানা ও সয়াবিনের সংমিশ্রণে তৈরি প্রাকৃতিক সুগন্ধযুক্ত ম্যাশ ফিড।',
   'ঐতিহ্যবাহী ম্যাশ ফরম্যাটে পছন্দ করা খামারিদের জন্য আদর্শ পছন্দ। এতে খাঁটি ভুট্টা ভাঙা, গমের ভুসি, সয়াবিন মিল ও ভিটামিন প্রি-মিক্স সুষম অনুপাতে মিশ্রিত রয়েছে।',
   '["চমৎকার স্বাদ ও সুঘ্রাণে গরু দ্রুত খাদ্য গ্রহণ করে", "পেশির বৃদ্ধি ত্বরান্বিত করে এবং চামড়া উজ্জ্বল করে", "সহজলভ্য শক্তি সরবরাহ করে"]'::jsonb,
   'পানি দিয়ে ভিজিয়ে বা শুকনো অবস্থায় ভুসি ও চিটাগুড়ের সাথে মিশিয়ে খাওয়ানো যায়।',
   'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80', 'active', false),

  ('p1111111-1111-1111-1111-111111111113', 'c1111111-1111-1111-1111-111111111111', 's2222222-2222-2222-2222-222222222222',
   'গমের ফিড (ষাঁড়ের শক্তিশালী গ্রোথ)', 'gomer-feed-bull-growth', 'KK-FD-003', 2550.00, 2750.00, '৫০ কেজি বস্তা', 65, 1,
   'বড় আকারের ষাঁড় ও শাহিওয়াল, ব্রাহমা জাতের গরুর পেশির শক্তিবৃদ্ধির জন্য উপযুক্ত।',
   'ভারী ও বড় জাতের ষাঁড় গরুর হাড়ের মজবুতি ও পেশিবহুল শরীরের জন্য বিশেষ পুষ্টিগুণ সম্পন্ন পেলিট ফিড। কুরবানির হাটে সর্বোচ্চ আকর্ষণীয় লুক পেতে খামারিদের প্রথম পছন্দ।',
   '["অর্গানিক জিংক ও বায়োটিন সমৃদ্ধ হওয়ায় খুর ও ত্বক চকচকে থাকে", "হাড় ও পেশির সামঞ্জস্যপূর্ণ বৃদ্ধি ঘটায়", "হজমশক্তি বৃদ্ধি করে পায়খানা পরিষ্কার রাখে"]'::jsonb,
   'প্রতি ১০০ কেজি দৈহিক ওজনের জন্য প্রতিদিন ১ কেজি থেকে ১.৫ কেজি পরিমাণ দিন।',
   'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80', 'active', true),

  ('p1111111-1111-1111-1111-111111111114', 'c1111111-1111-1111-1111-111111111111', 's3333333-3333-3333-3333-333333333333',
   'গাভীর ফিড (মিল্ক প্লাস)', 'gavir-feed-milk-plus', 'KK-FD-004', 2400.00, 2550.00, '৫০ কেজি বস্তা', 110, 1,
   'দুগ্ধবতী গাভীর দৈনিক দুধের পরিমাণ এবং ফ্যাট ও এসএনএফ বৃদ্ধির জন্য প্রস্তুত।',
   'উচ্চ দুধ উৎপাদনশীল অস্ট্রেলিয়ান, ফ্রিজিয়ান ও জার্সি শঙ্কর গাভীর জন্য মিল্ক-প্লাস ফিড নিশ্চিত করে সর্বোচ্চ দুধ উৎপাদন। এটি দুগ্ধকালীন সময়ে গাভীর শরীর ক্ষয় হওয়া রোধ করে এবং নিয়মিত হিটে আসতে সহায়তা করে।',
   '["দুধের ফ্যাট (Fat %) ও এসএনএফ (SNF) বৃদ্ধি করে", "দুধ দোয়ানোর পর শরীরের দুর্বলতা দ্রুত কাটিয়ে তোলে", "প্রজনন স্বাস্থ্য সুস্থ রাখে এবং সময়ে গর্ভধারণ নিশ্চিত করে", "মেস্টাইটিস (ওলান প্রদাহ) প্রতিরোধক ইমিউনো উপাদান যুক্ত"]'::jsonb,
   'গাভীর শরীরের রক্ষণাবেক্ষণের জন্য ২ কেজি এবং প্রতি ৩ লিটার দুধ উৎপাদনের জন্য অতিরিক্ত ১ কেজি করে প্রতিদিন সরবরাহ করুন।',
   'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80', 'active', true),

  -- RAW MATERIALS (ফিড কাঁচামাল)
  ('p2222222-2222-2222-2222-222222222221', 'c2222222-2222-2222-2222-222222222222', NULL,
   'ভুট্টা', 'bhutta-raw-corn', 'KK-RM-001', 40.00, 45.00, 'কেজি', 5000, 50,
   'খাদ্যের প্রধান শক্তি উৎস — আর্দ্রতামুক্ত ও পরিষ্কার গ্রেড-১ ভুট্টার দানা।',
   '১০০% পরিষ্কার, ধুলাবালি ও ছত্রাকমুক্ত শুকনো ভুট্টার দানা যা গরুর শর্করার প্রধান উৎস। এটি খাদ্যের হজমশক্তি বাড়িয়ে গরুকে দ্রুত চাঙ্গা ও মোটাতাজা করে।',
   '["আর্দ্রতা ১২% এর নিচে, দীর্ঘস্থায়ী সংরক্ষণ উপযোগী", "দানাদার আকার নিখুঁতভাবে ভাঙা যেন গরু সহজে চিবাতে পারে", "উচ্চ মেটাবলাইজেবল এনার্জি সমৃদ্ধ"]'::jsonb,
   'খামারের নিজস্ব মিক্সচার তৈরিতে মোট দানাদার খাদ্যের ৩০% থেকে ৫০% পর্যন্ত ভুট্টা ব্যবহার করা যায়।',
   'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80', 'active', true),

  ('p2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', NULL,
   'ঘাস (হাইব্রিড নেপিয়ার তাজা ঘাস)', 'ghas-napier-fresh', 'KK-RM-002', 20.00, 24.00, 'কেজি', 10000, 100,
   'রসাল, সুস্বাদু ও পুষ্টিকর হাইব্রিড নেপিয়ার তাজা কাঁচা ঘাস।',
   'খামারের পাশ্ববর্তী নিজস্ব আধুনিক ঘাসের খামার থেকে প্রতিদিন সকালে কেটে প্রক্রিয়াজাত করা নেপিয়ার ঘাস। এতে কাঁচা আঁশ ও ভিটামিন ক্যারোটিন ভরপুর থাকে।',
   '["সরাসরি খেতে দেওয়ার উপযোগী ও কোমল কাণ্ড", "রুমেনের মাইক্রোফ্লোরা সতেজ রাখে", "দুধের ফ্লো বাড়াতে সাহায্য করে"]'::jsonb,
   'প্রতিদিন প্রতিটি পূর্ণবয়স্ক গরুকে ১৫-২৫ কেজি কাঁচা ঘাস দিন।',
   'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80', 'active', false),

  ('p2222222-2222-2222-2222-222222222223', 'c2222222-2222-2222-2222-222222222222', NULL,
   'গম (উন্নত লাল ও সাদা আস্ত গম)', 'gom-raw-wheat', 'KK-RM-003', 50.00, 55.00, 'কেজি', 4000, 50,
   'দানাদার মিক্স তৈরির অপরিহার্য প্রোটিন ও এনার্জি সমৃদ্ধ গম।',
   'উন্নত মানের শুকনা গম যা খামারিরা নিজস্ব ফিড মিল বা মেশিনে ভাঙিয়ে ব্যবহার করেন।',
   '["পুষ্টিগুণ অটুট ও পোকা-মাকড় মুক্ত", "গরুর শারীরিক স্বাস্থ্য সুদৃঢ় করে", "সহজপাচ্য ফাইবার সমৃদ্ধ"]'::jsonb,
   'আংশিক ভেঙে বা গুঁড়া করে অন্যান্য উপাদানের সাথে মিশিয়ে খাওয়ান।',
   'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80', 'active', true),

  ('p2222222-2222-2222-2222-222222222224', 'c2222222-2222-2222-2222-222222222222', NULL,
   'ভূষি (উন্নত মিষ্টি গমের ভুসি)', 'bhushi-wheat-bran', 'KK-RM-004', 50.00, 55.00, 'কেজি', 3500, 25,
   'গরুর অত্যন্ত পছন্দের হজম সহায়ক প্রাকৃতিক মিষ্টি গমের ভুসি।',
   'অটো ফ্লাওয়ার মিল থেকে সরাসরি সংগৃহীত পরিষ্কার গমের ভুসি। এতে প্রচুর পরিমানে ফসফরাস ও ডায়েটারি ফাইবার থাকে যা পাকস্থলীর কাজ সক্রিয় রাখে।',
   '["কোনো ভেজাল কাঠের গুঁড়া বা ধূলোবালি মুক্ত", "প্রাকৃতিক সুবাসযুক্ত ও সুস্বাদু", "হজমের সমস্যা ও কোষ্ঠকাঠিন্য দূর করে"]'::jsonb,
   'পানি বা ভাতের মাড়ের সাথে মিশিয়ে বা শুকনো দানাদারের সাথে দেওয়া যায়।',
   'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80', 'active', false),

  ('p2222222-2222-2222-2222-222222222225', 'c2222222-2222-2222-2222-222222222222', NULL,
   'খৈল (ঘানি ভাঙা ১০০% খাঁটি সরিষার খৈল)', 'khoil-mustard-cake', 'KK-RM-005', 55.00, 60.00, 'কেজি', 2200, 25,
   'প্রাকৃতিক প্রোটিনের চমৎকার উৎস — গরুর দুধ ও স্বাস্থ্যের জন্য অপরিহার্য।',
   'দেশি সরিষা থেকে তেল নিষ্কাশনের পর প্রাপ্ত খাঁটি খৈল। এটি ভিজিয়ে রাখলে চমৎকার ঘ্রাণ ছড়ায় এবং খাবারে প্রোটিনের ঘাটতি পূরণ করে।',
   '["৩০% এর বেশি উদ্ভিজ্জ প্রোটিন", "দুধের ননি ও চর্বি বৃদ্ধিতে সহায়ক", "ক্ষতিকর কেমিক্যাল ও ভেজালমুক্ত"]'::jsonb,
   'খাওয়ানোর অন্তত ৪-৬ ঘণ্টা আগে পর্যাপ্ত পানিতে ভিজিয়ে রেখে নরম করে খাবারের সাথে মিশিয়ে দিন।',
   'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', 'active', false),

  -- SUPPLEMENTS (সাপ্লিমেন্ট)
  ('p3333333-3333-3333-3333-333333333331', 'c3333333-3333-3333-3333-333333333333', NULL,
   'মিনারেল সাপ্লিমেন্ট (খামারি ভাইটাল মিক্সচার)', 'mineral-supplement-premix', 'KK-SP-001', 380.00, 420.00, '১ কেজি প্যাকেট', 150, 1,
   'ক্যালসিয়াম, ফসফরাস, জিংক, কপার ও সেলেনিয়াম সমৃদ্ধ বিশেষ খনিজ ফর্মুলা।',
   'গবাদিপশুর দৈনন্দিন খাবারে খনিজের ঘাটতি পূরণের জন্য অপরিহার্য। মাটি ও ঘাসে খনিজ কম থাকলে গরু মাটি চাটা, পলিথিন খাওয়া বা অনিয়মিত হিটের সমস্যায় পড়ে। এই মিনারেল মিক্স নিয়মিত খাওয়ালে এসকল সমস্যা দূর হয়।',
   '["গরুর মাটি খাওয়া, পলিথিন চিবানোর বদভ্যাস দূর করে", "প্রজনন ক্ষমতা ও যথাসময়ে হিটে আসার হার বাড়ায়", "দুধের পরিমাণ বাড়াতে এবং খুর শক্ত করতে সহায়ক"]'::jsonb,
   'বড় গরুর জন্য প্রতিদিন ৩০-৫০ গ্রাম এবং বাছুরের জন্য ১৫-২০ গ্রাম দানাদার খাবারের সাথে মিশিয়ে দিন।',
   'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', 'active', true),

  ('p3333333-3333-3333-3333-333333333332', 'c3333333-3333-3333-3333-333333333333', NULL,
   'ক্যালসিয়াম সাপ্লিমেন্ট (লিকুইড ক্যালসিফোর্ড)', 'calcium-supplement-liquid', 'KK-SP-002', 450.00, 500.00, '১ লিটার বোতল', 95, 1,
   'দুগ্ধবতী গাভীর মিল্ক ফিভার প্রতিরোধ এবং হাড়ের ক্যালসিয়াম ঘাটতি পূরণের সিরাপ।',
   'উচ্চ মাত্রার আয়নিত ক্যালসিয়াম, ফসফরাস এবং ভিটামিন ডি৩ এর বিশেষ লিকুইড সিরাপ যা দ্রুত রক্তে শোষিত হয়। বাচ্চা প্রসবের আগে ও পরে মিল্ক ফিভার রোধে অত্যন্ত কার্যকরী।',
   '["বাচ্চা প্রসবের পর গাভীর দাঁড়াতে না পারার সমস্যা দূর করে", "দুধের ফ্লো দ্বিগুণ হারে বৃদ্ধি করে", "সহজে মুখে খাওয়ানো যায় বা খাবারের সাথে মেশানো যায়"]'::jsonb,
   'দুগ্ধবতী গাভীকে প্রতিদিন ১০০ মিলি করে নিয়মিত খাওয়ান। প্রসবের দিনে ২০০ মিলি দিন।',
   'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80', 'active', true),

  ('p3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', NULL,
   'ভিটামিন সাপ্লিমেন্ট (মিল্ক বুস্টার এইচ ও বায়োটিন)', 'vitamin-supplement-biotin-tonic', 'KK-SP-003', 650.00, 720.00, '৫০০ মিলি বোতল', 60, 1,
   'ওলানের কোষ বৃদ্ধি, মেস্টাইটিস প্রতিরোধ এবং সর্বোচ্চ দুধের ফ্যাট পাওয়ার টনিক।',
   'উচ্চ ক্ষমতাসম্পন্ন ভিটামিন এইচ (বায়োটিন), ভিটামিন এ, ডি৩ এবং ভিটামিন ই এর সংমিশ্রণ। গাভীর ওলানের পেশী মজবুত করে এবং মেস্টাইটিস রোগের হাত থেকে ওলান সুরক্ষা দেয়।',
   '["ওলান সুস্থ ও নরম রাখে এবং ছিদ্র বন্ধ হওয়া প্রতিরোধ করে", "চামড়ায় মসৃণ চকচকে ভাব এনে দেয়", "দুধের ফ্যাট পার্সেন্টেজ বাড়ায়"]'::jsonb,
   'দৈনিক ১০ মিলি করে টানা ২০ দিন খাওয়ান।',
   'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80', 'active', false),

  -- MEDICINES (ঔষধ)
  ('p4444444-4444-4444-4444-444444444441', 'c4444444-4444-4444-4444-444444444444', NULL,
   'ফাস্টভেট', 'fastvet-oral-tonic', 'KK-MD-001', 100.00, 120.00, '১০০ মিলি', 70, 1,
   'পশু চিকিৎসকের পরামর্শে ব্যবহার্য — পেটের গোলযোগ ও লিভারের কার্যক্ষমতা বর্ধক।',
   'গবাদিপশুর লিভার সুস্থ রাখতে ও বিভিন্ন অ্যান্টিবায়োটিক চিকিৎসার পরবর্তী দুর্বলতা কাটাতে এই সাসপেনশনটি ব্যবহৃত হয়।',
   '["ক্ষুধামন্দা ও ক্ষুধাহীনতা দূরীকরণে সহায়ক", "টক্সিন বা বিষাক্ততা লিভার থেকে নিষ্কাশন করে", "দ্রুত এনার্জি ফিরিয়ে আনে"]'::jsonb,
   'পশু চিকিৎসকের প্রেসক্রিপশন অনুযায়ী সঠিক মাত্রায় খাওয়ান। সাধারণ ক্ষেত্রে বড় গরুকে দৈনিক ৫০-১০০ মিলি।',
   'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80', 'active', true),

  ('p4444444-4444-4444-4444-444444444442', 'c4444444-4444-4444-4444-444444444444', NULL,
   'এস্ট্রাভেট', 'astravet-bolus', 'KK-MD-002', 180.00, 200.00, '১০ বোলাস স্ট্রিপ', 110, 1,
   'পশু চিকিৎসকের পরামর্শ অনুযায়ী — গরুর জ্বর, শরীরের ব্যথা ও ফোলা কমানোর বোলাস।',
   'আঘাতজনিত ফোলা, খুরের ক্ষতজনিত তীব্র ব্যথা এবং মৌসুমী জ্বরে তাৎক্ষণিক আরাম দিতে চিকিৎসকদের নির্দেশিত ওষুধ।',
   '["উচ্চ কার্যকারিতা সম্পন্ন পেইন কিলার ও অ্যান্টি-ইনফ্ল্যামেটরি", "সহজে পানিতে গুলে বা গুড়ের সাথে খাওয়ানো যায়"]'::jsonb,
   'নিবন্ধিত পশু চিকিৎসকের পরামর্শ অনুযায়ী নির্ধারিত মাত্রায় সেব্য।',
   'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80', 'active', false),

  ('p4444444-4444-4444-4444-444444444443', 'c4444444-4444-4444-4444-444444444444', NULL,
   'থিয়োভেট', 'thiovet-respiratory-care', 'KK-MD-003', 320.00, 360.00, '১০০ গ্রাম প্যাকেট', 85, 1,
   'শীতকাল বা ঋতু পরিবর্তনের ঠান্ডাজনিত কাশি, শ্বাসকষ্ট ও নিউমোনিয়ায় ব্যবহৃত পাউডার।',
   'গবাদিপশুর ফুসফুসের শ্লেষ্মা তরল করে শ্বাসপ্রশ্বাস সহজ করে। শীতকালীন কাশি ও সর্দি প্রতিরোধে সাহায্য করে।',
   '["শ্বাসনালীর প্রদাহ উপশম করে", "কফ পরিষ্কার করে আরামদায়ক শ্বাস নিশ্চিত করে"]'::jsonb,
   'পশু চিকিৎসকের প্রেসক্রিপশন অনুযায়ী কুসুম গরম পানিতে মিশিয়ে সেব্য।',
   'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80', 'active', false),

  ('p4444444-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444', NULL,
   'ভায়োডিন', 'viodine-antiseptic-solution', 'KK-MD-004', 190.00, 220.00, '১০০ মিলি বোতল', 140, 1,
   'খুরপাকা, ক্ষত, পোকা লাগা এবং সার্জারি পরবর্তী চামড়ার ক্ষত জীবাণুমুক্ত করার দ্রবণ।',
   'পোভিডন আয়োডিন ১০% জীবাণুনাশক দ্রবণ। খামারের প্রতিটি গরুর প্রাথমিক চিকিৎসার জন্য অতি প্রয়োজনীয় সুরক্ষা উপাদান।',
   '["জীবাণু, ব্যাকটেরিয়া ও ছত্রাক দ্রুত ধ্বংস করে", "ক্ষত দ্রুত শুকাতে সাহায্য করে ও মাছির সংক্রমণ ঠেকায়"]'::jsonb,
   'ক্ষতস্থান পরিষ্কার পানি দিয়ে ধুয়ে তুলোর সাহায্যে সরাসরি দিনে ২-৩ বার প্রয়োগ করুন।',
   'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80', 'active', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  unit = EXCLUDED.unit,
  stock_quantity = EXCLUDED.stock_quantity,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  features = EXCLUDED.features,
  usage_information = EXCLUDED.usage_information,
  main_image = EXCLUDED.main_image,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

-- 4. Insert Inventory records matching each product
INSERT INTO public.inventory (product_id, current_stock, low_stock_threshold, status)
SELECT
  id,
  stock_quantity,
  10,
  CASE
    WHEN stock_quantity <= 0 THEN 'out_of_stock'
    WHEN stock_quantity <= 10 THEN 'low_stock'
    ELSE 'in_stock'
  END
FROM public.products
ON CONFLICT (product_id) DO UPDATE SET
  current_stock = EXCLUDED.current_stock,
  status = EXCLUDED.status;

-- 5. Insert Combination Packages
INSERT INTO public.combination_packages (
  id, name, slug, description, image, regular_price, package_price, discount, stock_quantity, status
) VALUES
  ('cb111111-1111-1111-1111-111111111111',
   'খামারি কাব্য মোটাতাজাকরণ কম্বো (১০০ দিন স্পেশাল)',
   'khamari-kabbo-100-day-fattening-combo',
   'একটি গরুর দ্রুত মাংস বৃদ্ধি ও চমৎকার গঠনের জন্য প্রয়োজনীয় খাদ্য ও সাপ্লিমেন্টের সেরা সাশ্রয়ী বান্ডেল।',
   'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
   6700.00, 5990.00, 710.00, 40, 'active'),

  ('cb222222-2222-2222-2222-222222222222',
   'গাভী কেয়ার ও মিল্ক-ম্যাক্সিমাইজার কম্বো',
   'dairy-cow-care-milk-maximizer-combo',
   'দুধের পরিমাণ ও ফ্যাট সর্বোচ্চ বৃদ্ধি এবং ওলান সুরক্ষার জন্য ডেইরি স্পেশাল প্যাকেজ।',
   'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
   4250.00, 3750.00, 500.00, 35, 'active')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  regular_price = EXCLUDED.regular_price,
  package_price = EXCLUDED.package_price,
  discount = EXCLUDED.discount,
  stock_quantity = EXCLUDED.stock_quantity,
  status = EXCLUDED.status;

-- 6. Insert Combination Items
INSERT INTO public.combination_items (id, package_id, product_id, quantity)
VALUES
  ('ci111111-1111-1111-1111-111111111111', 'cb111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 2),
  ('ci111111-1111-1111-1111-111111111112', 'cb111111-1111-1111-1111-111111111111', 'p3333333-3333-3333-3333-333333333331', 2),
  ('ci222222-2222-2222-2222-222222222221', 'cb222222-2222-2222-2222-222222222222', 'p1111111-1111-1111-1111-111111111114', 1),
  ('ci222222-2222-2222-2222-222222222222', 'cb222222-2222-2222-2222-222222222222', 'p3333333-3333-3333-3333-333333333332', 2)
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Site Settings
INSERT INTO public.site_settings (
  id, website_name, bengali_name, tagline, phone, whatsapp, facebook, email, address, delivery_charge
) VALUES (
  'st111111-1111-1111-1111-111111111111',
  'Khamari Kabbo',
  'খামারি কাব্য',
  'খামারের যত্নে, খামারির পাশে',
  '01712-345678',
  '8801712345678',
  'https://facebook.com/khamarikabbo',
  'info@khamarikabbo.com',
  'প্রধান কার্যালয় ও কেন্দ্রীয় ওয়্যারহাউস: শ্রীপুর রোড, মাওনা চৌরাস্তা, গাজীপুর, বাংলাদেশ',
  120.00
) ON CONFLICT (id) DO NOTHING;
