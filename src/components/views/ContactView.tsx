import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber } from '../../utils/bengali';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Facebook,
  Clock,
  Send,
  CheckCircle2,
  Headphones,
  HelpCircle,
  Wheat
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { siteSettings } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    // Trigger WhatsApp message directly or show confirmation
    const text = `আসসালামু আলাইকুম, আমি ${name} (${phone})।\nমেসেজ: ${message}`;
    window.open(
      `https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
    setIsSent(true);
  };

  return (
    <div className="py-10 sm:py-16 bg-[#FDFCF9] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold px-3 py-1 rounded-full border border-[#1B5E20]/20">
            <Headphones className="w-3.5 h-3.5" />
            <span>সরাসরি খামারি সেবা</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#2E3333]">
            যোগাযোগ ও খামার পরামর্শ
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            যেকোনো পণ্য তথ্য, বাল্ক অর্ডার, ডিলারশিপ বা ভেটেরিনারি পরামর্শের জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        {/* 2 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Phone Card */}
            <div className="bg-white p-5 rounded-3xl border border-[#E8E5DF] shadow-sm flex items-start gap-4 hover:border-[#1B5E20] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#2E3333]">হটলাইন ফোন</h3>
                <p className="text-xs text-gray-500">সরাসরি কথা বলতে কল করুন</p>
                <a
                  href={`tel:${siteSettings.hotlinePhone}`}
                  className="inline-block text-base font-black text-[#1B5E20] hover:underline pt-0.5"
                >
                  +৮৮০ {toBengaliNumber(siteSettings.hotlinePhone)}
                </a>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white p-5 rounded-3xl border border-[#E8E5DF] shadow-sm flex items-start gap-4 hover:border-[#25D366] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#2E3333]">হোয়াটসঅ্যাপ সহায়তা</h3>
                <p className="text-xs text-gray-500">দ্রুত মেসেজ ও ছবি পাঠাতে</p>
                <a
                  href={`https://wa.me/${siteSettings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-base font-black text-[#25D366] hover:underline pt-0.5"
                >
                  {toBengaliNumber(siteSettings.whatsappNumber)}
                </a>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white p-5 rounded-3xl border border-[#E8E5DF] shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3E0] text-[#F57C00] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-xs">
                <h3 className="text-sm font-bold text-[#2E3333]">প্রধান কার্যালয় ও ডিপো</h3>
                <p className="text-gray-600 leading-relaxed">{siteSettings.addressBn}</p>
                <p className="text-gray-400 pt-1">ডেলিভারি কাভারেজ: বাংলাদেশের ৬৪ জেলা</p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white p-5 rounded-3xl border border-[#E8E5DF] shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E1F5FE] text-[#0288D1] flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-xs">
                <h3 className="text-sm font-bold text-[#2E3333]">সেবা প্রদানের সময়</h3>
                <p className="text-gray-600">শনিবার – বৃহস্পতিবার: সকাল ৮:০০ – রাত ১০:০০</p>
                <p className="text-gray-600">শুক্রবার: দুপুর ২:৩০ – রাত ৯:০০</p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Query Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DF] shadow-sm">
            <h2 className="text-lg sm:text-xl font-black text-[#2E3333] mb-2">
              আপনার প্রশ্ন বা পরামর্শ জানান
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              ফর্মটি পূরণ করলে আমাদের প্রতিনিধি দ্রুত আপনার সাথে ফোনে বা হোয়াটসঅ্যাপে যোগাযোগ করবেন।
            </p>

            {isSent ? (
              <div className="bg-[#E8F5E9] border border-[#1B5E20]/30 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1B5E20] text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#1B5E20]">
                  ধন্যবাদ! আপনার বার্তা সফলভাবে পাঠানো হয়েছে।
                </h4>
                <p className="text-xs text-gray-600">
                  আমাদের ক্যাটল নিউট্রিশন টিম দ্রুত আপনার সাথে যোগাযোগ করবে।
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setName('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="text-xs font-bold text-[#1B5E20] underline cursor-pointer"
                >
                  অন্য আরেকটি বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2E3333] mb-1">
                    আপনার নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মো: কামরুল হাসান"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 text-sm bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2E3333] mb-1">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 text-sm bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2E3333] mb-1">
                    বার্তা বা পণ্যের বিষয়ে জানতে চান <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="আপনার খামারের গরুর সংখ্যা, কাঙ্ক্ষিত পণ্য বা কোনো পরামর্শের বিস্তারিত লিখুন..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 text-sm bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] rounded-xl outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer text-sm"
                >
                  <Send className="w-4 h-4 text-[#F57C00]" />
                  <span>বার্তা পাঠিয়ে দিন</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
