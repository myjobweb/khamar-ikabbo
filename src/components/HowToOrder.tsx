import React from 'react';
import {
  Search,
  ShoppingBag,
  FileCheck,
  Truck,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HowToOrder: React.FC = () => {
  const { setCurrentRoute, siteSettings } = useApp();

  if (siteSettings.sectionVisibility?.howToOrder === false) {
    return null;
  }

  const steps = [
    {
      numberBn: '১',
      titleBn: 'পণ্য নির্বাচন করুন',
      descBn: 'খামারের প্রয়োজনীয় রেডিমেড ফিড, কাঁচামাল, সাপ্লিমেন্ট বা সাশ্রয়ী কম্বো প্যাকেজ বেছে নিন।',
      icon: Search
    },
    {
      numberBn: '২',
      titleBn: 'সরাসরি অর্ডার করুন',
      descBn: 'অর্ডার করুন বাটনে ক্লিক করে প্রয়োজনীয় পরিমাণ (কেজি বা বস্তা) নির্ধারণ করুন।',
      icon: ShoppingBag
    },
    {
      numberBn: '৩',
      titleBn: 'অর্ডার ফর্ম পূরণ করুন',
      descBn: 'আপনার নাম, মোবাইল নম্বর এবং খামারের সঠিক ঠিকানা উল্লেখ করে সাবমিট করুন।',
      icon: FileCheck
    },
    {
      numberBn: '৪',
      titleBn: 'অর্ডার নিশ্চিত করুন',
      descBn: 'প্রতিনিধির সাথে কথা বলে নিশ্চিত হন এবং ডেলিভারির সময় পণ্য বুঝে পেয়ে মূল্য পরিশোধ করুন।',
      icon: Truck
    }
  ];

  return (
    <section className="py-14 sm:py-18 bg-white border-b border-[#E8E5DF]" id="how-to-order">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#1B5E20] text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full mb-3 border border-[#1B5E20]/20">
            <span>সহজ ৪ ধাপ</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E3333] tracking-tight">
            খামারি কাব্য থেকে অর্ডার করা খুব সহজ
          </h2>
          
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            কোনো জটিলতা ছাড়াই মাত্র কয়েক ক্লিকে আপনার খামারে পৌঁছে যাবে উন্নত গবাদিপশুর পুষ্টি
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.numberBn}
                className="bg-[#FDFCF9] rounded-3xl p-6 border border-[#E8E5DF] hover:border-[#1B5E20] hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
              >
                {/* Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1B5E20] text-white flex items-center justify-center font-black text-xl shadow-xs group-hover:bg-[#124116] transition-colors">
                    {step.numberBn}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E5DF] flex items-center justify-center text-[#1B5E20] shadow-2xs">
                    <Icon className="w-5 h-5 text-[#F57C00]" />
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-[#2E3333]">
                    {step.titleBn}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {step.descBn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => setCurrentRoute('feed')}
            className="inline-flex items-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
          >
            <span>এখনই পণ্য অর্ডার করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
