import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategoryType, ProductStatus } from '../../types';
import { uploadProductImageToSupabase } from '../../services/supabase';
import { ConfirmationModal } from './ConfirmationModal';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  UploadCloud,
  CheckCircle2,
  X,
  Star,
  Image as ImageIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toBengaliNumber, formatBengaliPrice } from '../../utils/bengali';

export const AdminProductManagement: React.FC = () => {
  const {
    products,
    categories,
    saveProduct,
    deleteProduct,
    showToast
  } = useApp();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form Values
  const [formData, setFormData] = useState<Partial<Product>>({
    nameBn: '',
    slug: '',
    categorySlug: 'feed',
    subcategorySlug: '',
    price: 0,
    regularPrice: 0,
    discountPrice: 0,
    unit: '৫০ কেজি বস্তা',
    stockCount: 50,
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    shortDescBn: '',
    descriptionBn: '',
    featuresBn: [''],
    usageBn: '',
    status: 'active',
    featured: false
  });

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen to open-add-product-form event from sidebar or dashboard
  useEffect(() => {
    const handleOpenAdd = () => {
      openAddModal();
    };
    window.addEventListener('open-add-product-form', handleOpenAdd);
    return () => window.removeEventListener('open-add-product-form', handleOpenAdd);
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      id: `p-${Date.now()}`,
      nameBn: '',
      slug: `product-${Date.now()}`,
      categorySlug: 'feed',
      subcategorySlug: '',
      price: 0,
      regularPrice: 0,
      discountPrice: 0,
      unit: '৫০ কেজি বস্তা',
      stockCount: 50,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
      shortDescBn: '',
      descriptionBn: '',
      featuresBn: ['উচ্চ মানের পুষ্টিগুণ সমৃদ্ধ', 'দ্রুত ওজন ও স্বাস্থ্য বৃদ্ধি নিশ্চিত করে'],
      usageBn: '',
      rating: 4.9,
      reviewsCount: 15,
      status: 'active',
      featured: false
    });
    setIsFormOpen(true);
  };

  const openEditModal = (product: Product) => {
    setIsEditing(true);
    setFormData({
      ...product,
      featuresBn: product.featuresBn?.length ? product.featuresBn : ['']
    });
    setIsFormOpen(true);
  };

  // Image Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadProductImageToSupabase(file, 'products');
      setFormData((prev) => ({ ...prev, image: publicUrl }));
      showToast('ছবি সফলভাবে আপলোড হয়েছে!');
    } catch (err) {
      showToast('ছবি আপলোড করতে ব্যর্থ হয়েছে।', 'warning');
    } finally {
      setIsUploading(false);
    }
  };

  // Form Submit Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameBn || !formData.price) {
      showToast('দয়া করে পণ্যের নাম ও মূল্য পূরণ করুন।', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const productToSave: Product = {
        id: formData.id || `prod-${Date.now()}`,
        nameBn: formData.nameBn,
        slug: formData.slug || formData.nameBn.toLowerCase().replace(/\s+/g, '-'),
        categorySlug: formData.categorySlug || 'feed',
        subcategorySlug: formData.subcategorySlug,
        price: Number(formData.price) || 0,
        regularPrice: Number(formData.regularPrice) || Number(formData.price) || 0,
        discountPrice: Number(formData.discountPrice) || 0,
        unit: formData.unit || 'বস্তা',
        stockCount: Number(formData.stockCount) || 0,
        inStock: Number(formData.stockCount) > 0,
        image: formData.image || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
        shortDescBn: formData.shortDescBn || '',
        descriptionBn: formData.descriptionBn || '',
        featuresBn: (formData.featuresBn || []).filter((f) => f.trim().length > 0),
        usageBn: formData.usageBn || '',
        rating: formData.rating || 4.9,
        reviewsCount: formData.reviewsCount || 10,
        status: (formData.status as ProductStatus) || 'active',
        featured: !!formData.featured
      };

      await saveProduct(productToSave);
      setIsFormOpen(false);
    } catch (err) {
      showToast('পণ্য সংরক্ষণ করতে ত্রুটি হয়েছে।', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteProduct(deleteTargetId);
      setDeleteTargetId(null);
    } catch (e) {
      showToast('পণ্য মুছে ফেলতে সমস্যা হয়েছে।', 'warning');
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameBn.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'all' || p.categorySlug === categoryFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && p.status === 'active') ||
      (statusFilter === 'inactive' && p.status === 'inactive') ||
      (statusFilter === 'out_of_stock' && (!p.inStock || p.stockCount <= 0));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-3xl border border-[#E8E5DF] shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#2E3333]">
            পণ্য ব্যবস্থাপনা তালিকা ({toBengaliNumber(filteredProducts.length)})
          </h2>
          <p className="text-xs text-gray-500">
            খামারি কাব্য এর সকল প্রোডাক্ট ক্যাটালগ ও মূল্য তালিকা
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B5E20] hover:bg-[#124116] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন পণ্য যুক্ত করুন</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="পণ্যের নাম দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs outline-none text-[#2E3333]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs outline-none text-[#2E3333] cursor-pointer"
          >
            <option value="all">সকল ক্যাটাগরি</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.nameBn}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs outline-none text-[#2E3333] cursor-pointer"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="active">সক্রিয় (Active)</option>
            <option value="out_of_stock">স্টক আউট (Out of Stock)</option>
            <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
          </select>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E8E5DF] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FDFCF9] border-b border-[#E8E5DF] text-gray-500 font-bold">
              <tr>
                <th className="p-3.5">ছবি</th>
                <th className="p-3.5">পণ্যের নাম</th>
                <th className="p-3.5">ক্যাটাগরি</th>
                <th className="p-3.5">মূল্য</th>
                <th className="p-3.5">মজুত (Stock)</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    কোনো পণ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                    
                    {/* Image */}
                    <td className="p-3.5">
                      <img
                        src={prod.image}
                        alt={prod.nameBn}
                        className="w-10 h-10 rounded-xl object-cover border border-[#E8E5DF]"
                        referrerPolicy="no-referrer"
                      />
                    </td>

                    {/* Name & Slug */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#2E3333]">{prod.nameBn}</span>
                        {prod.featured && (
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400">{prod.unit}</p>
                    </td>

                    {/* Category */}
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-bold">
                        {categories.find((c) => c.slug === prod.categorySlug)?.nameBn || prod.categorySlug}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-3.5 font-bold text-[#1B5E20]">
                      {formatBengaliPrice(prod.price)}
                      {prod.regularPrice && prod.regularPrice > prod.price && (
                        <span className="text-[10px] text-gray-400 line-through block font-normal">
                          {formatBengaliPrice(prod.regularPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="p-3.5 font-semibold">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.stockCount <= 0
                          ? 'bg-red-100 text-red-700'
                          : prod.stockCount <= 10
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {toBengaliNumber(prod.stockCount)} টি
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.status === 'active' && prod.inStock
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {prod.status === 'active' && prod.inStock ? 'সক্রিয়' : 'স্টক আউট / নিষ্ক্রিয়'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          title="এডিট করুন"
                          className="p-1.5 text-gray-600 hover:text-[#1B5E20] hover:bg-[#E8F5E9] rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTargetId(prod.id);
                            setIsDeleteModalOpen(true);
                          }}
                          title="ডিলিট করুন"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8E5DF] p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E5DF]">
              <div>
                <h3 className="text-base font-black text-[#2E3333]">
                  {isEditing ? 'পণ্য সংশোধন (Edit Product)' : 'নতুন পণ্য যোগ (Add Product)'}
                </h3>
                <p className="text-[11px] text-gray-500">
                  সঠিক মূল্য, স্টক ও ছবি প্রদান করুন
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4 text-xs">
              
              {/* Product Name */}
              <div>
                <label className="block font-bold text-[#2E3333] mb-1">
                  পণ্যের নাম (বাংলায়) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameBn || ''}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  placeholder="যেমন: গরু মোটাতাজাকরণ স্পেশাল ফিড"
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                />
              </div>

              {/* Category & Subcategory Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">
                    ক্যাটাগরি (Category) *
                  </label>
                  <select
                    value={formData.categorySlug || 'feed'}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value as ProductCategoryType })}
                    className="w-full px-3 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.nameBn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">
                    সাবক্যাটাগরি (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={formData.subcategorySlug || ''}
                    onChange={(e) => setFormData({ ...formData, subcategorySlug: e.target.value })}
                    placeholder="যেমন: motatajakaron, shar, gavi"
                    className="w-full px-3 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Price, Regular Price, Unit, Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">
                    বিক্রয় মূল্য (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="2450"
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-bold text-[#1B5E20]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">
                    রেগুলার মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    value={formData.regularPrice || ''}
                    onChange={(e) => setFormData({ ...formData, regularPrice: Number(e.target.value) })}
                    placeholder="2600"
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">
                    একক (Unit) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit || ''}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="৫০ কেজি বস্তা"
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">
                    স্টক পরিমাণ *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stockCount ?? 0}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    placeholder="50"
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              {/* Image Upload & URL */}
              <div className="space-y-2 pt-1">
                <label className="block font-bold text-[#2E3333]">
                  পণ্যের ছবি (Product Image)
                </label>
                
                <div className="flex items-center gap-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover border border-[#E8E5DF] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5E9] hover:bg-[#D7EED9] text-[#1B5E20] rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>আপলোড হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>ছবি আপলোড করুন (Storage)</span>
                        </>
                      )}
                    </button>
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="বা সরাসরি ছবির URL দিন..."
                      className="w-full px-3 py-1.5 bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl text-[11px] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Short & Full Description */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">
                    সংক্ষিপ্ত বিবরণ
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescBn || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescBn: e.target.value })}
                    placeholder="এক নজরে পণ্যের মূল কাজ..."
                    className="w-full px-3.5 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">
                    বিস্তারিত বিবরণ ও ব্যবহারের নিয়ম
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descriptionBn || ''}
                    onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                    placeholder="উপাদান, উপকারিতা ও ডোজ সম্পর্কে লিখুন..."
                    className="w-full px-3.5 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Status & Featured */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#2E3333]">
                  <input
                    type="checkbox"
                    checked={formData.status === 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                    className="w-4 h-4 accent-[#1B5E20] rounded"
                  />
                  <span>সক্রিয় রাখুন (Active in Store)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-700">
                  <input
                    type="checkbox"
                    checked={!!formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                  <span>ফিচার্ড পণ্য হিসেবে প্রদর্শন (Featured)</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E8E5DF]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold bg-[#1B5E20] hover:bg-[#124116] text-white rounded-xl shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <span>{isEditing ? 'আপডেট করুন' : 'যোগ করুন'}</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="পণ্য মুছে ফেলুন"
        message="আপনি কি নিশ্চিতভাবে এই পণ্যটি ডাটাবেজ থেকে মুছে ফেলতে চান? এই কাজটি ফিরিয়ে আনা যাবে না।"
        confirmLabel="হ্যাঁ, মুছে ফেলুন"
      />

    </div>
  );
};
