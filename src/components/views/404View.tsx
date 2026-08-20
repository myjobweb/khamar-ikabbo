import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, Home, ShoppingBag, ArrowLeft } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  const { setCurrentRoute } = useApp();

  return (
    <div className="py-16 sm:py-24 bg-[#FDFCF9] min-h-[75vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E5DF] p-8 sm:p-10 text-center space-y-6 shadow-sm">
        <div className="w-20 h-20 bg-amber-50 text-[#F57C00] rounded-3xl flex items-center justify-center mx-auto border border-amber-200">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#1B5E20]/20">
            ত্রুটি ৪০৪ (404 Error)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E3333]">
            দুঃখিত, পেজটি পাওয়া যায়নি।
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            আপনি যে পেজটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ঠিকানা ভুল রয়েছে। নিচের বোতামগুলো ব্যবহার করে সঠিক জায়গায় ফিরে যান।
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setCurrentRoute('home')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl transition-all shadow-sm cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </button>

          <button
            onClick={() => setCurrentRoute('feed')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#E8F5E9] text-[#1B5E20] border border-[#1B5E20]/30 text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>পণ্য দেখুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
