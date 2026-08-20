import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminTabType } from '../../types';
import {
  Menu,
  Database,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Bell
} from 'lucide-react';

interface AdminTopNavProps {
  onToggleSidebar?: () => void;
  onMenuClick?: () => void;
}

const TAB_TITLES: Record<AdminTabType, { title: string; subtitle: string }> = {
  dashboard: { title: 'ড্যাশবোর্ড ওভারভিউ', subtitle: 'খামারি কাব্য এর বিক্রয় ও স্টক সম্পর্কিত সারসংক্ষেপ' },
  products: { title: 'পণ্য ব্যবস্থাপনা', subtitle: 'সকল ফিড, কাঁচামাল ও ভেটেরিনারি পণ্য নিয়ন্ত্রণ' },
  categories: { title: 'ক্যাটাগরি কন্ট্রোল', subtitle: 'মূল পণ্য বিভাগ ও ক্যাটাগরি কনফিগারেশন' },
  subcategories: { title: 'সাবক্যাটাগরি তালিকা', subtitle: 'ক্যাটাগরির অধীনস্থ উপ-বিভাগসমূহ' },
  combinations: { title: 'কম্বিনেশন প্যাকেজ', subtitle: 'সাশ্রয়ী কম্বো ও বিশেষ অফার প্যাকেজসমূহ' },
  orders: { title: 'অর্ডার তালিকা ও প্রসেসিং', subtitle: 'গ্রাহকের অর্ডার ডেলিভারি ও স্ট্যাটাস আপডেট' },
  customers: { title: 'খামারি ও গ্রাহক তালিকা', subtitle: 'নিবন্ধিত ও নিয়মিত ক্রেতা প্রোফাইল' },
  inventory: { title: 'ইনভেন্টরি ও স্টক অ্যালার্ট', subtitle: 'মজুত পণ্য ও লো-স্টক নোটিফিকেশন' },
  settings: { title: 'সাইট সেটিংস ও কনফিগারেশন', subtitle: 'ফোন, হোয়াটসঅ্যাপ, ডেলিভারি চার্জ ও ঠিকানা' },
  'site-settings': { title: 'সাইট সেটিংস ও কনফিগারেশন', subtitle: 'ফোন, হোয়াটসঅ্যাপ, ডেলিভারি চার্জ ও ঠিকানা' },
  guides: { title: 'খামারি গাইড ও কনটেন্ট', subtitle: 'খামারি পরামর্শ ও নির্দেশিকা আর্টিকেলসমূহ ব্যবস্থাপনা' },
  profile: { title: 'অ্যাডমিন প্রোফাইল', subtitle: 'সিস্টেম অ্যাডমিনিস্ট্রেটর ও ক্রেডেনশিয়াল' }
};

export const AdminTopNav: React.FC<AdminTopNavProps> = ({ onToggleSidebar, onMenuClick }) => {
  const { adminTab, adminUser, setCurrentRoute, isSupabaseConnected, reloadAllData, isLoading } = useApp();

  const handleOpenMenu = onMenuClick || onToggleSidebar || (() => {});
  const tabInfo = TAB_TITLES[adminTab] || { title: 'অ্যাডমিন প্যানেল', subtitle: 'খামারি কাব্য ম্যানেজমেন্ট' };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E8E5DF] px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      
      {/* Left: Mobile Toggle & Tab Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleOpenMenu}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          title="মেনু খুলুন"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base lg:text-lg font-black text-[#2E3333] leading-tight">
            {tabInfo.title}
          </h2>
          <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
            {tabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Status & User Info */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Supabase Status Pill */}
        <div
          title={isSupabaseConnected ? 'Supabase ক্লাউড ডাটাবেজ সক্রিয়' : 'লোকাল মেমোরি মোড'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
            isSupabaseConnected
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          <Database className={`w-3 h-3 ${isSupabaseConnected ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span className="hidden md:inline">{isSupabaseConnected ? 'Supabase Live' : 'Local Cache'}</span>
        </div>

        {/* Reload Data Button */}
        <button
          onClick={() => reloadAllData()}
          disabled={isLoading}
          title="ডাটা রিফ্রেশ করুন"
          className="p-2 rounded-xl text-gray-500 hover:text-[#1B5E20] hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#1B5E20]' : ''}`} />
        </button>

        {/* Website Link */}
        <button
          onClick={() => setCurrentRoute('home')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#1B5E20] bg-[#E8F5E9] hover:bg-[#D7EED9] transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>ওয়েবসাইট</span>
        </button>

        {/* User Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E8E5DF]">
          <div className="w-8 h-8 rounded-full bg-[#1B5E20] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {adminUser?.name ? adminUser.name.charAt(0) : 'A'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-[#2E3333] leading-none">
              {adminUser?.name || 'অ্যাডমিনিস্ট্রেটর'}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 inline" />
              <span>{adminUser?.role === 'super_admin' ? 'সুপার অ্যাডমিন' : 'ম্যানেজার'}</span>
            </p>
          </div>
        </div>

      </div>

    </header>
  );
};
