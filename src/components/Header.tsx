import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber } from '../utils/bengali';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  PhoneCall,
  Calculator,
  BookOpen,
  Wheat,
  ChevronDown,
  Layers,
  Settings
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRoute,
    setCurrentRoute,
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    setIsCalculatorOpen,
    setIsAdminOpen,
    siteSettings
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedDropdownOpen, setFeedDropdownOpen] = useState(false);

  const navLinks = [
    { route: 'home', label: 'হোম' },
    {
      route: 'feed',
      label: 'রেডিমেড ফিড',
      hasDropdown: true,
      subRoutes: [
        { route: 'feed', label: 'সকল ফিড' },
        { route: 'feed-motatajakaron', label: 'মোটাতাজাকরণ ফিড' },
        { route: 'feed-shar', label: 'ষাঁড় ফিড' },
        { route: 'feed-gavi', label: 'গাভীর ফিড' },
        { route: 'feed-dairy-special', label: 'ডেইরি স্পেশাল ফিড' }
      ]
    },
    { route: 'raw-materials', label: 'ফিড কাঁচামাল' },
    { route: 'supplements', label: 'সাপ্লিমেন্ট' },
    { route: 'medicines', label: 'ঔষধ ও সেবা' },
    { route: 'combinations', label: 'কম্বিনেশন প্যাকেজ' },
    { route: 'guides', label: 'খামারি গাইড' },
    { route: 'contact', label: 'যোগাযোগ' },
    { route: 'admin', label: 'অ্যাডমিন প্যানেল', isSpecial: true }
  ];

  const handleNavClick = (route: string) => {
    setCurrentRoute(route as import('../types').AppRoute);
    setMobileMenuOpen(false);
    setFeedDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E8E5DF] shadow-xs" id="main-header">
      {/* Top Banner Ribbon */}
      <div className="bg-[#1B5E20] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#F57C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              খামারি অফার
            </span>
            <span className="hidden sm:inline font-medium text-[#E8F5E9]">
              {toBengaliNumber(siteSettings.freeDeliveryThreshold)} টাকার অর্ডারে সারাদেশে ফ্রি ডেলিভারি!
            </span>
            <span className="sm:hidden font-medium">ফ্রি ডেলিভারি অফার চলছে</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="flex items-center gap-1 hover:text-[#FFF3E0] transition-colors cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-[#F57C00]" />
              <span className="hidden md:inline">খাদ্য ক্যালকুলেটর</span>
            </button>

            <a
              href={`tel:${siteSettings.hotlinePhone}`}
              className="flex items-center gap-1 hover:text-[#FFF3E0] transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-[#F57C00]" />
              <span>+৮৮০ {toBengaliNumber(siteSettings.hotlinePhone)}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo / Brand Name */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
            id="brand-logo"
          >
            <div className="w-10 h-10 bg-[#1B5E20] rounded-xl flex items-center justify-center text-white shadow-sm group-hover:bg-[#124116] transition-colors">
              <Wheat className="w-6 h-6 text-[#F57C00]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1B5E20] leading-none tracking-tight">
                খামারি কাব্য
              </h1>
              <p className="text-[10px] text-[#555] uppercase tracking-wider font-bold mt-0.5">
                Khamari Kabbo
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 text-xs xl:text-sm font-medium text-[#2E3333]">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route || (link.hasDropdown && currentRoute.startsWith('feed-'));
              
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.route}
                    className="relative group"
                    onMouseEnter={() => setFeedDropdownOpen(true)}
                    onMouseLeave={() => setFeedDropdownOpen(false)}
                  >
                    <button
                      onClick={() => handleNavClick(link.route)}
                      className={`flex items-center gap-1 px-2.5 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                        isActive
                          ? 'text-[#1B5E20] bg-[#E8F5E9]'
                          : 'hover:text-[#1B5E20] hover:bg-gray-50'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </button>

                    {/* Submenu */}
                    {feedDropdownOpen && (
                      <div className="absolute top-full left-0 w-48 bg-white border border-[#E8E5DF] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {link.subRoutes?.map((sub) => (
                          <button
                            key={sub.route}
                            onClick={() => handleNavClick(sub.route)}
                            className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#E8F5E9] hover:text-[#1B5E20] transition-colors cursor-pointer text-[#2E3333]"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`px-2.5 py-2 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                    link.isSpecial
                      ? 'text-gray-500 hover:text-[#1B5E20] hover:bg-gray-100 text-xs border border-gray-200'
                      : isActive
                      ? 'text-[#1B5E20] bg-[#E8F5E9]'
                      : 'hover:text-[#1B5E20] hover:bg-gray-50'
                  }`}
                >
                  {link.isSpecial && <Settings className="w-3.5 h-3.5 text-[#1B5E20]" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Search & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Input Bar (Desktop) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  const newUrl = `${window.location.pathname}#/search?q=${encodeURIComponent(searchQuery)}`;
                  window.history.pushState({}, '', newUrl);
                  setCurrentRoute('search' as any);
                }
              }}
              className="relative hidden md:block w-44 lg:w-52 xl:w-60"
            >
              <input
                type="text"
                placeholder="পণ্য খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]/20 rounded-full outline-none transition-all"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </form>

            {/* Order Tracking Button */}
            <button
              onClick={() => handleNavClick('track-order')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                currentRoute === 'track-order'
                  ? 'bg-[#E8F5E9] text-[#1B5E20] border-[#1B5E20]/30'
                  : 'bg-white text-gray-700 border-[#E8E5DF] hover:border-[#1B5E20] hover:text-[#1B5E20]'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#F57C00]" />
              <span>ট্র্যাকিং</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-[#F57C00] hover:bg-[#E65100] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
              id="btn-header-cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>কার্ট</span>
              {cartCount > 0 && (
                <span className="bg-white text-[#F57C00] text-[11px] font-black px-2 py-0.2 rounded-full shadow-2xs">
                  {toBengaliNumber(cartCount)}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#1B5E20]" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden pt-4 pb-3 border-t border-[#E8E5DF] mt-3 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  const newUrl = `${window.location.pathname}#/search?q=${encodeURIComponent(searchQuery)}`;
                  window.history.pushState({}, '', newUrl);
                  setCurrentRoute('search' as any);
                  setMobileMenuOpen(false);
                }
              }}
              className="relative mb-3"
            >
              <input
                type="text"
                placeholder="আপনার প্রয়োজনীয় পণ্য খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FDFCF9] border border-[#E8E5DF] rounded-xl outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </form>

            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                  currentRoute === link.route
                    ? 'bg-[#E8F5E9] text-[#1B5E20]'
                    : link.isSpecial
                    ? 'text-[#1B5E20] bg-gray-50 border border-gray-200'
                    : 'text-[#2E3333] hover:bg-gray-50'
                }`}
              >
                {link.isSpecial && <Settings className="w-4 h-4 text-[#1B5E20]" />}
                <span>{link.label}</span>
              </button>
            ))}

            <div className="pt-2 border-t border-[#E8E5DF] flex items-center justify-between">
              <button
                onClick={() => {
                  handleNavClick('track-order');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-[#1B5E20] py-2 px-3"
              >
                <Search className="w-4 h-4 text-[#F57C00]" />
                <span>অর্ডার ট্র্যাকিং</span>
              </button>

              <button
                onClick={() => {
                  setIsCalculatorOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-700 py-2 px-3"
              >
                <Calculator className="w-4 h-4 text-[#F57C00]" />
                <span>ক্যালকুলেটর</span>
              </button>

              <button
                onClick={() => {
                  handleNavClick('admin');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-[#1B5E20] py-2 px-3 bg-[#E8F5E9] rounded-xl"
              >
                <Settings className="w-4 h-4 text-[#1B5E20]" />
                <span>অ্যাডমিন প্যানেল</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
