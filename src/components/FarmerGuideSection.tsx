import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GuideArticle } from '../types';
import {
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

export const FarmerGuideSection: React.FC = () => {
  const { guides, setSelectedGuide, siteSettings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  if (siteSettings.sectionVisibility?.guides === false) {
    return null;
  }

  // Extract unique categories
  const categoriesList = ['all', ...Array.from(new Set(guides.map((g) => g.categoryBn).filter(Boolean)))];

  // Filter guides
  const filteredGuides = guides.filter((g) => {
    const matchesCat = selectedCategory === 'all' || g.categoryBn === selectedCategory;
    const matchesQuery = !searchFilter || 
      g.titleBn.toLowerCase().includes(searchFilter.toLowerCase()) || 
      g.summaryBn.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <section className="py-14 sm:py-18 bg-[#FDFCF9] border-b border-[#E8E5DF]" id="section-farmer-guides">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full mb-2 border border-[#1B5E20]/20">
              <BookOpen className="w-3.5 h-3.5 text-[#1B5E20]" />
              <span>খামারিদের সহায়ক নির্দেশিকা</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E3333] tracking-tight">
              খামারি গাইড ও পরামর্শ
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-2xl">
              অভিজ্ঞ ভেটেরিনারি চিকিৎসক ও সফল খামারিদের বাস্তবসম্মত দিকনির্দেশনা এবং দৈনিক খাবারের চার্ট
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="গাইড খুঁজুন..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E5DF] focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          <span className="text-xs font-bold text-gray-500 shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> ফিল্টার:
          </span>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1B5E20] text-white shadow-2xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#E8E5DF]'
              }`}
            >
              {cat === 'all' ? 'সব গাইড' : cat}
            </button>
          ))}
        </div>

        {/* Guide Cards Grid */}
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className="group bg-white rounded-3xl border border-[#E8E5DF] hover:border-[#1B5E20] shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-0.5"
                id={`guide-card-${guide.slug}`}
              >
                {/* Image Box */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={guide.image}
                    alt={guide.titleBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#1B5E20] text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-[#E8E5DF]">
                    {guide.categoryBn}
                  </div>

                  <div className="absolute bottom-3 left-3 text-white text-xs flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#F57C00]" />
                    <span>{guide.readTimeBn}</span>
                  </div>
                </div>

                {/* Text content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-[#2E3333] group-hover:text-[#1B5E20] transition-colors line-clamp-2 leading-snug">
                      {guide.titleBn}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {guide.summaryBn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8E5DF] flex items-center justify-between text-xs font-bold text-[#1B5E20] group-hover:text-[#124116]">
                    <span>সম্পূর্ণ পড়ুন</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F57C00]" />
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E8E5DF] p-12 text-center text-gray-500 text-sm">
            কোনো গাইড নির্দেশিকা পাওয়া যায়নি।
          </div>
        )}

      </div>
    </section>
  );
};
