import React from 'react';
import { GuideArticle } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  BookOpen,
  Clock,
  CheckCircle2,
  Table,
  ArrowRight
} from 'lucide-react';

export const GuideReaderModal: React.FC = () => {
  const { selectedGuide, setSelectedGuide, setCurrentRoute } = useApp();

  if (!selectedGuide) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      id="guide-reader-modal"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8E5DF] my-auto">
        
        {/* Header Image & Close */}
        <div className="relative h-48 sm:h-64 overflow-hidden bg-[#1B5E20]">
          <img
            src={selectedGuide.image}
            alt={selectedGuide.titleBn}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <button
            onClick={() => setSelectedGuide(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2 text-xs text-[#FFF3E0] font-bold mb-1.5">
              <span className="bg-[#1B5E20]/90 px-2.5 py-0.5 rounded-md border border-white/20">
                {selectedGuide.categoryBn}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#F57C00]" />
                {selectedGuide.readTimeBn}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {selectedGuide.titleBn}
            </h2>
            <p className="text-xs sm:text-sm text-[#E8F5E9] mt-1">
              {selectedGuide.subtitleBn}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto text-[#2E3333] leading-relaxed text-sm">
          
          {/* Summary Box */}
          <div className="bg-[#E8F5E9] border-l-4 border-[#1B5E20] p-4 rounded-r-2xl text-[#1B5E20]">
            <p className="font-semibold">{selectedGuide.summaryBn}</p>
          </div>

          {/* Key Highlights */}
          {selectedGuide.keyPointsBn && (
            <div className="space-y-2 bg-[#FDFCF9] p-4 rounded-2xl border border-[#E8E5DF]">
              <h4 className="font-bold text-[#2E3333] text-xs uppercase tracking-wider">
                গুরুত্বপূর্ণ মূল বিষয়সমূহ:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                {selectedGuide.keyPointsBn.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sections */}
          <div className="space-y-5">
            {selectedGuide.sections.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-base font-bold text-[#1B5E20]">
                  {section.headingBn}
                </h3>
                <div className="space-y-2 text-gray-600 text-xs sm:text-sm">
                  {section.contentBn.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Cattle Ration Table if available */}
          {selectedGuide.rationTable && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-[#2E3333] flex items-center gap-2">
                <Table className="w-4 h-4 text-[#1B5E20]" />
                <span>দৈনিক সুষম খাবারের নমুনা চার্ট</span>
              </h3>
              <div className="overflow-x-auto border border-[#E8E5DF] rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#1B5E20] text-white">
                    <tr>
                      <th className="p-2.5 font-bold">গবাদিপশুর ওজন</th>
                      <th className="p-2.5 font-bold">কাঁচা ঘাস</th>
                      <th className="p-2.5 font-bold">শুকনা খড়</th>
                      <th className="p-2.5 font-bold">দানাদার ফিড</th>
                      <th className="p-2.5 font-bold">মিনারেল মিক্স</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E5DF]">
                    {selectedGuide.rationTable.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-gray-50">
                        <td className="p-2.5 font-semibold text-[#2E3333]">{row.cattleType}</td>
                        <td className="p-2.5 text-gray-600">{row.greenGrass}</td>
                        <td className="p-2.5 text-gray-600">{row.dryStraw}</td>
                        <td className="p-2.5 font-bold text-[#1B5E20]">{row.concentrateFeed}</td>
                        <td className="p-2.5 text-gray-600">{row.mineralMix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#FDFCF9] border-t border-[#E8E5DF] flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedGuide(null)}
            className="text-xs font-bold text-gray-500 hover:text-[#2E3333] px-4 py-2"
          >
            বন্ধ করুন
          </button>

          <button
            onClick={() => {
              setSelectedGuide(null);
              setCurrentRoute('feed');
            }}
            className="flex items-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold text-xs px-5 py-2.5 rounded-2xl transition-colors cursor-pointer"
          >
            <span>প্রয়োজনীয় ফিড কিনুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
