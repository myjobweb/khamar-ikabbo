import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DbCustomer } from '../../types';
import { fetchCustomersList } from '../../services/store';
import {
  Users,
  Search,
  Phone,
  MapPin,
  ShoppingBag,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { toBengaliNumber, formatBengaliPrice } from '../../utils/bengali';

export const AdminCustomersManagement: React.FC = () => {
  const { orders } = useApp();
  const [customers, setCustomers] = useState<DbCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const list = await fetchCustomersList();
        setCustomers(list);
      } catch (e) {
        console.error('Failed to load customers:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orders]);

  const filteredCustomers = customers.filter((c) => {
    const matches =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      (c.district && c.district.toLowerCase().includes(search.toLowerCase())) ||
      (c.upazila && c.upazila.toLowerCase().includes(search.toLowerCase()));
    return matches;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-3xl border border-[#E8E5DF] shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#2E3333]">
            খামারি ও গ্রাহক তালিকা ({toBengaliNumber(filteredCustomers.length)})
          </h2>
          <p className="text-xs text-gray-500">
            খামারি কাব্য এর নিয়মিত ক্রেতা ও খামার মালিকদের ডাটাবেজ
          </p>
        </div>

        <div className="text-xs font-bold text-[#1B5E20] bg-emerald-50 px-3 py-1.5 rounded-xl">
          মোট নিবন্ধিত খামারি: {toBengaliNumber(customers.length)} জন
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="গ্রাহকের নাম, মোবাইল নম্বর বা জেলা দিয়ে খুঁজুন..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs outline-none text-[#2E3333]"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#E8E5DF] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#1B5E20]" />
            <span>গ্রাহক তথ্য লোড হচ্ছে...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFCF9] border-b border-[#E8E5DF] text-gray-500 font-bold">
                <tr>
                  <th className="p-3.5">খামারি / গ্রাহক</th>
                  <th className="p-3.5">মোবাইল ফোন</th>
                  <th className="p-3.5">ঠিকানা ও জেলা</th>
                  <th className="p-3.5">মোট ক্রয় (Orders)</th>
                  <th className="p-3.5">মোট টাকার পরিমাণ</th>
                  <th className="p-3.5 text-right">যোগাযোগ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      কোনো গ্রাহকের তথ্য পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => {
                    const customerOrders = orders.filter(
                      (o) => o.phone === cust.phone || o.customerName === cust.name
                    );
                    const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total || 0), 0);

                    return (
                      <tr key={cust.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3.5">
                          <p className="font-bold text-[#2E3333]">{cust.name}</p>
                          <p className="text-[10px] text-gray-400">
                            যোগদান: {cust.created_at ? new Date(cust.created_at).toLocaleDateString('bn-BD') : '—'}
                          </p>
                        </td>

                        <td className="p-3.5 font-mono font-semibold text-gray-700">
                          {cust.phone}
                        </td>

                        <td className="p-3.5">
                          <p className="font-medium text-[#2E3333]">
                            {cust.upazila ? `${cust.upazila}, ` : ''}{cust.district || 'বাংলাদেশ'}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate max-w-xs">{cust.address}</p>
                        </td>

                        <td className="p-3.5 font-bold text-gray-700">
                          <span className="inline-flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                            <span>{toBengaliNumber(customerOrders.length)} টি অর্ডার</span>
                          </span>
                        </td>

                        <td className="p-3.5 font-bold text-[#1B5E20]">
                          {formatBengaliPrice(totalSpent)}
                        </td>

                        <td className="p-3.5 text-right">
                          <a
                            href={`tel:${cust.phone}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E8F5E9] hover:bg-[#D7EED9] text-[#1B5E20] font-bold rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            <Phone className="w-3 h-3" />
                            <span>কল দিন</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
