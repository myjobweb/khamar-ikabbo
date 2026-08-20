import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Warehouse,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Plus,
  Minus,
  Save,
  Loader2
} from 'lucide-react';
import { toBengaliNumber } from '../../utils/bengali';

export const AdminInventoryManagement: React.FC = () => {
  const { products, updateProductStock, categories, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [editingStockMap, setEditingStockMap] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const getStockValue = (prod: Product) => {
    return editingStockMap[prod.id] !== undefined ? editingStockMap[prod.id] : prod.stockCount;
  };

  const handleStockInputChange = (productId: string, val: number) => {
    setEditingStockMap((prev) => ({
      ...prev,
      [productId]: Math.max(0, val)
    }));
  };

  const handleQuickAdjust = (productId: string, currentStock: number, delta: number) => {
    const current = editingStockMap[productId] !== undefined ? editingStockMap[productId] : currentStock;
    const next = Math.max(0, current + delta);
    setEditingStockMap((prev) => ({
      ...prev,
      [productId]: next
    }));
  };

  const handleSaveStock = async (prod: Product) => {
    const newStock = editingStockMap[prod.id] !== undefined ? editingStockMap[prod.id] : prod.stockCount;
    setSavingId(prod.id);
    try {
      await updateProductStock(prod.id, newStock);
      setEditingStockMap((prev) => {
        const next = { ...prev };
        delete next[prod.id];
        return next;
      });
    } catch (err) {
      showToast('স্টক আপডেট করতে ব্যর্থ হয়েছে।', 'warning');
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameBn.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());

    const stock = p.stockCount;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && stock > 10) ||
      (stockFilter === 'low_stock' && stock > 0 && stock <= 10) ||
      (stockFilter === 'out_of_stock' && stock <= 0);

    return matchesSearch && matchesStock;
  });

  const lowStockCount = products.filter((p) => p.stockCount > 0 && p.stockCount <= 10).length;
  const outOfStockCount = products.filter((p) => p.stockCount <= 0).length;
  const inStockCount = products.filter((p) => p.stockCount > 10).length;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-3xl border border-[#E8E5DF] shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#2E3333]">
            ইনভেন্টরি ও মজুত ব্যবস্থাপনা ({toBengaliNumber(filteredProducts.length)})
          </h2>
          <p className="text-xs text-gray-500">
            রিয়েল-টাইম স্টক আপডেট ও লো-স্টক নোটিফিকেশন সিস্টেম
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            পর্যাপ্ত স্টক: {toBengaliNumber(inStockCount)} টি
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            লো-স্টক: {toBengaliNumber(lowStockCount)} টি
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-800 text-xs font-bold border border-red-200">
            স্টক আউট: {toBengaliNumber(outOfStockCount)} টি
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="পণ্যের নাম দিয়ে ইনভেন্টরি খুঁজুন..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs outline-none text-[#2E3333]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        <div>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-white border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs outline-none text-[#2E3333] cursor-pointer"
          >
            <option value="all">সকল ইনভেন্টরি পণ্য</option>
            <option value="in_stock">পর্যাপ্ত স্টক (&gt;১০)</option>
            <option value="low_stock">লো স্টক অ্যালার্ট (১-১০)</option>
            <option value="out_of_stock">স্টক আউট (০)</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#E8E5DF] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FDFCF9] border-b border-[#E8E5DF] text-gray-500 font-bold">
              <tr>
                <th className="p-3.5">পণ্য</th>
                <th className="p-3.5">ক্যাটাগরি</th>
                <th className="p-3.5">একক (Unit)</th>
                <th className="p-3.5">বর্তমান মজুত</th>
                <th className="p-3.5">মজুত স্ট্যাটাস</th>
                <th className="p-3.5 text-center">কুইক স্টক পরিবর্তন</th>
                <th className="p-3.5 text-right">সংরক্ষণ</th>
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
                filteredProducts.map((prod) => {
                  const currentVal = getStockValue(prod);
                  const isDirty = editingStockMap[prod.id] !== undefined && editingStockMap[prod.id] !== prod.stockCount;
                  const isSaving = savingId === prod.id;

                  return (
                    <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                      
                      {/* Product */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={prod.image}
                            alt={prod.nameBn}
                            className="w-10 h-10 rounded-xl object-cover border border-[#E8E5DF]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-[#2E3333]">{prod.nameBn}</p>
                            <p className="text-[10px] text-gray-400 font-mono">{prod.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-bold">
                          {categories.find((c) => c.slug === prod.categorySlug)?.nameBn || prod.categorySlug}
                        </span>
                      </td>

                      {/* Unit */}
                      <td className="p-3.5 font-medium text-gray-600">
                        {prod.unit}
                      </td>

                      {/* Current Stock */}
                      <td className="p-3.5">
                        <span className="text-sm font-black text-[#2E3333]">
                          {toBengaliNumber(prod.stockCount)} টি
                        </span>
                      </td>

                      {/* Stock Status Badge */}
                      <td className="p-3.5">
                        {prod.stockCount <= 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                            <XCircle className="w-3 h-3" />
                            <span>স্টক আউট</span>
                          </span>
                        ) : prod.stockCount <= 10 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>লো স্টক ({toBengaliNumber(prod.stockCount)})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>পর্যাপ্ত মজুত</span>
                          </span>
                        )}
                      </td>

                      {/* Quick Adjust buttons & Input */}
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(prod.id, prod.stockCount, -5)}
                            className="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer"
                            title="-৫ হ্রাস"
                          >
                            -৫
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(prod.id, prod.stockCount, -1)}
                            className="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer"
                            title="-১ হ্রাস"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={currentVal}
                            onChange={(e) => handleStockInputChange(prod.id, Number(e.target.value))}
                            className={`w-16 px-2 py-1 text-center font-bold border rounded-lg outline-none text-xs ${
                              isDirty ? 'border-[#1B5E20] bg-emerald-50 text-[#1B5E20]' : 'border-gray-300 bg-white'
                            }`}
                          />

                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(prod.id, prod.stockCount, +1)}
                            className="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer"
                            title="+১ বৃদ্ধি"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(prod.id, prod.stockCount, +10)}
                            className="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer"
                            title="+১০ বৃদ্ধি"
                          >
                            +১০
                          </button>
                        </div>
                      </td>

                      {/* Save Action */}
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleSaveStock(prod)}
                          disabled={!isDirty || isSaving}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                            isDirty
                              ? 'bg-[#1B5E20] hover:bg-[#124116] text-white shadow-xs'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isSaving ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          <span>সেভ</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
