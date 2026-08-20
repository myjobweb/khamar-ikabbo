import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, SiteSettings } from '../types';
import { formatTaka, toBengaliNumber, formatBengaliDate } from '../utils/bengali';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Settings,
  Database,
  Save,
  ShoppingBag,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    siteSettings,
    updateSettings,
    categories,
    resetToInitialData
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'supabase'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...siteSettings });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  if (!isAdminOpen) return null;

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.nameBn || !editingProduct.price) return;

    if (isAddingProduct) {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        nameBn: editingProduct.nameBn || '',
        nameEn: editingProduct.nameEn || '',
        slug: editingProduct.nameBn.toLowerCase().replace(/\s+/g, '-'),
        categorySlug: editingProduct.categorySlug || 'feed',
        subcategorySlug: editingProduct.subcategorySlug || 'motatajakaron',
        price: Number(editingProduct.price) || 0,
        regularPrice: editingProduct.regularPrice ? Number(editingProduct.regularPrice) : undefined,
        unit: editingProduct.unit || 'বস্তা',
        inStock: editingProduct.inStock !== false,
        stockCount: editingProduct.stockCount ?? 100,
        image: editingProduct.image || 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&auto=format&fit=crop&q=80',
        shortDescBn: editingProduct.shortDescBn || '',
        descriptionBn: editingProduct.descriptionBn || '',
        featuresBn: editingProduct.featuresBn || ['উচ্চ প্রোটিন ও শক্তি', 'দ্রুত ওজন বৃদ্ধি'],
        rating: editingProduct.rating ?? 4.8,
        reviewsCount: editingProduct.reviewsCount ?? 15,
        badge: editingProduct.badge || undefined,
        isCombo: editingProduct.isCombo || false,
        isVetMedicine: editingProduct.isVetMedicine || false
      };
      await addProduct(newProd);
    } else if (editingProduct.id) {
      const existing = products.find((p) => p.id === editingProduct.id);
      if (existing) {
        const updatedProd: Product = {
          ...existing,
          ...editingProduct,
          price: Number(editingProduct.price) || existing.price,
          regularPrice: editingProduct.regularPrice ? Number(editingProduct.regularPrice) : existing.regularPrice
        } as Product;
        await updateProduct(updatedProd);
      }
    }

    setEditingProduct(null);
    setIsAddingProduct(false);
    setSaveSuccessMsg('পণ্য সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Handle Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    setSaveSuccessMsg('সাইট সেটিংস সফলভাবে আপডেট হয়েছে!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const filteredAdminProducts = products.filter((p) =>
    p.nameBn.toLowerCase().includes(adminSearch.toLowerCase()) ||
    (p.nameEn && p.nameEn.toLowerCase().includes(adminSearch.toLowerCase()))
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      id="admin-dashboard-modal"
    >
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8E5DF] my-auto flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#1B5E20] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F57C00]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black">
                খামারি কাব্য — অ্যাডমিন ম্যানেজমেন্ট
              </h3>
              <p className="text-xs text-[#E8F5E9]">
                পণ্য ক্যাটালগ, গ্রাহকের অর্ডার, সাইট সেটিংস এবং ডাটাবেজ নিয়ন্ত্রণ
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#E8E5DF] bg-[#FDFCF9] flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => {
              setActiveTab('products');
              setEditingProduct(null);
            }}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#1B5E20] text-[#1B5E20]'
                : 'border-transparent text-gray-500 hover:text-[#2E3333]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>পণ্য তালিকা ({toBengaliNumber(products.length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#1B5E20] text-[#1B5E20]'
                : 'border-transparent text-gray-500 hover:text-[#2E3333]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>অর্ডারসমূহ ({toBengaliNumber(orders.length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#1B5E20] text-[#1B5E20]'
                : 'border-transparent text-gray-500 hover:text-[#2E3333]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>সাইট কনফিগারেশন</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'border-[#1B5E20] text-[#1B5E20]'
                : 'border-transparent text-gray-500 hover:text-[#2E3333]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase ক্লাউড সিঙ্ক</span>
          </button>
        </div>

        {/* Global Success Notification */}
        {saveSuccessMsg && (
          <div className="bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold p-3 text-center border-b border-[#1B5E20]/20 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          
          {/* TAB 1: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* If editing / adding product */}
              {editingProduct !== null ? (
                <form onSubmit={handleSaveProduct} className="bg-[#FDFCF9] p-6 rounded-3xl border border-[#E8E5DF] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF]">
                    <h4 className="text-base font-bold text-[#2E3333]">
                      {isAddingProduct ? 'নতুন পণ্য যোগ করুন' : 'পণ্য সম্পাদনা করুন'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-xs text-gray-500 hover:text-gray-900"
                    >
                      বাতিল
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#2E3333] mb-1">বাংলা নাম *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.nameBn || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, nameBn: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#E8E5DF] rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2E3333] mb-1">ইংরেজি নাম</label>
                      <input
                        type="text"
                        value={editingProduct.nameEn || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#E8E5DF] rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2E3333] mb-1">ক্যাটাগরি</label>
                      <select
                        value={editingProduct.categorySlug || 'feed'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, categorySlug: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#E8E5DF] rounded-xl outline-none"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.nameBn}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#2E3333] mb-1">একক (Unit)</label>
                      <input
                        type="text"
                        value={editingProduct.unit || 'বস্তা'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#E8E5DF] rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2E3333] mb-1">বিক্রয় মূল্য (৳) *</label>
                      <input
                        type="number"
                        required
                        value={editingProduct.price || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full p-2.5 bg-white border border-[#E8E5DF] rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2E3333] mb-1">পূর্বের মূল্য / নিয়মিত মূল্য (৳)</label>
                      <input
                        type="number"
                        value={editingProduct.regularPrice || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, regularPrice: Number(e.target.value) })}
                        className="w-full p-2.5 bg-white border border-[#E8E5DF] rounded-xl outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-[#2E3333] mb-1">ছবির URL</label>
                      <input
                        type="url"
                        value={editingProduct.image || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#E8E5DF] rounded-xl outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-[#2E3333] mb-1">সংক্ষিপ্ত বিবরণ</label>
                      <input
                        type="text"
                        value={editingProduct.shortDescBn || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, shortDescBn: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#E8E5DF] rounded-xl outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-[#2E3333] mb-1">বিস্তারিত বিবরণ</label>
                      <textarea
                        rows={3}
                        value={editingProduct.descriptionBn || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, descriptionBn: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#E8E5DF] rounded-xl outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-4 sm:col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer font-bold">
                        <input
                          type="checkbox"
                          checked={editingProduct.inStock !== false}
                          onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                          className="rounded text-[#1B5E20]"
                        />
                        <span>ইন স্টক (In Stock)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-bold">
                        <input
                          type="checkbox"
                          checked={editingProduct.isCombo || false}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isCombo: e.target.checked })}
                          className="rounded text-[#1B5E20]"
                        />
                        <span>কম্বো প্যাকেজ</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-bold">
                        <input
                          type="checkbox"
                          checked={editingProduct.isVetMedicine || false}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isVetMedicine: e.target.checked })}
                          className="rounded text-[#1B5E20]"
                        />
                        <span>পশু চিকিৎসা ঔষধ</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E5DF]">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-xl"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-xs font-bold text-white bg-[#1B5E20] hover:bg-[#124116] rounded-xl shadow-md"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Products Toolbar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        placeholder="পণ্য খুঁজুন..."
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl outline-none"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>

                    <button
                      onClick={() => {
                        setEditingProduct({ inStock: true, categorySlug: 'feed' });
                        setIsAddingProduct(true);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন পণ্য যোগ করুন</span>
                    </button>
                  </div>

                  {/* Products Table */}
                  <div className="border border-[#E8E5DF] rounded-2xl overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FDFCF9] text-gray-600 font-bold border-b border-[#E8E5DF]">
                        <tr>
                          <th className="p-3">পণ্য</th>
                          <th className="p-3">ক্যাটাগরি</th>
                          <th className="p-3">মূল্য</th>
                          <th className="p-3">স্টক স্ট্যাটাস</th>
                          <th className="p-3 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E5DF]">
                        {filteredAdminProducts.map((prod) => (
                          <tr key={prod.id} className="hover:bg-gray-50">
                            <td className="p-3 flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.nameBn}
                                className="w-10 h-10 object-cover rounded-lg border border-[#E8E5DF]"
                              />
                              <div>
                                <p className="font-bold text-[#2E3333]">{prod.nameBn}</p>
                                <p className="text-gray-400 text-[11px]">{prod.unit}</p>
                              </div>
                            </td>
                            <td className="p-3 text-gray-600 font-medium">
                              {prod.categorySlug}
                            </td>
                            <td className="p-3 font-bold text-[#1B5E20]">
                              {formatTaka(prod.price)}
                            </td>
                            <td className="p-3">
                              {prod.inStock ? (
                                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[10px]">
                                  ইন স্টক
                                </span>
                              ) : (
                                <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md font-bold text-[10px]">
                                  স্টক শেষ
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setIsAddingProduct(false);
                                }}
                                className="p-1.5 text-gray-600 hover:text-[#1B5E20] hover:bg-[#E8F5E9] rounded-lg transition-colors cursor-pointer"
                                title="সম্পাদনা"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('আপনি কি সত্যিই এই পণ্যটি মুছে ফেলতে চান?')) {
                                    deleteProduct(prod.id);
                                  }
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#2E3333]">
                  গ্রাহকের অর্ডার তালিকা ({toBengaliNumber(orders.length)})
                </h4>
              </div>

              <div className="border border-[#E8E5DF] rounded-2xl overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FDFCF9] text-gray-600 font-bold border-b border-[#E8E5DF]">
                    <tr>
                      <th className="p-3">অর্ডার নং</th>
                      <th className="p-3">তারিখ</th>
                      <th className="p-3">গ্রাহকের নাম ও ফোন</th>
                      <th className="p-3">ঠিকানা</th>
                      <th className="p-3">আইটেম</th>
                      <th className="p-3">সর্বমোট</th>
                      <th className="p-3">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E5DF]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono font-bold text-[#1B5E20]">
                          {ord.orderNumber}
                        </td>
                        <td className="p-3 text-gray-500">
                          {formatBengaliDate(ord.createdAt)}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-[#2E3333]">{ord.customerName}</p>
                          <p className="text-gray-500 text-[11px]">{toBengaliNumber(ord.phone)}</p>
                        </td>
                        <td className="p-3 text-gray-600 max-w-xs truncate">
                          {ord.district}, {ord.address}
                        </td>
                        <td className="p-3">
                          {ord.items.length} টি পণ্য
                        </td>
                        <td className="p-3 font-bold text-[#1B5E20]">
                          {formatTaka(ord.total)}
                        </td>
                        <td className="p-3">
                          <select
                            value={ord.status}
                            onChange={(e: any) => updateOrderStatus(ord.id, e.target.value)}
                            className={`p-1.5 rounded-lg font-bold text-[11px] outline-none ${
                              ord.status === 'pending'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : ord.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <option value="pending">অপেক্ষমান (Pending)</option>
                            <option value="confirmed">নিশ্চিতকৃত (Confirmed)</option>
                            <option value="shipped">ডেলিভারিতে পাঠানো (Shipped)</option>
                            <option value="delivered">ডেলিভার্ড (Delivered)</option>
                            <option value="cancelled">বাতিল (Cancelled)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SITE SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
              <h4 className="text-sm font-bold text-[#2E3333] pb-2 border-b border-[#E8E5DF]">
                সাইট সেটিংস ও হেল্পলাইন নাম্বার
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">হটলাইন ফোন নম্বর</label>
                  <input
                    type="text"
                    value={settingsForm.hotlinePhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hotlinePhone: e.target.value })}
                    className="w-full p-2.5 bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">হোয়াটসঅ্যাপ নম্বর</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full p-2.5 bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full p-2.5 bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">ফেসবুক পেজ লিংক</label>
                  <input
                    type="url"
                    value={settingsForm.facebookUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                    className="w-full p-2.5 bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#2E3333] mb-1">ঠিকানা (বাংলায়)</label>
                  <input
                    type="text"
                    value={settingsForm.addressBn}
                    onChange={(e) => setSettingsForm({ ...settingsForm, addressBn: e.target.value })}
                    className="w-full p-2.5 bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">ঢাকা জেলা ডেলিভারি চার্জ (৳)</label>
                  <input
                    type="number"
                    value={settingsForm.deliveryChargeDhaka}
                    onChange={(e) => setSettingsForm({ ...settingsForm, deliveryChargeDhaka: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">ঢাকার বাইরে ডেলিভারি চার্জ (৳)</label>
                  <input
                    type="number"
                    value={settingsForm.deliveryChargeOutside}
                    onChange={(e) => setSettingsForm({ ...settingsForm, deliveryChargeOutside: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">ফ্রি ডেলিভারি থ্রেশহোল্ড (৳)</label>
                  <input
                    type="number"
                    value={settingsForm.freeDeliveryThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E8E5DF]">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('আপনি কি সকল ডাটা মূল অবস্থায় রিসেট করতে চান?')) {
                      resetToInitialData();
                      setSaveSuccessMsg('ডাটাবেজ মূল অবস্থায় রিসেট হয়েছে!');
                    }
                  }}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  ডাটাবেজ রিসেট করুন
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#1B5E20] hover:bg-[#124116] rounded-xl shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>সেটিংস সেভ করুন</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: SUPABASE CLOUD SYNC */}
          {activeTab === 'supabase' && (
            <div className="space-y-6 max-w-2xl text-xs">
              <div className="p-5 bg-[#FDFCF9] border border-[#E8E5DF] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#1B5E20]">
                  <Database className="w-4 h-4" />
                  <span>Supabase ডাটাবেজ ইন্টিগ্রেশন স্ট্যাটাস</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  খামারি কাব্য অ্যাপটি অফলাইন-ফার্স্ট এবং ক্লাউড-রেডি আর্কিটেকচারে তৈরি। যখন আপনি Supabase URL ও API Key প্রদান করবেন, তখন স্বয়ংক্রিয়ভাবে ক্লাউড ডাটাবেজের সাথে পণ্য এবং অর্ডার সিঙ্ক হবে।
                </p>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-900 font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>লোকাল পারসিস্টেন্স সক্রিয় আছে — সকল অর্ডার ও পরিবর্তন ব্রাউজারে সুরক্ষিত রয়েছে।</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
