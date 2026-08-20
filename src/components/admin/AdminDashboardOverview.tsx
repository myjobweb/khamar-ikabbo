import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchAbandonedOrders } from '../../services/store';
import {
  Package,
  FileSpreadsheet,
  Clock,
  RefreshCcw,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Truck,
  Users,
  Eye
} from 'lucide-react';
import { toBengaliNumber, formatBengaliPrice } from '../../utils/bengali';

export const AdminDashboardOverview: React.FC = () => {
  const { products, orders, setAdminTab, updateOrderStatus } = useApp();
  const [abandonedOrdersCount, setAbandonedOrdersCount] = useState(0);

  useEffect(() => {
    fetchAbandonedOrders().then(orders => {
      setAbandonedOrdersCount(orders.filter(o => o.status !== 'converted').length);
    });
  }, []);

  // Statistics calculation
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.status === 'new' || o.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'processing' || o.status === 'confirmed').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 10);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* 7 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Total Products */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#E8E5DF] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">মোট পণ্য</p>
            <h3 className="text-2xl font-black text-[#1B5E20] mt-1">
              {toBengaliNumber(totalProducts)} টি
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">ক্যাটালগে সক্রিয়</p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-[#1B5E20] rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* 2. Total Orders */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#E8E5DF] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">সম্পূর্ণ অর্ডার</p>
            <h3 className="text-2xl font-black text-[#2E3333] mt-1">
              {toBengaliNumber(totalOrders)} টি
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">অর্ডার সম্পন্ন</p>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>

        {/* 3. Abandoned Orders */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#E8E5DF] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">অসম্পূর্ণ অর্ডার</p>
            <h3 className="text-2xl font-black text-[#2E3333] mt-1">
              {toBengaliNumber(abandonedOrdersCount)} টি
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">পরিত্যক্ত / চেকআউট হয়নি</p>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 opacity-70" />
          </div>
        </div>

        {/* 4. New Orders */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#E8E5DF] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">নতুন অর্ডার</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              {toBengaliNumber(newOrders)} টি
            </h3>
            <p className="text-[10px] text-amber-700/80 font-semibold mt-0.5">কনফার্মেশন অপেক্ষমান</p>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* 4. Processing Orders */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#E8E5DF] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">প্রসেসিং অর্ডার</p>
            <h3 className="text-2xl font-black text-sky-600 mt-1">
              {toBengaliNumber(processingOrders)} টি
            </h3>
            <p className="text-[10px] text-sky-700/80 font-semibold mt-0.5">প্যাকিং / শিপিং চলছে</p>
          </div>
          <div className="w-11 h-11 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center">
            <RefreshCcw className="w-6 h-6" />
          </div>
        </div>

        {/* 5. Completed Orders */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#E8E5DF] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">সম্পন্ন অর্ডার</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {toBengaliNumber(deliveredOrders)} টি
            </h3>
            <p className="text-[10px] text-emerald-700/80 font-semibold mt-0.5">সফলভাবে ডেলিভারড</p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* 6. Total Sales / Revenue */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#E8E5DF] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#1B5E20] uppercase tracking-wider">মোট বিক্রয়</p>
            <h3 className="text-xl font-black text-[#1B5E20] mt-1">
              {formatBengaliPrice(totalRevenue)}
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">সর্বমোট রেভিনিউ</p>
          </div>
          <div className="w-11 h-11 bg-emerald-100/60 text-[#1B5E20] rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* 7. Low Stock Alert */}
        <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2 bg-red-50/50 p-4.5 rounded-2xl border border-red-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Low Stock Products</p>
            <h3 className="text-2xl font-black text-red-600 mt-1">
              {toBengaliNumber(lowStockProducts.length)} টি পণ্য
            </h3>
            <p className="text-[10px] text-red-600/80 font-semibold mt-0.5">১০ বা তার কম মজুত রয়েছে</p>
          </div>
          <button
            onClick={() => setAdminTab('inventory')}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            মজুত দেখুন
          </button>
        </div>

      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div
          onClick={() => {
            setAdminTab('products');
            window.dispatchEvent(new CustomEvent('open-add-product-form'));
          }}
          className="p-4 bg-white rounded-2xl border border-[#E8E5DF] hover:border-[#1B5E20] transition-all cursor-pointer flex items-center gap-3.5 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-white transition-colors flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2E3333]">নতুন পণ্য যোগ করুন</h4>
            <p className="text-[11px] text-gray-500">ফিড, মেডিসিন বা কাঁচামাল আপলোড</p>
          </div>
        </div>

        <div
          onClick={() => setAdminTab('orders')}
          className="p-4 bg-white rounded-2xl border border-[#E8E5DF] hover:border-amber-500 transition-all cursor-pointer flex items-center gap-3.5 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2E3333]">অর্ডার প্রসেসিং করুন</h4>
            <p className="text-[11px] text-gray-500">ডেলিভারি স্ট্যাটাস ও ইনভয়েস</p>
          </div>
        </div>

        <div
          onClick={() => setAdminTab('inventory')}
          className="p-4 bg-white rounded-2xl border border-[#E8E5DF] hover:border-blue-500 transition-all cursor-pointer flex items-center gap-3.5 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2E3333]">স্টক মজুত পরিচালনা</h4>
            <p className="text-[11px] text-gray-500">ইনভেন্টরি কোয়ান্টিটি বৃদ্ধি বা হ্রাস</p>
          </div>
        </div>

      </div>

      {/* Two Column Section: Recent Orders & Low Stock Alert List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E8E5DF] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[#2E3333]">সাম্প্রতিক অর্ডারসমূহ</h3>
              <p className="text-[11px] text-gray-500">সর্বশেষ গ্রাহক ক্রয়ের তথ্য</p>
            </div>
            <button
              onClick={() => setAdminTab('orders')}
              className="text-xs font-bold text-[#1B5E20] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>সকল অর্ডার দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              কোনো সাম্প্রতিক অর্ডার পাওয়া যায়নি।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E5DF] text-gray-400 font-bold text-[11px]">
                    <th className="pb-2.5">অর্ডার নং</th>
                    <th className="pb-2.5">খামারি / ক্রেতা</th>
                    <th className="pb-2.5">টাকা</th>
                    <th className="pb-2.5">স্ট্যাটাস</th>
                    <th className="pb-2.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 font-mono font-bold text-[#1B5E20]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3">
                        <p className="font-bold text-[#2E3333]">{ord.customerName}</p>
                        <p className="text-[10px] text-gray-400">{ord.phone}</p>
                      </td>
                      <td className="py-3 font-bold text-[#2E3333]">
                        {formatBengaliPrice(ord.total)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'processing'
                            ? 'bg-sky-100 text-sky-800'
                            : ord.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status === 'delivered'
                            ? 'সম্পন্ন'
                            : ord.status === 'processing'
                            ? 'প্রসেসিং'
                            : ord.status === 'confirmed'
                            ? 'কনফার্ম'
                            : 'নতুন'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setAdminTab('orders')}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#1B5E20] hover:bg-[#E8F5E9] rounded-lg transition-colors cursor-pointer"
                        >
                          বিস্তারিত
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Watchlist (1 Col) */}
        <div className="bg-white rounded-3xl border border-[#E8E5DF] p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-black text-[#2E3333]">লো-স্টক সতর্কতা</h3>
              </div>
              <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                {toBengaliNumber(lowStockProducts.length)} টি
              </span>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                সব পণ্যের পর্যাপ্ত মজুত রয়েছে। 🎉
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl border border-red-100 bg-red-50/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.image}
                        alt={p.nameBn}
                        className="w-8 h-8 rounded-lg object-cover border border-red-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-[#2E3333] line-clamp-1">{p.nameBn}</p>
                        <p className="text-[10px] text-gray-500">{p.unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-red-600">
                        {toBengaliNumber(p.stockCount)} টি
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setAdminTab('inventory')}
            className="w-full py-2.5 bg-[#1B5E20] hover:bg-[#124116] text-white text-xs font-bold rounded-xl transition-colors text-center cursor-pointer mt-2"
          >
            ইনভেন্টরি রিফিল করুন
          </button>
        </div>

      </div>

    </div>
  );
};
