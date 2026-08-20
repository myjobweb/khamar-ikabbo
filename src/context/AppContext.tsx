import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  SiteSettings,
  GuideArticle,
  ProductCategoryType,
  FeedSubcategoryType,
  AppRoute,
  AdminTabType,
  AdminUser
} from '../types';
import {
  fetchProducts,
  fetchCategories,
  fetchOrders,
  saveOrderToStore,
  updateOrderStatusInStore,
  saveProductToStore,
  deleteProductFromStore,
  fetchSiteSettings,
  saveSiteSettingsToStore,
  fetchGuides,
  saveGuideToStore,
  deleteGuideFromStore,
  resetStoreToDefaults,
  saveCategoryToStore,
  deleteCategoryFromStore,
  updateStockInStore
} from '../services/store';
import { checkSupabaseConnection } from '../services/supabase';
import { loginAdminUser, getActiveAdminSession, logoutAdminUser } from '../services/adminAuth';
import { toBengaliNumber } from '../utils/bengali';

export type { AppRoute };

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  products: Product[];
  categories: Category[];
  orders: Order[];
  siteSettings: SiteSettings;
  guides: GuideArticle[];
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  supabaseStatusMsg: string;
  testSupabaseConnection: () => Promise<boolean>;
  
  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSuccessModalOpen: boolean;
  setIsSuccessModalOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedGuide: GuideArticle | null;
  setSelectedGuide: (guide: GuideArticle | null) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isCalculatorOpen: boolean;
  setIsCalculatorOpen: (open: boolean) => void;
  lastCreatedOrder: Order | null;

  // Admin Auth & Tabs
  adminUser: AdminUser | null;
  adminTab: AdminTabType;
  setAdminTab: (tab: AdminTabType) => void;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;

  // Cart actions
  addToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  buyNow: (product: Product, quantity?: number) => void;
  validateAndSyncCart: () => Promise<{ isValid: boolean; priceChanged: boolean; message?: string }>;

  // Order actions
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;

  // Product & Category Admin actions
  saveProduct: (product: Product) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveCategory: (cat: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveGuide: (guide: GuideArticle) => Promise<void>;
  deleteGuide: (id: string) => Promise<void>;
  updateProductStock: (productId: string, stock: number) => Promise<void>;
  updateSettings: (settings: SiteSettings) => Promise<void>;
  resetData: () => Promise<void>;
  resetToInitialData: () => Promise<void>;
  reloadAllData: () => Promise<void>;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRouteState] = useState<AppRoute>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    hotlinePhone: '01712-345678',
    whatsappNumber: '8801712345678',
    facebookUrl: 'https://facebook.com/khamarikabbo',
    email: 'info@khamarikabbo.com',
    addressBn: 'প্রধান কার্যালয় ও কেন্দ্রীয় ওয়্যারহাউস: শ্রীপুর রোড, মাওনা চৌরাস্তা, গাজীপুর, বাংলাদেশ',
    deliveryChargeDhaka: 120,
    deliveryChargeOutside: 180,
    freeDeliveryThreshold: 5000,
    announcementTextBn: '🚚 সারা বাংলাদেশে দ্রুত ক্যাটল ফিড ও সাপ্লিমেন্ট হোম ডেলিভারি দেওয়া হচ্ছে! ক্যাশ অন ডেলিভারি সুবিধা রয়েছে।',
    showAnnouncement: true
  });
  const [guides, setGuides] = useState<GuideArticle[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState('সংযোগ যাচাই করা হচ্ছে...');
  
  // UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<GuideArticle | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Admin Session & Tab state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminTab, setAdminTab] = useState<AdminTabType>('dashboard');

  // Initialize data on mount
  useEffect(() => {
    loadAllData();
    checkConnection();

    // Check saved admin session
    const existingAdmin = getActiveAdminSession();
    if (existingAdmin) {
      setAdminUser(existingAdmin);
    }

    // Load cart from localStorage
    try {
      const savedCart = localStorage.getItem('khamari_cart_v1');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.warn('Cart load error:', e);
    }

    // Sync route from URL Hash / Path
    handleInitialRoute();

    const handlePopState = () => {
      handleInitialRoute();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const checkConnection = async () => {
    const res = await checkSupabaseConnection();
    setIsSupabaseConnected(res.connected);
    setSupabaseStatusMsg(res.message);
    return res.connected;
  };

  const testSupabaseConnection = async (): Promise<boolean> => {
    setIsLoading(true);
    const ok = await checkConnection();
    await loadAllData();
    setIsLoading(false);
    return ok;
  };

  const handleInitialRoute = () => {
    const path = window.location.pathname.replace(/^\//, '');
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    const target = hash || path;

    if (target === 'admin' || target.startsWith('admin/')) {
      setCurrentRouteState('admin');
      const sub = target.replace('admin/', '');
      const validTabs: AdminTabType[] = [
        'dashboard', 'products', 'categories', 'subcategories',
        'combinations', 'orders', 'customers', 'inventory', 'settings', 'profile'
      ];
      if (validTabs.includes(sub as AdminTabType)) {
        setAdminTab(sub as AdminTabType);
      }
      return;
    }

    if (target.startsWith('search') || path.includes('search')) {
      setCurrentRouteState('search');
      return;
    }

    if (hash) {
      const validRoutes: AppRoute[] = [
        'home', 'feed', 'feed-motatajakaron', 'feed-shar', 'feed-gavi', 'feed-dairy-special',
        'raw-materials', 'supplements', 'medicines', 'combinations', 'search', 'guides', 'contact',
        'cart', 'checkout', 'admin'
      ];
      if (validRoutes.includes(hash as AppRoute) || hash.startsWith('search')) {
        setCurrentRouteState(hash.startsWith('search') ? 'search' : (hash as AppRoute));
      }
    }
  };

  const setCurrentRoute = (route: AppRoute) => {
    setCurrentRouteState(route);
    window.location.hash = `#/${route === 'home' ? '' : route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAdmin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const res = await loginAdminUser(email, pass);
    if (res.user) {
      setAdminUser(res.user);
      showToast(`স্বাগতম, ${res.user.name || 'অ্যাডমিনিস্ট্রেটর'}!`, 'success');
      return { success: true };
    }
    return { success: false, error: res.error || 'লগইন ব্যর্থ হয়েছে।' };
  };

  const logoutAdmin = async () => {
    await logoutAdminUser();
    setAdminUser(null);
    showToast('অ্যাডমিন সফলভাবে লগআউট হয়েছেন।', 'info');
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats, ords, sets, gds] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchSiteSettings(),
        fetchGuides()
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setSiteSettings(sets);
      setGuides(gds);
    } catch (err) {
      console.error('Error loading store data:', err);
      showToast('ডাটা লোড করতে সমস্যা হয়েছে। লোকাল মেমোরি ব্যবহার করা হচ্ছে।', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const reloadAllData = async () => {
    await loadAllData();
  };

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('khamari_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart save error:', e);
    }
  }, [cart]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations with inventory validation
  const addToCart = (product: Product, quantity = 1, openDrawer = false) => {
    if (!product.inStock || product.stockCount <= 0 || product.status === 'out_of_stock') {
      showToast(`দুঃখিত, "${product.nameBn}" বর্তমানে স্টক আউট।`, 'warning');
      return;
    }

    const minOrderQty = product.minimumOrderQuantity && product.minimumOrderQuantity > 0 
      ? product.minimumOrderQuantity 
      : 1;

    let addedSuccessfully = true;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      const currentQty = existing ? existing.quantity : 0;
      const initialQty = existing ? quantity : Math.max(quantity, minOrderQty);
      const targetQty = currentQty + initialQty;

      if (targetQty > product.stockCount) {
        showToast(
          `দুঃখিত, এই পণ্যের সর্বোচ্চ ${toBengaliNumber(product.stockCount)} টি স্টকে রয়েছে।`,
          'warning'
        );
        const cappedQty = Math.max(1, product.stockCount);
        if (existing) {
          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: cappedQty } : item
          );
        }
        return [...prevCart, { product, quantity: cappedQty }];
      }

      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: targetQty } : item
        );
      }
      return [...prevCart, { product, quantity: initialQty }];
    });

    if (addedSuccessfully) {
      showToast('পণ্যটি কার্টে যোগ হয়েছে।', 'success');
    }

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const prod = products.find((p) => p.id === productId);
    if (prod && quantity > prod.stockCount) {
      showToast(
        `দুঃখিত, এই পণ্যের সর্বোচ্চ ${toBengaliNumber(prod.stockCount)} টি স্টকে রয়েছে।`,
        'warning'
      );
      quantity = prod.stockCount;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    showToast('পণ্যটি কার্ট থেকে সরানো হয়েছে।', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const buyNow = (product: Product, quantity = 1) => {
    if (!product.inStock || product.stockCount <= 0 || product.status === 'out_of_stock') {
      showToast(`দুঃখিত, "${product.nameBn}" বর্তমানে স্টক আউট।`, 'warning');
      return;
    }
    const minOrderQty = product.minimumOrderQuantity || 1;
    const finalQty = Math.max(quantity, minOrderQty);

    addToCart(product, finalQty, false);
    setIsCartOpen(false);
    setSelectedProduct(null);
    setCurrentRoute('checkout');
    setIsCheckoutOpen(true);
  };

  // Real database Price & Stock validation before checkout / order submission
  const validateAndSyncCart = async (): Promise<{ isValid: boolean; priceChanged: boolean; message?: string }> => {
    try {
      const freshProducts = await fetchProducts();
      let priceChanged = false;
      const outOfStockItems: string[] = [];
      const updatedCart: CartItem[] = [];

      for (const item of cart) {
        const liveProd = freshProducts.find((p) => p.id === item.product.id);

        if (!liveProd || !liveProd.inStock || liveProd.stockCount <= 0 || liveProd.status === 'inactive' || liveProd.status === 'out_of_stock') {
          outOfStockItems.push(item.product.nameBn);
          continue; // Remove out-of-stock product
        }

        if (liveProd.price !== item.product.price) {
          priceChanged = true;
        }

        // Clamp quantity if stock decreased
        const clampedQty = Math.min(item.quantity, liveProd.stockCount);
        updatedCart.push({
          product: liveProd,
          quantity: Math.max(1, clampedQty)
        });
      }

      setCart(updatedCart);

      if (outOfStockItems.length > 0) {
        showToast(`দুঃখিত, "${outOfStockItems.join(', ')}" পণ্যটি বর্তমানে পাওয়া যাচ্ছে না।`, 'error');
        return { isValid: false, priceChanged, message: 'কিছু পণ্য বর্তমানে উপলব্ধ নয়।' };
      }

      if (priceChanged) {
        showToast('আপনার কার্টের একটি পণ্যের মূল্য পরিবর্তিত হয়েছে। অনুগ্রহ করে অর্ডারটি আবার যাচাই করুন।', 'warning');
        return { isValid: true, priceChanged, message: 'পণ্যের মূল্য পরিবর্তিত হয়েছে।' };
      }

      return { isValid: true, priceChanged: false };
    } catch (err) {
      console.warn('validateAndSyncCart error:', err);
      return { isValid: true, priceChanged: false };
    }
  };

  // Computed Cart values
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Order Placement
  const placeOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order> => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `KK-${randomSuffix}`,
      createdAt: new Date().toISOString()
    };

    const saved = await saveOrderToStore(newOrder);
    setOrders((prev) => [saved, ...prev]);
    setLastCreatedOrder(saved);
    clearCart();
    setIsCheckoutOpen(false);
    setIsSuccessModalOpen(true);
    showToast(`অর্ডার সফল হয়েছে! আপনার অর্ডার নং: ${saved.orderNumber}`, 'success');
    
    // Refresh product stock list in background
    loadAllData();
    return saved;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await updateOrderStatusInStore(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status } : o))
    );
    showToast('অর্ডার স্ট্যাটাস আপডেট হয়েছে।');
  };

  const saveProduct = async (product: Product) => {
    await saveProductToStore(product);
    await loadAllData();
    showToast('পণ্য সফলভাবে সংরক্ষণ করা হয়েছে!');
  };

  const addProduct = async (product: Product) => {
    await saveProduct(product);
  };

  const updateProduct = async (product: Product) => {
    await saveProduct(product);
  };

  const deleteProduct = async (id: string) => {
    await deleteProductFromStore(id);
    await loadAllData();
    showToast('পণ্যটি ডিলিট করা হয়েছে।', 'info');
  };

  const saveCategory = async (cat: Category) => {
    await saveCategoryToStore(cat);
    await loadAllData();
    showToast(`"${cat.nameBn}" ক্যাটাগরি সংরক্ষণ হয়েছে!`);
  };

  const deleteCategory = async (id: string) => {
    await deleteCategoryFromStore(id);
    await loadAllData();
    showToast('ক্যাটাগরি মুছে ফেলা হয়েছে।', 'info');
  };

  const saveGuide = async (guide: GuideArticle) => {
    await saveGuideToStore(guide);
    await loadAllData();
    showToast(`"${guide.titleBn}" গাইড সফলভাবে সংরক্ষণ করা হয়েছে!`);
  };

  const deleteGuide = async (id: string) => {
    await deleteGuideFromStore(id);
    await loadAllData();
    showToast('গাইড মুছে ফেলা হয়েছে।', 'info');
  };

  const updateProductStock = async (productId: string, stock: number) => {
    await updateStockInStore(productId, stock);
    await loadAllData();
    showToast('পণ্য মজুত (স্টক) সফলভাবে আপডেট হয়েছে!');
  };

  const updateSettings = async (settings: SiteSettings) => {
    await saveSiteSettingsToStore(settings);
    setSiteSettings(settings);
    showToast('সাইট সেটিংস আপডেট হয়েছে!');
  };

  const resetData = async () => {
    resetStoreToDefaults();
    await loadAllData();
    showToast('সকল প্রাথমিক ডেমো ডেটা সফলভাবে রিস্টোর হয়েছে!');
  };

  const resetToInitialData = async () => {
    await resetData();
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        products,
        categories,
        orders,
        siteSettings,
        guides,
        cart,
        cartCount,
        cartTotal,
        searchQuery,
        setSearchQuery,
        isLoading,
        isSupabaseConnected,
        supabaseStatusMsg,
        testSupabaseConnection,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSuccessModalOpen,
        setIsSuccessModalOpen,
        selectedProduct,
        setSelectedProduct,
        selectedGuide,
        setSelectedGuide,
        isAdminOpen,
        setIsAdminOpen,
        isCalculatorOpen,
        setIsCalculatorOpen,
        lastCreatedOrder,
        adminUser,
        adminTab,
        setAdminTab,
        loginAdmin,
        logoutAdmin,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        buyNow,
        validateAndSyncCart,
        placeOrder,
        updateOrderStatus,
        saveProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        saveCategory,
        deleteCategory,
        saveGuide,
        deleteGuide,
        updateProductStock,
        updateSettings,
        resetData,
        resetToInitialData,
        reloadAllData,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
