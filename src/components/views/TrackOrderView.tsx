import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { trackOrderFromStore } from '../../services/store';
import { Order, OrderStatus } from '../../types';
import { formatTaka, toBengaliNumber } from '../../utils/bengali';
import { OrderInvoice } from '../OrderInvoice';
import {
  Search,
  CheckCircle2,
  Clock,
  RefreshCcw,
  Truck,
  PackageCheck,
  XCircle,
  PhoneCall,
  MapPin,
  User,
  ShoppingBag,
  AlertCircle,
  Printer,
  ArrowLeft,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';

const STATUS_STEPS: { key: OrderStatus; labelBn: string; descBn: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'pending', labelBn: 'নতুন অর্ডার', descBn: 'অর্ডার গ্রহনের অপেক্ষায়', icon: Clock },
  { key: 'confirmed', labelBn: 'নিশ্চিত হয়েছে', descBn: 'কাস্টমার কেয়ার হতে কনফার্ম করা হয়েছে', icon: CheckCircle2 },
  { key: 'processing', labelBn: 'প্রসেসিং', descBn: 'ওয়্যারহাউসে প্যাকেট প্রস্তুত করা হচ্ছে', icon: RefreshCcw },
  { key: 'shipped', labelBn: 'পাঠানো হয়েছে', descBn: 'কুরিয়ার/ডেলিভারিম্যানের কাছে হস্তান্তরিত', icon: Truck },
  { key: 'delivered', labelBn: 'ডেলিভারি সম্পন্ন', descBn: 'গ্রাহক সফলভাবে পণ্য গ্রহণ করেছেন', icon: PackageCheck }
];

