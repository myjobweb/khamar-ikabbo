import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  ShieldCheck,
  Star,
  Quote
} from 'lucide-react';
import { toBengaliNumber } from '../utils/bengali';

export const TrustSection: React.FC = () => {
  const { siteSettings } = useApp();

  if (siteSettings.sectionVisibility?.trust === false) {
    return null;
  }
  const trustPoints = [
    'প্রয়োজনীয় পণ্য এক জায়গায়',
    'সহজ অর্ডার ব্যবস্থা',
    'স্বচ্ছ ও যৌক্তিক মূল্য',
    'মোবাইল থেকে সহজে অর্ডার',
    'খামারিদের জন্য তথ্যভিত্তিক কনটেন্ট'
  ];

  const testimonials = [
    {
      id: 'test-1',
      name: 'হাজী মো: গোলাম রসুল',
      farm: 'রসুল ডেইরি অ্যান্ড ক্যাটল ফার্ম',
      location: 'বাঘাবাড়ী, সিরাজগঞ্জ',
      cattleCount: '৪০টি ফ্রিজিয়ান গাভী',
      comment: 'খামারি কাব্য থেকে হাই-ইল্ডিং গাভীর ফিড ও লিকুইড ক্যালসিয়াম নেওয়ার পর গাভীর গড় দুধ উৎপাদন আড়াই লিটার বেড়েছে। খৈল ও ভুট্টার গুণগত মান শতভাগ নিখুঁত।',
      rating: 5
    },
    {
      id: 'test-2',
      name: 'মো: তানভীর আহমেদ',
      farm: 'প্রগতি এগ্রো অ্যান্ড ফ্যাটেনিং',
      location: 'ঈশ্বরদী, পাবনা',
      cattleCount: '৬৫টি কুরবানি ষাঁড়',
      comment: '১০০ দিনের মোটাতাজাকরণ কম্বো প্যাকেজ ব্যবহার করে আমার ষাঁড়গুলোর দৈনিক ১.৬ কেজি হারে ওজন বেড়েছে। কোনো ক্ষতিকর ওষুধ ছাড়াই প্রাকৃতিকভাবে এমন ফল সত্যিই প্রশংসনীয়।',
      rating: 5
    },
    {
      id: 'test-3',
      name: 'ডা: মাহফুজুর রহমান',
      farm: 'গ্রিন ডেল ক্যাটল ব্রিডিং',
      location: 'মাওনা, গাজীপুর',
      cattleCount: '২৮টি শাহিওয়াল ষাঁড়',
      comment: 'ফোনে বা অনলাইনে অর্ডার করলেই ঠিক সময়ে খামারের দরজায় বস্তা পৌঁছে যায়। দাম একদম স্বচ্ছ এবং তাদের ভাইটাল মিনারেল প্রিমিক্সের কার্যকারিতা দারুণ।',
      rating: 5
    }
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#F1F8E9]/50 border-b border-[#E8E5DF]" id="trust-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Trust Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full border border-[#1B5E20]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1B5E20]" />
              <span>নিরাপদ ও নির্ভরযোগ্য প্ল্যাটফর্ম</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E3333] tracking-tight">
              খামারির আস্থায়,{' '}
              <span className="text-[#1B5E20]">খামারি কাব্য</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              সারা দেশের শত শত সফল দুগ্ধ ও মোটাতাজাকরণ খামারি প্রতিদিন নির্ভর করছেন আমাদের প্রিমিয়াম ফিড ও সাপ্লিমেন্টের ওপর।
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {trustPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2E3333]">
                  <div className="w-5 h-5 rounded-full bg-[#1B5E20] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Metrics Card */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E8E5DF] shadow-sm text-center space-y-1 hover:border-[#1B5E20] transition-colors">
              <p className="text-2xl sm:text-3xl font-black text-[#1B5E20]">
                {toBengaliNumber('5000')}+
              </p>
              <p className="text-xs font-bold text-[#2E3333]">খামারি সদস্য</p>
              <p className="text-[11px] text-gray-500">সারা দেশে সেবা গ্রহণকারী</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8E5DF] shadow-sm text-center space-y-1 hover:border-[#1B5E20] transition-colors">
              <p className="text-2xl sm:text-3xl font-black text-[#F57C00]">
                {toBengaliNumber('100')}%
              </p>
              <p className="text-xs font-bold text-[#2E3333]">খাঁটি ও প্রাকৃতিক</p>
              <p className="text-[11px] text-gray-500">কোনো ক্ষতিকর উপাদান নেই</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8E5DF] shadow-sm text-center space-y-1 hover:border-[#1B5E20] transition-colors">
              <p className="text-2xl sm:text-3xl font-black text-[#1B5E20]">
                {toBengaliNumber('64')}
              </p>
              <p className="text-xs font-bold text-[#2E3333]">জেলায় ডেলিভারি</p>
              <p className="text-[11px] text-gray-500">প্রত্যন্ত অঞ্চলেও পৌঁছানো</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8E5DF] shadow-sm text-center space-y-1 hover:border-[#1B5E20] transition-colors">
              <p className="text-2xl sm:text-3xl font-black text-[#F57C00]">
                {toBengaliNumber('24')}/{toBengaliNumber('7')}
              </p>
              <p className="text-xs font-bold text-[#2E3333]">ভেটেরিনারি সহায়তা</p>
              <p className="text-[11px] text-gray-500">জরুরি খাদ্য ও রোগ পরামর্শ</p>
            </div>
          </div>

        </div>

        {/* Farmer Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-[#E8E5DF] shadow-sm hover:border-[#1B5E20] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#F57C00] text-sm">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F57C00] text-[#F57C00]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#E8E5DF]" />
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E5DF]">
                <p className="font-bold text-[#2E3333] text-sm">{item.name}</p>
                <p className="text-xs text-[#1B5E20] font-semibold">{item.farm}</p>
                <p className="text-[11px] text-gray-500">{item.location} • {item.cattleCount}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
