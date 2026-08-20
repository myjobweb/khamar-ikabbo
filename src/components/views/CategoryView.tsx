import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../ProductCard';
import { toBengaliNumber } from '../../utils/bengali';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Package,
  AlertTriangle,
  Sparkles,
  Layers,
  Wheat,
  RotateCcw,
  X,
  Check,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface CategoryViewProps {
  categorySlug?: string;
  subcategorySlug?: string;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  categorySlug,
  subcategorySlug
}) => {
  const {
    products,
    categories,
    searchQuery,
    setSearchQuery,
    setCurrentRoute,
    isLoading,
    reloadAllData
  } = useApp();

  const [activeSubcategory, setActiveSubcategory] = useState<string>(
    subcategorySlug || 'all'
  );
  const [sortBy, setSortBy] = useState<string>('featured');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all'); // all, in_stock, low_stock, out_of_stock
  const [discountOnly, setDiscountOnly] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [displayLimit, setDisplayLimit] = useState<number>(8);

  // Sync subcategorySlug prop when route changes
  useEffect(() => {
    if (subcategorySlug) {
      setActiveSubcategory(subcategorySlug);
    } else {
      setActiveSubcategory('all');
    }
    setDisplayLimit(8);
  }, [subcategorySlug, categorySlug]);

  // Determine current active category metadata
  const currentCategory = categories.find((c) => c.slug === categorySlug);

  // Subcategories for feed
  const feedSubcategories = [
    { slug: 'all', nameBn: 'সকল রেডিমেড ফিড' },
    { slug: 'motatajakaron', nameBn: 'গরু মোটাতাজাকরণ ফিড' },
    { slug: 'shar', nameBn: 'ষাঁড় গরুর ফিড' },
    { slug: 'gavi', nameBn: 'গাভীর ফিড' },
    { slug: 'dairy-special', nameBn: 'ডেইরি স্পেশাল ফিড' }
  ];

  const subcategoryName = feedSubcategories.find((s) => s.slug === activeSubcategory)?.nameBn;

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category match
      if (categorySlug && categorySlug !== 'all') {
        if (categorySlug === 'combinations') {
          if (!product.isCombo) return false;
        } else if (product.categorySlug !== categorySlug) {
          return false;
        }
      }

      // Subcategory match (for feed)
      if (
        categorySlug === 'feed' &&
        activeSubcategory !== 'all' &&
        product.subcategorySlug !== activeSubcategory
      ) {
        return false;
      }

      // Availability filter
      if (availabilityFilter === 'in_stock') {
        if (!product.inStock || product.stockCount <= 0) return false;
      } else if (availabilityFilter === 'low_stock') {
        if (product.stockCount <= 0 || product.stockCount > 10) return false;
      } else if (availabilityFilter === 'out_of_stock') {
        if (product.inStock && product.stockCount > 0) return false;
      }

      // Discount filter
      if (discountOnly) {
        const isDiscounted = product.regularPrice && product.regularPrice > product.price;
        if (!isDiscounted) return false;
      }

      // Price Range filter
      const min = minPrice !== '' ? Number(minPrice) : 0;
      const max = maxPrice !== '' ? Number(maxPrice) : Infinity;
      if (product.price < min || product.price > max) {
        return false;
      }

      // Global Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNameBn = product.nameBn.toLowerCase().includes(query);
        const matchesNameEn = product.nameEn?.toLowerCase().includes(query) || false;
        const matchesDesc = product.shortDescBn.toLowerCase().includes(query);
        if (!matchesNameBn && !matchesNameEn && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '');
      if (sortBy === 'name-az') return a.nameBn.localeCompare(b.nameBn, 'bn');
      // default featured
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, categorySlug, activeSubcategory, availabilityFilter, discountOnly, minPrice, maxPrice, searchQuery, sortBy]);

  const activeFiltersCount =
    (activeSubcategory !== 'all' ? 1 : 0) +
    (availabilityFilter !== 'all' ? 1 : 0) +
    (discountOnly ? 1 : 0) +
    (minPrice !== '' || maxPrice !== '' ? 1 : 0);

  const resetAllFilters = () => {
    setActiveSubcategory('all');
    setAvailabilityFilter('all');
    setDiscountOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FDFCF9] min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button onClick={() => setCurrentRoute('home')} className="hover:text-[#1B5E20] transition-colors cursor-pointer">
            হোম
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <button onClick={() => setCurrentRoute(categorySlug as any || 'feed')} className="hover:text-[#1B5E20] transition-colors cursor-pointer">
            {currentCategory ? currentCategory.nameBn : 'সকল পণ্য'}
          </button>
          {activeSubcategory !== 'all' && subcategoryName && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[#1B5E20] font-bold">{subcategoryName}</span>
            </>
          )}
        </div>

        {/* Category Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DF] shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full border border-[#1B5E20]/20">
              <Wheat className="w-3.5 h-3.5" />
              <span>
                {currentCategory ? currentCategory.nameBn : 'সকল ক্যাটাগরির পণ্য'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E3333]">
              {activeSubcategory !== 'all' && subcategoryName
                ? subcategoryName
                : currentCategory
                ? currentCategory.nameBn
                : 'খামারির প্রয়োজনীয় পণ্য তালিকা'}
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {currentCategory
                ? currentCategory.descriptionBn
                : 'উচ্চ পুষ্টিগুণসম্পন্ন রেডিমেড ফিড, দানাদার কাঁচামাল, সাপ্লিমেন্ট এবং সাশ্রয়ী কম্বো প্যাকেজ।'}
            </p>
          </div>

          {/* Special Vet Medicine Banner */}
          {categorySlug === 'medicines' && (
            <div className="mt-4 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-2.5 text-amber-950 text-xs sm:text-sm">
              <AlertTriangle className="w-5 h-5 text-[#F57C00] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">জরুরি নির্দেশনা:</p>
                <p>ঔষধ ব্যবহারের ক্ষেত্রে নিবন্ধিত পশু চিকিৎসকের পরামর্শ অনুসরণ করুন।</p>
              </div>
            </div>
          )}

          {/* Special Combos Banner */}
          {categorySlug === 'combinations' && (
            <div className="mt-4 p-3.5 bg-[#FFF3E0] border border-[#FFE0B2] rounded-2xl flex items-center gap-2.5 text-[#E65100] text-xs sm:text-sm">
              <Sparkles className="w-5 h-5 text-[#F57C00] shrink-0" />
              <p className="font-bold">
                কম্বো প্যাকেজ ক্রয়ে সর্বোচ্চ ১২% পর্যন্ত সাশ্রয় এবং দ্রুত ডেলিভারি সুবিধা!
              </p>
            </div>
          )}
        </div>

        {/* Subcategories Navigation (For Feed) */}
        {categorySlug === 'feed' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {feedSubcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => {
                  setActiveSubcategory(sub.slug);
                  const route = sub.slug === 'all' ? 'feed' : `feed-${sub.slug}`;
                  setCurrentRoute(route as any);
                }}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeSubcategory === sub.slug
                    ? 'bg-[#1B5E20] text-white shadow-md'
                    : 'bg-white text-[#2E3333] border border-[#E8E5DF] hover:border-[#1B5E20] hover:bg-[#F1F8E9]'
                }`}
              >
                {sub.nameBn}
              </button>
            ))}
          </div>
        )}

        {/* Control Bar: Product Count, Mobile Filter Button, Sorting */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8E5DF]">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-[#2E3333]">
              {toBengaliNumber(filteredProducts.length)}টি পণ্য পাওয়া গেছে
            </span>
            {activeFiltersCount > 0 && (
              <span className="bg-[#E8F5E9] text-[#1B5E20] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#1B5E20]/20">
                ফিল্টার সক্রিয় ({toBengaliNumber(activeFiltersCount)})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-[#FDFCF9] border border-[#E8E5DF] hover:border-[#1B5E20] text-[#1B5E20] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#F57C00]" />
              <span>ফিল্টার ও সাজান</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap hidden sm:inline">সাজান:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl px-3 py-2 text-xs font-bold text-[#2E3333] outline-none cursor-pointer"
              >
                <option value="featured">জনপ্রিয় / ফিচারড</option>
                <option value="newest">নতুন পণ্য</option>
                <option value="price-low">দাম: কম থেকে বেশি</option>
                <option value="price-high">দাম: বেশি থেকে কম</option>
                <option value="name-az">নাম: ক - ড় (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap bg-white p-3 rounded-2xl border border-[#E8E5DF]">
            <span className="text-xs font-bold text-gray-500 mr-1">সক্রিয় ফিল্টার:</span>
            {activeSubcategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full border border-[#1B5E20]/20">
                {subcategoryName}
                <button onClick={() => setActiveSubcategory('all')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {availabilityFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                {availabilityFilter === 'in_stock' ? 'স্টকে আছে' : availabilityFilter === 'low_stock' ? 'সীমিত স্টক' : 'স্টক শেষ'}
                <button onClick={() => setAvailabilityFilter('all')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {discountOnly && (
              <span className="inline-flex items-center gap-1 bg-[#FFF3E0] text-[#E65100] text-xs font-bold px-3 py-1 rounded-full border border-[#FFE0B2]">
                ডিসকাউন্টযুক্ত
                <button onClick={() => setDiscountOnly(false)} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {(minPrice !== '' || maxPrice !== '') && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                মূল্য: {minPrice || '০'} - {maxPrice || '∞'} টাকা
                <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            <button
              onClick={resetAllFilters}
              className="text-xs font-bold text-red-600 hover:underline ml-auto cursor-pointer"
            >
              সব ফিল্টার মুছে ফেলুন
            </button>
          </div>
        )}

        {/* Main Content Grid: Desktop Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-[#E8E5DF] h-fit sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E5DF]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#1B5E20]" />
                <h3 className="text-sm font-black text-[#2E3333]">ফিল্টার প্যানেল</h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                >
                  রিসেট
                </button>
              )}
            </div>

            {/* Availability Filter */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#2E3333] uppercase tracking-wider">মজুদ অবস্থা</h4>
              <div className="space-y-1.5 text-xs font-medium text-gray-700">
                {[
                  { id: 'all', label: 'সব পণ্য' },
                  { id: 'in_stock', label: 'স্টকে আছে' },
                  { id: 'low_stock', label: 'সীমিত স্টক' },
                  { id: 'out_of_stock', label: 'স্টক শেষ' }
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:text-[#1B5E20]">
                    <input
                      type="radio"
                      name="availability"
                      checked={availabilityFilter === item.id}
                      onChange={() => setAvailabilityFilter(item.id)}
                      className="accent-[#1B5E20]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Discount Filter */}
            <div className="space-y-2.5 pt-4 border-t border-[#E8E5DF]">
              <h4 className="text-xs font-bold text-[#2E3333] uppercase tracking-wider">মূল্য ছাড়</h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={discountOnly}
                  onChange={(e) => setDiscountOnly(e.target.checked)}
                  className="accent-[#1B5E20] rounded"
                />
                <span>শুধু ডিসকাউন্টযুক্ত পণ্য</span>
              </label>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3 pt-4 border-t border-[#E8E5DF]">
              <h4 className="text-xs font-bold text-[#2E3333] uppercase tracking-wider">মূল্য পরিসীমা (টাকা)</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="সর্বনিম্ন"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#1B5E20]"
                />
                <input
                  type="number"
                  placeholder="সর্বোচ্চ"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#1B5E20]"
                />
              </div>
            </div>
          </div>

          {/* Product Grid & Results */}
          <div className="lg:col-span-3 space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-3xl border border-[#E8E5DF] p-4 space-y-3 animate-pulse h-72">
                    <div className="w-full h-40 bg-gray-200 rounded-2xl" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.slice(0, displayLimit).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {displayLimit < filteredProducts.length && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setDisplayLimit((prev) => prev + 6)}
                      className="bg-white hover:bg-[#E8F5E9] text-[#1B5E20] border border-[#1B5E20]/30 font-bold text-xs sm:text-sm px-8 py-3 rounded-2xl transition-all shadow-xs cursor-pointer"
                    >
                      আরও পণ্য দেখুন ({toBengaliNumber(filteredProducts.length - displayLimit)}টি বাকি)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#E8E5DF] p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#FDFCF9] text-[#1B5E20] rounded-2xl flex items-center justify-center mx-auto border border-[#E8E5DF]">
                  <Package className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-lg font-bold text-[#2E3333]">
                  এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য পাওয়া যাচ্ছে না।
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  আপনার নির্বাচিত ফিল্টার বা ক্যাটাগরির সাথে মিলছে এমন কোনো পণ্য নেই। ফিল্টার রিসেট করে আবার চেষ্টা করুন।
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={resetAllFilters}
                    className="bg-[#1B5E20] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    সব ফিল্টার রিসেট করুন
                  </button>
                  <button
                    onClick={() => reloadAllData()}
                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>রিফ্রেশ</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Bottom Sheet / Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200 lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E5DF]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#1B5E20]" />
                  <h3 className="text-base font-black text-[#2E3333]">ফিল্টার ও সাজান</h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subcategories mobile */}
              {categorySlug === 'feed' && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#2E3333] uppercase tracking-wider">সাব-ক্যাটাগরি</h4>
                  <div className="space-y-1">
                    {feedSubcategories.map((sub) => (
                      <button
                        key={sub.slug}
                        onClick={() => setActiveSubcategory(sub.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          activeSubcategory === sub.slug
                            ? 'bg-[#1B5E20] text-white'
                            : 'bg-gray-50 text-gray-700 hover:bg-[#E8F5E9]'
                        }`}
                      >
                        {sub.nameBn}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#2E3333] uppercase tracking-wider">মজুদ অবস্থা</h4>
                <div className="space-y-1.5 text-xs font-medium text-gray-700">
                  {[
                    { id: 'all', label: 'সব পণ্য' },
                    { id: 'in_stock', label: 'স্টке আছে' },
                    { id: 'low_stock', label: 'সীমিত স্টক' },
                    { id: 'out_of_stock', label: 'স্টক শেষ' }
                  ].map((item) => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mob_availability"
                        checked={availabilityFilter === item.id}
                        onChange={() => setAvailabilityFilter(item.id)}
                        className="accent-[#1B5E20]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Discount */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#2E3333] uppercase tracking-wider">মূল্য ছাড়</h4>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={discountOnly}
                    onChange={(e) => setDiscountOnly(e.target.checked)}
                    className="accent-[#1B5E20] rounded"
                  />
                  <span>শুধু ডিসকাউন্টযুক্ত পণ্য</span>
                </label>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#2E3333] uppercase tracking-wider">মূল্য পরিসীমা (টাকা)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="সর্বনিম্ন"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs outline-none"
                  />
                  <input
                    type="number"
                    placeholder="সর্বোচ্চ"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-[#E8E5DF] grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  resetAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
              >
                রিসেট
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="bg-[#1B5E20] hover:bg-[#124116] text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                প্রয়োগ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
