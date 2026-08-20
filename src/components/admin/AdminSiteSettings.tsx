import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SiteSettings } from '../../types';
import { ConfirmationModal } from './ConfirmationModal';
import {
  Settings,
  Phone,
  MessageSquare,
  Facebook,
  Mail,
  MapPin,
  Truck,
  Bell,
  Save,
  RotateCcw,
  Database,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export const AdminSiteSettings: React.FC = () => {
  const {
    siteSettings,
    updateSettings,
    resetData,
    isSupabaseConnected,
    testSupabaseConnection,
    showToast
  } = useApp();

  const [formData, setFormData] = useState<SiteSettings>({ ...siteSettings });
  const [isSaving, setIsSaving] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
    } catch (err) {
      showToast('সাইট সেটিংস সংরক্ষণে ত্রুটি হয়েছে।', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetConfirm = async () => {
    await resetData();
    setFormData({ ...siteSettings });
    setIsResetModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-3xl border border-[#E8E5DF] shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#2E3333]">
            সাইট সেটিংস ও কনফিগারেশন
          </h2>
          <p className="text-xs text-gray-500">
            খামারি কাব্য এর কন্টাক্ট নম্বর, ডেলিভারি চার্জ ও নোটিফিকেশন বার
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsResetModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-red-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ডিফল্ট ডাটা রিস্টোর</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Brand Info */}
        <div className="bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-[#2E3333] border-b border-gray-100 pb-2.5 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#1B5E20]" />
            <span>ব্র্যান্ড ও সাধারণ তথ্য</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                ওয়েবসাইটের নাম (English)
              </label>
              <input
                type="text"
                value={formData.websiteName || 'Khamari Kabbo'}
                onChange={(e) => handleChange('websiteName', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                ওয়েবসাইটের নাম (বাংলায়)
              </label>
              <input
                type="text"
                value={formData.bengaliName || 'খামারি কাব্য'}
                onChange={(e) => handleChange('bengaliName', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#2E3333] mb-1">
                ট্যাগলাইন (Tagline)
              </label>
              <input
                type="text"
                value={formData.tagline || 'খামারের যত্নে, খামারির পাশে'}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Banner Content Settings */}
        <div className="bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-[#2E3333] border-b border-gray-100 pb-2.5 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#1B5E20]" />
            <span>হিরো সেকশন টেক্সট (মূল শিরোনাম ও বর্ণনা)</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                হিরো মেইন হেডলাইন (যেমন: আপনার খামারের প্রয়োজনীয় সবকিছু, এক জায়গায়)
              </label>
              <input
                type="text"
                value={formData.heroHeading || 'আপনার খামারের প্রয়োজনীয় সবকিছু, এক জায়গায়'}
                onChange={(e) => handleChange('heroHeading', e.target.value)}
                placeholder="আপনার খামারের প্রয়োজনীয় সবকিছু, এক জায়গায়"
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                হিরো সাবটাইটেল / বিবরণ (Description)
              </label>
              <textarea
                rows={2}
                value={formData.heroDescription || 'গরুর খাদ্য, ফিড কাঁচামাল, সাপ্লিমেন্ট, ঔষধ ও প্রয়োজনীয় কম্বিনেশন—সহজে অর্ডার করুন।'}
                onChange={(e) => handleChange('heroDescription', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                প্রধান বাটন টেক্সট (Button Text)
              </label>
              <input
                type="text"
                value={formData.heroButtonText || 'পণ্য দেখুন'}
                onChange={(e) => handleChange('heroButtonText', e.target.value)}
                placeholder="পণ্য দেখুন"
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Channels */}
        <div className="bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-[#2E3333] border-b border-gray-100 pb-2.5 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#1B5E20]" />
            <span>যোগাযোগ ও কাস্টমার কেয়ার</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                হটলাইন ফোন নম্বর
              </label>
              <input
                type="text"
                value={formData.hotlinePhone}
                onChange={(e) => handleChange('hotlinePhone', e.target.value)}
                placeholder="01712-345678"
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                হোয়াটসঅ্যাপ নম্বর (আন্তর্জাতিক ফরম্যাটে)
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="8801712345678"
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                ইমেইল এড্রেস
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="info@khamarikabbo.com"
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                ফেসবুক পেজ লিংক
              </label>
              <input
                type="text"
                value={formData.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/khamarikabbo"
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#2E3333] mb-1">
                অফিস ও ওয়্যারহাউসের ঠিকানা (বাংলায়)
              </label>
              <textarea
                rows={2}
                value={formData.addressBn}
                onChange={(e) => handleChange('addressBn', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Delivery Charges */}
        <div className="bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-[#2E3333] border-b border-gray-100 pb-2.5 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#1B5E20]" />
            <span>ডেলিভারি চার্জ ও ফ্রি ডেলিভারি সীমা</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                ঢাকা শহরের ভেতরে ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                value={formData.deliveryChargeDhaka}
                onChange={(e) => handleChange('deliveryChargeDhaka', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                ঢাকার বাইরে ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                value={formData.deliveryChargeOutside}
                onChange={(e) => handleChange('deliveryChargeOutside', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                ফ্রি ডেলিভারি মিনিমাম অর্ডার (৳)
              </label>
              <input
                type="number"
                value={formData.freeDeliveryThreshold}
                onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-bold text-[#1B5E20]"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <h3 className="text-sm font-black text-[#2E3333] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#1B5E20]" />
              <span>ওয়েবসাইটের শীর্ষ ঘোষণা (Announcement Bar)</span>
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1B5E20]">
              <input
                type="checkbox"
                checked={formData.showAnnouncement}
                onChange={(e) => handleChange('showAnnouncement', e.target.checked)}
                className="w-4 h-4 accent-[#1B5E20] rounded"
              />
              <span>ঘোষণা প্রদর্শন চালু রাখুন</span>
            </label>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-[#2E3333] mb-1">
              ঘোষণার বার্তা (Text)
            </label>
            <input
              type="text"
              value={formData.announcementTextBn}
              onChange={(e) => handleChange('announcementTextBn', e.target.value)}
              placeholder="🚚 সারা বাংলাদেশে দ্রুত ক্যাটল ফিড ও সাপ্লিমেন্ট হোম ডেলিভারি দেওয়া হচ্ছে!"
              className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
            />
          </div>
        </div>

        {/* SEO & Analytics Settings */}
        <div className="bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-[#2E3333] border-b border-gray-100 pb-2.5 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#1B5E20]" />
            <span>এসইও (SEO), মেটা ট্যাগ ও অ্যানালিটিক্স কনফিগারেশন</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                এসইও টাইটেল (SEO Title)
              </label>
              <input
                type="text"
                value={formData.seoTitle || ''}
                onChange={(e) => handleChange('seoTitle', e.target.value)}
                placeholder="খামারি কাব্য — গরুর খাদ্য, ফিড, সাপ্লিমেন্ট ও ঔষধ"
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                এসইও মেটা বর্ণনা (Meta Description)
              </label>
              <input
                type="text"
                value={formData.seoDescription || ''}
                onChange={(e) => handleChange('seoDescription', e.target.value)}
                placeholder="খামারি কাব্য থেকে গরুর খাদ্য ও ফিড অর্ডার করুন..."
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                এসইও কিওয়ার্ডস (SEO Keywords)
              </label>
              <input
                type="text"
                value={formData.seoKeywords || ''}
                onChange={(e) => handleChange('seoKeywords', e.target.value)}
                placeholder="গরুর ফিড, মোটাতাজাকরণ ফিড, ভুট্টার গুঁড়া, মিনারেল মিক্স"
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                ডিফল্ট সোশ্যাল ইমেজ URL (OpenGraph Image)
              </label>
              <input
                type="text"
                value={formData.heroImage || ''}
                onChange={(e) => handleChange('heroImage', e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                Google Search Console Verification Code
              </label>
              <input
                type="text"
                value={formData.googleSearchConsole || ''}
                onChange={(e) => handleChange('googleSearchConsole', e.target.value)}
                placeholder="google-site-verification=..."
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2E3333] mb-1">
                Google Analytics Measurement ID (GA4)
              </label>
              <input
                type="text"
                value={formData.googleAnalyticsId || ''}
                onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-mono text-[11px]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#2E3333] mb-1">
                Meta Pixel ID (Facebook Pixel)
              </label>
              <input
                type="text"
                value={formData.metaPixelId || ''}
                onChange={(e) => handleChange('metaPixelId', e.target.value)}
                placeholder="123456789012345"
                className="w-full px-3.5 py-2.5 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-[#1B5E20] hover:bg-[#124116] text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>সেটিংস পরিবর্তন সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
        title="ডিফল্ট ডেমো ডাটা রিস্টোর"
        message="আপনি কি সমস্ত পণ্য, ক্যাটাগরি এবং সেটিংস আদি অবস্থায় ফিরিয়ে নিতে চান?"
        confirmLabel="হ্যাঁ, রিস্টোর করুন"
      />

    </div>
  );
};
