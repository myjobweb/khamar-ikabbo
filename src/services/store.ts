import {
  Category,
  Product,
  Order,
  AbandonedOrder,
  SiteSettings,
  GuideArticle,
  OrderStatus,
  DbCustomer,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_GUIDE_ARTICLES,
  INITIAL_SITE_SETTINGS
} from '../data/seedData';
import { db } from './firebase';
import { doc, getDoc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  PRODUCTS: 'khamari_products_v1',
  CATEGORIES: 'khamari_categories_v1',
  ORDERS: 'khamari_orders_v1',
  SETTINGS: 'khamari_settings_v1',
  GUIDES: 'khamari_guides_v1'
};

export const initLocalStorage = () => {};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const snap = await getDocs(collection(db, 'categories'));
    if (!snap.empty) {
      const cats = snap.docs.map(d => d.data() as Category);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
      return cats;
    }
  } catch (e) {
    console.warn(e);
  }
  const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (!snap.empty) {
      const prods = snap.docs.map(d => d.data() as Product);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
      return prods;
    }
  } catch (e) {
    console.warn(e);
  }
  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
};

export const fetchProductBySlugOrId = async (slugOrId: string): Promise<Product | null> => {
  const products = await fetchProducts();
  return products.find((p) => p.slug === slugOrId || p.id === slugOrId) || null;
};

export const fetchRelatedProducts = (currentProduct: Product, allProducts: Product[], limit = 4): Product[] => {
  return allProducts.filter(p => p.id !== currentProduct.id).slice(0, limit);
};

export const saveProductToStore = async (product: Product): Promise<Product> => {
  try {
    await setDoc(doc(db, 'products', product.id), product);
  } catch(e) {
    console.warn(e);
  }
  return product;
};

export const deleteProductFromStore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch(e) {}
  return true;
};

export const fetchAbandonedOrders = async (): Promise<AbandonedOrder[]> => {
  try {
    const snap = await getDocs(collection(db, 'abandoned_orders'));
    if (!snap.empty) {
      const orders = snap.docs.map(d => d.data() as AbandonedOrder);
      orders.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      return orders;
    }
  } catch (e) {
    console.warn('Error fetching abandoned orders:', e);
  }
  return [];
};

export const saveAbandonedOrderToStore = async (order: AbandonedOrder): Promise<AbandonedOrder> => {
  try {
    await setDoc(doc(db, 'abandoned_orders', order.id), order);
  } catch (e) {
    console.warn('Error saving abandoned order:', e);
  }
  return order;
};

export const deleteAbandonedOrderFromStore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'abandoned_orders', id));
    return true;
  } catch (e) {
    console.warn(e);
    return false;
  }
};

export const markAbandonedOrderConverted = async (id: string, convertedOrderId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'abandoned_orders', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as AbandonedOrder;
      await setDoc(docRef, {
        ...data,
        status: 'converted',
        convertedOrderId,
        updatedAt: new Date().toISOString()
      });
      return true;
    }
  } catch (e) {
    console.warn(e);
  }
  return false;
};

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    if (!snap.empty) {
      const orders = snap.docs.map(d => d.data() as Order);
      // Sort by creation date
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return orders;
    }
  } catch (e) {
    console.warn(e);
  }
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return raw ? JSON.parse(raw) : [];
};

export const saveOrderToStore = async (order: Order): Promise<Order> => {
  try {
    await setDoc(doc(db, 'orders', order.id), order);
  } catch (e) {
    console.warn(e);
  }
  return order;
};

export const updateOrderStatusInStore = async (orderId: string, status: OrderStatus): Promise<boolean> => {
  try {
    const orders = await fetchOrders();
    const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.status = status;
      await setDoc(doc(db, 'orders', order.id), order);
      return true;
    }
  } catch(e) {}
  return false;
};

export const trackOrderFromStore = async (orderNumber: string, phone: string): Promise<Order | null> => {
  const orders = await fetchOrders();
  return orders.find(o => o.orderNumber === orderNumber && o.phone === phone) || null;
};

export const fetchSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const d = await getDoc(doc(db, 'site_settings', 'main'));
    if (d.exists()) {
      const settings = d.data() as SiteSettings;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return settings;
    }
  } catch (e) {}
  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return raw ? JSON.parse(raw) : INITIAL_SITE_SETTINGS;
};

export const saveSiteSettingsToStore = async (settings: SiteSettings): Promise<SiteSettings> => {
  try {
    await setDoc(doc(db, 'site_settings', 'main'), settings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn(e);
  }
  return settings;
};

export const fetchGuides = async (): Promise<GuideArticle[]> => {
  try {
    const snap = await getDocs(collection(db, 'guides'));
    if (!snap.empty) {
      const guides = snap.docs.map(d => d.data() as GuideArticle);
      localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));
      return guides;
    }
  } catch (e) {}
  const raw = localStorage.getItem(STORAGE_KEYS.GUIDES);
  return raw ? JSON.parse(raw) : INITIAL_GUIDE_ARTICLES;
};

export const saveGuideToStore = async (guide: GuideArticle): Promise<GuideArticle> => {
  try {
    await setDoc(doc(db, 'guides', guide.id), guide);
  } catch (e) {}
  return guide;
};

export const deleteGuideFromStore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'guides', id));
  } catch (e) {}
  return true;
};

export const resetStoreToDefaults = () => {
  localStorage.clear();
};

export const fetchCustomersList = async (): Promise<DbCustomer[]> => {
  const orders = await fetchOrders();
  const customerMap = new Map<string, DbCustomer>();
  orders.forEach((o) => {
    const key = o.phone || o.customerName;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: o.customerId || `cust-${key.replace(/\\D/g, '')}`,
        name: o.customerName,
        phone: o.phone,
        district: o.district,
        upazila: o.upazila,
        address: o.address,
        created_at: o.createdAt
      } as DbCustomer);
    }
  });
  return Array.from(customerMap.values());
};

export const saveCategoryToStore = async (cat: Category): Promise<Category> => {
  try {
    await setDoc(doc(db, 'categories', cat.id), cat);
  } catch (e) {}
  return cat;
};

export const deleteCategoryFromStore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch(e) {}
  return true;
};

export const updateStockInStore = async (productId: string, stockCount: number): Promise<boolean> => {
  const products = await fetchProducts();
  const product = products.find(p => p.id === productId);
  if (product) {
    product.stockCount = stockCount;
    product.inStock = stockCount > 0;
    product.status = stockCount <= 0 ? 'out_of_stock' : 'active';
    try {
      await setDoc(doc(db, 'products', product.id), product);
      return true;
    } catch(e){}
  }
  return false;
};
