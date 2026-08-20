import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminTabType } from '../../types';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FolderGit2,
  Gift,
  FileSpreadsheet,
  Users,
  Warehouse,
  Settings,
  UserCheck,
  LogOut,
  X,
  Wheat,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { toBengaliNumber } from '../../utils/bengali';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { adminTab, setAdminTab, logoutAdmin, setCurrentRoute, orders, products } = useApp();
  const [productsMenuOpen, setProductsMenuOpen] = useState(true);

  const pendingOrdersCount = orders.filter((o) => o.status === 'new' || o.status === 'pending' || o.status === 'confirmed').length;
  const lowStockCount = products.filter((p) => p.stockCount <= 10).length;

  const handleTabSelect = (tab: AdminTabType) => {
    setAdminTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full w-64 bg-white border-r border-[#E8E5DF] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand / Logo */}
        <div>
          <div className="p-4 border-b border-[#E8E5DF] flex items-center justify-between">
            <div
              onClick={() => handleTabSelect('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-9 h-9 bg-[#1B5E20] rounded-xl flex items-center justify-center text-white shadow-xs">
                <Wheat className="w-5 h-5 text-[#F57C00]" />
              </div>
              <div>
                <h1 className="text-base font-black text-[#1B5E20] leading-none">
                  খামারি কাব্য
                </h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Admin Panel
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs overflow-y-auto max-h-[calc(100vh-210px)] custom-scrollbar">
            
            {/* Dashboard */}
            <button
              onClick={() => handleTabSelect('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                adminTab === 'dashboard'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-[#2E3333] hover:bg-[#E8F5E9] hover:text-[#1B5E20]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>🏠 ড্যাশবোর্ড (Dashboard)</span>
            </button>

            {/* Products Dropdown */}
            <div className="space-y-0.5">
              <button
                onClick={() => setProductsMenuOpen(!productsMenuOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  adminTab === 'products'
                    ? 'bg-[#E8F5E9] text-[#1B5E20]'
                    : 'text-[#2E3333] hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#1B5E20]" />
                  <span>📦 পণ্য তালিকা (Products)</span>
                </div>
                {productsMenuOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>

              {productsMenuOpen && (
                <div className="pl-7 pr-1 py-1 space-y-1 animate-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => handleTabSelect('products')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      adminTab === 'products' ? 'text-[#1B5E20] font-bold bg-[#E8F5E9]/60' : 'text-gray-600 hover:text-[#1B5E20]'
                    }`}
                  >
                    • সকল পণ্য ({toBengaliNumber(products.length)})
                  </button>
                  <button
                    onClick={() => {
                      handleTabSelect('products');
                      // trigger add product modal
                      window.dispatchEvent(new CustomEvent('open-add-product-form'));
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3 h-3 text-emerald-600" />
                    <span>+ নতুন পণ্য যোগ করুন</span>
                  </button>
                </div>
              )}
            </div>

            {/* Categories */}
            <button
              onClick={() => handleTabSelect('categories')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                adminTab === 'categories'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-[#2E3333] hover:bg-[#E8F5E9] hover:text-[#1B5E20]'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>📂 ক্যাটাগরি (Categories)</span>
            </button>

            {/* Subcategories */}
            <button
              onClick={() => handleTabSelect('subcategories')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                adminTab === 'subcategories'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-[#2E3333] hover:bg-[#E8F5E9] hover:text-[#1B5E20]'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>📁 সাবক্যাটাগরি (Subcategories)</span>
            </button>

            {/* Combination Packages */}
            <button
              onClick={() => handleTabSelect('combinations')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                adminTab === 'combinations'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-[#2E3333] hover:bg-[#E8F5E9] hover:text-[#1B5E20]'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>🎁 কম্বিনেশন প্যাকেজ (Combos)</span>
            </button>

            {/* Orders */}
            <button
              onClick={() => handleTabSelect('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                adminTab === 'orders'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-[#2E3333] hover:bg-[#E8F5E9] hover:text-[#1B5E20]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-4 h-4" />
                <span>🧾 অর্ডারসমূহ (Orders)</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  adminTab === 'orders' ? 'bg-[#F57C00] text-white' : 'bg-amber-100 text-amber-900'
                }`}>
                  {toBengaliNumber(pendingOrdersCount)}
                </span>
              )}
            </button>

            {/* Customers */}
            <button
              onClick={() => handleTabSelect('customers')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                adminTab === 'customers'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-[#2E3333] hover:bg-[#E8F5E9] hover:text-[#1B5E20]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>👥 খামারি / গ্রাহক (Customers)</span>
            </button>

            {/* Inventory */}
            <button
              onClick={() => handleTabSelect('inventory')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                adminTab === 'inventory'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-[#2E3333] hover:bg-[#E8F5E9] hover:text-[#1B5E20]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Warehouse className="w-4 h-4" />
                <span>📊 ইনভেন্টরি (Inventory)</span>
              </div>
              {lowStockCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  adminTab === 'inventory' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
                }`}>
                  {toBengaliNumber(lowStockCount)}
                </span>
              )}
            </button>

            {/* Site Settings */}
            <button
              onClick={() => handleTabSelect('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                adminTab === 'settings'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-[#2E3333] hover:bg-[#E8F5E9] hover:text-[#1B5E20]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>⚙️ সাইট সেটিংস (Settings)</span>
            </button>

            {/* Admin Profile */}
            <button
              onClick={() => handleTabSelect('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                adminTab === 'profile'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-[#2E3333] hover:bg-[#E8F5E9] hover:text-[#1B5E20]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>👤 অ্যাডমিন প্রোফাইল</span>
            </button>

          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#E8E5DF] space-y-1.5 text-xs">
          <button
            onClick={() => setCurrentRoute('home')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-600 hover:text-[#1B5E20] hover:bg-gray-50 transition-colors font-bold cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>মূল ওয়েবসাইটে যান</span>
            </span>
          </button>

          <button
            onClick={() => logoutAdmin()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-bold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>🚪 লগআউট (Logout)</span>
          </button>
        </div>

      </aside>
    </>
  );
};
