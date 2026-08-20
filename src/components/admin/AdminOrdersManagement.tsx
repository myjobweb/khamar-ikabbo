import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { OrderInvoice } from '../OrderInvoice';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  RefreshCcw,
  Truck,
  XCircle,
  Phone,
  MapPin,
  FileSpreadsheet,
  Printer,
  X,
  MessageCircle,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { toBengaliNumber, formatBengaliPrice, formatTaka } from '../../utils/bengali';

const STATUS_CONFIG: Record<
  OrderStatus,
  { labelBn: string; badgeClass: string; icon: React.FC<{ className?: string }> }
> = {
  new: { labelBn: 'নতুন', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300', icon: Clock },
  pending: { labelBn: 'নতুন (Pending)', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300', icon: Clock },
  confirmed: { labelBn: 'কনফার্মড', badgeClass: 'bg-blue-100 text-blue-800 border-blue-300', icon: CheckCircle2 },
  processing: { labelBn: 'প্রসেসিং', badgeClass: 'bg-sky-100 text-sky-800 border-sky-300', icon: RefreshCcw },
  shipped: { labelBn: 'শিপিং হচ্ছে', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: Truck },
  delivered: { labelBn: 'সম্পন্ন (Delivered)', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle2 },
  cancelled: { labelBn: 'বাতিল (Cancelled)', badgeClass: 'bg-red-100 text-red-800 border-red-300', icon: XCircle }
};

export const AdminOrdersManagement: React.FC = () => {
  const { orders, updateOrderStatus, siteSettings } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Filter Orders by search term, status, and date range
  const filteredOrders = orders.filter((o) => {
    const cleanSearch = search.toLowerCase().trim();
    const matchesSearch =
      !cleanSearch ||
      o.orderNumber.toLowerCase().includes(cleanSearch) ||
      o.customerName.toLowerCase().includes(cleanSearch) ||
      o.phone.toLowerCase().includes(cleanSearch) ||
      o.district.toLowerCase().includes(cleanSearch);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      if (dateFilter === 'today') {
        matchesDate = orderDate.toDateString() === now.toDateString();
      } else if (dateFilter === '7days') {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        matchesDate = diffDays <= 7;
      } else if (dateFilter === '30days') {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        matchesDate = diffDays <= 30;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderNumber === orderId)) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate WhatsApp message for selected order
  const getWhatsAppUrl = (order: Order) => {
    const cleanCustomerPhone = order.phone.replace(/[^0-9]/g, '');
    const itemsText = order.items
      .map((i) => `- ${i.productName} × ${toBengaliNumber(i.quantity)} (${formatTaka(i.price * i.quantity)})`)
      .join('\n');

    const msg = `${siteSettings.bengaliName || 'খামারি কাব্য'}\n\nপ্রিয় ${order.customerName},\nআপনার অর্ডার নং: ${order.orderNumber} এর হালনাগাদ তথ্য:\n\nঅর্ডার স্ট্যাটাস: ${STATUS_CONFIG[order.status]?.labelBn || order.status}\n\nপণ্যসমূহ:\n${itemsText}\n\nসর্বমোট: ${formatTaka(order.total)}\n\nধন্যবাদ! খামারি কাব্য।`;

    return `https://wa.me/${cleanCustomerPhone.startsWith('88') ? cleanCustomerPhone : `88${cleanCustomerPhone}`}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-6" id="admin-orders-page">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E8E5DF] shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#2E3333]">
            অর্ডার ব্যবস্থাপনা ({toBengaliNumber(filteredOrders.length)})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            খামারি কাব্য এর সকল অনলাইন ও ক্যাশ অন ডেলিভারি অর্ডারের তালিকা ও ইনভয়েস
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1B5E20] bg-[#E8F5E9] px-3.5 py-1.5 rounded-full border border-[#1B5E20]/20">
            সর্বমোট কাস্টমার অর্ডার: {toBengaliNumber(orders.length)} টি
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Bar */}
        <div className="relative sm:col-span-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="অর্ডার নম্বর (KK-XXXX), ক্রেতার নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs outline-none text-[#2E3333]"
            id="input-admin-search-orders"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        {/* Status Filter Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs font-semibold outline-none text-[#2E3333] cursor-pointer"
          >
            <option value="all">সকল অর্ডার স্ট্যাটাস</option>
            <option value="pending">নতুন / অপেক্ষমান (New/Pending)</option>
            <option value="confirmed">কনফার্মড (Confirmed)</option>
            <option value="processing">প্রসেসিং (Processing)</option>
            <option value="shipped">শিপিং হচ্ছে (Shipped)</option>
            <option value="delivered">সম্পন্ন (Delivered)</option>
            <option value="cancelled">বাতিল (Cancelled)</option>
          </select>
        </div>

        {/* Date Filter Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs font-semibold outline-none text-[#2E3333] cursor-pointer"
          >
            <option value="all">সকল সময় (All Time)</option>
            <option value="today">আজকের অর্ডার (Today)</option>
            <option value="7days">গত ৭ দিন (Last 7 Days)</option>
            <option value="30days">গত ৩০ দিন (Last 30 Days)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E8E5DF] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FDFCF9] border-b border-[#E8E5DF] text-gray-500 font-bold">
              <tr>
                <th className="p-3.5">অর্ডার নং</th>
                <th className="p-3.5">ক্রেতা ও মোবাইল</th>
                <th className="p-3.5">গন্তব্য ঠিকানা</th>
                <th className="p-3.5 text-center">আইটেম</th>
                <th className="p-3.5">সর্বমোট</th>
                <th className="p-3.5">তারিখ</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 font-semibold">
                    কোনো মিল থাকা অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const statusInfo = STATUS_CONFIG[ord.status] || {
                    labelBn: ord.status,
                    badgeClass: 'bg-gray-100 text-gray-700',
                    icon: Clock
                  };

                  const itemCount = ord.items.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Order Number */}
                      <td className="p-3.5">
                        <span className="font-mono font-black text-[#1B5E20] text-sm">
                          {ord.orderNumber}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="p-3.5">
                        <p className="font-bold text-[#2E3333]">{ord.customerName}</p>
                        <a
                          href={`tel:${ord.phone}`}
                          className="text-[11px] text-[#1B5E20] hover:underline flex items-center gap-1 font-mono font-bold"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>{ord.phone}</span>
                        </a>
                      </td>

                      {/* Address */}
                      <td className="p-3.5 max-w-[180px]">
                        <p className="font-bold text-[#2E3333] truncate">
                          {ord.address}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {ord.district}
                        </p>
                      </td>

                      {/* Item Count */}
                      <td className="p-3.5 text-center font-bold text-gray-700">
                        {toBengaliNumber(itemCount)} টি
                      </td>

                      {/* Total */}
                      <td className="p-3.5 font-black text-[#1B5E20] text-sm">
                        {formatBengaliPrice(ord.total)}
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-gray-500 font-medium">
                        {new Date(ord.createdAt).toLocaleDateString('bn-BD')}
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-3.5">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border outline-none cursor-pointer ${statusInfo.badgeClass}`}
                        >
                          <option value="pending">নতুন (Pending)</option>
                          <option value="confirmed">কনফার্মড</option>
                          <option value="processing">প্রসেসিং</option>
                          <option value="shipped">শিপিং হচ্ছে</option>
                          <option value="delivered">সম্পন্ন</option>
                          <option value="cancelled">বাতিল</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E8F5E9] hover:bg-[#D7EED9] text-[#1B5E20] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>বিস্তারিত</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8E5DF] p-6 max-h-[90vh] overflow-y-auto space-y-5 print:p-0 print:border-none print:shadow-none">
            
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E5DF] print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center font-black">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#2E3333]">
                    অর্ডার বিবরণী — #{selectedOrder.orderNumber}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    তারিখ: {new Date(selectedOrder.createdAt).toLocaleString('bn-BD')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="px-3 py-1.5 bg-[#1B5E20] text-white hover:bg-[#124116] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#F57C00]" />
                  <span>ইনভয়েস দেখুন</span>
                </button>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FDFCF9] rounded-2xl border border-[#E8E5DF] text-xs">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase">গ্রাহকের তথ্য</p>
                <p className="font-black text-sm text-[#2E3333]">{selectedOrder.customerName}</p>
                <p className="font-semibold text-gray-700 font-mono flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-[#1B5E20]" />
                  <span>{selectedOrder.phone}</span>
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase">ডেলিভারি ঠিকানা</p>
                <p className="font-semibold text-[#2E3333] flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1B5E20] shrink-0 mt-0.5" />
                  <span>
                    {selectedOrder.address}
                    {selectedOrder.upazila ? `, ${selectedOrder.upazila}` : ''}
                    {selectedOrder.district ? `, ${selectedOrder.district}` : ''}
                  </span>
                </p>
                {selectedOrder.notes && (
                  <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-1.5">
                    <strong>মন্তব্য:</strong> {selectedOrder.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items Table (Using Snapshot Data) */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">অর্ডারকৃত পণ্যসমূহ</h4>
              <div className="border border-[#E8E5DF] rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FDFCF9] border-b border-[#E8E5DF] text-gray-500 font-bold">
                    <tr>
                      <th className="p-3">পণ্য</th>
                      <th className="p-3">একক মূল্য</th>
                      <th className="p-3 text-center">পরিমাণ</th>
                      <th className="p-3 text-right">মোট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3">
                          <p className="font-bold text-[#2E3333]">{item.productName}</p>
                          <p className="text-[10px] text-gray-400">{item.unit || 'একক'}</p>
                        </td>
                        <td className="p-3 font-semibold text-gray-600">
                          {formatBengaliPrice(item.price)}
                        </td>
                        <td className="p-3 text-center font-bold text-[#2E3333]">
                          {toBengaliNumber(item.quantity)} টি
                        </td>
                        <td className="p-3 font-bold text-[#1B5E20] text-right">
                          {formatBengaliPrice(item.subtotal || item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="p-4 bg-[#FDFCF9] rounded-2xl border border-[#E8E5DF] space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>পণ্যের সাবটোটাল:</span>
                <span className="font-bold">{formatBengaliPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold">
                  {selectedOrder.deliveryCharge === 0 ? 'ফ্রি' : formatBengaliPrice(selectedOrder.deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#1B5E20] pt-2 border-t border-[#E8E5DF]">
                <span>সর্বমোট প্রদেয় টাকা:</span>
                <span>{formatBengaliPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Status Changer & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 print:hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2E3333]">স্ট্যাটাস পরিবর্তন:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className="px-3 py-1.5 bg-white border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="pending">নতুন (Pending)</option>
                  <option value="confirmed">কনফার্মড (Confirmed)</option>
                  <option value="processing">প্রসেসিং (Processing)</option>
                  <option value="shipped">শিপিং হচ্ছে (Shipped)</option>
                  <option value="delivered">সম্পন্ন (Delivered)</option>
                  <option value="cancelled">বাতিল (Cancelled)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppUrl(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] text-white hover:bg-[#1EBE5D] text-xs font-bold rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1B5E20] text-white hover:bg-[#124116] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#F57C00]" />
                  <span>ইনভয়েস প্রিন্ট</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Admin Full Invoice Viewer Overlay */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-4 sm:p-8 max-h-[92vh] overflow-y-auto my-auto print:p-0 print:m-0 print:border-none print:shadow-none">
            <OrderInvoice
              order={selectedOrder}
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
