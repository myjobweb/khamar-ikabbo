import {
  Category,
  Product,
  Order,
  SiteSettings,
  GuideArticle,
  OrderStatus,
  DbCategory,
  DbSubcategory,
  DbProduct,
  DbGuideArticle,
  DbCombinationPackage,
  DbCombinationItem,
  DbOrder,
  DbOrderItem,
  DbCustomer,
  DbSiteSettings
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_GUIDE_ARTICLES,
  INITIAL_SITE_SETTINGS
} from '../data/seedData';
import {
  getSupabaseClient,
  transformDbProductToFrontend,
  transformFrontendProductToDb,
  transformDbComboToFrontend,
  transformDbCategoryToFrontend,
  transformDbGuideToFrontend,
  transformFrontendGuideToDb
} from './supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'khamari_products_v1',
  CATEGORIES: 'khamari_categories_v1',
  ORDERS: 'khamari_orders_v1',
  SETTINGS: 'khamari_settings_v1',
  GUIDES: 'khamari_guides_v1'
};

// Initialize default local storage cache if empty
export const initLocalStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SITE_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GUIDES)) {
    localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(INITIAL_GUIDE_ARTICLES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    const demoOrders: Order[] = [
      {
        id: 'ord-101',
        orderNumber: 'KK-74192',
        customerName: 'মো: রফিকুল ইসলাম',
        phone: '01718-990011',
        division: 'ঢাকা',
        district: 'গাজীপুর',
        upazila: 'শ্রীপুর',
        address: 'গ্রাম: মাওনা, খামারের নাম: সততা ডেইরি ফার্ম',
        notes: 'জরুরি ডেলিভারি লাগবে, সকাল ১০টার দিকে ফোন দিবেন।',
        paymentMethod: 'cod',
        items: [
          {
            productId: 'p1111111-1111-1111-1111-111111111111',
            productName: 'গরু মোটাতাজাকরণ ফিড',
            unit: '৫০ কেজি বস্তা',
            price: 2450,
            quantity: 4,
            image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80'
          },
          {
            productId: 'p3333333-3333-3333-3333-333333333331',
            productName: 'মিনারেল সাপ্লিমেন্ট (খামারি ভাইটাল মিক্সচার)',
            unit: '১ কেজি প্যাকেট',
            price: 380,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
          }
        ],
        subtotal: 10560,
        deliveryCharge: 120,
        total: 10680,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'ord-102',
        orderNumber: 'KK-88310',
        customerName: 'হাফেজ মো: দেলোয়ার হোসেন',
        phone: '01819-456123',
        division: 'রাজশাহী',
        district: 'পাবনা',
        upazila: 'বেড়া',
        address: 'যমুনার চর, বাঘাবাড়ী ঘাট সংলগ্ন ডেইরি খামার',
        paymentMethod: 'bkash',
        items: [
          {
            productId: 'cb111111-1111-1111-1111-111111111111',
            productName: 'খামারি কাব্য মোটাতাজাকরণ কম্বো (১০০ দিন স্পেশাল)',
            unit: 'সম্পূর্ণ প্যাকেজ',
            price: 5990,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80'
          }
        ],
        subtotal: 5990,
        deliveryCharge: 180,
        total: 6170,
        status: 'processing',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(demoOrders));
  }
};

// ==============================================================================
// 1. CATEGORIES FETCHING & SYNC
// ==============================================================================

export const fetchCategories = async (): Promise<Category[]> => {
  initLocalStorage();
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const [catRes, subRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        supabase.from('subcategories').select('*').order('display_order', { ascending: true })
      ]);

      if (!catRes.error && catRes.data && catRes.data.length > 0) {
        const dbCategories = catRes.data as DbCategory[];
        const dbSubcategories = (subRes.data || []) as DbSubcategory[];

        const mappedCategories = dbCategories.map((cat) => {
          const subs = dbSubcategories.filter((s) => s.category_id === cat.id);
          return transformDbCategoryToFrontend(cat, subs);
        });

        // Update local cache
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mappedCategories));
        return mappedCategories;
      }
    } catch (e) {
      console.warn('[Supabase] fetchCategories fallback:', e);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
};

// ==============================================================================
// 2. PRODUCTS FETCHING & SYNC
// ==============================================================================

