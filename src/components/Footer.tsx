import React from 'react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber } from '../utils/bengali';
import {
  Wheat,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Facebook,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Settings
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentRoute, siteSettings, setIsAdminOpen } = useApp();

  if (siteSettings.sectionVisibility?.footer === false) {
    return null;
  }

  const bengaliName = siteSettings.bengaliName || 'খামারি কাব্য';
  const websiteName = siteSettings.websiteName || 'Khamari Kabbo';
  const tagline = siteSettings.tagline || 'খামারের যত্নে, খামারির পাশে';
  const footerText = siteSettings.footerText || '© ২০২৪-২০২৬ খামারি কাব্য (Khamari Kabbo)। সর্বস্বত্ব সংরক্ষিত।';

  return (
    <footer className="bg-white border-t border-[#E8E5DF] text-[#2E3333] pt-14 pb-8" id="site-footer">
      
      {/* Top Value Assurance Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-[#E8E5DF]">
        <div className="bg-[#1B5E20] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full md:w-auto text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">মানসম্মত পণ্য</p>
                <p className="text-[11px] text-[#E8F5E9]">১০০% পরীক্ষিত ও খাঁটি</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">সহজ অর্ডার ব্যবস্থা</p>
                <p className="text-[11px] text-[#E8F5E9]">হোম ডেলিভারি সুবিধা</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">স্বচ্ছ মূল্য ও রিটার্ন</p>
                <p className="text-[11px] text-[#E8F5E9]">ক্যাশ অন ডেলিভারি</p>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right shrink-0 bg-white/10 px-5 py-3 rounded-2xl border border-white/15">
            <p className="text-[10px] uppercase tracking-wider text-[#FFF3E0] font-bold">খামারি হেল্পলাইন</p>
            <a
              href={`tel:${siteSettings.hotlinePhone}`}
              className="text-lg font-black text-white hover:text-[#F57C00] transition-colors"
            >
              +৮৮০ {toBengaliNumber(siteSettings.hotlinePhone)}
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-[#1B5E20] rounded-xl flex items-center justify-center text-white shadow-md">
                <Wheat className="w-6 h-6 text-[#F57C00]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1B5E20] leading-none">
                  {bengaliName}
                </h3>
                <p className="text-[11px] text-[#555] uppercase tracking-wider font-semibold">
                  {websiteName}
                </p>
              </div>
            </div>

            <p className="text-xs font-bold text-[#1B5E20]">
              "{tagline}"
            </p>

            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              গবাদিপশুর খাদ্য, ফিড কাঁচামাল, সাপ্লিমেন্ট ও প্রয়োজনীয় পশু চিকিৎসা পণ্য — সব এক জায়গায় সহজে খুঁজে নিন এবং অর্ডার করুন।
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={siteSettings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteSettings.email}`}
                className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-bold text-[#1B5E20] uppercase tracking-wider text-sm">
              প্রয়োজনীয় লিংক
            </h4>
            <ul className="space-y-2 text-gray-600 font-medium">
              <li>
                <button
                  onClick={() => setCurrentRoute('home')}
                  className="hover:text-[#1B5E20] transition-colors cursor-pointer"
                >
                  হোম
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('feed')}
                  className="hover:text-[#1B5E20] transition-colors cursor-pointer"
                >
                  পণ্যসমূহ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('guides')}
                  className="hover:text-[#1B5E20] transition-colors cursor-pointer"
                >
                  খামারি গাইড
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('track-order')}
                  className="hover:text-[#1B5E20] font-bold text-[#1B5E20] transition-colors cursor-pointer"
                >
                  অর্ডার ট্র্যাকিং
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('contact')}
                  className="hover:text-[#1B5E20] transition-colors cursor-pointer"
                >
                  যোগাযোগ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('admin')}
                  className="text-gray-400 hover:text-[#1B5E20] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>অ্যাডমিন প্যানেল</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-[#1B5E20] uppercase tracking-wider text-sm">
              পণ্য ক্যাটাগরি
            </h4>
            <ul className="space-y-2 text-gray-600 font-medium">
              <li>
                <button
                  onClick={() => setCurrentRoute('feed')}
                  className="hover:text-[#1B5E20] transition-colors cursor-pointer"
                >
                  রেডিমেড ফিড
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('raw-materials')}
                  className="hover:text-[#1B5E20] transition-colors cursor-pointer"
                >
                  ফিড কাঁচামাল
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('supplements')}
                  className="hover:text-[#1B5E20] transition-colors cursor-pointer"
                >
                  সাপ্লিমেন্ট ও ভিটামিন
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('medicines')}
                  className="hover:text-[#1B5E20] transition-colors cursor-pointer"
                >
                  ঔষধ ও ফার্স্ট এইড
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('combinations')}
                  className="hover:text-[#1B5E20] transition-colors cursor-pointer"
                >
                  কম্বিনেশন প্যাকেজ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details (Dynamic from Site Settings) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-[#1B5E20] uppercase tracking-wider text-sm">
              যোগাযোগের ঠিকানা
            </h4>
            <div className="space-y-2.5 text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{siteSettings.addressBn}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#1B5E20] shrink-0" />
                <a
                  href={`tel:${siteSettings.hotlinePhone}`}
                  className="font-bold text-[#2E3333] hover:text-[#1B5E20]"
                >
                  {toBengaliNumber(siteSettings.hotlinePhone)}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${siteSettings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1B5E20]"
                >
                  হোয়াটসঅ্যাপ: {toBengaliNumber(siteSettings.whatsappNumber)}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1B5E20] shrink-0" />
                <span>{siteSettings.email}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-[#E8E5DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <p>{footerText}</p>
        <div className="flex items-center space-x-4 text-[11px] font-bold text-[#1B5E20] uppercase tracking-wider">
          <button onClick={() => setCurrentRoute('guides')} className="hover:underline">গাইডবুক</button>
          <span>•</span>
          <button onClick={() => setCurrentRoute('contact')} className="hover:underline">শর্তাবলী ও পলিসি</button>
          <span>•</span>
          <button onClick={() => setCurrentRoute('contact')} className="hover:underline">যোগাযোগ</button>
        </div>
      </div>

    </footer>
  );
};
