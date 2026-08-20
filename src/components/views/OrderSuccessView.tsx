import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTaka, toBengaliNumber } from '../../utils/bengali';
import { OrderInvoice } from '../OrderInvoice';
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  MessageCircle,
  PhoneCall,
  Search,
  ArrowRight,
  ShieldCheck,
  FileText,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Home
} from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { lastCreatedOrder, setCurrentRoute, siteSettings } = useApp();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // If no order in memory, fallback notice with order tracking button
  if (!lastCreatedOrder) {
    return (
      <div className="py-16 bg-[#FDFCF9] min-h-[65vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto shadow-xs border border-[#1B5E20]/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#2E3333]">
              🎉 অর্ডার সফল হয়েছে!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              আপনার অর্ডারের তথ্য ও ডেলিভারি স্ট্যাটাস জানতে আমাদের Order Tracking ব্যবহার করুন।
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setCurrentRoute('track-order')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold px-6 py-3 rounded-2xl shadow-md transition-all cursor-pointer text-xs"
            >
              <Search className="w-4 h-4 text-[#F57C00]" />
              <span>অর্ডার ট্র্যাক করুন</span>
            </button>
            <button
              onClick={() => setCurrentRoute('home')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#2E3333] border border-[#E8E5DF] font-bold px-6 py-3 rounded-2xl transition-all cursor-pointer text-xs"
            >
              <Home className="w-4 h-4 text-[#1B5E20]" />
              <span>হোমে ফিরে যান</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const order = lastCreatedOrder;

  // WhatsApp pre-filled text
  const itemsText = order.items
    .map((i) => `- ${i.productName} × ${toBengaliNumber(i.quantity)} (${formatTaka(i.price * i.quantity)})`)
    .join('\n');

  const whatsappText = `${siteSettings.bengaliName || 'খামারি কাব্য'}\n\nঅর্ডার নম্বর: ${order.orderNumber}\n\nনাম: ${order.customerName}\nমোবাইল: ${order.phone}\nঠিকানা: ${order.address}${order.district ? `, ${order.district}` : ''}\n${order.notes ? `মন্তব্য: ${order.notes}\n` : ''}\nপণ্য:\n${itemsText}\n\nপণ্যের মোট: ${formatTaka(order.subtotal)}\nডেলিভারি চার্জ: ${order.deliveryCharge === 0 ? 'ফ্রি' : formatTaka(order.deliveryCharge)}\nসর্বমোট: ${formatTaka(order.total)}`;

  const whatsappUrl = siteSettings.whatsappNumber
    ? `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappText)}`
    : null;

  return (
    <div className="py-8 sm:py-12 bg-[#FDFCF9] min-h-[80vh]" id="order-success-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Success Banner */}
        <div className="bg-[#1B5E20] text-white p-6 sm:p-10 rounded-3xl text-center space-y-4 shadow-lg relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-[#F57C00] text-white flex items-center justify-center mx-auto shadow-md shadow-[#F57C00]/30 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black">
              🎉 অর্ডার সফল হয়েছে!
            </h1>
            <p className="text-xs sm:text-sm text-[#E8F5E9] font-medium max-w-lg mx-auto">
              ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।
            </p>
          </div>

          {/* Prominent Order Number Display */}
          <div className="inline-flex items-center gap-3 bg-white/15 border border-white/20 px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold text-[#FFF3E0]">
            <span>অর্ডার নম্বর:</span>
            <span className="font-mono text-base sm:text-lg text-white font-black tracking-widest">
              {order.orderNumber}
            </span>
          </div>

          <div className="pt-2 text-xs text-[#E8F5E9]/90 space-y-1">
            <p>আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে। অর্ডার নম্বরটি সংরক্ষণ করুন।</p>
            <p className="font-semibold text-[#FFF3E0]">
              অর্ডারের অবস্থা জানতে Order Tracking ব্যবহার করুন।
            </p>
          </div>
        </div>

        {/* Customer Information Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DF] shadow-xs space-y-4">
          <h2 className="text-sm font-black text-[#1B5E20] uppercase tracking-wider pb-3 border-b border-[#E8E5DF] flex items-center gap-2">
            <User className="w-4 h-4 text-[#F57C00]" />
            <span>গ্রাহকের তথ্য</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block">নাম:</span>
              <p className="font-extrabold text-sm text-[#2E3333]">{order.customerName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block">মোবাইল নাম্বার:</span>
              <p className="font-extrabold text-sm text-[#1B5E20] font-mono">{order.phone}</p>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <span className="text-gray-400 font-semibold block">সম্পূর্ণ ঠিকানা:</span>
              <p className="font-bold text-[#2E3333] leading-relaxed">
                {order.address}
                {order.upazila ? `, ${order.upazila}` : ''}
                {order.district ? `, ${order.district}` : ''}
              </p>
            </div>

            {order.notes && (
              <div className="sm:col-span-2 space-y-1 bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900">
                <span className="font-bold block">মন্তব্য:</span>
                <p className="font-medium">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items & Totals Summary */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DF] shadow-xs space-y-5">
          <h2 className="text-sm font-black text-[#1B5E20] uppercase tracking-wider pb-3 border-b border-[#E8E5DF] flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#F57C00]" />
            <span>আপনার অর্ডার</span>
          </h2>

          {/* Items Table using Snapshot data */}
          <div className="border border-[#E8E5DF] rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFCF9] border-b border-[#E8E5DF] text-gray-500 font-bold">
                <tr>
                  <th className="p-3.5">পণ্য</th>
                  <th className="p-3.5 text-center">পরিমাণ</th>
                  <th className="p-3.5 text-right">একক মূল্য</th>
                  <th className="p-3.5 text-right">মোট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DF]">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-3.5 font-bold text-[#2E3333]">
                      {item.productName}
                      <span className="block text-[10px] text-gray-400 font-normal">{item.unit || 'একক'}</span>
                    </td>
                    <td className="p-3.5 text-center font-bold text-gray-700">
                      {toBengaliNumber(item.quantity)} টি
                    </td>
                    <td className="p-3.5 text-right font-medium text-gray-600">
                      {formatTaka(item.price)}
                    </td>
                    <td className="p-3.5 text-right font-black text-[#1B5E20]">
                      {formatTaka(item.subtotal || item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="bg-[#FDFCF9] p-4 sm:p-5 rounded-2xl border border-[#E8E5DF] space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-600">
              <span>পণ্যের মোট:</span>
              <span className="font-bold text-[#2E3333]">{formatTaka(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>ডেলিভারি চার্জ:</span>
              <span className="font-bold text-[#1B5E20]">
                {order.deliveryCharge === 0 ? 'ফ্রি' : formatTaka(order.deliveryCharge)}
              </span>
            </div>
            <div className="pt-3 border-t-2 border-[#1B5E20] flex justify-between items-baseline font-black">
              <span className="text-base sm:text-lg text-[#2E3333]">সর্বমোট:</span>
              <span className="text-2xl sm:text-3xl text-[#1B5E20]">{formatTaka(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DF] shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            
            {/* View / Print Invoice Modal */}
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer text-xs"
            >
              <Printer className="w-4 h-4 text-[#F57C00]" />
              <span>ইনভয়েস দেখুন / প্রিন্ট করুন</span>
            </button>

            {/* Track Order */}
            <button
              onClick={() => setCurrentRoute('track-order')}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#2E3333] border border-[#E8E5DF] font-bold py-3.5 px-4 rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer text-xs"
            >
              <Search className="w-4 h-4 text-[#1B5E20]" />
              <span>অর্ডার ট্র্যাক করুন</span>
            </button>

            {/* WhatsApp Order Details */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-95 text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp-এ অর্ডারের তথ্য পাঠান</span>
              </a>
            )}

            {/* Hotline Call */}
            {siteSettings.hotlinePhone && (
              <a
                href={`tel:${siteSettings.hotlinePhone}`}
                className="flex items-center justify-center gap-2 bg-[#F57C00] hover:bg-[#E65100] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-95 text-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>কল করুন (+৮৮০ {toBengaliNumber(siteSettings.hotlinePhone)})</span>
              </a>
            )}

            {/* Return to Home */}
            <button
              onClick={() => setCurrentRoute('home')}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#2E3333] font-bold py-3.5 px-4 rounded-2xl transition-all cursor-pointer text-xs"
            >
              <Home className="w-4 h-4 text-[#1B5E20]" />
              <span>হোমে ফিরে যান</span>
            </button>

          </div>
        </div>

      </div>

      {/* Embedded Full Screen Printable Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-4 sm:p-8 max-h-[92vh] overflow-y-auto my-auto print:p-0 print:m-0 print:border-none print:shadow-none">
            <OrderInvoice
              order={order}
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
