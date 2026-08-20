import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const FeaturedProductsSection: React.FC = () => {
  const { products, setCurrentRoute, siteSettings } = useApp();

  if (siteSettings.sectionVisibility?.featuredProducts === false) {
    return null;
  }

  // Filter products where featured === true or fallback
  const featuredList = products.filter((p) => p.featured === true);
  const displayList = featuredList.length > 0 ? featuredList.slice(0, 8) : products.slice(0, 8);

  return (
    <section className="py-14 sm:py-18 bg-[#FDFCF9] border-b border-[#E8E5DF]" id="featured-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full mb-2 border border-[#1B5E20]/20">
              <TrendingUp className="w-3.5 h-3.5 text-[#1B5E20]" />
              <span>জনপ্রিয় পণ্য</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E3333] tracking-tight">
              জনপ্রিয় পণ্য
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
              উচ্চ পুষ্টি ও প্রোটিন সমৃদ্ধ নিয়মিত পরীক্ষিত গবাদিপশুর খাদ্য ও উপাদান
            </p>
          </div>

          <button
            onClick={() => setCurrentRoute('feed')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1B5E20] hover:text-[#124116] self-start sm:self-auto cursor-pointer"
          >
            <span>সব পণ্য ব্রাউজ করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid or Empty Message */}
        {displayList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#E8E5DF] p-6 text-gray-500 text-sm">
            জনপ্রিয় পণ্য শীঘ্রই যোগ করা হবে।
          </div>
        )}

        {/* View More Bar */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setCurrentRoute('feed')}
            className="inline-flex items-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>আরও পণ্য দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
