import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BANGLADESH_DISTRICTS } from '../../data/seedData';
import { formatTaka, toBengaliNumber } from '../../utils/bengali';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  PhoneCall,
  MapPin,
  User,
  Building2,
  AlertCircle,
  ArrowLeft,
  FileText,
  CreditCard,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveAbandonedOrderToStore, markAbandonedOrderConverted } from '../../services/store';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartCount,
    cartTotal,
    siteSettings,
    placeOrder,
    setCurrentRoute,
    validateAndSyncCart,
    showToast
  } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [priceChangeNotice, setPriceChangeNotice] = useState<string | null>(null);

  // Initial validation when checkout starts
  useEffect(() => {
    let isMounted = true;
    const runCheck = async () => {
      if (cart.length === 0) return;
      setIsValidating(true);
      const res = await validateAndSyncCart();
      if (isMounted) {
        if (res.priceChanged) {
          setPriceChangeNotice('আপনার কার্টের একটি পণ্যের মূল্য পরিবর্তিত হয়েছে। অনুগ্রহ করে অর্ডারটি আবার যাচাই করুন।');
        }
        setIsValidating(false);
      }
    };
    runCheck();
    return () => {
      isMounted = false;
    };
  }, []);

  // Delivery charge calculation
  const isFreeDelivery = cartTotal >= siteSettings.freeDeliveryThreshold;
  const deliveryCharge = isFreeDelivery ? 0 : siteSettings.deliveryChargeDhaka;
  const grandTotal = cartTotal + deliveryCharge;

  // Bangladeshi Mobile Number Validator (e.g., 013, 014, 015, 016, 017, 018, 019)
  const isValidBdPhone = (phoneNum: string): boolean => {
    const clean = phoneNum.replace(/[\s-]/g, '');
    const bdRegex = /^(?:\+?88|88)?(01[3-9]\d{8})$/;
    return bdRegex.test(clean);
  };

  const [abandonedOrderId] = useState(() => `abnd-${Date.now()}-${Math.floor(Math.random()*1000)}`);
  
  useEffect(() => {
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
  }, [name, phone, address, cart, cartTotal, grandTotal, abandonedOrderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

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
      setErrorMsg('সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678 বা 019XXXXXXXX)।');
      return;
    }

    if (!address.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার সম্পূর্ণ ঠিকানা লিখুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Recalculate and validate against live database before final order submission
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

      // 2. Prepare Order items snapshot
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.nameBn,
        unit: item.product.unit,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        subtotal: item.product.price * item.quantity
      }));

      // 3. Create Order
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

      // 4. Mark Abandoned Order as Converted
      await markAbandonedOrderConverted(abandonedOrderId, savedOrder.id);

      try {
        confetti({
          particleCount: 90,
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

  if (cart.length === 0) {
    return (
      <div className="py-12 sm:py-16 bg-[#FDFCF9] min-h-[65vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-[#E8F5E9] text-[#1B5E20] rounded-3xl mx-auto flex items-center justify-center shadow-xs border border-[#1B5E20]/20">
            <ShoppingBag className="w-10 h-10 text-[#1B5E20]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#2E3333]">
              আপনার কার্ট এখনো খালি।
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              অর্ডার সম্পন্ন করার জন্য প্রথমে প্রয়োজনীয় পণ্য কার্টে যোগ করুন।
            </p>
          </div>

          <button
            onClick={() => setCurrentRoute('feed')}
            className="inline-flex items-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer text-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#F57C00]" />
            <span>পণ্য দেখুন</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 bg-[#FDFCF9] min-h-[75vh]" id="checkout-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E5DF]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2E3333]">
              অর্ডার সম্পন্ন করুন
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              খামারের ঠিকানা দিয়ে খুব সহজেই ক্যাশ অন ডেলিভারিতে অর্ডার নিশ্চিত করুন
            </p>
          </div>

          <button
            onClick={() => setCurrentRoute('home')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1B5E20] hover:text-[#124116] bg-white hover:bg-gray-50 px-4 py-2.5 rounded-xl border border-[#E8E5DF] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>পণ্য তালিকায় ফিরে যান</span>
          </button>
        </div>

        {/* Price Change / Live sync Notification */}
        {priceChangeNotice && (
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-center gap-3 text-amber-950 text-xs sm:text-sm shadow-xs">
            <AlertCircle className="w-5 h-5 text-[#F57C00] shrink-0" />
            <span>{priceChangeNotice}</span>
          </div>
        )}

        {/* Main Grid: Checkout Form (Left) + Order Summary (Right) */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Customer Details Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Information */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E8E5DF] shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E8E5DF]">
                <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center font-black text-sm">
                  ১
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#2E3333]">
                  গ্রাহক ও খামারির তথ্য
                </h2>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 font-semibold">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#2E3333] mb-1.5">
                    নাম <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs sm:text-sm outline-none transition-colors"
                      id="input-customer-name"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Mobile Number with Bangladeshi verification */}
                <div>
                  <label className="block text-xs font-bold text-[#2E3333] mb-1.5">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX বা 019XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs sm:text-sm outline-none transition-colors font-mono"
                      id="input-customer-phone"
                    />
                    <PhoneCall className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    অর্ডার কনফার্মেশনের জন্য এই নম্বরে কল করা হবে।
                  </p>
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-xs font-bold text-[#2E3333] mb-1.5">
                    সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={3}
                      placeholder="গ্রাম/রোড নং, পোস্ট অফিস, ইউনিয়ন/এলাকা ও স্পষ্ট ল্যান্ডমার্ক"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl text-xs sm:text-sm outline-none resize-none"
                      id="input-address"
                    />
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Selection */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E8E5DF] shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E8E5DF]">
                <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center font-black text-sm">
                  ২
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#2E3333]">
                  মূল্য পরিশোধের পদ্ধতি
                </h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#1B5E20] bg-[#E8F5E9]/50 shadow-2xs'
                      : 'border-[#E8E5DF] bg-[#FDFCF9]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-[#1B5E20] focus:ring-[#1B5E20]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#2E3333]">
                      <span>ক্যাশ অন ডেলিভারি (Cash on Delivery)</span>
                      <span className="bg-[#1B5E20] text-white text-[10px] px-2 py-0.2 rounded-full font-semibold">
                        জনপ্রিয়
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      পণ্য হাতে পেয়ে যাচাই-বাছাই করে ডেলিভারিম্যানের কাছে সম্পূর্ণ টাকা পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary ("আপনার অর্ডার") */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-3xl border border-[#E8E5DF] p-5 sm:p-7 shadow-xs space-y-5 sticky top-24">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF]">
                <h2 className="text-base sm:text-lg font-black text-[#2E3333] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#1B5E20]" />
                  <span>আপনার অর্ডার</span>
                </h2>
                <span className="text-xs font-bold bg-[#FDFCF9] text-gray-600 px-2.5 py-1 rounded-full border border-[#E8E5DF]">
                  {toBengaliNumber(cartCount)} টি আইটেম
                </span>
              </div>

              {/* Itemized list */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-[#E8E5DF]">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.nameBn}
                      className="w-12 h-12 object-cover rounded-xl border border-[#E8E5DF] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#2E3333] truncate">
                        {item.product.nameBn}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {toBengaliNumber(item.quantity)} × {formatTaka(item.product.price)} / {item.product.unit}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#1B5E20] shrink-0">
                      {formatTaka(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-[#E8E5DF] text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>পণ্যের মোট:</span>
                  <span className="font-bold text-[#2E3333]">
                    {formatTaka(cartTotal)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-bold text-[#1B5E20]">
                    {isFreeDelivery ? 'ফ্রি (০ ৳)' : formatTaka(deliveryCharge)}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E8E5DF] flex justify-between items-baseline">
                  <span className="text-base font-black text-[#2E3333]">সর্বমোট:</span>
                  <span className="text-2xl font-black text-[#1B5E20]">
                    {formatTaka(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isValidating}
                className="w-full flex items-center justify-center gap-2 bg-[#F57C00] hover:bg-[#E65100] text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer text-sm sm:text-base disabled:opacity-50"
                id="btn-confirm-order"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {isSubmitting
                    ? 'অর্ডার প্রক্রিয়াধীন...'
                    : isValidating
                    ? 'যাচাই করা হচ্ছে...'
                    : 'অর্ডার নিশ্চিত করুন'}
                </span>
              </button>

              {/* Safety Badges */}
              <div className="p-3 bg-[#FDFCF9] rounded-2xl border border-[#E8E5DF] space-y-1.5 text-[11px] text-gray-500">
                <div className="flex items-center gap-2 text-[#1B5E20] font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>১০০% নিরাপদ ও নির্ভরযোগ্য ক্যাশ অন ডেলিভারি</span>
                </div>
                <p className="text-gray-400 pl-6 leading-relaxed">
                  পণ্য ডেলিভারি পাওয়ার পর সম্পূর্ণ মূল্য পরিশোধ করার সুযোগ রয়েছে।
                </p>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