export const fetchProducts = async (): Promise<Product[]> => {
  initLocalStorage();
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      // 1. Get Categories and Subcategories for ID-to-slug mapping
      const [catsRes, subsRes, prodsRes, combosRes, comboItemsRes] = await Promise.all([
        supabase.from('categories').select('id, slug'),
        supabase.from('subcategories').select('id, slug'),
        supabase.from('products').select('*').neq('status', 'inactive').order('created_at', { ascending: false }),
        supabase.from('combination_packages').select('*').eq('status', 'active'),
        supabase.from('combination_items').select('*, product:products(*)')
      ]);

      if (!prodsRes.error && prodsRes.data && prodsRes.data.length > 0) {
        const categoryMap = new Map<string, string>();
        catsRes.data?.forEach((c: { id: string; slug: string }) => categoryMap.set(c.id, c.slug));

        const subcategoryMap = new Map<string, string>();
        subsRes.data?.forEach((s: { id: string; slug: string }) => subcategoryMap.set(s.id, s.slug));

        const mappedProducts: Product[] = (prodsRes.data as DbProduct[]).map((dbP) =>
          transformDbProductToFrontend(dbP, categoryMap, subcategoryMap)
        );

        // Map Combination Packages
        if (combosRes.data && combosRes.data.length > 0) {
          const mappedCombos = (combosRes.data as DbCombinationPackage[]).map((combo) => {
            const items = (comboItemsRes.data || []).filter(
              (ci: { package_id: string }) => ci.package_id === combo.id
            ) as { quantity: number; product: DbProduct }[];
            return transformDbComboToFrontend(combo, items);
          });
          mappedProducts.push(...mappedCombos);
        }

        // Cache in local storage for fast offline/refresh recovery
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mappedProducts));
        return mappedProducts;
      }
    } catch (e) {
      console.warn('[Supabase] fetchProducts fallback:', e);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
};

/**
 * Fetch a single product by slug or id
 */
export const fetchProductBySlugOrId = async (slugOrId: string): Promise<Product | null> => {
  const allProducts = await fetchProducts();
  return allProducts.find((p) => p.slug === slugOrId || p.id === slugOrId) || null;
};

/**
 * Fetch related products from the same category (excluding current product)
 */
export const fetchRelatedProducts = (currentProduct: Product, allProducts: Product[], limit = 4): Product[] => {
  return allProducts
    .filter((p) => p.id !== currentProduct.id && p.categorySlug === currentProduct.categorySlug)
    .slice(0, limit);
};

// ==============================================================================
// 3. PRODUCT SAVE / EDIT / DELETE (ADMIN / STORE PERSISTENCE)
// ==============================================================================

export const saveProductToStore = async (product: Product): Promise<Product> => {
  const products = await fetchProducts();
  const index = products.findIndex((p) => p.id === product.id || p.slug === product.slug);
  let updatedList: Product[];

  if (index >= 0) {
    updatedList = [...products];
    updatedList[index] = product;
  } else {
    updatedList = [product, ...products];
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedList));

  // Sync to Supabase
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const categories = await fetchCategories();
      const cat = categories.find((c) => c.slug === product.categorySlug);
      const sub = cat?.subcategories?.find((s) => s.slug === product.subcategorySlug);

      const dbPayload = transformFrontendProductToDb(product, cat?.id, sub?.id);

      if (product.id && !product.id.startsWith('prod-') && product.id.length >= 30) {
        await supabase.from('products').upsert({ ...dbPayload, id: product.id });
      } else {
        const { data } = await supabase.from('products').insert(dbPayload).select().single();
        if (data) {
          product.id = data.id;
        }
      }

      // Also upsert inventory
      if (product.id) {
        await supabase.from('inventory').upsert({
          product_id: product.id,
          current_stock: product.stockCount,
          low_stock_threshold: 10,
          status: product.stockCount <= 0 ? 'out_of_stock' : product.stockCount <= 10 ? 'low_stock' : 'in_stock'
        }, { onConflict: 'product_id' });
      }
    } catch (err) {
      console.warn('[Supabase] saveProductToStore error:', err);
    }
  }

  return product;
};

export const deleteProductFromStore = async (id: string): Promise<boolean> => {
  const products = await fetchProducts();
  const updatedList = products.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedList));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('[Supabase] deleteProductFromStore error:', err);
    }
  }

  return true;
};

// ==============================================================================
// 4. ORDERS & ORDER ITEMS MANAGEMENT
// ==============================================================================

