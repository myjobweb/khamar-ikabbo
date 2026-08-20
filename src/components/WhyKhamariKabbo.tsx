import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  MousePointerClick,
  Users,
  Boxes,
  Headphones,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const WhyKhamariKabbo: React.FC = () => {
  const { siteSettings } = useApp();

  if (siteSettings.sectionVisibility?.whyKhamariKabbo === false) {
    return null;
  }
  const benefits = [
    {
      id: 'benefit-1',
      titleBn: 'মানসম্মত ও ভেজালমুক্ত পণ্য',
      descBn: 'ল্যাব পরীক্ষিত উচ্চ প্রোটিনযুক্ত ফিড ও ১০০% খাঁটি কাঁচামাল নিশ্চিত করে দ্রুত ও স্বাস্থ্যকর গবাদিপশুর বৃদ্ধি।',
      icon: ShieldCheck,
      color: 'emerald'
    },
    {
      id: 'benefit-2',
      titleBn: 'সহজ অনলাইন অর্ডার',
      descBn: 'কোনো জটিলতা ছাড়া সাধারণ বাংলায় নাম ও ঠিকানা দিয়ে মোবাইল থেকেই মাত্র ১ মিনিটে অর্ডার করার সুবিধা।',
      icon: MousePointerClick,
      color: 'amber'
    },
    {
      id: 'benefit-3',
      titleBn: 'খামারি-কেন্দ্রিক সেবা ও পরামর্শ',
      descBn: 'শুধু ব্যবসা নয়; অভিজ্ঞ ভেটেরিনারি পরামর্শ ও খাদ্য তালিকা নির্ধারণে খামারির পাশে থাকার নিরবচ্ছিন্ন অঙ্গীকার।',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'benefit-4',
      titleBn: 'বিভিন্ন প্রয়োজনীয় পণ্য এক জায়গায়',
      descBn: 'ফিড, কাঁচামাল, সাপ্লিমেন্ট, প্রাথমিক চিকিৎসা ও কম্বো প্যাকেজ — খামারের যাবতীয় প্রয়োজন এখন এক ছাদের নিচে।',
      icon: Boxes,
      color: 'purple'
    },
    {
      id: 'benefit-5',
      titleBn: 'সহজ যোগাযোগ ও ট্র্যাকিং',
      descBn: 'হটলাইন কল ও সরাসরি হোয়াটসঅ্যাপ সাপোর্টে দিনরাত যেকোনো প্রশ্নের দ্রুত উত্তর ও অর্ডার আপডেট প্রদান।',
      icon: Headphones,
      color: 'rose'
    }
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#1B5E20] text-white relative overflow-hidden" id="why-khamari-kabbo">
      {/* Natural Tones Background Accents */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#F57C00]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/15 text-[#FFF3E0] text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full mb-3 border border-white/20">
            <Sparkles className="w-4 h-4 text-[#F57C00]" />
            <span>আমাদের লক্ষ্য ও বৈশিষ্ট্য</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            খামারি কাব্য কেন?
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-[#E8F5E9] leading-relaxed font-normal">
            "খামারি কাব্য শুধু পণ্য বিক্রির জায়গা নয়; খামারিদের প্রয়োজনীয় পণ্য সহজে খুঁজে পাওয়া এবং সঠিক তথ্যের মাধ্যমে সিদ্ধান্ত নিতে সহায়তা করাই আমাদের লক্ষ্য।"
          </p>
        </div>

        {/* 5 Benefit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.id}
                className={`bg-white/10 backdrop-blur-xs border border-white/15 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300 shadow-sm flex flex-col justify-between ${
                  idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-[#F57C00] shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{benefit.titleBn}</span>
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-[#E8F5E9] leading-relaxed">
                    {benefit.descBn}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/15 flex items-center gap-1.5 text-xs text-[#FFF3E0] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F57C00]" />
                  <span>খামারির শতভাগ আস্থার অঙ্গীকার</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
