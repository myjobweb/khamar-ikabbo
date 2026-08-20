import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, ProductCategoryType } from '../../types';
import { uploadProductImageToSupabase } from '../../services/supabase';
import { ConfirmationModal } from './ConfirmationModal';
import {
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  UploadCloud,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { toBengaliNumber } from '../../utils/bengali';

export const AdminCategoryManagement: React.FC = () => {
  const { categories, products, saveCategory, deleteCategory, showToast } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<Category>>({
    nameBn: '',
    nameEn: '',
    slug: 'feed',
    descriptionBn: '',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    status: 'active'
  });

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      id: `cat-${Date.now()}`,
      nameBn: '',
      nameEn: '',
      slug: `category-${Date.now()}`,
      descriptionBn: '',
      image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
      displayOrder: categories.length + 1,
      status: 'active'
    });
    setIsFormOpen(true);
  };

  const openEditModal = (category: Category) => {
    setIsEditing(true);
    setFormData({ ...category });
    setIsFormOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadProductImageToSupabase(file, 'categories');
      setFormData((prev) => ({ ...prev, image: publicUrl }));
      showToast('ক্যাটাগরি ছবি আপলোড হয়েছে!');
    } catch (err) {
      showToast('ছবি আপলোড করতে ব্যর্থ হয়েছে।', 'warning');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameBn || !formData.slug) {
      showToast('দয়া করে ক্যাটাগরির নাম ও স্ল্যাগ পূরণ করুন।', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const catToSave: Category = {
        id: formData.id || `cat-${Date.now()}`,
        nameBn: formData.nameBn,
        nameEn: formData.nameEn || formData.slug || '',
        slug: formData.slug as ProductCategoryType,
        descriptionBn: formData.descriptionBn || '',
        image: formData.image || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
        displayOrder: Number(formData.displayOrder) || 1,
        status: formData.status || 'active',
        subcategories: formData.subcategories || []
      };

      await saveCategory(catToSave);
      setIsFormOpen(false);
    } catch (err) {
      showToast('ক্যাটাগরি সংরক্ষণে ত্রুটি হয়েছে।', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteCategory(deleteTargetId);
      setDeleteTargetId(null);
    } catch (e) {
      showToast('ক্যাটাগরি মুছে ফেলতে সমস্যা হয়েছে।', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-3xl border border-[#E8E5DF] shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#2E3333]">
            ক্যাটাগরি তালিকা ({toBengaliNumber(categories.length)})
          </h2>
          <p className="text-xs text-gray-500">
            খামারি কাব্য এর সকল প্রধান পণ্য ক্যাটাগরি ও বিভাগ
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B5E20] hover:bg-[#124116] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন ক্যাটাগরি</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.categorySlug === cat.slug).length;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-[#E8E5DF] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-32 overflow-hidden bg-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.nameBn}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-black text-[#1B5E20]">
                    {toBengaliNumber(productCount)} টি পণ্য
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#2E3333]">{cat.nameBn}</h3>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">
                      {cat.slug}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {cat.descriptionBn || 'খামারি কাব্য এর প্রিমিয়াম ক্যাটাগরি।'}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-3 bg-[#FDFCF9] border-t border-[#E8E5DF] flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400">
                  অর্ডার: {toBengaliNumber(cat.displayOrder || 1)}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-gray-600 hover:text-[#1B5E20] hover:bg-[#E8F5E9] rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteTargetId(cat.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8E5DF] p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF]">
              <h3 className="text-base font-black text-[#2E3333]">
                {isEditing ? 'ক্যাটাগরি সম্পাদনা' : 'নতুন ক্যাটাগরি তৈরি'}
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
                  ক্যাটাগরি নাম (বাংলা) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameBn || ''}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  placeholder="যেমন: ক্যাটল ফিড"
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">
                    স্ল্যাগ (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value as ProductCategoryType })}
                    placeholder="feed"
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E3333] mb-1">
                    ডিসপ্লে ক্রম (Order)
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder || 1}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Image */}
              <div className="space-y-2">
                <label className="block font-bold text-[#2E3333]">ক্যাটাগরি ব্যানার ছবি</label>
                <div className="flex items-center gap-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-16 h-12 rounded-xl object-cover border border-[#E8E5DF]"
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
                      <span>ছবি আপলোড</span>
                    </button>
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="বা ইমেজ URL..."
                      className="w-full px-3 py-1 bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl text-[11px] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2E3333] mb-1">বিবরণ (বাংলা)</label>
                <textarea
                  rows={2}
                  value={formData.descriptionBn || ''}
                  onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                  placeholder="ক্যাটাগরি সম্পর্কিত সংক্ষিপ্ত তথ্য..."
                  className="w-full px-3 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                />
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="ক্যাটাগরি মুছে ফেলুন"
        message="আপনি কি নিশ্চিতভাবে এই ক্যাটাগরি মুছে ফেলতে চান?"
      />

    </div>
  );
};