export const fetchOrders = async (): Promise<Order[]> => {
  initLocalStorage();
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mappedOrders: Order[] = data.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          customerId: o.customer_id,
          customerName: o.customer_name,
          phone: o.phone,
          district: o.district,
          upazila: o.upazila,
          address: o.address,
          notes: o.notes,
          subtotal: Number(o.subtotal),
          deliveryCharge: Number(o.delivery_charge),
          total: Number(o.total),
          status: o.status as OrderStatus,
          createdAt: o.created_at,
          updatedAt: o.updated_at,
          items: (o.items || []).map((item: DbOrderItem) => ({
            productId: item.product_id || '',
            productName: item.product_name_snapshot,
            unit: 'প্যাকেট / বস্তা',
            price: Number(item.price_snapshot),
            quantity: item.quantity,
            image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
            subtotal: Number(item.subtotal)
          }))
        }));

        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mappedOrders));
        return mappedOrders;
      }
    } catch (e) {
      console.warn('[Supabase] fetchOrders fallback:', e);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return raw ? JSON.parse(raw) : [];
};

export const saveOrderToStore = async (order: Order): Promise<Order> => {
  initLocalStorage();
  const orders = await fetchOrders();
  const updatedOrders = [order, ...orders];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // 1. Create or retrieve customer
      let customerId: string | undefined = undefined;
      const { data: existingCust } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', order.phone)
        .limit(1)
        .single();

      if (existingCust) {
        customerId = existingCust.id;
      } else {
        const { data: newCust } = await supabase
          .from('customers')
          .insert({
            name: order.customerName,
            phone: order.phone,
            district: order.district,
            upazila: order.upazila,
            address: order.address
          })
          .select('id')
          .single();
        if (newCust) customerId = newCust.id;
      }

      // 2. Insert Order
      const { data: insertedOrder, error: ordErr } = await supabase
        .from('orders')
        .insert({
          order_number: order.orderNumber,
          customer_id: customerId,
          customer_name: order.customerName,
          phone: order.phone,
          district: order.district,
          upazila: order.upazila,
          address: order.address,
          notes: order.notes || '',
          subtotal: order.subtotal,
          delivery_charge: order.deliveryCharge,
          total: order.total,
          status: order.status || 'new'
        })
        .select('id')
        .single();

      if (insertedOrder && !ordErr) {
        const orderId = insertedOrder.id;
        order.id = orderId;

        // 3. Insert Order Items snapshots
        const itemsToInsert = order.items.map((item) => ({
          order_id: orderId,
          product_id: item.productId.startsWith('prod-') || item.productId.startsWith('p') && item.productId.length < 30 ? null : item.productId,
          product_name_snapshot: item.productName,
          price_snapshot: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        }));

        await supabase.from('order_items').insert(itemsToInsert);

        // 4. Decrement inventory
        for (const item of order.items) {
          if (item.productId && item.productId.length >= 30) {
            try {
              const { data: currentInv } = await supabase
                .from('inventory')
                .select('current_stock')
                .eq('product_id', item.productId)
                .single();

              if (currentInv) {
                const newStock = Math.max(0, currentInv.current_stock - item.quantity);
                await supabase
                  .from('inventory')
                  .update({
                    current_stock: newStock,
                    status: newStock <= 0 ? 'out_of_stock' : newStock <= 10 ? 'low_stock' : 'in_stock'
                  })
                  .eq('product_id', item.productId);

                await supabase
                  .from('products')
                  .update({
                    stock_quantity: newStock,
                    status: newStock <= 0 ? 'out_of_stock' : 'active'
                  })
                  .eq('id', item.productId);
              }
            } catch (invErr) {
              console.warn('[Supabase] Stock decrement warning:', invErr);
            }
          }
        }
      }
    } catch (err) {
      console.warn('[Supabase] saveOrderToStore error:', err);
    }
  }

  return order;
};

export const updateOrderStatusInStore = async (orderId: string, status: OrderStatus): Promise<boolean> => {
  const orders = await fetchOrders();
  const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
  if (index >= 0) {
    orders[index].status = status;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('orders').update({ status }).or(`id.eq.${orderId},order_number.eq.${orderId}`);
      } catch (err) {
        console.warn('[Supabase] order update status error:', err);
      }
    }
    return true;
  }
  return false;
};

