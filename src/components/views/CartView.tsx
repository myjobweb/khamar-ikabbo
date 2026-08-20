import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTaka, toBengaliNumber } from '../../utils/bengali';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Package,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    cartCount,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    setCurrentRoute,
    siteSettings,
    validateAndSyncCart
  } = useApp();

  const [isValidating, setIsValidating] = useState(false);
  const [validationNote, setValidationNote] = useState<string | null>(null);

  // Validate cart against live database on initial load of cart page
  useEffect(() => {
    let isMounted = true;
    const runValidation = async () => {
      if (cart.length === 0) return;
      setIsValidating(true);
      const res = await validateAndSyncCart();
      if (isMounted && res.priceChanged) {
        setValidationNote('আপনার কার্টের পণ্যের মূল্য ডাটাবেজ অনুযায়ী সর্বশেষ মূল্যে আপডেট করা হয়েছে।');
      }
      if (isMounted) setIsValidating(false);
    };
    runValidation();
    return () => {
      isMounted = false;
    };
  }, []);

  const freeDeliveryDiff = siteSettings.freeDeliveryThreshold - cartTotal;
  const isFreeDelivery = freeDeliveryDiff <= 0;
  const progressPercent = Math.min(
    100,
    Math.round((cartTotal / siteSettings.freeDeliveryThreshold) * 100)
  );

  // Estimated delivery charge for summary
  const estimatedDeliveryCharge = isFreeDelivery ? 0 : siteSettings.deliveryChargeDhaka;
  const grandTotal = cartTotal + estimatedDeliveryCharge;

  const handleProceedToCheckout = async () => {
    setIsValidating(true);
    const res = await validateAndSyncCart();
    setIsValidating(false);

    if (!res.isValid) {
      return;
    }

    setCurrentRoute('checkout');
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
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              আপনার খামারের জন্য প্রয়োজনীয় উন্নত মানের রেডিমেড ফিড, খৈল, ভুট্টা ভাঙ্গা বা সাপ্লিমেন্ট বেছে নিন।
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCurrentRoute('feed')}
              className="inline-flex items-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer text-sm"
              id="btn-empty-cart-browse"
            >
              <Package className="w-4 h-4 text-[#F57C00]" />
              <span>পণ্য দেখুন</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 bg-[#FDFCF9] min-h-[75vh]" id="cart-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumb / Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E5DF]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2E3333] flex items-center gap-3">
              <span>শপিং কার্ট</span>
              <span className="text-xs font-bold bg-[#E8F5E9] text-[#1B5E20] px-3 py-1 rounded-full border border-[#1B5E20]/20">
                {toBengaliNumber(cartCount)} টি পণ্য
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              নির্বাচিত পণ্যগুলোর পরিমাণ যাচাই করে অর্ডারে এগিয়ে যান
            </p>
          </div>

          <button
            onClick={() => setCurrentRoute('feed')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1B5E20] hover:text-[#124116] bg-white hover:bg-gray-50 px-4 py-2.5 rounded-xl border border-[#E8E5DF] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>আরও পণ্য দেখুন</span>
          </button>
        </div>

        {/* Price Alert / Notice if synced */}
        {validationNote && (
          <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl flex items-center gap-3 text-amber-950 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-[#F57C00] shrink-0" />
            <span>{validationNote}</span>
          </div>
        )}

        {/* Free Delivery Threshold Banner */}
        <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 p-4 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#1B5E20] font-bold mb-2">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1B5E20]" />
              <span>
                {isFreeDelivery
                  ? '🎉 অভিনন্দন! আপনি বিনামূল্যে ডেলিভারির জন্য যোগ্য।'
                  : `আর মাত্র ${formatTaka(freeDeliveryDiff)} টাকার পণ্য কিনলে ফ্রি ডেলিভারি পাবেন!`}
              </span>
            </div>
            <span className="text-xs font-black">{toBengaliNumber(progressPercent)}% অর্জিত</span>
          </div>
          <div className="w-full h-2.5 bg-emerald-200/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B5E20] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Grid: Cart Items List + Order Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Product Items */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-[#E8E5DF] shadow-xs overflow-hidden divide-y divide-[#E8E5DF]">
              {cart.map((item) => {
                const itemSubtotal = item.product.price * item.quantity;
                return (
                  <div
                    key={item.product.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors hover:bg-gray-50/50"
                    id={`cart-item-${item.product.id}`}
                  >
                    {/* Product Image */}
                    <img
                      src={item.product.image}
                      alt={item.product.nameBn}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-[#E8E5DF] bg-[#FDFCF9] shrink-0"
                    />

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-[#2E3333] leading-snug">
                          {item.product.nameBn}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="sm:hidden text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-gray-500">
                        একক: <span className="font-semibold text-gray-700">{item.product.unit}</span>
                      </p>

                      <p className="text-xs text-gray-500">
                        একক মূল্য: <span className="font-bold text-[#1B5E20]">{formatTaka(item.product.price)}</span>
                      </p>
                    </div>

                    {/* Quantity Controls & Line Total */}
                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E5DF]">
                      {/* Quantity Controller: − quantity + */}
                      <div className="flex items-center border border-[#E8E5DF] rounded-xl overflow-hidden bg-[#FDFCF9] shadow-2xs">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 active:scale-95 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 text-xs sm:text-sm font-bold text-[#2E3333] min-w-8 text-center">
                          {toBengaliNumber(item.quantity)}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 active:scale-95 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-24">
                        <p className="text-[11px] text-gray-400 font-medium">সাবটোটাল</p>
                        <p className="text-base font-black text-[#1B5E20]">
                          {formatTaka(itemSubtotal)}
                        </p>
                      </div>

                      {/* Desktop Delete button: "মুছে ফেলুন" */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="hidden sm:flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                        <span className="hidden xl:inline">মুছে ফেলুন</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bottom shopping navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentRoute('feed')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1B5E20] hover:text-[#124116] py-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>আরও পণ্য দেখুন</span>
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-5 sticky top-24">
              <h2 className="text-lg font-black text-[#2E3333] pb-3 border-b border-[#E8E5DF]">
                অর্ডার সারসংক্ষেপ
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>পণ্যের মোট (Subtotal):</span>
                  <span className="font-bold text-[#2E3333]">
                    {formatTaka(cartTotal)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-bold text-[#1B5E20]">
                    {isFreeDelivery ? 'ফ্রি (০ ৳)' : `${formatTaka(estimatedDeliveryCharge)} (ঢাকা)`}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E8E5DF] flex justify-between items-baseline">
                  <span className="text-base font-black text-[#2E3333]">সর্বমোট:</span>
                  <span className="text-xl sm:text-2xl font-black text-[#1B5E20]">
                    {formatTaka(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA button: "অর্ডার করতে এগিয়ে যান" */}
              <button
                onClick={handleProceedToCheckout}
                disabled={isValidating}
                className="w-full flex items-center justify-center gap-2 bg-[#F57C00] hover:bg-[#E65100] text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer text-sm sm:text-base disabled:opacity-50"
                id="btn-proceed-checkout"
              >
                <span>{isValidating ? 'যাচাই করা হচ্ছে...' : 'অর্ডার করতে এগিয়ে যান'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Trust & Guarantee Info */}
              <div className="space-y-2 pt-2 text-[11px] text-gray-500 border-t border-[#E8E5DF]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1B5E20] shrink-0" />
                  <span>ক্যাশ অন ডেলিভারি সুবিধা রয়েছে</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#1B5E20] shrink-0" />
                  <span>সারা বাংলাদেশে খামারের ঠিকানায় দ্রুত ডেলিভারি</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E20] shrink-0" />
                  <span>১০০% খাঁটি গুণগত মান ও ওজনের নিশ্চয়তা</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
