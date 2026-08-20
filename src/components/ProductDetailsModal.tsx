import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatTaka, toBengaliNumber } from '../utils/bengali';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Package,
  ShieldCheck,
  Truck,
  RotateCcw,
  Scale
} from 'lucide-react';

export const ProductDetailsModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    buyNow,
    products
  } = useApp();

  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const isDiscounted =
    selectedProduct.regularPrice &&
    selectedProduct.regularPrice > selectedProduct.price;
  const discountPercent = isDiscounted
    ? Math.round(
        ((selectedProduct.regularPrice! - selectedProduct.price) /
          selectedProduct.regularPrice!) *
          100
      )
    : 0;

  const relatedProducts = products
    .filter(
      (p) =>
        p.categorySlug === selectedProduct.categorySlug &&
        p.id !== selectedProduct.id
    )
    .slice(0, 3);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      id="product-details-modal"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8E5DF] my-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-gray-100 text-[#2E3333] p-2 rounded-full shadow-md border border-[#E8E5DF] transition-transform active:scale-95 cursor-pointer"
          aria-label="Close"
          id="btn-close-product-modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Image & Highlights */}
          <div className="md:col-span-5 bg-[#FDFCF9] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E5DF]">
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-[#E8E5DF] bg-white shadow-inner aspect-square">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.nameBn}
                  className="w-full h-full object-cover"
                />
                {selectedProduct.badge && (
                  <span className="absolute top-3 left-3 bg-[#1B5E20] text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                    {selectedProduct.badge}
                  </span>
                )}
                {isDiscounted && (
                  <span className="absolute bottom-3 left-3 bg-[#F57C00] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-2xs">
                    {toBengaliNumber(discountPercent)}% সাশ্রয়
                  </span>
                )}
              </div>

              {/* Trust Badges */}
              <div className="space-y-2 text-xs text-gray-600 bg-white p-4 rounded-2xl border border-[#E8E5DF]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1B5E20] shrink-0" />
                  <span>১০০% খাঁটি ও গুণগত মান নিশ্চিতকৃত</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#1B5E20] shrink-0" />
                  <span>দ্রুত ডেলিভারি ও সহজে রিসিভ</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#1B5E20] shrink-0" />
                  <span>প্যাকেজিং সুরক্ষিত না থাকলে তাৎক্ষণিক রিটার্ন</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Full Details & Controls */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#1B5E20]/20">
                  একক: {selectedProduct.unit}
                </span>
                {selectedProduct.inStock ? (
                  <span className="text-xs text-[#1B5E20] font-semibold flex items-center gap-1 bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#1B5E20]" />
                    ইন স্টক (প্রস্তুত আছে)
                  </span>
                ) : (
                  <span className="text-xs text-red-600 font-semibold bg-red-50 px-2.5 py-0.5 rounded-full">
                    স্টক শেষ
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#2E3333] leading-tight">
                {selectedProduct.nameBn}
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {selectedProduct.nameEn}
              </p>
            </div>

            {/* Price section */}
            <div className="bg-[#FDFCF9] p-4 rounded-2xl border border-[#E8E5DF] flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-[#1B5E20]">
                {formatTaka(selectedProduct.price)}
              </span>
              {isDiscounted && (
                <span className="text-sm sm:text-base text-gray-400 line-through font-medium">
                  {formatTaka(selectedProduct.regularPrice)}
                </span>
              )}
              <span className="text-xs text-gray-500">
                (প্রতি {selectedProduct.unit})
              </span>
            </div>

            {/* Veterinary Medicine Alert if applicable */}
            {selectedProduct.isVetMedicine && (
              <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl flex items-start gap-2.5 text-amber-950 text-xs sm:text-sm">
                <AlertTriangle className="w-5 h-5 text-[#F57C00] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-950">সতর্কতামূলক নির্দেশনা:</p>
                  <p className="mt-0.5">ঔষধ ব্যবহারের ক্ষেত্রে নিবন্ধিত পশু চিকিৎসকের পরামর্শ অনুসরণ করুন।</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#2E3333]">পণ্যের বিবরণ:</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {selectedProduct.descriptionBn}
              </p>
            </div>

            {/* Combo items list if combo package */}
            {selectedProduct.isCombo && selectedProduct.comboItems && (
              <div className="bg-[#FFF3E0] border border-[#FFE0B2] p-4 rounded-2xl space-y-2.5">
                <h4 className="text-xs font-bold text-[#E65100] uppercase tracking-wide flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#F57C00]" />
                  এই প্যাকেজের অন্তর্ভুক্ত পণ্যসমূহ:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2E3333]">
                  {selectedProduct.comboItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#FFE0B2] shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1B5E20] shrink-0" />
                      <div>
                        <span className="font-semibold">{item.productName}</span>
                        <span className="text-[#F57C00] block text-[11px] font-medium">
                          পরিমাণ: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features & Benefits */}
            {selectedProduct.featuresBn && selectedProduct.featuresBn.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#2E3333]">উপকারিতা ও বিশেষ বৈশিষ্ট্য:</h4>
                <ul className="grid grid-cols-1 gap-1.5 text-xs sm:text-sm text-gray-600">
                  {selectedProduct.featuresBn.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Usage Information */}
            {selectedProduct.usageBn && (
              <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 p-3.5 rounded-2xl space-y-1 text-xs text-[#1B5E20]">
                <p className="font-bold flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  ব্যবহারবিধি ও প্রয়োগ মাত্রা:
                </p>
                <p className="leading-relaxed text-gray-700">{selectedProduct.usageBn}</p>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#E8E5DF]">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#2E3333]">পরিমাণ:</span>
                <div className="flex items-center border border-[#E8E5DF] rounded-xl overflow-hidden bg-white shadow-2xs">
                  <button
                    onClick={handleDecrement}
                    className="p-2 hover:bg-gray-100 text-gray-600 active:scale-95 transition-colors cursor-pointer"
                    id="btn-qty-minus"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-[#2E3333] min-w-10 text-center">
                    {toBengaliNumber(quantity)}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="p-2 hover:bg-gray-100 text-gray-600 active:scale-95 transition-colors cursor-pointer"
                    id="btn-qty-plus"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  মোট: {formatTaka(selectedProduct.price * quantity)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    addToCart(selectedProduct, quantity, true);
                    setSelectedProduct(null);
                  }}
                  disabled={!selectedProduct.inStock}
                  className="flex items-center justify-center gap-2 bg-[#FDFCF9] hover:bg-[#F1F8E9] text-[#1B5E20] border border-[#E8E5DF] font-bold py-3.5 px-4 rounded-2xl transition-all active:scale-98 cursor-pointer"
                  id="btn-modal-add-cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>কার্টে যোগ করুন</span>
                </button>

                <button
                  onClick={() => buyNow(selectedProduct, quantity)}
                  disabled={!selectedProduct.inStock}
                  className="flex items-center justify-center gap-2 bg-[#F57C00] hover:bg-[#E65100] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer"
                  id="btn-modal-buy-now"
                >
                  <Zap className="w-4 h-4 text-white" />
                  <span>এখনই অর্ডার করুন</span>
                </button>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="pt-6 border-t border-[#E8E5DF] space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  একই ক্যাটাগরির আরও পণ্য
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {relatedProducts.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => {
                        setSelectedProduct(rel);
                        setQuantity(1);
                      }}
                      className="p-2.5 bg-[#FDFCF9] hover:bg-[#E8F5E9] rounded-2xl border border-[#E8E5DF] text-left transition-colors cursor-pointer group"
                    >
                      <img
                        src={rel.image}
                        alt={rel.nameBn}
                        className="w-full h-16 object-cover rounded-xl mb-1.5 border border-[#E8E5DF]"
                      />
                      <p className="text-[11px] font-bold text-[#2E3333] line-clamp-1 group-hover:text-[#1B5E20]">
                        {rel.nameBn}
                      </p>
                      <p className="text-[11px] font-black text-[#1B5E20]">
                        {formatTaka(rel.price)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