export const trackOrderFromStore = async (orderNumber: string, phone: string): Promise<Order | null> => {
  const cleanOrderNo = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.replace(/[\s-]/g, '').trim();

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .ilike('order_number', cleanOrderNo)
        .eq('phone', cleanPhone)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          orderNumber: data.order_number,
          customerId: data.customer_id,
          customerName: data.customer_name,
          phone: data.phone,
          district: data.district,
          upazila: data.upazila,
          address: data.address,
          notes: data.notes,
          subtotal: Number(data.subtotal),
          deliveryCharge: Number(data.delivery_charge),
          total: Number(data.total),
          status: data.status as OrderStatus,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          items: (data.items || []).map((item: DbOrderItem) => ({
            productId: item.product_id || '',
            productName: item.product_name_snapshot,
            unit: 'প্যাকেট / বস্তা',
            price: Number(item.price_snapshot),
            quantity: item.quantity,
            image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
            subtotal: Number(item.subtotal)
          }))
        };
      }
    } catch (e) {
      console.warn('[Supabase] trackOrderFromStore fallback:', e);
    }
  }

  // Fallback to local storage (requiring BOTH orderNumber AND phone match)
  const localOrders = await fetchOrders();
  const matched = localOrders.find(
    (o) =>
      o.orderNumber.toUpperCase() === cleanOrderNo &&
      o.phone.replace(/[\s-]/g, '').trim() === cleanPhone
  );
  return matched || null;
};

// ==============================================================================
// 5. SITE SETTINGS & GUIDES
// ==============================================================================

export const fetchSiteSettings = async (): Promise<SiteSettings> => {
  initLocalStorage();
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
      if (!error && data) {
        const settings: SiteSettings = {
          hotlinePhone: data.phone || INITIAL_SITE_SETTINGS.hotlinePhone,
          whatsappNumber: data.whatsapp || INITIAL_SITE_SETTINGS.whatsappNumber,
          facebookUrl: data.facebook || INITIAL_SITE_SETTINGS.facebookUrl,
          email: data.email || INITIAL_SITE_SETTINGS.email,
          addressBn: data.address || INITIAL_SITE_SETTINGS.addressBn,
          deliveryChargeDhaka: Number(data.delivery_charge) || INITIAL_SITE_SETTINGS.deliveryChargeDhaka,
          deliveryChargeOutside: INITIAL_SITE_SETTINGS.deliveryChargeOutside,
          freeDeliveryThreshold: INITIAL_SITE_SETTINGS.freeDeliveryThreshold,
          announcementTextBn: INITIAL_SITE_SETTINGS.announcementTextBn,
          showAnnouncement: true,
          websiteName: data.website_name || INITIAL_SITE_SETTINGS.websiteName,
          bengaliName: data.bengali_name || INITIAL_SITE_SETTINGS.bengaliName,
          tagline: data.tagline || INITIAL_SITE_SETTINGS.tagline,
          heroHeading: data.hero_heading || INITIAL_SITE_SETTINGS.heroHeading,
          heroDescription: data.hero_description || INITIAL_SITE_SETTINGS.heroDescription,
          heroImage: data.hero_image || INITIAL_SITE_SETTINGS.heroImage,
          heroButtonText: data.hero_button_text || INITIAL_SITE_SETTINGS.heroButtonText,
          heroButtonLink: data.hero_button_link || INITIAL_SITE_SETTINGS.heroButtonLink,
          footerText: data.footer_text || INITIAL_SITE_SETTINGS.footerText,
          sectionVisibility: data.section_visibility || INITIAL_SITE_SETTINGS.sectionVisibility
        };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        return settings;
      }
    } catch (e) {
      console.warn('[Supabase] fetchSiteSettings fallback:', e);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return raw ? JSON.parse(raw) : INITIAL_SITE_SETTINGS;
};

export const saveSiteSettingsToStore = async (settings: SiteSettings): Promise<SiteSettings> => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('site_settings').upsert({
        phone: settings.hotlinePhone,
        whatsapp: settings.whatsappNumber,
        facebook: settings.facebookUrl,
        email: settings.email,
        address: settings.addressBn,
        delivery_charge: settings.deliveryChargeDhaka,
        website_name: settings.websiteName || 'Khamari Kabbo',
        bengali_name: settings.bengaliName || 'খামারি কাব্য',
        tagline: settings.tagline || 'খামারের যত্নে, খামারির পাশে',
        hero_heading: settings.heroHeading,
        hero_description: settings.heroDescription,
        hero_image: settings.heroImage,
        hero_button_text: settings.heroButtonText,
        hero_button_link: settings.heroButtonLink,
        footer_text: settings.footerText,
        section_visibility: settings.sectionVisibility
      });
    } catch (err) {
      console.warn('[Supabase] saveSiteSettings error:', err);
    }
  }

  return settings;
};

