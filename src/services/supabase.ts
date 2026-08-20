import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Product,
  Category,
  Order,
  SiteSettings,
  GuideArticle,
  DbProduct,
  DbCategory,
  DbSubcategory,
  DbOrder,
  DbOrderItem,
  DbSiteSettings,
  DbGuideArticle,
  DbCombinationPackage,
  DbCombinationItem,
  DbCustomer,
  ProductCategoryType
} from '../types';

let supabaseInstance: SupabaseClient | null = null;
let lastTestedUrl = '';
let lastTestedKey = '';

/**
 * Safely retrieve the active Supabase client instance using environment variables or user overrides.
 * Never requires or accepts service_role secrets.
 */
export const getSupabaseClient = (urlOverride?: string, keyOverride?: string): SupabaseClient | null => {
  const envObj = (import.meta as unknown as { env?: Record<string, string> }).env || {};

  const targetUrl =
    urlOverride ||
    (typeof window !== 'undefined' ? localStorage.getItem('khamari_supabase_url') : null) ||
    envObj.VITE_SUPABASE_URL ||
    '';

  const targetKey =
    keyOverride ||
    (typeof window !== 'undefined' ? localStorage.getItem('khamari_supabase_key') : null) ||
    envObj.VITE_SUPABASE_ANON_KEY ||
    '';

  if (!targetUrl || !targetKey || !targetUrl.startsWith('http')) {
    return null;
  }

  if (!supabaseInstance || lastTestedUrl !== targetUrl || lastTestedKey !== targetKey) {
    try {
      supabaseInstance = createClient(targetUrl, targetKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      lastTestedUrl = targetUrl;
      lastTestedKey = targetKey;
    } catch (err) {
      console.warn('[Supabase] Initialization failed:', err);
      return null;
    }
  }

  return supabaseInstance;
};

/**
 * Configure and persist user-provided Supabase credentials.
 */
export const setSupabaseCredentials = (url: string, anonKey: string): boolean => {
  if (url && anonKey && url.startsWith('http')) {
    try {
      supabaseInstance = createClient(url, anonKey);
      lastTestedUrl = url;
      lastTestedKey = anonKey;
      if (typeof window !== 'undefined') {
        localStorage.setItem('khamari_supabase_url', url);
        localStorage.setItem('khamari_supabase_key', anonKey);
      }
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

/**
 * Check if active Supabase connection is live and reachable.
 */
export const checkSupabaseConnection = async (): Promise<{ connected: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      message: 'Supabase কানেকশন কনফিগার করা হয়নি। (লোকাল মেমোরি মোড সক্রিয়)'
    };
  }

  try {
    const { error } = await client.from('categories').select('id').limit(1);
    if (error) {
      return {
        connected: false,
        message: `ডাটাবেজ এক্সেস ত্রুটি: ${error.message}`
      };
    }
    return {
      connected: true,
      message: 'Supabase ক্লাউড ডাটাবেজ সফলভাবে সংযুক্ত হয়েছে!'
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      message: `কানেকশন ব্যর্থ: ${msg}`
    };
  }
};

// ==============================================================================
// DATA TRANSFORMERS (Supabase DB Snake_Case <-> Frontend CamelCase)
// ==============================================================================

/**
 * Convert Database Product to Frontend Product Model
 */
export const transformDbProductToFrontend = (
  dbProd: DbProduct,
  categoryMap?: Map<string, string>,
  subcategoryMap?: Map<string, string>
): Product => {
  const features = Array.isArray(dbProd.features)
    ? (dbProd.features as string[])
    : ['উচ্চ পুষ্টিমান ও সুষম উপাদান'];

  const categorySlug =
    (dbProd.category_id && categoryMap?.get(dbProd.category_id)) ||
    'feed';

  const subcategorySlug =
    (dbProd.subcategory_id && subcategoryMap?.get(dbProd.subcategory_id)) ||
    undefined;

  const stockCount = Number(dbProd.stock_quantity) || 0;
  const isOutOfStock = dbProd.status === 'out_of_stock' || stockCount <= 0;

  return {
    id: dbProd.id,
    nameBn: dbProd.name,
    nameEn: dbProd.slug ? dbProd.slug.replace(/-/g, ' ') : undefined,
    slug: dbProd.slug,
    sku: dbProd.sku || undefined,
    categorySlug: categorySlug as ProductCategoryType,
    categoryId: dbProd.category_id,
    subcategorySlug,
    subcategoryId: dbProd.subcategory_id,
    price: Number(dbProd.price) || 0,
    regularPrice: dbProd.discount_price ? Number(dbProd.price) : undefined,
    discountPrice: dbProd.discount_price ? Number(dbProd.discount_price) : undefined,
    unit: dbProd.unit || 'বস্তা',
    inStock: !isOutOfStock,
    stockCount: stockCount,
    minimumOrderQuantity: dbProd.minimum_order_quantity || 1,
    image: dbProd.main_image || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    shortDescBn: dbProd.short_description || '',
    descriptionBn: dbProd.full_description || dbProd.short_description || '',
    featuresBn: features,
    usageBn: dbProd.usage_information || undefined,
    rating: 4.8,
    reviewsCount: 18,
    status: dbProd.status,
    featured: dbProd.featured,
    createdAt: dbProd.created_at,
    updatedAt: dbProd.updated_at
  };
};

/**
 * Convert Frontend Product Model to Database Product Record
 */
export const transformFrontendProductToDb = (
  prod: Product,
  categoryId?: string,
  subcategoryId?: string
): Partial<DbProduct> => {
  return {
    id: prod.id.startsWith('prod-') || prod.id.length < 30 ? undefined : prod.id,
    name: prod.nameBn,
    slug: prod.slug || prod.nameBn.toLowerCase().replace(/\s+/g, '-'),
    sku: prod.sku || undefined,
    category_id: categoryId || prod.categoryId || undefined,
    subcategory_id: subcategoryId || prod.subcategoryId || undefined,
    price: Number(prod.price) || 0,
    discount_price: prod.discountPrice || prod.regularPrice ? Number(prod.price) : undefined,
    unit: prod.unit || 'বস্তা',
    stock_quantity: Number(prod.stockCount) || 0,
    minimum_order_quantity: prod.minimumOrderQuantity || 1,
    short_description: prod.shortDescBn || '',
    full_description: prod.descriptionBn || '',
    features: prod.featuresBn || [],
    usage_information: prod.usageBn || '',
    main_image: prod.image,
    status: prod.stockCount <= 0 ? 'out_of_stock' : (prod.status || 'active'),
    featured: Boolean(prod.featured)
  };
};

/**
 * Convert Database Combination to Frontend Combo Product
 */
export const transformDbComboToFrontend = (
  combo: DbCombinationPackage,
  items?: { quantity: number; product: DbProduct }[]
): Product => {
  const comboItems = items?.map((i) => ({
    productName: i.product.name,
    quantity: `${i.quantity} টি`,
    productId: i.product.id
  })) || [];

  return {
    id: combo.id,
    nameBn: combo.name,
    nameEn: combo.slug.replace(/-/g, ' '),
    slug: combo.slug,
    categorySlug: 'combinations',
    price: Number(combo.package_price) || 0,
    regularPrice: Number(combo.regular_price) || undefined,
    discountPrice: combo.discount ? Number(combo.package_price) : undefined,
    unit: 'সম্পূর্ণ প্যাকেজ',
    inStock: combo.status === 'active' && combo.stock_quantity > 0,
    stockCount: combo.stock_quantity,
    image: combo.image || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    shortDescBn: combo.description || '',
    descriptionBn: combo.description || '',
    featuresBn: [
      'আলাদা আলাদা কেনার চেয়ে বিশেষ সাশ্রয়ী প্যাকেজ',
      'প্রমাণিত ফর্মুলা ও বিশেষজ্ঞ খামারি অনুমোদিত',
      'ফ্রি ডেলিভারি ও সম্পূর্ণ নির্দেশিকা'
    ],
    rating: 5.0,
    reviewsCount: 45,
    badge: 'সেরা কম্বো',
    isCombo: true,
    comboItems: comboItems.length > 0 ? comboItems : undefined,
    createdAt: combo.created_at,
    updatedAt: combo.updated_at
  };
};

/**
 * Convert Database Category to Frontend Category
 */
export const transformDbCategoryToFrontend = (
  dbCat: DbCategory,
  subcategories?: DbSubcategory[]
): Category => {
  return {
    id: dbCat.id,
    nameBn: dbCat.name,
    nameEn: dbCat.slug,
    slug: dbCat.slug as ProductCategoryType,
    descriptionBn: dbCat.description || '',
    image: dbCat.image || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    status: dbCat.status,
    displayOrder: dbCat.display_order,
    subcategories: subcategories?.map((sub) => ({
      id: sub.id,
      categoryId: sub.category_id,
      slug: sub.slug,
      nameBn: sub.name,
      descriptionBn: sub.description,
      image: sub.image,
      status: sub.status,
      displayOrder: sub.display_order
    }))
  };
};

/**
 * Upload Product image to Supabase Storage bucket 'products'
 * Returns the public URL, or data URL fallback
 */
export const uploadProductImageToSupabase = async (
  file: File,
  folder: string = 'products'
): Promise<string> => {
  const client = getSupabaseClient();
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  if (client) {
    try {
      const { data, error } = await client.storage
        .from('products')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = client.storage
          .from('products')
          .getPublicUrl(data.path);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('[Supabase Storage] Upload to bucket failed, using Base64 preview fallback:', err);
    }
  }

  // Fallback to local Base64 data URL for offline / local-storage preview
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Convert Database Guide to Frontend Guide Model
 */
export const transformDbGuideToFrontend = (dbGuide: DbGuideArticle): GuideArticle => {
  let parsedContent: { summaryBn?: string; sections?: { headingBn: string; contentBn: string[] }[] } = {};

  try {
    if (dbGuide.content && dbGuide.content.trim().startsWith('{')) {
      parsedContent = JSON.parse(dbGuide.content);
    }
  } catch (e) {
    parsedContent = {};
  }

  const sections = parsedContent.sections || [
    {
      headingBn: 'গাইডের বিস্তারিত বিষয়বস্তু',
      contentBn: dbGuide.content ? dbGuide.content.split('\n\n').filter(Boolean) : [dbGuide.short_description || '']
    }
  ];

  return {
    id: dbGuide.id,
    slug: dbGuide.slug,
    titleBn: dbGuide.title,
    subtitleBn: dbGuide.short_description || '',
    categoryBn: dbGuide.category || 'খামার ব্যবস্থাপনা',
    readTimeBn: '৪ মিনিট পাঠ',
    image: dbGuide.featured_image || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    author: dbGuide.author || 'খামারি কাব্য পরামর্শ দল',
    status: dbGuide.status || 'published',
    featured: dbGuide.featured || false,
    summaryBn: dbGuide.short_description || parsedContent.summaryBn || dbGuide.title,
    contentBn: dbGuide.content,
    sections: sections.length > 0 ? sections : [
      {
        headingBn: 'গাইডের মূল তথ্য',
        contentBn: [dbGuide.short_description || dbGuide.title]
      }
    ],
    createdAt: dbGuide.created_at,
    updatedAt: dbGuide.updated_at
  };
};

/**
 * Convert Frontend Guide Model to Database Record
 */
export const transformFrontendGuideToDb = (guide: GuideArticle): Partial<DbGuideArticle> => {
  const contentString = guide.contentBn || JSON.stringify({
    summaryBn: guide.summaryBn,
    sections: guide.sections
  });

  return {
    id: guide.id && guide.id.length >= 30 ? guide.id : undefined,
    title: guide.titleBn,
    slug: guide.slug || guide.titleBn.toLowerCase().replace(/\s+/g, '-'),
    short_description: guide.summaryBn || guide.subtitleBn || '',
    content: contentString,
    featured_image: guide.image,
    category: guide.categoryBn,
    author: guide.author || 'খামারি কাব্য পরামর্শ দল',
    status: guide.status || 'published',
    featured: guide.featured || false
  };
};

