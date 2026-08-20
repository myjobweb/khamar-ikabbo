import React from 'react';
import { useApp } from '../context/AppContext';
import { formatTaka, toBengaliNumber } from '../utils/bengali';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    setIsCheckoutOpen,
    setCurrentRoute,
    siteSettings
  } = useApp();

  if (!isCartOpen) return null;

  const freeDeliveryDiff = siteSettings.freeDeliveryThreshold - cartTotal;
  const isFreeDelivery = freeDeliveryDiff <= 0;
  const progressPercent = Math.min(
    100,
    Math.round((cartTotal / siteSettings.freeDeliveryThreshold) * 100)
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      id="cart-drawer-overlay"
    >
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#E8E5DF] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E5DF] flex items-center justify-between bg-[#FDFCF9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1B5E20] text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5 text-[#F57C00]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2E3333]">
                আপনার শপিং ব্যাগ
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {toBengaliNumber(cartCount)}টি পণ্য যোগ করা হয়েছে
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-[#2E3333] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close Cart"
            id="btn-close-cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        <div className="bg-[#E8F5E9] px-4 py-3 border-b border-[#1B5E20]/20 text-xs">
          <div className="flex items-center justify-between text-[#1B5E20] font-medium mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#1B5E20]" />
              {isFreeDelivery
                ? '🎉 আপনি বিনামূল্যে ডেলিভারির জন্য যোগ্য!'
                : `আর ${formatTaka(freeDeliveryDiff)} টাকার পণ্য নিলে ফ্রি ডেলিভারি!`}
            </span>
            <span className="font-bold">{toBengaliNumber(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B5E20] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#E8E5DF]">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="py-4 first:pt-0 last:pb-0 flex items-start gap-3.5"
              >
                <img
                  src={item.product.image}
                  alt={item.product.nameBn}
                  className="w-18 h-18 object-cover rounded-2xl border border-[#E8E5DF] bg-[#FDFCF9] shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-[#2E3333] line-clamp-2 leading-snug">
                      {item.product.nameBn}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer shrink-0"
                      title="সরিয়ে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-0.5">
                    একক: {item.product.unit}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#E8E5DF] rounded-xl overflow-hidden bg-[#FDFCF9]">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity - 1)
                        }
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 active:scale-95 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-[#2E3333] min-w-7 text-center">
                        {toBengaliNumber(item.quantity)}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity + 1)
                        }
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 active:scale-95 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <span className="text-sm font-bold text-[#1B5E20]">
                      {formatTaka(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FDFCF9] border border-[#E8E5DF] flex items-center justify-center text-gray-400">
                <ShoppingBag className="w-8 h-8 text-[#F57C00]" />
              </div>
              <div>
                <p className="text-base font-bold text-[#2E3333]">
                  আপনার কার্ট বর্তমানে খালি
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  খামারের প্রয়োজনীয় ফিড, খৈল, ভুট্টা বা সাপ্লিমেন্ট বেছে নিয়ে কার্টে যোগ করুন।
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentRoute('feed');
                }}
                className="bg-[#1B5E20] hover:bg-[#124116] text-white font-bold text-xs px-6 py-3 rounded-2xl transition-colors cursor-pointer shadow-md"
              >
                পণ্য ব্রাউজ করুন
              </button>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E8E5DF] bg-[#FDFCF9] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>পণ্য উপ-মোট (Subtotal):</span>
                <span className="font-bold text-[#2E3333]">
                  {formatTaka(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="text-[#1B5E20] font-bold">
                  {isFreeDelivery ? 'ফ্রি (০ ৳)' : 'পরের ধাপে নির্ধারিত হবে'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#2E3333] pt-2 border-t border-[#E8E5DF]">
                <span>সর্বমোট আনুমানিক:</span>
                <span className="text-[#1B5E20] text-base">
                  {formatTaka(cartTotal)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentRoute('cart');
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-gray-100 text-[#1B5E20] border border-[#1B5E20]/30 font-bold py-3 px-3 rounded-2xl transition-all active:scale-98 cursor-pointer text-xs"
                id="btn-drawer-view-cart-page"
              >
                <ShoppingBag className="w-4 h-4 text-[#1B5E20]" />
                <span>কার্ট পেজ দেখুন</span>
              </button>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentRoute('checkout');
                  setIsCheckoutOpen(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-[#F57C00] hover:bg-[#E65100] text-white font-bold py-3 px-3 rounded-2xl shadow-md transition-all active:scale-98 cursor-pointer text-xs"
                id="btn-cart-checkout"
              >
                <span>চেকআউট করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1B5E20]" />
              ক্যাশ অন ডেলিভারিতে পণ্য বুঝে পেয়ে মূল্য পরিশোধের সুবিধা
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
