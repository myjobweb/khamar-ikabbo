import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { toBengaliNumber } from '../utils/bengali';
import {
  X,
  Calculator,
  Sparkles,
  ArrowRight,
  Wheat,
  Scale
} from 'lucide-react';

export const FeedCalculatorModal: React.FC = () => {
  const { isCalculatorOpen, setIsCalculatorOpen, setCurrentRoute } = useApp();

  const [cattleType, setCattleType] = useState<'fattening' | 'dairy' | 'calf'>('fattening');
  const [weight, setWeight] = useState<number>(250);
  const [milkYield, setMilkYield] = useState<number>(10);

  if (!isCalculatorOpen) return null;

  let greenGrass = 0;
  let dryStraw = 0;
  let concentrateFeed = 0;
  let mineralMix = 0;
  let waterLiters = 0;

  if (cattleType === 'fattening') {
    concentrateFeed = Number(((weight * 0.016)).toFixed(1));
    greenGrass = Number(((weight * 0.06)).toFixed(1));
    dryStraw = Number(((weight * 0.012)).toFixed(1));
    mineralMix = Math.round(weight * 0.15);
    waterLiters = Math.round(weight * 0.12);
  } else if (cattleType === 'dairy') {
    const maintenanceFeed = weight * 0.008;
    const productionFeed = milkYield * 0.38;
    concentrateFeed = Number((maintenanceFeed + productionFeed).toFixed(1));
    greenGrass = Number(((weight * 0.08)).toFixed(1));
    dryStraw = Number(((weight * 0.015)).toFixed(1));
    mineralMix = Math.round(weight * 0.18 + milkYield * 3);
    waterLiters = Math.round(weight * 0.15 + milkYield * 3);
  } else {
    concentrateFeed = Number(((weight * 0.018)).toFixed(1));
    greenGrass = Number(((weight * 0.05)).toFixed(1));
    dryStraw = Number(((weight * 0.01)).toFixed(1));
    mineralMix = Math.round(weight * 0.2);
    waterLiters = Math.round(weight * 0.1);
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      id="feed-calculator-modal"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8E5DF] my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#1B5E20] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-[#F57C00]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">গরুর দৈনিক সুষম খাদ্য ক্যালকুলেটর</h3>
              <p className="text-xs text-[#E8F5E9]">
                ওজন ও ধরন অনুযায়ী বিজ্ঞানসম্মত খাবারের চার্ট বের করুন
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCalculatorOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calculator Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* 1. Cattle Type Selector */}
          <div>
            <label className="block text-xs font-bold text-[#2E3333] mb-2">
              ১. গবাদিপশুর ধরন নির্বাচন করুন:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCattleType('fattening')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  cattleType === 'fattening'
                    ? 'border-[#1B5E20] bg-[#E8F5E9] text-[#1B5E20] font-bold shadow-2xs'
                    : 'border-[#E8E5DF] bg-[#FDFCF9] text-gray-600'
                }`}
              >
                <span className="block text-base mb-0.5">🐂</span>
                <span>মোটাতাজাকরণ ষাঁড়</span>
              </button>

              <button
                type="button"
                onClick={() => setCattleType('dairy')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  cattleType === 'dairy'
                    ? 'border-[#1B5E20] bg-[#E8F5E9] text-[#1B5E20] font-bold shadow-2xs'
                    : 'border-[#E8E5DF] bg-[#FDFCF9] text-gray-600'
                }`}
              >
                <span className="block text-base mb-0.5">🐄</span>
                <span>দুগ্ধবতী গাভী</span>
              </button>

              <button
                type="button"
                onClick={() => setCattleType('calf')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  cattleType === 'calf'
                    ? 'border-[#1B5E20] bg-[#E8F5E9] text-[#1B5E20] font-bold shadow-2xs'
                    : 'border-[#E8E5DF] bg-[#FDFCF9] text-gray-600'
                }`}
              >
                <span className="block text-base mb-0.5">🌾</span>
                <span>বাড়ন্ত বাছুর</span>
              </button>
            </div>
          </div>

          {/* 2. Weight Slider */}
          <div className="bg-[#FDFCF9] p-4 rounded-2xl border border-[#E8E5DF] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#2E3333]">
                ২. গবাদিপশুর আনুমানিক দৈহিক ওজন:
              </label>
              <span className="text-base font-black text-[#1B5E20] bg-white px-3 py-1 rounded-xl border border-[#E8E5DF]">
                {toBengaliNumber(weight)} কেজি
              </span>
            </div>

            <input
              type="range"
              min="80"
              max="650"
              step="10"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B5E20]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-medium">
              <span>৮০ কেজি</span>
              <span>২৫০ কেজি</span>
              <span>৪৫০ কেজি</span>
              <span>৬৫০ কেজি</span>
            </div>
          </div>

          {/* If Dairy, Milk Yield input */}
          {cattleType === 'dairy' && (
            <div className="bg-[#FFF3E0] p-4 rounded-2xl border border-[#FFE0B2] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#E65100]">
                  দৈনিক দুধ উৎপাদনের পরিমাণ:
                </label>
                <span className="text-base font-black text-[#E65100] bg-white px-3 py-1 rounded-xl border border-[#FFE0B2]">
                  {toBengaliNumber(milkYield)} লিটার
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="35"
                step="1"
                value={milkYield}
                onChange={(e) => setMilkYield(Number(e.target.value))}
                className="w-full h-2 bg-[#FFE0B2] rounded-lg appearance-none cursor-pointer accent-[#F57C00]"
              />
            </div>
          )}

          {/* Result Output Chart */}
          <div className="bg-[#1B5E20] text-white p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/20 pb-2">
              <h4 className="text-sm font-bold text-[#FFF3E0] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F57C00]" />
                <span>দৈনিক প্রয়োজনীয় সুষম রেশনের হিসাব:</span>
              </h4>
              <span className="text-[11px] text-[#E8F5E9]">
                (২৪ ঘণ্টার মোট বরাদ্দ)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white/10 p-3 rounded-2xl border border-white/15">
                <p className="text-[11px] text-[#E8F5E9]">দানাদার ফিড</p>
                <p className="text-lg font-black text-[#FFF3E0] mt-1">
                  {toBengaliNumber(concentrateFeed)} কেজি
                </p>
                <p className="text-[10px] text-[#E8F5E9]">পেলিট / ম্যাশ</p>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/15">
                <p className="text-[11px] text-[#E8F5E9]">কাঁচা ঘাস</p>
                <p className="text-lg font-black text-white mt-1">
                  {toBengaliNumber(greenGrass)} কেজি
                </p>
                <p className="text-[10px] text-[#E8F5E9]">নেপিয়ার / ঘাস</p>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/15">
                <p className="text-[11px] text-[#E8F5E9]">শুকনা খড়</p>
                <p className="text-lg font-black text-white mt-1">
                  {toBengaliNumber(dryStraw)} কেজি
                </p>
                <p className="text-[10px] text-[#E8F5E9]">আঁশ জাতীয়</p>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/15">
                <p className="text-[11px] text-[#E8F5E9]">মিনারেল মিক্স</p>
                <p className="text-lg font-black text-[#FFF3E0] mt-1">
                  {toBengaliNumber(mineralMix)} গ্রাম
                </p>
                <p className="text-[10px] text-[#E8F5E9]">দৈনিক প্রিমিক্স</p>
              </div>
            </div>

            <div className="text-xs text-[#E8F5E9] pt-2 border-t border-white/20 flex items-center justify-between">
              <span>💧 প্রতিদিন বিশুদ্ধ পানি প্রয়োজন: <strong>{toBengaliNumber(waterLiters)} - {toBengaliNumber(waterLiters + 10)} লিটার</strong></span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#FDFCF9] border-t border-[#E8E5DF] flex items-center justify-between gap-3">
          <button
            onClick={() => setIsCalculatorOpen(false)}
            className="text-xs font-bold text-gray-500 hover:text-[#2E3333] px-4 py-2"
          >
            বন্ধ করুন
          </button>

          <button
            onClick={() => {
              setIsCalculatorOpen(false);
              setCurrentRoute(cattleType === 'dairy' ? 'feed-gavi' : 'feed-motatajakaron');
            }}
            className="flex items-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold text-xs px-5 py-2.5 rounded-2xl transition-colors cursor-pointer"
          >
            <span>উপযুক্ত ফিড ও সাপ্লিমেন্ট দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
