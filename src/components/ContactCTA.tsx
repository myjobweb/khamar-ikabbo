import React from 'react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber } from '../utils/bengali';
import {
  ArrowRight,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  Wheat,
  Sparkles
} from 'lucide-react';

export const ContactCTA: React.FC = () => {
  const { setCurrentRoute, siteSettings } = useApp();

  if (siteSettings.sectionVisibility?.contact === false) {
    return null;
  }

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-br from-[#1B5E20] to-[#124116] text-white relative overflow-hidden" id="contact-cta">
      {/* Decorative Natural Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F57C00]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xs text-[#FFF3E0] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-white/20">
          <Wheat className="w-4 h-4 text-[#F57C00]" />
          <span>খামারের পুষ্টি ও সঠিক সমাধান</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
          খামারের প্রয়োজনীয় পণ্য খুঁজছেন?
        </h2>

        <p className="mt-4 text-base sm:text-xl text-[#E8F5E9] max-w-2xl mx-auto leading-relaxed">
          "খামারি কাব্য থেকে আপনার প্রয়োজনীয় পণ্য বেছে নিন।"
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setCurrentRoute('feed')}
            className="flex items-center gap-2 bg-[#F57C00] hover:bg-[#E65100] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer text-base"
            id="btn-cta-view-feed"
          >
            <span>পণ্য দেখুন</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href={`tel:${siteSettings.hotlinePhone}`}
            className="flex items-center gap-2 bg-white text-[#1B5E20] hover:bg-[#F1F8E9] font-bold px-7 py-4 rounded-2xl shadow-md transition-all cursor-pointer text-base"
            id="btn-cta-call"
          >
            <PhoneCall className="w-5 h-5 text-[#1B5E20]" />
            <span>সরাসরি কল: {toBengaliNumber(siteSettings.hotlinePhone)}</span>
          </a>

          <a
            href={`https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি খামারি কাব্য থেকে গবাদিপশুর ফিড কিনতে চাই।')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold px-6 py-4 rounded-2xl shadow-md transition-all cursor-pointer text-base"
            id="btn-cta-whatsapp"
          >
            <MessageCircle className="w-5 h-5" />
            <span>হোয়াটসঅ্যাপ পরামর্শ</span>
          </a>
        </div>

        <p className="mt-6 text-xs text-[#E8F5E9]/80 font-medium">
          🚚 দ্রুত ডেলিভারি • ক্যাশ অন ডেলিভারি সুবিধা • মান নিশ্চিতকৃত পণ্য
        </p>

      </div>
    </section>
  );
};
