export type ProductCategoryType = 'feed' | 'raw-materials' | 'supplements' | 'medicines' | 'combinations';

export type FeedSubcategoryType = 'all' | 'motatajakaron' | 'shar' | 'gavi' | 'dairy-special';

export type AppRoute =
  | 'home'
  | 'feed'
  | 'feed-motatajakaron'
  | 'feed-shar'
  | 'feed-gavi'
  | 'feed-dairy-special'
  | 'raw-materials'
  | 'supplements'
  | 'medicines'
  | 'combinations'
  | 'search'
  | 'guides'
  | 'contact'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'track-order'
  | 'admin';

export type AdminTabType =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'subcategories'
  | 'combinations'
  | 'orders'
  | 'customers'
  | 'inventory'
  | 'guides'
  | 'settings'
  | 'site-settings'
  | 'profile';

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  lastSignIn?: string;
}

export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';
export type StockStatusType = 'in_stock' | 'low_stock' | 'out_of_stock';

export type OrderStatus = 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'pending';

// --- Supabase DB Schema Types ---

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface DbSubcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface DbProduct {
  id: string;
  category_id?: string;
  subcategory_id?: string;
  name: string;
  slug: string;
  sku?: string;
  price: number;
  discount_price?: number;
  unit: string;
  stock_quantity: number;
  minimum_order_quantity?: number;
  short_description?: string;
  full_description?: string;
  features?: string[] | Record<string, unknown>;
  usage_information?: string;
  main_image?: string;
  status: ProductStatus;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DbProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at?: string;
}

export interface DbCombinationPackage {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  regular_price: number;
  package_price: number;
  discount?: number;
  stock_quantity: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbCombinationItem {
  id: string;
  package_id: string;
  product_id: string;
  quantity: number;
  product?: DbProduct;
}

export interface DbInventory {
  id: string;
  product_id: string;
  current_stock: number;
  low_stock_threshold: number;
  status: StockStatusType;
  created_at?: string;
  updated_at?: string;
}

export interface DbCustomer {
  id: string;
  name: string;
  phone: string;
  district?: string;
  upazila?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbOrder {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  phone: string;
  district: string;
  upazila: string;
  address: string;
  notes?: string;
  subtotal: number;
  delivery_charge: number;
  total: number;
  status: OrderStatus;
  created_at?: string;
  updated_at?: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name_snapshot: string;
  price_snapshot: number;
  quantity: number;
  subtotal: number;
  created_at?: string;
}

export interface DbGuideArticle {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  content: string;
  featured_image?: string;
  category: string;
  author?: string;
  status: 'draft' | 'published';
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DbSiteSettings {
  id?: string;
  website_name: string;
  bengali_name: string;
  tagline: string;
  logo?: string;
  hero_image?: string;
  hero_heading?: string;
  hero_description?: string;
  hero_button_text?: string;
  hero_button_link?: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  email: string;
  address?: string;
  delivery_charge: number;
  footer_text?: string;
  section_visibility?: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

// --- Frontend View Models (Normalized for UI) ---

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: ProductCategoryType | string;
  descriptionBn: string;
  icon?: string;
  image: string;
  status?: string;
  displayOrder?: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  categoryId?: string;
  slug: string;
  nameBn: string;
  descriptionBn?: string;
  image?: string;
  status?: string;
  displayOrder?: number;
}

export interface ComboItem {
  productName: string;
  quantity: string;
  icon?: string;
  productId?: string;
}

export interface Product {
  id: string;
  nameBn: string;
  nameEn?: string;
  slug: string;
  sku?: string;
  categorySlug: ProductCategoryType | string;
  categoryId?: string;
  subcategorySlug?: string;
  subcategoryId?: string;
  price: number;
  regularPrice?: number;
  discountPrice?: number;
  unit: string;
  inStock: boolean;
  stockCount: number;
  minimumOrderQuantity?: number;
  image: string;
  shortDescBn: string;
  descriptionBn: string;
  featuresBn: string[];
  usageBn?: string;
  compositionBn?: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  isCombo?: boolean;
  comboItems?: ComboItem[];
  isVetMedicine?: boolean;
  status?: ProductStatus;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unit: string;
  price: number;
  quantity: number;
  image: string;
  subtotal?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  phone: string;
  division?: string;
  district: string;
  upazila: string;
  address: string;
  notes?: string;
  paymentMethod?: 'cod' | 'bkash' | 'nagad';
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface GuideArticle {
  id: string;
  slug: string;
  titleBn: string;
  subtitleBn?: string;
  categoryBn: string;
  readTimeBn?: string;
  image: string;
  author?: string;
  status: 'draft' | 'published';
  featured?: boolean;
  keyPointsBn?: string[];
  summaryBn?: string;
  contentBn?: string;
  sections: {
    headingBn: string;
    contentBn: string[];
  }[];
  rationTable?: {
    cattleType: string;
    weightRange: string;
    greenGrass: string;
    dryStraw: string;
    concentrateFeed: string;
    mineralMix: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  hotlinePhone: string;
  whatsappNumber: string;
  facebookUrl: string;
  email: string;
  addressBn: string;
  deliveryChargeDhaka: number;
  deliveryChargeOutside: number;
  freeDeliveryThreshold: number;
  announcementTextBn: string;
  showAnnouncement: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  websiteName?: string;
  bengaliName?: string;
  tagline?: string;
  heroHeading?: string;
  heroDescription?: string;
  heroImage?: string;
  heroButtonText?: string;
  heroButtonLink?: string;
  footerText?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  googleSearchConsole?: string;
  googleAnalyticsId?: string;
  metaPixelId?: string;
  sectionVisibility?: {
    hero?: boolean;
    categories?: boolean;
    featuredProducts?: boolean;
    combination?: boolean;
    guide?: boolean;
    guides?: boolean;
    whyUs?: boolean;
    whyKhamariKabbo?: boolean;
    howToOrder?: boolean;
    trust?: boolean;
    contact?: boolean;
    footer?: boolean;
  };
}
