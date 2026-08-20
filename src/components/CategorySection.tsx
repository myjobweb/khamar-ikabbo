import React from 'react';
import { useApp } from '../context/AppContext';
import { AppRoute } from '../types';
import {
  Wheat,
  Layers,
  Activity,
  HeartPulse,
  Package,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CategorySection: React.FC = () => {
  const { categories, setCurrentRoute, siteSettings } = useApp();

  if (siteSettings.sectionVisibility?.categories === false) {
    return null;
  }

  const getIcon = (slug: string) => {
    switch (slug) {
      case 'feed':
        return Wheat;
      case 'raw-materials':
        return Layers;
      case 'supplements':
        return Activity;
      case 'medicines':
        return HeartPulse;
      case 'combinations':
        return Package;
      default:
        return Wheat;
    }
  };

  const getCardTone = (slug: string) => {
    switch (slug) {
      case 'feed':
        return { bg: 'bg-[#FFF3E0]', text: 'text-[#F57C00]' };
      case 'raw-materials':
        return { bg: 'bg-[#F1F8E9]', text: 'text-[#7CB342]' };
      case 'supplements':
        return { bg: 'bg-[#E1F5FE]', text: 'text-[#0288D1]' };
      case 'medicines':
        return { bg: 'bg-[#FFEBEE]', text: 'text-[#E53935]' };
      case 'combinations':
        return { bg: 'bg-[#F3E5F5]', text: 'text-[#8E24AA]' };
      default:
        return { bg: 'bg-[#E8F5E9]', text: 'text-[#1B5E20]' };
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-[#E8E5DF]" id="category-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full mb-2 border border-[#1B5E20]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>খামারের সকল পণ্য সম্ভার</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E3333] tracking-tight">
              পণ্য ক্যাটাগরি অনুযায়ী খুঁজুন
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
              আপনার খামারের গবাদিপশুর চাহিদা অনুযায়ী সঠিক ক্যাটাগরি বেছে নিন
            </p>
          </div>

          <button
            onClick={() => setCurrentRoute('feed')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1B5E20] hover:text-[#124116] self-start sm:self-auto cursor-pointer"
          >
            <span>সকল পণ্য একসাথে দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = getIcon(category.slug);
            const tone = getCardTone(category.slug);

            return (
              <div
                key={category.id}
                onClick={() => setCurrentRoute(category.slug as AppRoute)}
                className="group bg-[#FDFCF9] hover:bg-white rounded-3xl p-5 border border-[#E8E5DF] hover:border-[#1B5E20] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
                id={`cat-card-${category.slug}`}
              >
                <div>
                  <div className={`w-12 h-12 ${tone.bg} rounded-2xl flex items-center justify-center mb-3.5 group-hover:bg-[#1B5E20] transition-colors duration-300 shadow-2xs`}>
                    <Icon className={`w-6 h-6 ${tone.text} group-hover:text-white transition-colors duration-300`} />
                  </div>

                  <h3 className="text-base font-bold text-[#2E3333] group-hover:text-[#1B5E20] transition-colors">
                    {category.nameBn}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {category.descriptionBn}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E8E5DF] flex items-center justify-between text-xs font-bold text-[#F57C00] group-hover:text-[#E65100]">
                  <span>পণ্য দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