export const TrackOrderView: React.FC = () => {
  const { siteSettings, setCurrentRoute } = useApp();

  const [orderNumberInput, setOrderNumberInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Helper to map step index
  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'new':
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return -1;
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSearchedOrder(null);

    const cleanOrderNo = orderNumberInput.trim();
    const cleanPhone = phoneInput.trim();

    if (!cleanOrderNo) {
      setErrorMsg('অনুগ্রহ করে অর্ডার নম্বর প্রদান করুন (যেমন: KK-12345678)');
      return;
    }

    if (!cleanPhone) {
      setErrorMsg('অনুগ্রহ করে অর্ডারের মোবাইল নাম্বার প্রদান করুন।');
      return;
    }

    setIsSearching(true);
    try {
      const matched = await trackOrderFromStore(cleanOrderNo, cleanPhone);
      if (matched) {
        setSearchedOrder(matched);
      } else {
        setErrorMsg('এই অর্ডার নম্বর ও মোবাইল নম্বরের মাধ্যমে কোনো অর্ডার খুঁজে পাওয়া যায়নি। অনুগ্রহ করে তথ্য পুনঃযাচাই করুন।');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('অর্ডার খুঁজতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FDFCF9] min-h-[80vh]" id="track-order-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Page Title & Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#1B5E20] text-[#F57C00] rounded-2xl mx-auto flex items-center justify-center shadow-md">
            <Search className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2E3333]">
            অর্ডার ট্র্যাকিং
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            আপনার অর্ডার নম্বর ও মোবাইল নাম্বার দিয়ে অর্ডারের বর্তমান অবস্থা সরাসরি জেনে নিন।
          </p>
        </div>

        {/* Tracking Search Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DF] shadow-xs">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 font-semibold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Order Number Input */}
              <div>
                <label className="block text-xs font-bold text-[#2E3333] mb-1.5">
                  অর্ডার নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: KK-12345678"
                  value={orderNumberInput}
                  onChange={(e) => setOrderNumberInput(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs sm:text-sm outline-none font-mono uppercase"
                  id="input-track-order-no"
                />
              </div>

              {/* Mobile Phone Input */}
              <div>
                <label className="block text-xs font-bold text-[#2E3333] mb-1.5">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs sm:text-sm outline-none font-mono"
                  id="input-track-phone"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all active:scale-98 cursor-pointer text-xs sm:text-sm disabled:opacity-50"
              id="btn-track-submit"
            >
              <Search className="w-4 h-4 text-[#F57C00]" />
              <span>{isSearching ? 'অর্ডার খোঁজা হচ্ছে...' : 'অর্ডার ট্র্যাক করুন'}</span>
            </button>
          </form>
        </div>

        {/* Order Details & Progress Timeline Result */}
        {searchedOrder && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Status Highlight Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DF] shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E5DF]">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    অর্ডার ট্র্যাকিং আইডি
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#1B5E20] font-mono">
                    {searchedOrder.orderNumber}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    অর্ডারের তারিখ: {new Date(searchedOrder.createdAt).toLocaleDateString('bn-BD', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E8F5E9] hover:bg-[#D7EED9] text-[#1B5E20] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#F57C00]" />
                    <span>ইনভয়েস দেখুন</span>
                  </button>
                </div>
              </div>

              {/* Order Cancelled Badge */}
              {searchedOrder.status === 'cancelled' ? (
                <div className="bg-red-50 border border-red-200 p-5 rounded-2xl text-center space-y-2">
                  <XCircle className="w-10 h-10 text-red-600 mx-auto" />
                  <h3 className="text-base font-black text-red-800">অর্ডার বাতিল (Order Cancelled)</h3>
                  <p className="text-xs text-red-600 max-w-md mx-auto">
                    আপনার এই অর্ডারটি বাতিল করা হয়েছে। বিস্তারিত জানতে অনুগ্রহ করে আমাদের সাপোর্ট হটলাইনে যোগাযোগ করুন।
                  </p>
                </div>
              ) : (
                /* Visual Progress Timeline (5 Steps) */
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-[#2E3333] uppercase tracking-wider">
                    অর্ডারের বর্তমান অগ্রগতি (Status Timeline)
                  </h3>

                  <div className="relative pt-2 pb-4">
                    {/* Progress Bar Line */}
                    <div className="hidden sm:block absolute top-6 left-8 right-8 h-1 bg-gray-200 z-0">
                      <div
                        className="h-full bg-[#1B5E20] transition-all duration-500"
                        style={{
                          width: `${(Math.max(0, getStepIndex(searchedOrder.status)) / (STATUS_STEPS.length - 1)) * 100}%`
                        }}
                      />
                    </div>

                    {/* Timeline Steps Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2 relative z-10">
                      {STATUS_STEPS.map((step, idx) => {
                        const currentIdx = getStepIndex(searchedOrder.status);
                        const isCompleted = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        const StepIcon = step.icon;

                        return (
                          <div
                            key={step.key}
                            className={`flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-3 sm:p-2 rounded-2xl sm:rounded-none transition-all ${
                              isCurrent
                                ? 'bg-[#E8F5E9] sm:bg-transparent border sm:border-none border-[#1B5E20]/30 shadow-xs'
                                : ''
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                                isCompleted
                                  ? 'bg-[#1B5E20] text-white shadow-md'
                                  : 'bg-gray-100 text-gray-400 border border-gray-200'
                              } ${isCurrent ? 'ring-4 ring-[#1B5E20]/20 scale-110' : ''}`}
                            >
                              <StepIcon className="w-5 h-5" />
                            </div>

                            <div className="sm:mt-1">
                              <p
                                className={`text-xs font-black ${
                                  isCompleted ? 'text-[#1B5E20]' : 'text-gray-400'
                                }`}
                              >
                                {step.labelBn}
                              </p>
                              <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                                {step.descBn}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Customer & Address Details */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DF] shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-gray-400 font-semibold block">গ্রাহকের নাম:</span>
                <p className="font-black text-sm text-[#2E3333]">{searchedOrder.customerName}</p>
                <p className="text-gray-600 font-mono font-bold mt-1">মোবাইল: {searchedOrder.phone}</p>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 font-semibold block">ডেলিভারি গন্তব্য:</span>
                <p className="font-bold text-[#2E3333] leading-relaxed">
                  {searchedOrder.address}
                  {searchedOrder.upazila ? `, ${searchedOrder.upazila}` : ''}
                  {searchedOrder.district ? `, ${searchedOrder.district}` : ''}
                </p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DF] shadow-xs space-y-4">
              <h3 className="text-xs font-black text-[#1B5E20] uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#F57C00]" />
                <span>অর্ডারের পণ্যসমূহ</span>
              </h3>

              <div className="border border-[#E8E5DF] rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FDFCF9] border-b border-[#E8E5DF] text-gray-500 font-bold">
                    <tr>
                      <th className="p-3">পণ্য</th>
                      <th className="p-3 text-center">পরিমাণ</th>
                      <th className="p-3 text-right">একক মূল্য</th>
                      <th className="p-3 text-right">মোট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E5DF]">
                    {searchedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-bold text-[#2E3333]">
                          {item.productName}
                          <span className="block text-[10px] text-gray-400 font-normal">{item.unit || 'একক'}</span>
                        </td>
                        <td className="p-3 text-center font-bold text-gray-700">
                          {toBengaliNumber(item.quantity)} টি
                        </td>
                        <td className="p-3 text-right font-medium text-gray-600">
                          {formatTaka(item.price)}
                        </td>
                        <td className="p-3 text-right font-black text-[#1B5E20]">
                          {formatTaka(item.subtotal || item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation */}
              <div className="p-4 bg-[#FDFCF9] rounded-2xl border border-[#E8E5DF] space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>পণ্যের মোট:</span>
                  <span className="font-bold text-[#2E3333]">{formatTaka(searchedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-bold text-[#1B5E20]">
                    {searchedOrder.deliveryCharge === 0 ? 'ফ্রি' : formatTaka(searchedOrder.deliveryCharge)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E8E5DF] flex justify-between items-baseline font-black">
                  <span className="text-sm text-[#2E3333]">সর্বমোট প্রদেয়:</span>
                  <span className="text-2xl text-[#1B5E20]">{formatTaka(searchedOrder.total)}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Invoice Modal Overlay */}
      {showInvoiceModal && searchedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-4 sm:p-8 max-h-[92vh] overflow-y-auto my-auto print:p-0 print:m-0 print:border-none print:shadow-none">
            <OrderInvoice
              order={searchedOrder}
              siteSettings={siteSettings}
              showActions={true}
              onClose={() => setShowInvoiceModal(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
