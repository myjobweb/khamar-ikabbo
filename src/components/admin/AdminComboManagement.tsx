import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ComboItem } from '../../types';
import { uploadProductImageToSupabase } from '../../services/supabase';
import { ConfirmationModal } from './ConfirmationModal';
import {
  Gift,
  Plus,
  Edit2,
  Trash2,
  UploadCloud,
  CheckCircle2,
  X,
  Loader2,
  PackagePlus
} from 'lucide-react';
import { toBengaliNumber, formatBengaliPrice } from '../../utils/bengali';

export const AdminComboManagement: React.FC = () => {
  const { products, saveProduct, deleteProduct, showToast } = useApp();

  const comboProducts = products.filter((p) => p.isCombo || p.categorySlug === 'combinations');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    nameBn: '',
    slug: '',
    price: 0,
    regularPrice: 0,
    stockCount: 30,
    unit: 'প্যাকেজ',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    shortDescBn: '',
    descriptionBn: '',
    comboItems: [
      { productName: 'গরু মোটাতাজাকরণ ফিড (১ বস্তা)', quantity: '১ বস্তা' },
      { productName: 'খামারি ভাইটাল মিনারেল মিক্স', quantity: '১ প্যাকেট' }
    ]
  });

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      id: `combo-${Date.now()}`,
      nameBn: '',
      slug: `combo-package-${Date.now()}`,
      categorySlug: 'combinations',
      isCombo: true,
      price: 0,
      regularPrice: 0,
      stockCount: 30,
      unit: 'প্যাকেজ',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
      shortDescBn: 'সাশ্রয়ী কম্বো অফার প্যাকেজ',
      descriptionBn: 'সম্পূর্ণ প্যাকেজ কিনলে বিশেষ মূল্যছাড় ও ফ্রি ডেলিভারি সুবিধা।',
      featuresBn: ['সাশ্রয়ী প্যাকেজ মূল্য', 'এক সাথে প্রয়োজনীয় সকল পুষ্টি উপাদান'],
      comboItems: [
        { productName: 'গরু মোটাতাজাকরণ ফিড (১ বস্তা)', quantity: '১ বস্তা' },
        { productName: 'খামারি ভাইটাল মিনারেল মিক্স', quantity: '১ প্যাকেট' }
      ],
      rating: 5.0,
      reviewsCount: 18,
      status: 'active',
      featured: true
    });
    setIsFormOpen(true);
  };

  const openEditModal = (combo: Product) => {
    setIsEditing(true);
    setFormData({ ...combo });
    setIsFormOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadProductImageToSupabase(file, 'combos');
      setFormData((prev) => ({ ...prev, image: publicUrl }));
      showToast('ছবি সফলভাবে আপলোড হয়েছে!');
    } catch (err) {
      showToast('ছবি আপলোড ব্যর্থ হয়েছে।', 'warning');
    } finally {
      setIsUploading(false);
    }
  };

  const addComboItem = () => {
    setFormData((prev) => ({
      ...prev,
      comboItems: [...(prev.comboItems || []), { productName: '', quantity: '১ টি' }]
    }));
  };

  const updateComboItem = (index: number, field: keyof ComboItem, value: string) => {
    const items = [...(formData.comboItems || [])];
    items[index] = { ...items[index], [field]: value };
    setFormData((prev) => ({ ...prev, comboItems: items }));
  };

  const removeComboItem = (index: number) => {
    const items = [...(formData.comboItems || [])].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, comboItems: items }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameBn || !formData.price) {
      showToast('দয়া করে প্যাকেজের নাম ও মূল্য দিন।', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const comboToSave: Product = {
        id: formData.id || `combo-${Date.now()}`,
        nameBn: formData.nameBn,
        slug: formData.slug || formData.nameBn.toLowerCase().replace(/\s+/g, '-'),
        categorySlug: 'combinations',
        isCombo: true,
        price: Number(formData.price) || 0,
        regularPrice: Number(formData.regularPrice) || Number(formData.price) || 0,
        discountPrice: Number(formData.discountPrice) || 0,
        unit: formData.unit || 'প্যাকেজ',
        stockCount: Number(formData.stockCount) || 0,
        inStock: Number(formData.stockCount) > 0,
        image: formData.image || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
        shortDescBn: formData.shortDescBn || '',
        descriptionBn: formData.descriptionBn || '',
        featuresBn: formData.featuresBn || ['সাশ্রয়ী প্যাকেজ অফার'],
        comboItems: (formData.comboItems || []).filter((it) => it.productName.trim().length > 0),
        rating: formData.rating || 5.0,
        reviewsCount: formData.reviewsCount || 10,
        status: formData.status || 'active',
        featured: !!formData.featured
      };

      await saveProduct(comboToSave);
      setIsFormOpen(false);
    } catch (err) {
      showToast('কম্বো প্যাকেজ সংরক্ষণে সমস্যা হয়েছে।', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteProduct(deleteTargetId);
      setDeleteTargetId(null);
    } catch (e) {
      showToast('কম্বো প্যাকেজ ডিলিট করতে সমস্যা হয়েছে।', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-3xl border border-[#E8E5DF] shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#2E3333]">
            কম্বিনেশন প্যাকেজ তালিকা ({toBengaliNumber(comboProducts.length)})
          </h2>
          <p className="text-xs text-gray-500">
            খামারি কাব্য এর বিশেষ অফার বান্ডেল ও প্যাকেজ প্যাকেজিং
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B5E20] hover:bg-[#124116] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন কম্বো প্যাকেজ</span>
        </button>
      </div>

      {/* Combos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comboProducts.map((combo) => (
          <div
            key={combo.id}
            className="bg-white rounded-3xl border border-[#E8E5DF] p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={combo.image}
                  alt={combo.nameBn}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#E8E5DF] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-sm font-black text-[#2E3333] leading-tight">
                    {combo.nameBn}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-black text-[#1B5E20]">
                      {formatBengaliPrice(combo.price)}
                    </span>
                    {combo.regularPrice && combo.regularPrice > combo.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatBengaliPrice(combo.regularPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">
                    মজুত: {toBengaliNumber(combo.stockCount)} প্যাকেজ
                  </span>
                </div>
              </div>

              {/* Combo Items Included */}
              <div className="p-3 bg-[#FDFCF9] rounded-2xl border border-[#E8E5DF] space-y-1.5 text-xs">
                <p className="text-[11px] font-bold text-gray-600">প্যাকেজের অন্তর্ভুক্ত পণ্যসমূহ:</p>
                <ul className="space-y-1">
                  {(combo.comboItems || []).map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between text-gray-700">
                      <span>• {item.productName}</span>
                      <span className="text-gray-400 font-medium text-[11px]">{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                combo.status === 'active' && combo.inStock
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-red-50 text-red-700'
              }`}>
                {combo.status === 'active' && combo.inStock ? 'অফার চলছে' : 'স্টক শেষ'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(combo)}
                  className="p-1.5 text-gray-600 hover:text-[#1B5E20] hover:bg-[#E8F5E9] rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setDeleteTargetId(combo.id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Combo Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E8E5DF] p-6 max-h-[90vh] overflow-y-auto custom-scrollbar space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF]">
              <h3 className="text-base font-black text-[#2E3333]">
                {isEditing ? 'কম্বো প্যাকেজ সম্পাদনা' : 'নতুন কম্বো প্যাকেজ তৈরি'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-[#2E3333] mb-1">
                  প্যাকেজের নাম (বাংলা) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameBn || ''}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  placeholder="যেমন: খামারি কাব্য মোটাতাজাকরণ কম্বো (১০০ দিন স্পেশাল)"
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">
                    প্যাকেজ মূল্য (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="5990"
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
                    placeholder="6500"
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">
                    প্যাকেজ স্টক *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stockCount || 0}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              {/* Included Items Builder */}
              <div className="space-y-2 p-3 bg-emerald-50/40 rounded-2xl border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1B5E20]">প্যাকেজের আইটেমসমূহ</span>
                  <button
                    type="button"
                    onClick={addComboItem}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B5E20] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>আইটেম যোগ করুন</span>
                  </button>
                </div>

                {(formData.comboItems || []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) => updateComboItem(idx, 'productName', e.target.value)}
                      placeholder="পণ্যের নাম..."
                      className="flex-1 px-3 py-1.5 bg-white border border-[#E8E5DF] rounded-xl outline-none"
                    />
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => updateComboItem(idx, 'quantity', e.target.value)}
                      placeholder="পরিমাণ (যেমন: ১ বস্তা)"
                      className="w-28 px-3 py-1.5 bg-white border border-[#E8E5DF] rounded-xl outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeComboItem(idx)}
                      className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Image */}
              <div className="space-y-2">
                <label className="block font-bold text-[#2E3333]">প্যাকেজের ব্যানার ছবি</label>
                <div className="flex items-center gap-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-14 h-14 rounded-xl object-cover border border-[#E8E5DF]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1 flex-1">
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
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E8F5E9] text-[#1B5E20] rounded-xl font-bold text-xs hover:bg-[#D7EED9] cursor-pointer"
                    >
                      {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                      <span>ছবি আপলোড করুন</span>
                    </button>
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="বা ছবির URL দিন..."
                      className="w-full px-3 py-1 bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl text-[11px] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E8E5DF]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold bg-[#1B5E20] hover:bg-[#124116] text-white rounded-xl shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>সংরক্ষণ করুন</span>}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="কম্বো প্যাকেজ মুছে ফেলুন"
        message="আপনি কি নিশ্চিতভাবে এই প্যাকেজটি মুছে ফেলতে চান?"
      />

    </div>
  );
};
