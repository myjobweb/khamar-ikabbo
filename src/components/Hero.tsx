import React from 'react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber } from '../utils/bengali';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
  Layers,
  Wheat,
  Activity,
  HeartPulse,
  PhoneCall,
  Calculator
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCurrentRoute, setIsCalculatorOpen, siteSettings } = useApp();

  if (siteSettings.sectionVisibility?.hero === false) {
    return null;
  }

  const brandName = siteSettings.bengaliName || 'খামারি কাব্য';
  const tagline = siteSettings.tagline || 'খামারের যত্নে, খামারির পাশে';
  const heroHeading = siteSettings.heroHeading || 'আপনার খামারের প্রয়োজনীয় সবকিছু, এক জায়গায়';
  const heroDesc = siteSettings.heroDescription || 'গরুর খাদ্য, ফিড কাঁচামাল, সাপ্লিমেন্ট, ঔষধ ও প্রয়োজনীয় কম্বিনেশন—সহজে অর্ডার করুন।';
  const buttonText = siteSettings.heroButtonText || 'পণ্য দেখুন';

  const heroCategoryCards = [
    {
      id: 'cat-feed',
      route: 'feed',
      titleBn: 'রেডিমেড ফিড',
      subtitleBn: 'গবাদিপশুর প্রয়োজন অনুযায়ী প্রস্তুত খাদ্য',
      bgTone: 'bg-[#FFF3E0]',
      iconColor: 'text-[#F57C00]',
      icon: Wheat
    },
    {
      id: 'cat-supplements',
      route: 'supplements',
      titleBn: 'সাপ্লিমেন্ট',
      subtitleBn: 'পুষ্টি ও প্রয়োজন অনুযায়ী পুষ্টিকর সাপ্লিমেন্ট',
      bgTone: 'bg-[#E1F5FE]',
      iconColor: 'text-[#0288D1]',
      icon: Activity
    },
    {
      id: 'cat-raw',
      route: 'raw-materials',
      titleBn: 'ফিড কাঁচামাল',
      subtitleBn: 'খাদ্য তৈরির প্রয়োজনীয় সব কাঁচামাল',
      bgTone: 'bg-[#F1F8E9]',
      iconColor: 'text-[#7CB342]',
      icon: Layers
    },
    {
      id: 'cat-med',
      route: 'medicines',
      titleBn: 'ঔষধ ও সেবা',
      subtitleBn: 'প্রয়োজনীয় পশু চিকিৎসা পণ্য সমূহ',
      bgTone: 'bg-[#FFEBEE]',
      iconColor: 'text-[#E53935]',
      icon: HeartPulse
    }
  ];

  return (
    <section className="bg-[#FDFCF9] py-10 sm:py-16 border-b border-[#E8E5DF] overflow-hidden" id="main-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading & Calls to Action */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold rounded-full uppercase tracking-widest border border-[#1B5E20]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#F57C00]" />
              <span>{brandName} — {tagline}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1B5E20] leading-[1.2] tracking-tight">
              {heroHeading}
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
              {heroDesc}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setCurrentRoute('feed')}
                className="px-8 py-4 bg-[#1B5E20] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
                id="btn-hero-view-products"
              >
                {buttonText}
              </button>

              <button
                onClick={() => setCurrentRoute('combinations')}
                className="px-8 py-4 bg-white border-2 border-[#1B5E20] text-[#1B5E20] rounded-2xl font-bold hover:bg-[#F1F8E9] transition-all cursor-pointer text-sm sm:text-base"
                id="btn-hero-order-now"
              >
                অর্ডার করুন
              </button>

              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#F57C00] hover:text-[#E65100] px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>দৈনিক খাদ্য চার্ট হিসাব করুন</span>
              </button>
            </div>

            {/* Featured Hero Banner Image Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E8E5DF] group mt-6">
              <img
                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
                alt="খামারি কাব্য খামার ও গরু"
                className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700 bg-emerald-800"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                <span className="inline-block px-3 py-1 bg-[#1B5E20] text-white text-[10px] font-bold rounded-full w-max mb-2 uppercase tracking-wider">
                  খামারি কাব্য লাইভ খামার
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1">
                  সুস্থ সবল গবাদিপশু ও সমৃদ্ধ খামার
                </h3>
                <p className="text-xs text-gray-200 line-clamp-2">
                  সেরা মানের ফিড ও সুষম পুষ্টি নিশ্চিত করুন খামারের সর্বোচ্চ উৎপাদনে।
                </p>
              </div>
            </div>

            {/* Micro Trust Strip */}
            <div className="pt-6 border-t border-[#E8E5DF] flex flex-wrap items-center gap-6 text-xs text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1B5E20]" />
                <span>১০০% খাঁটি ও গুণগত মান নিশ্চিত</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1B5E20]" />
                <span>৬৪ জেলায় ক্যাশ অন ডেলিভারি</span>
              </div>
            </div>

          </div>

          {/* Right Column: 4 Interactive Natural Tones Category Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {heroCategoryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    onClick={() => setCurrentRoute(card.route as import('../types').AppRoute)}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E5DF] shadow-xs hover:border-[#1B5E20] hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                    id={`hero-card-${card.id}`}
                  >
                    <div>
                      <div className={`w-10 h-10 ${card.bgTone} rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#1B5E20] transition-colors duration-300 shadow-2xs`}>
                        <Icon className={`w-5 h-5 ${card.iconColor} group-hover:text-white transition-colors duration-300`} />
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#1B5E20] mb-0.5 group-hover:text-[#1B5E20]">
                        {card.titleBn}
                      </h3>

                      <p className="text-[11px] text-gray-500 mb-2 line-clamp-2 leading-relaxed">
                        {card.subtitleBn}
                      </p>
                    </div>

                    <span className="text-[11px] font-bold text-[#F57C00] flex items-center group-hover:translate-x-1 transition-transform">
                      পণ্য দেখুন <ArrowRight className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                );
              })}
            </div>

        </div>

      </div>
    </section>
  );
};
