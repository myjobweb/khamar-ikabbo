import React from 'react';
import { useApp } from '../context/AppContext';
import { formatTaka, toBengaliNumber } from '../utils/bengali';
import { Gift, ShoppingBag, Eye, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

export const CombinationSection: React.FC = () => {
  const { products, siteSettings, setSelectedProduct, buyNow, setCurrentRoute } = useApp();

  if (siteSettings.sectionVisibility?.combination === false) {
    return null;
  }

  // Find combo products
  const comboProducts = products.filter(
    (p) => p.isCombo || p.categorySlug === 'combinations' || (p.comboItems && p.comboItems.length > 0)
  ).slice(0, 4);

  if (comboProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-[#FDFCF9] to-[#F4F1EA] border-y border-[#E8E5DF]" id="combination-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold mb-2">
              <Gift className="w-4 h-4 text-[#F57C00]" />
              <span>বিশেষ সাশ্রয়ী প্যাকেজ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2E3333]">
              খামারি কাব্য কম্বিনেশন
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              আপনার খামারের প্রয়োজন অনুযায়ী প্রয়োজনীয় পণ্য একসাথে বেছে নিন।
            </p>
          </div>

          <button
            onClick={() => setCurrentRoute('combinations')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1B5E20] hover:text-[#124116] bg-white px-4 py-2.5 rounded-xl border border-[#E8E5DF] shadow-2xs hover:shadow-xs transition-all cursor-pointer self-start md:self-auto"
          >
            <span>সবগুলো কম্বো দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comboProducts.map((combo) => {
            const isDiscounted = combo.regularPrice && combo.regularPrice > combo.price;
            const discountAmount = isDiscounted ? combo.regularPrice! - combo.price : 0;
            const discountPercent = isDiscounted
              ? Math.round((discountAmount / combo.regularPrice!) * 100)
              : 0;

            return (
              <div
                key={combo.id}
                className="bg-white rounded-3xl border border-[#E8E5DF] hover:border-[#1B5E20] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Image & Badge */}
                  <div
                    onClick={() => setSelectedProduct(combo)}
                    className="relative h-48 sm:h-56 overflow-hidden bg-[#FDFCF9] cursor-pointer"
                  >
                    <img
                      src={combo.image}
                      alt={combo.nameBn}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      <span className="bg-[#7B1FA2] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                        🎁 স্পেশাল কম্বো
                      </span>
                      {isDiscounted && (
                        <span className="bg-[#F57C00] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                          {toBengaliNumber(discountPercent)}% ছাড় ({formatTaka(discountAmount)} সাশ্রয়)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Combo Details */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h3
                        onClick={() => setSelectedProduct(combo)}
                        className="text-lg font-bold text-[#2E3333] hover:text-[#1B5E20] cursor-pointer transition-colors leading-snug"
                      >
                        {combo.nameBn}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {combo.shortDescBn}
                      </p>
                    </div>

                    {/* Included Items List */}
                    {combo.comboItems && combo.comboItems.length > 0 && (
                      <div className="bg-[#FDFCF9] p-3.5 rounded-2xl border border-[#E8E5DF] space-y-2">
                        <p className="text-[11px] font-bold text-[#1B5E20] uppercase tracking-wider">
                          প্যাকেজের অন্তর্ভুক্ত উপাদানসমূহ:
                        </p>
                        <ul className="space-y-1.5 text-xs text-gray-700">
                          {combo.comboItems.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1B5E20] shrink-0 mt-0.5" />
                              <span className="font-medium">{item.productName} — <span className="font-bold text-[#2E3333]">{item.quantity}</span></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Price Section */}
                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#1B5E20]">
                        {formatTaka(combo.price)}
                      </span>
                      {isDiscounted && (
                        <span className="text-sm font-semibold text-gray-400 line-through">
                          {formatTaka(combo.regularPrice!)}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 font-medium ml-auto">
                        /{combo.unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedProduct(combo)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-[#2E3333] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span>বিস্তারিত</span>
                  </button>

                  <button
                    onClick={() => buyNow(combo, 1)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#F57C00] hover:bg-[#E65100] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    <Zap className="w-4 h-4 text-white fill-white" />
                    <span>অর্ডার করুন</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
