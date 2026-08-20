import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatTaka, toBengaliNumber } from '../utils/bengali';
import {
  ShoppingBag,
  Eye,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, buyNow } = useApp();

  const isDiscounted = product.regularPrice && product.regularPrice > product.price;
  const discountPercent = isDiscounted
    ? Math.round(((product.regularPrice! - product.price) / product.regularPrice!) * 100)
    : 0;

  return (
    <div
      className="group bg-white rounded-3xl border border-[#E8E5DF] hover:border-[#1B5E20] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative"
      id={`product-card-${product.id}`}
    >
      {/* Top Image Box */}
      <div
        className="relative h-48 sm:h-52 overflow-hidden bg-[#FDFCF9] cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        <img
          src={product.image}
          alt={product.nameBn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="inline-flex items-center gap-1 bg-[#1B5E20] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#F57C00]" />
              {product.badge}
            </span>
          )}
          {isDiscounted && (
            <span className="bg-[#F57C00] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
              {toBengaliNumber(discountPercent)}% ছাড়
            </span>
          )}
          {product.isCombo && (
            <span className="bg-[#7B1FA2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
              কম্বো অফার
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {product.stockCount > 10 && product.inStock ? (
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-[#1B5E20] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#E8F5E9] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20]" />
              স্টকে আছে
            </span>
          ) : product.stockCount > 0 && product.stockCount <= 10 && product.inStock ? (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F57C00]" />
              সীমিত স্টক
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
              স্টক শেষ
            </span>
          )}
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Unit pill */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span className="bg-[#FDFCF9] text-gray-700 px-2 py-0.5 rounded-md font-medium text-[11px] border border-[#E8E5DF]">
              একক: {product.unit}
            </span>
            {product.rating && (
              <span className="flex items-center gap-1 text-[#F57C00] font-bold text-[11px]">
                ★ {toBengaliNumber(product.rating)} <span className="text-gray-400 font-normal">({toBengaliNumber(product.reviewsCount)})</span>
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-base font-bold text-[#2E3333] group-hover:text-[#1B5E20] transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={product.nameBn}
          >
            {product.nameBn}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescBn}
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="space-y-3 pt-3 border-t border-[#E8E5DF]">
          {/* Price details */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black text-[#1B5E20]">
              {formatTaka(product.price)}
            </span>
            {isDiscounted && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {formatTaka(product.regularPrice)}
              </span>
            )}
            <span className="text-[11px] text-gray-500 font-normal">
              / {product.unit}
            </span>
          </div>

          {/* Action Buttons: "কার্টে যোগ করুন" and "এখনই অর্ডার করুন" */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1, false);
              }}
              disabled={!product.inStock}
              className={`flex items-center justify-center gap-1 text-xs font-bold py-2.5 px-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                product.inStock
                  ? 'bg-[#FDFCF9] hover:bg-[#E8F5E9] text-[#1B5E20] border-[#1B5E20]/30 hover:border-[#1B5E20]'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
              id={`btn-add-cart-${product.id}`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#1B5E20]" />
              <span>কার্টে যোগ করুন</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                buyNow(product, 1);
              }}
              disabled={!product.inStock}
              className={`flex items-center justify-center gap-1 text-xs font-bold py-2.5 px-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
                product.inStock
                  ? 'bg-[#F57C00] hover:bg-[#E65100] text-white shadow-xs'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              id={`btn-buy-${product.id}`}
            >
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>এখনই অর্ডার করুন</span>
            </button>
          </div>

          {/* Quick Details View Link */}
          <button
            onClick={() => setSelectedProduct(product)}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-[#1B5E20] py-1 rounded-lg transition-colors cursor-pointer"
            id={`btn-details-${product.id}`}
          >
            <Eye className="w-3 h-3" />
            <span>বিস্তারিত বিবরণ দেখুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
