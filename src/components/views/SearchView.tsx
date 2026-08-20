import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../ProductCard';
import { toBengaliNumber } from '../../utils/bengali';
import { Search, Sparkles, Package, ArrowLeft, AlertCircle } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { products, setCurrentRoute, setSearchQuery: setGlobalSearchQuery, setSelectedProduct } = useApp();
  
  // Get query from URL search params
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(12);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    setSearchQuery(q);
  }, []);

  // Listen to popstate or URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || '';
      setSearchQuery(q);
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const nameBn = p.nameBn?.toLowerCase() || '';
      const nameEn = p.nameEn?.toLowerCase() || '';
      const shortDesc = p.shortDescBn?.toLowerCase() || '';
      const fullDesc = p.descriptionBn?.toLowerCase() || '';
      const cat = p.categorySlug?.toLowerCase() || '';
      const subcat = p.subcategorySlug?.toLowerCase() || '';
      return (
        nameBn.includes(query) ||
        nameEn.includes(query) ||
        shortDesc.includes(query) ||
        fullDesc.includes(query) ||
        cat.includes(query) ||
        subcat.includes(query)
      );
    });
  }, [products, searchQuery]);

  const popularProducts = useMemo(() => {
    return products.filter((p) => p.featured || p.rating >= 4.5).slice(0, 4);
  }, [products]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const term = (formData.get('q') as string) || '';
    const newUrl = `${window.location.pathname}#/search?q=${encodeURIComponent(term)}`;
    window.history.pushState({}, '', newUrl);
    setSearchQuery(term);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FDFCF9] min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search Header & Input Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DF] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentRoute('home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5E20] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোমে ফিরে যান</span>
            </button>
            <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full font-medium">
              সরাসরি ডাটাবেজ সার্চ
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3333]">
              সার্চ ফলাফল
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {searchQuery ? (
                <>
                  <span className="font-bold text-[#1B5E20]">"{searchQuery}"</span> এর জন্য{' '}
                  <span className="font-bold text-[#F57C00]">
                    {toBengaliNumber(searchResults.length)}টি
                  </span>{' '}
                  পণ্য পাওয়া গেছে।
                </>
              ) : (
                'অনুগ্রহ করে অনুসন্ধানের জন্য কিছু লিখুন।'
              )}
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-2xl">
            <Search className="w-5 h-5 text-gray-400 absolute left-4" />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="আপনার প্রয়োজনীয় পণ্য খুঁজুন (যেমন: ভুট্টা, ফিড, সাপ্লিমেন্ট)..."
              className="w-full bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 rounded-2xl py-3.5 pl-12 pr-28 text-sm font-medium outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              খুঁজুন
            </button>
          </form>
        </div>

        {/* Results Grid or Empty State */}
        {searchResults.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {searchResults.slice(0, displayLimit).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {displayLimit < searchResults.length && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setDisplayLimit((prev) => prev + 8)}
                  className="bg-white hover:bg-[#E8F5E9] text-[#1B5E20] border border-[#1B5E20]/30 font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all shadow-xs cursor-pointer"
                >
                  আরও পণ্য দেখুন ({toBengaliNumber(searchResults.length - displayLimit)}টি বাকি)
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E8E5DF] p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-50 text-[#F57C00] rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#2E3333]">
                দুঃখিত, আপনার খোঁজা পণ্যটি পাওয়া যায়নি।
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                বানান চেক করুন অথবা ভিন্ন শব্দ দিয়ে অনুসন্ধান করুন। অন্য কোনো জনপ্রিয় পণ্য নিচে থেকে দেখতে পারেন।
              </p>
            </div>

            {/* Popular Products Fallback */}
            {popularProducts.length > 0 && (
              <div className="pt-6 border-t border-[#E8E5DF] space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F57C00]" />
                  <h4 className="text-sm font-bold text-[#1B5E20] uppercase tracking-wider">
                    জনপ্রিয় পণ্য
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                  {popularProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="group bg-[#FDFCF9] p-3 rounded-2xl border border-[#E8E5DF] hover:border-[#1B5E20] cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <img src={p.image} alt={p.nameBn} className="w-full h-28 object-cover rounded-xl mb-2" />
                      <h5 className="text-xs font-bold text-[#2E3333] group-hover:text-[#1B5E20] line-clamp-1">
                        {p.nameBn}
                      </h5>
                      <p className="text-xs font-black text-[#1B5E20] mt-1">
                        ৳{toBengaliNumber(p.price)} / {p.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
