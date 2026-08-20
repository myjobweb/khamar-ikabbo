import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AbandonedOrder } from '../../types';
import { fetchAbandonedOrders, deleteAbandonedOrderFromStore, markAbandonedOrderConverted } from '../../services/store';
import { Phone, Calendar, Trash2, CheckCircle, Search, Eye, AlertCircle } from 'lucide-react';
import { formatTaka, toBengaliNumber } from '../../utils/bengali';

export const AdminAbandonedOrders: React.FC = () => {
  const [abandoned, setAbandoned] = useState<AbandonedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchAbandonedOrders();
    setAbandoned(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি এই অসম্পূর্ণ অর্ডারটি মুছে ফেলতে চান?')) {
      const success = await deleteAbandonedOrderFromStore(id);
      if (success) {
        setAbandoned(prev => prev.filter(o => o.id !== id));
      }
    }
  };

  const handleMarkConverted = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি সম্পন্ন হয়েছে?')) {
      const success = await markAbandonedOrderConverted(id, 'manual');
      if (success) {
        loadOrders();
      }
    }
  };

  const filtered = abandoned.filter(o => 
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.phone.includes(search)
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500">লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-xl font-bold text-[#2E3333]">অসম্পূর্ণ অর্ডার ({toBengaliNumber(abandoned.length)})</h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="নাম বা মোবাইল নাম্বার দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-[#E8E5DF] rounded-xl text-sm w-full sm:w-64"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E5DF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#FDFCF9] border-b border-[#E8E5DF] text-gray-600">
              <tr>
                <th className="p-4 font-semibold">তারিখ ও সময়</th>
                <th className="p-4 font-semibold">গ্রাহকের তথ্য</th>
                <th className="p-4 font-semibold">পণ্যের বিবরণ</th>
                <th className="p-4 font-semibold">মোট মূল্য</th>
                <th className="p-4 font-semibold">স্ট্যাটাস</th>
                <th className="p-4 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DF]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    কোনো অসম্পূর্ণ অর্ডার পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.updatedAt).toLocaleString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#2E3333]">{order.customerName || 'অজ্ঞাত'}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Phone className="w-3.5 h-3.5" />
                        {order.phone || 'দেওয়া হয়নি'}
                      </div>
                      {order.address && (
                        <div className="text-xs text-gray-400 truncate max-w-[200px] mt-1" title={order.address}>
                          {order.address}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-semibold">{item.productName}</span> x {toBengaliNumber(item.quantity)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#1B5E20]">
                      {formatTaka(order.total)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        order.status === 'converted' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status === 'converted' ? 'সম্পন্ন হয়েছে' : 'অসম্পূর্ণ'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {order.phone && (
                          <a href={`tel:${order.phone}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="কল করুন">
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        {order.status !== 'converted' && (
                          <button onClick={() => handleMarkConverted(order.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark as Converted">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(order.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="মুছে ফেলুন">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
