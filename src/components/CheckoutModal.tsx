import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BANGLADESH_DISTRICTS } from '../data/seedData';
import { formatTaka, toBengaliNumber } from '../utils/bengali';
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  PhoneCall,
  MapPin,
  User,
  ShoppingBag,
  Building2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveAbandonedOrderToStore, markAbandonedOrderConverted } from '../services/store';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    siteSettings,
    placeOrder,
    validateAndSyncCart
  } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate delivery charge
  const isFreeDelivery = cartTotal >= siteSettings.freeDeliveryThreshold;
  const deliveryCharge = isFreeDelivery ? 0 : siteSettings.deliveryChargeDhaka;
  const grandTotal = cartTotal + deliveryCharge;

  const isValidBdPhone = (phoneNum: string): boolean => {
    const clean = phoneNum.replace(/[\s-]/g, '');
    const bdRegex = /^(?:\+?88|88)?(01[3-9]\d{8})$/;
    return bdRegex.test(clean);
  };

  const [abandonedOrderId] = useState(() => `abnd-${Date.now()}-${Math.floor(Math.random()*1000)}`);
  
  useEffect(() => {
    if (!isCheckoutOpen) return;
    
    const handler = setTimeout(() => {
      if ((name || phone || address) && cart.length > 0) {
        saveAbandonedOrderToStore({
          id: abandonedOrderId,
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          items: cart.map(item => ({
            productId: item.product.id,
            productName: item.product.nameBn,
            unit: item.product.unit,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
            subtotal: item.product.price * item.quantity
          })),
          subtotal: cartTotal,
          total: grandTotal,
          status: 'abandoned',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }, 1500); // 1.5 seconds debounce

    return () => clearTimeout(handler);
  }, [name, phone, address, cart, cartTotal, grandTotal, abandonedOrderId, isCheckoutOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isCheckoutOpen) return;

    if (cart.length === 0) {
      setErrorMsg('আপনার কার্ট খালি, কোনো পণ্য নির্বাচন করা হয়নি।');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার সম্পূর্ণ নাম লিখুন।');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    if (!isValidBdPhone(phone)) {
      setErrorMsg('সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX বা 019XXXXXXXX)।');
      return;
    }

    if (!address.trim()) {
      setErrorMsg('অনুগ্রহ করে সম্পূর্ণ ঠিকানা লিখুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      // Re-validate against latest database prices & stock before submission
      const validation = await validateAndSyncCart();
      if (!validation.isValid) {
        setErrorMsg('দুঃখিত, কার্টের কিছু পণ্য বর্তমানে স্টকে নেই বা অনুপলব্ধ।');
        setIsSubmitting(false);
        return;
      }

      if (validation.priceChanged) {
        setErrorMsg('আপনার কার্টের একটি পণ্যের মূল্য পরিবর্তিত হয়েছে। অনুগ্রহ করে অর্ডারটি আবার যাচাই করুন।');
        setIsSubmitting(false);
        return;
      }

      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.nameBn,
        unit: item.product.unit,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        subtotal: item.product.price * item.quantity
      }));

      const savedOrder = await placeOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        division: 'বাংলাদেশ',
        district: 'বাংলাদেশ',
        upazila: '',
        address: address.trim(),
        notes: '',
        paymentMethod,
        items: orderItems,
        subtotal: cartTotal,
        deliveryCharge,
        total: grandTotal,
        status: 'pending'
      });

      // Mark Abandoned Order as Converted
      await markAbandonedOrderConverted(abandonedOrderId, savedOrder.id);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      id="checkout-modal"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8E5DF] my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#1B5E20] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-[#F57C00]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">সহজ অর্ডার ফর্ম</h3>
              <p className="text-xs text-[#E8F5E9]">
                খামারের ঠিকানা দিয়ে দ্রুত ক্যাশ অন ডেলিভারিতে অর্ডার কনফার্ম করুন
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          
          {/* Left Column: Customer & Delivery Info Form */}
          <div className="lg:col-span-7 p-5 sm:p-7 space-y-4 border-b lg:border-b-0 lg:border-r border-[#E8E5DF]">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E5DF] text-[#2E3333] font-bold text-sm">
              <User className="w-4 h-4 text-[#1B5E20]" />
              <span>আপনার ঠিকানা ও খামারের তথ্য</span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-[#2E3333] mb-1">
                আপনার পুরো নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: মো: রফিকুল ইসলাম"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 text-sm bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                id="input-checkout-name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-[#2E3333] mb-1">
                মোবাইল নম্বর <span className="text-red-500">*</span> (১১ ডিজিট)
              </label>
              <input
                type="tel"
                required
                placeholder="যেমন: 01712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 text-sm bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                id="input-checkout-phone"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                অর্ডার নিশ্চিত করার জন্য আমাদের প্রতিনিধি এই নম্বরে কল করবেন।
              </p>
            </div>

            {/* Detailed Address */}
            <div>
              <label className="block text-xs font-bold text-[#2E3333] mb-1">
                সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="গ্রাম/রোড নং, পোস্ট অফিস, ইউনিয়ন/এলাকা ও স্পষ্ট ল্যান্ডমার্ক"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 text-sm bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none resize-none"
                id="textarea-checkout-address"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-[#2E3333]">
                পেমেন্ট পদ্ধতি:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-center cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#1B5E20] bg-[#E8F5E9] text-[#1B5E20] font-bold shadow-2xs'
                      : 'border-[#E8E5DF] bg-[#FDFCF9] text-gray-700'
                  }`}
                >
                  <p className="font-bold">ক্যাশ অন ডেলিভারি</p>
                  <p className="text-[10px] text-gray-500">পণ্য বুঝে পেয়ে টাকা দিন</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-3 rounded-2xl border text-center cursor-pointer transition-colors ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-50 text-pink-950 font-bold shadow-2xs'
                      : 'border-[#E8E5DF] bg-[#FDFCF9] text-gray-700'
                  }`}
                >
                  <p className="font-bold text-pink-700">বিকাশ (bKash)</p>
                  <p className="text-[10px] text-gray-500">মার্চেন্ট / পার্সোনাল</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-3 rounded-2xl border text-center cursor-pointer transition-colors ${
                    paymentMethod === 'nagad'
                      ? 'border-[#F57C00] bg-[#FFF3E0] text-[#E65100] font-bold shadow-2xs'
                      : 'border-[#E8E5DF] bg-[#FDFCF9] text-gray-700'
                  }`}
                >
                  <p className="font-bold text-[#F57C00]">নগদ (Nagad)</p>
                  <p className="text-[10px] text-gray-500">দ্রুত পেমেন্ট</p>
                </button>
              </div>
            </div>


          </div>

          {/* Right Column: Order Summary & Confirm Action */}
          <div className="lg:col-span-5 bg-[#FDFCF9] p-5 sm:p-7 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-sm font-bold text-[#2E3333] pb-2 border-b border-[#E8E5DF] flex items-center justify-between">
                <span>অর্ডার সামারি</span>
                <span className="text-xs text-[#1B5E20] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full font-bold">
                  {toBengaliNumber(cart.length)}টি আইটেম
                </span>
              </h4>

              {/* Itemized List */}
              <div className="divide-y divide-[#E8E5DF] my-3 max-h-44 overflow-y-auto pr-1 text-xs">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={item.product.image}
                        alt={item.product.nameBn}
                        className="w-9 h-9 object-cover rounded-xl border border-[#E8E5DF]"
                      />
                      <div className="truncate">
                        <p className="font-semibold text-[#2E3333] truncate">
                          {item.product.nameBn}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {toBengaliNumber(item.quantity)} x {formatTaka(item.product.price)} ({item.product.unit})
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[#2E3333] shrink-0">
                      {formatTaka(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E5DF] space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>পণ্যের মূল্য (Subtotal):</span>
                  <span className="font-bold text-[#2E3333]">{formatTaka(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className={deliveryCharge === 0 ? 'text-[#1B5E20] font-bold' : 'font-bold text-[#2E3333]'}>
                    {deliveryCharge === 0 ? 'বিনামূল্যে (০ ৳)' : formatTaka(deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#2E3333] pt-2 border-t border-[#E8E5DF]">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span className="text-[#1B5E20] text-lg font-black">{formatTaka(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2.5">
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#F57C00] hover:bg-[#E65100] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-50 text-base"
                id="btn-confirm-order"
              >
                {isSubmitting ? (
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>অর্ডার নিশ্চিত করুন</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                অর্ডার নিশ্চিত করার পর কোনো অগ্রিম টাকা লাগবে না। ডেলিভারির সময় পণ্য যাচাই করে মূল্য পরিশোধ করুন।
              </p>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
};
