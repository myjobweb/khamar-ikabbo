import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Subcategory } from '../../types';
import { ConfirmationModal } from './ConfirmationModal';
import { Plus, Edit2, Trash2, FolderGit2, X } from 'lucide-react';
import { toBengaliNumber } from '../../utils/bengali';

export const AdminSubcategoryManagement: React.FC = () => {
  const { categories, saveCategory, showToast } = useApp();

  // Extract all subcategories from categories
  const allSubcategories: { categoryName: string; categorySlug: string; sub: Subcategory }[] = [];
  categories.forEach((c) => {
    (c.subcategories || []).forEach((sub) => {
      allSubcategories.push({
        categoryName: c.nameBn,
        categorySlug: c.slug,
        sub
      });
    });
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedParentSlug, setSelectedParentSlug] = useState<string>('feed');
  const [formData, setFormData] = useState<Partial<Subcategory>>({
    nameBn: '',
    slug: '',
    descriptionBn: '',
    displayOrder: 1,
    status: 'active'
  });

  const [deleteTargetSub, setDeleteTargetSub] = useState<{ parentSlug: string; subId: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedParentSlug('feed');
    setFormData({
      id: `sub-${Date.now()}`,
      nameBn: '',
      slug: '',
      descriptionBn: '',
      displayOrder: 1,
      status: 'active'
    });
    setIsFormOpen(true);
  };

  const openEditModal = (parentSlug: string, sub: Subcategory) => {
    setIsEditing(true);
    setSelectedParentSlug(parentSlug);
    setFormData({ ...sub });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameBn || !formData.slug) {
      showToast('দয়া করে সাবক্যাটাগরির নাম ও স্ল্যাগ প্রদান করুন।', 'warning');
      return;
    }

    const parentCat = categories.find((c) => c.slug === selectedParentSlug);
    if (!parentCat) return;

    const currentSubs = parentCat.subcategories || [];
    const newSub: Subcategory = {
      id: formData.id || `sub-${Date.now()}`,
      categoryId: parentCat.id,
      nameBn: formData.nameBn,
      slug: formData.slug,
      descriptionBn: formData.descriptionBn || '',
      displayOrder: Number(formData.displayOrder) || 1,
      status: formData.status || 'active'
    };

    let updatedSubs: Subcategory[];
    const existingIndex = currentSubs.findIndex((s) => s.id === newSub.id || s.slug === newSub.slug);
    if (existingIndex >= 0) {
      updatedSubs = [...currentSubs];
      updatedSubs[existingIndex] = newSub;
    } else {
      updatedSubs = [...currentSubs, newSub];
    }

    const updatedCategory = {
      ...parentCat,
      subcategories: updatedSubs
    };

    await saveCategory(updatedCategory);
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetSub) return;
    const parentCat = categories.find((c) => c.slug === deleteTargetSub.parentSlug);
    if (!parentCat) return;

    const updatedSubs = (parentCat.subcategories || []).filter((s) => s.id !== deleteTargetSub.subId);
    await saveCategory({
      ...parentCat,
      subcategories: updatedSubs
    });
    setDeleteTargetSub(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-3xl border border-[#E8E5DF] shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#2E3333]">
            সাবক্যাটাগরি তালিকা ({toBengaliNumber(allSubcategories.length)})
          </h2>
          <p className="text-xs text-gray-500">
            মূল ক্যাটাগরির অধীনে নির্দিষ্ট সাব-গ্রুপসমূহ
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B5E20] hover:bg-[#124116] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন সাবক্যাটাগরি</span>
        </button>
      </div>

      {/* Subcategory Table */}
      <div className="bg-white rounded-3xl border border-[#E8E5DF] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FDFCF9] border-b border-[#E8E5DF] text-gray-500 font-bold">
              <tr>
                <th className="p-3.5">সাবক্যাটাগরি নাম</th>
                <th className="p-3.5">স্ল্যাগ (Slug)</th>
                <th className="p-3.5">মূল ক্যাটাগরি</th>
                <th className="p-3.5">বিবরণ</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allSubcategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    কোনো সাবক্যাটাগরি পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                allSubcategories.map(({ categoryName, categorySlug, sub }) => (
                  <tr key={sub.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-[#2E3333]">
                      {sub.nameBn}
                    </td>
                    <td className="p-3.5 font-mono text-gray-500">
                      {sub.slug}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-[#1B5E20] font-bold text-[10px]">
                        {categoryName}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-500 max-w-xs truncate">
                      {sub.descriptionBn || '—'}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                        সক্রিয়
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(categorySlug, sub)}
                          className="p-1.5 text-gray-600 hover:text-[#1B5E20] hover:bg-[#E8F5E9] rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTargetSub({ parentSlug: categorySlug, subId: sub.id });
                            setIsDeleteModalOpen(true);
                          }}
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

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E8E5DF] p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF]">
              <h3 className="text-base font-black text-[#2E3333]">
                {isEditing ? 'সাবক্যাটাগরি সম্পাদনা' : 'নতুন সাবক্যাটাগরি'}
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
                  মূল ক্যাটাগরি (Parent Category) *
                </label>
                <select
                  value={selectedParentSlug}
                  onChange={(e) => setSelectedParentSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none cursor-pointer"
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
                  সাবক্যাটাগরি নাম (বাংলা) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameBn || ''}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  placeholder="যেমন: মোটাতাজাকরণ স্পেশাল"
                  className="w-full px-3.5 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2E3333] mb-1">
                  স্ল্যাগ (Slug) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="motatajakaron"
                  className="w-full px-3.5 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2E3333] mb-1">বিবরণ (ঐচ্ছিক)</label>
                <textarea
                  rows={2}
                  value={formData.descriptionBn || ''}
                  onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                  placeholder="সাবক্যাটাগরির সংক্ষিপ্ত বিবরণ..."
                  className="w-full px-3.5 py-2 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
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
                  className="px-5 py-2 text-xs font-bold bg-[#1B5E20] hover:bg-[#124116] text-white rounded-xl shadow-md cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Confirmation */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="সাবক্যাটাগরি মুছে ফেলুন"
        message="আপনি কি নিশ্চিতভাবে এই সাবক্যাটাগরি মুছে ফেলতে চান?"
      />

    </div>
  );
};