export const fetchGuides = async (): Promise<GuideArticle[]> => {
  initLocalStorage();
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const transformed = (data as DbGuideArticle[]).map(transformDbGuideToFrontend);
        localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(transformed));
        return transformed;
      }
    } catch (err) {
      console.warn('[Supabase] fetchGuides fallback to localStorage:', err);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.GUIDES);
  return raw ? JSON.parse(raw) : INITIAL_GUIDE_ARTICLES;
};

export const saveGuideToStore = async (guide: GuideArticle): Promise<GuideArticle> => {
  const guides = await fetchGuides();
  const index = guides.findIndex((g) => g.id === guide.id || g.slug === guide.slug);
  let updatedGuide = { ...guide };

  if (index >= 0) {
    guides[index] = updatedGuide;
  } else {
    guides.unshift(updatedGuide);
  }

  localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const dbPayload = transformFrontendGuideToDb(updatedGuide);
      const { data, error } = await supabase.from('guides').upsert(dbPayload).select().single();
      if (!error && data) {
        updatedGuide = transformDbGuideToFrontend(data as DbGuideArticle);
        const idx = guides.findIndex((g) => g.id === guide.id || g.slug === guide.slug);
        if (idx >= 0) guides[idx] = updatedGuide;
        localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));
      }
    } catch (err) {
      console.warn('[Supabase] saveGuideToStore error:', err);
    }
  }

  return updatedGuide;
};

export const deleteGuideFromStore = async (id: string): Promise<boolean> => {
  const guides = await fetchGuides();
  const filtered = guides.filter((g) => g.id !== id && g.slug !== id);
  localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(filtered));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('guides').delete().or(`id.eq.${id},slug.eq.${id}`);
    } catch (err) {
      console.warn('[Supabase] deleteGuideFromStore error:', err);
    }
  }

  return true;
};

export const resetStoreToDefaults = () => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SITE_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(INITIAL_GUIDE_ARTICLES));
};

// ==============================================================================
// 6. CUSTOMERS, CATEGORIES & INVENTORY STORE HELPERS
// ==============================================================================

export const fetchCustomersList = async (): Promise<DbCustomer[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as DbCustomer[];
      }
    } catch (e) {
      console.warn('[Supabase] fetchCustomersList error:', e);
    }
  }

  // Generate unique customers from orders as fallback
  const orders = await fetchOrders();
  const customerMap = new Map<string, DbCustomer>();

  orders.forEach((o) => {
    const key = o.phone || o.customerName;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: o.customerId || `cust-${key.replace(/\D/g, '')}`,
        name: o.customerName,
        phone: o.phone,
        district: o.district,
        upazila: o.upazila,
        address: o.address,
        created_at: o.createdAt
      });
    }
  });

  return Array.from(customerMap.values());
};

export const saveCategoryToStore = async (cat: Category): Promise<Category> => {
  const categories = await fetchCategories();
  const index = categories.findIndex((c) => c.id === cat.id || c.slug === cat.slug);
  if (index >= 0) {
    categories[index] = cat;
  } else {
    categories.push(cat);
  }
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('categories').upsert({
        id: cat.id,
        name: cat.nameBn,
        slug: cat.slug,
        description: cat.descriptionBn,
        image: cat.image,
        status: cat.status || 'active',
        display_order: cat.displayOrder || 1
      });
    } catch (err) {
      console.warn('[Supabase] saveCategory error:', err);
    }
  }
  return cat;
};

export const deleteCategoryFromStore = async (id: string): Promise<boolean> => {
  const categories = await fetchCategories();
  const filtered = categories.filter((c) => c.id !== id && c.slug !== id);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('categories').delete().or(`id.eq.${id},slug.eq.${id}`);
    } catch (err) {
      console.warn('[Supabase] deleteCategory error:', err);
    }
  }
  return true;
};

export const updateStockInStore = async (productId: string, stockCount: number): Promise<boolean> => {
  const products = await fetchProducts();
  const index = products.findIndex((p) => p.id === productId);
  if (index >= 0) {
    products[index].stockCount = stockCount;
    products[index].inStock = stockCount > 0;
    products[index].status = stockCount <= 0 ? 'out_of_stock' : 'active';
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('products')
          .update({
            stock_quantity: stockCount,
            status: stockCount <= 0 ? 'out_of_stock' : 'active'
          })
          .eq('id', productId);

        await supabase
          .from('inventory')
          .upsert({
            product_id: productId,
            current_stock: stockCount,
            status: stockCount <= 0 ? 'out_of_stock' : stockCount <= 10 ? 'low_stock' : 'in_stock'
          });
      } catch (err) {
        console.warn('[Supabase] updateStock error:', err);
      }
    }
    return true;
  }
  return false;
};

