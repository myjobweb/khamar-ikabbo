import React from 'react';
import { Order, SiteSettings } from '../types';
import { formatTaka, toBengaliNumber } from '../utils/bengali';
import {
  Wheat,
  Printer,
  FileDown,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface OrderInvoiceProps {
  order: Order;
  siteSettings: SiteSettings;
  showActions?: boolean;
  onClose?: () => void;
}

export const OrderInvoice: React.FC<OrderInvoiceProps> = ({
  order,
  siteSettings,
  showActions = true,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Prepare WhatsApp pre-filled message using actual order item snapshots
  const itemsText = order.items
    .map((item) => `- ${item.productName} × ${toBengaliNumber(item.quantity)} (${formatTaka(item.price * item.quantity)})`)
    .join('\n');

  const whatsappText = `${siteSettings.bengaliName || 'খামারি কাব্য'}\n\nঅর্ডার নম্বর: ${order.orderNumber}\n\nনাম: ${order.customerName}\nমোবাইল: ${order.phone}\nঠিকানা: ${order.address}${order.district ? `, ${order.district}` : ''}\n${order.notes ? `মন্তব্য: ${order.notes}\n` : ''}\nপণ্য:\n${itemsText}\n\nপণ্যের মোট: ${formatTaka(order.subtotal)}\nডেলিভারি চার্জ: ${order.deliveryCharge === 0 ? 'ফ্রি' : formatTaka(order.deliveryCharge)}\nসর্বমোট: ${formatTaka(order.total)}`;

  const whatsappUrl = siteSettings.whatsappNumber
    ? `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappText)}`
    : null;

  return (
    <div className="space-y-6">
      
      {/* Printable Invoice Container */}
      <div
        id="printable-invoice"
        className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E5DF] shadow-sm max-w-3xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none"
      >
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#1B5E20]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-[#1B5E20] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md">
              <Wheat className="w-7 h-7 text-[#F57C00]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1B5E20] leading-tight">
                {siteSettings.bengaliName || 'খামারি কাব্য'}
              </h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                {siteSettings.websiteName || 'Khamari Kabbo'}
              </p>
              <p className="text-xs font-semibold text-[#F57C00] mt-0.5">
                "{siteSettings.tagline || 'খামারের যত্নে, খামারির পাশে'}"
              </p>
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
            <span className="inline-block bg-[#1B5E20] text-white text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-1.5">
              অর্ডার রসিদ (INVOICE)
            </span>
            <p className="font-mono text-lg font-black text-[#1B5E20]">
              {order.orderNumber}
            </p>
            <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
              তারিখ: {formattedDate}
            </p>
          </div>
        </div>

        {/* Brand Contact Bar */}
        <div className="py-3 px-4 bg-[#FDFCF9] border-b border-[#E8E5DF] text-[11px] text-gray-600 flex flex-wrap justify-between gap-2 mt-2 rounded-xl">
          <span>হটলাইন: {siteSettings.hotlinePhone}</span>
          <span>ইমেইল: {siteSettings.email}</span>
          <span className="truncate max-w-md">{siteSettings.addressBn}</span>
        </div>

        {/* Customer & Delivery Information */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FDFCF9] p-4 sm:p-5 rounded-2xl border border-[#E8E5DF] text-xs">
          <div className="space-y-1.5">
            <h3 className="text-xs font-black text-[#1B5E20] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#F57C00]" />
              <span>গ্রাহকের তথ্য</span>
            </h3>
            <p className="font-extrabold text-sm text-[#2E3333]">{order.customerName}</p>
            <p className="text-gray-600 font-semibold font-mono flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#1B5E20]" />
              <span>{order.phone}</span>
            </p>
            <p className="text-[#1B5E20] font-bold mt-1">
              পেমেন্ট: {order.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে মূল্য পরিশোধ)' : order.paymentMethod?.toUpperCase()}
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-black text-[#1B5E20] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F57C00]" />
              <span>ডেলিভারি গন্তব্য</span>
            </h3>
            <p className="font-bold text-[#2E3333] leading-relaxed break-words">
              {order.address}
              {order.upazila ? `, ${order.upazila}` : ''}
              {order.district ? `, ${order.district}` : ''}
            </p>
            {order.notes && (
              <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl text-[11px] text-amber-900 mt-2">
                <span className="font-bold">বিশেষ মন্তব্য:</span> {order.notes}
              </div>
            )}
          </div>
        </div>

        {/* Itemized Order Products Table */}
        <div className="mt-6">
          <h3 className="text-xs font-extrabold text-[#2E3333] uppercase tracking-wider mb-2.5">
            অর্ডারের পণ্যসমূহ
          </h3>
          <div className="border border-[#E8E5DF] rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#1B5E20] text-white font-bold">
                <tr>
                  <th className="p-3 text-left">পণ্য</th>
                  <th className="p-3 text-center">পরিমাণ</th>
                  <th className="p-3 text-right">একক মূল্য</th>
                  <th className="p-3 text-right">মোট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DF]">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-[#2E3333] break-words max-w-[220px]">
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
        </div>

        {/* Financial Totals Breakdown */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="bg-[#E8F5E9]/60 border border-[#1B5E20]/20 p-3.5 rounded-2xl max-w-xs text-[11px] text-[#1B5E20] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#1B5E20] shrink-0" />
              <span>১০০% প্রিমিয়াম কোয়ালিটি গ্যারান্টি</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              পণ্য গ্রহণে কোনো সমস্যা হলে ৩ কার্যদিবসের মধ্যে যোগাযোগ করুন।
            </p>
          </div>

          <div className="w-full sm:w-72 bg-[#FDFCF9] p-4 rounded-2xl border border-[#E8E5DF] space-y-2 text-xs">
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
            <div className="pt-2 border-t-2 border-[#1B5E20] flex justify-between items-baseline font-black">
              <span className="text-sm text-[#2E3333]">সর্বমোট প্রদেয়:</span>
              <span className="text-xl text-[#1B5E20]">{formatTaka(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Notice */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center space-y-1">
          <p className="text-xs font-bold text-[#1B5E20]">
            আপনার অর্ডারের জন্য ধন্যবাদ।
          </p>
          <p className="text-[11px] text-gray-400">
            {siteSettings.footerText || '© ২০২৪-২০২৬ খামারি কাব্য (Khamari Kabbo)। সর্বস্বত্ব সংরক্ষিত।'}
          </p>
        </div>
      </div>

      {/* Action Buttons (Screen Only - Hidden during print) */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-3 print:hidden max-w-3xl mx-auto">
          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#F57C00]" />
            <span>ইনভয়েস প্রিন্ট করুন</span>
          </button>

          {/* PDF Download Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#2E3333] border border-[#E8E5DF] px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-[#1B5E20]" />
            <span>PDF সংরক্ষণ করুন</span>
          </button>

          {/* WhatsApp Button */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp-এ অর্ডারের তথ্য পাঠান</span>
            </a>
          )}

          {/* Call Hotline Button */}
          {siteSettings.hotlinePhone && (
            <a
              href={`tel:${siteSettings.hotlinePhone}`}
              className="flex items-center gap-2 bg-[#F57C00] hover:bg-[#E65100] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>কল করুন (+৮৮০ {toBengaliNumber(siteSettings.hotlinePhone)})</span>
            </a>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <span>বন্ধ করুন</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
