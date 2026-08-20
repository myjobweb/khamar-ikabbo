import React from 'react';
import { useApp } from '../context/AppContext';
import { formatTaka, toBengaliNumber } from '../utils/bengali';
import {
  CheckCircle2,
  X,
  Printer,
  ShoppingBag,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const {
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    lastCreatedOrder,
    setCurrentRoute,
    siteSettings
  } = useApp();

  if (!isSuccessModalOpen || !lastCreatedOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = `আসসালামু আলাইকুম, আমি খামারি কাব্য থেকে একটি অর্ডার করেছি।\nঅর্ডার নম্বর: ${lastCreatedOrder.orderNumber}\nনাম: ${lastCreatedOrder.customerName}\nসর্বমোট: ${formatTaka(lastCreatedOrder.total)}\nঠিকানা: ${lastCreatedOrder.address}, ${lastCreatedOrder.district}`;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      id="order-success-modal"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8E5DF] my-auto">
        
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 bg-[#1B5E20] text-white text-center relative">
          <button
            onClick={() => setIsSuccessModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-[#F57C00] text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#F57C00]/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black">
            ধন্যবাদ! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে
          </h3>
          <p className="text-xs sm:text-sm text-[#E8F5E9] mt-1 max-w-md mx-auto">
            আমাদের কাস্টমার কেয়ার প্রতিনিধি শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করে অর্ডার কনফার্ম করবেন।
          </p>

          {/* Order ID Pill */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#FFF3E0]">
            <span>অর্ডার ট্র্যাকিং আইডি:</span>
            <span className="font-mono text-white tracking-wider">
              {lastCreatedOrder.orderNumber}
            </span>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-5 sm:p-7 space-y-5 max-h-[60vh] overflow-y-auto" id="printable-invoice">
          
          {/* Customer & Delivery Summary Card */}
          <div className="bg-[#FDFCF9] p-4 rounded-2xl border border-[#E8E5DF] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-400 font-semibold">গ্রাহকের নাম:</p>
              <p className="font-bold text-[#2E3333] text-sm">{lastCreatedOrder.customerName}</p>
              <p className="text-gray-500 mt-1">মোবাইল: {toBengaliNumber(lastCreatedOrder.phone)}</p>
            </div>
            <div>
              <p className="text-gray-400 font-semibold">ডেলিভারি গন্তব্য:</p>
              <p className="font-bold text-[#2E3333]">
                {lastCreatedOrder.district}, {lastCreatedOrder.upazila}
              </p>
              <p className="text-gray-500 mt-1 truncate">{lastCreatedOrder.address}</p>
            </div>
            <div>
              <p className="text-gray-400 font-semibold">পেমেন্ট মেথড:</p>
              <p className="font-bold text-[#1B5E20]">
                {lastCreatedOrder.paymentMethod === 'cod'
                  ? 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে মূল্য পরিশোধ)'
                  : lastCreatedOrder.paymentMethod.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-semibold">অর্ডার স্ট্যাটাস:</p>
              <span className="inline-block font-bold text-[#1B5E20] bg-[#E8F5E9] px-2.5 py-0.5 rounded-md text-[11px]">
                অপেক্ষমান (Pending Verification)
              </span>
            </div>
          </div>

          {/* Itemized Order Details */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              অর্ডারের পণ্যসমূহ
            </h4>
            <div className="border border-[#E8E5DF] rounded-2xl overflow-hidden divide-y divide-[#E8E5DF] text-xs">
              {lastCreatedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-10 h-10 object-cover rounded-xl border border-[#E8E5DF]"
                    />
                    <div className="truncate">
                      <p className="font-bold text-[#2E3333] truncate">{item.productName}</p>
                      <p className="text-gray-400 text-[11px]">একক: {item.unit}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-[#2E3333]">
                      {formatTaka(item.price * item.quantity)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {toBengaliNumber(item.quantity)} টি × {formatTaka(item.price)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Total Calculation Row */}
              <div className="p-3.5 bg-[#FDFCF9] space-y-1.5">
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>পণ্য সাবটোটাল:</span>
                  <span>{formatTaka(lastCreatedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>{lastCreatedOrder.deliveryCharge === 0 ? 'ফ্রি' : formatTaka(lastCreatedOrder.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#2E3333] pt-1.5 border-t border-[#E8E5DF]">
                  <span>সর্বমোট প্রদেয় মূল্য:</span>
                  <span className="text-[#1B5E20] text-base">{formatTaka(lastCreatedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help Notice */}
          <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-[#1B5E20]">
            <ShieldCheck className="w-5 h-5 text-[#1B5E20] shrink-0" />
            <p>
              কোনো তথ্য পরিবর্তন করতে চাইলে আমাদের হটলাইনে কল করুন অথবা সরাসরি নিচের বাটনে ক্লিক করে হোয়াটসঅ্যাপে জানান।
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-6 bg-[#FDFCF9] border-t border-[#E8E5DF] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-bold text-[#2E3333] bg-white hover:bg-gray-100 border border-[#E8E5DF] py-2.5 px-3.5 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>রসিদ প্রিন্ট করুন</span>
            </button>

            <a
              href={`https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1EBE5D] py-2.5 px-3.5 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে জানান</span>
            </a>
          </div>

          <button
            onClick={() => {
              setIsSuccessModalOpen(false);
              setCurrentRoute('home');
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#1B5E20] hover:bg-[#124116] py-2.5 px-5 rounded-xl transition-colors cursor-pointer ml-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>আরও পণ্য কিনুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
