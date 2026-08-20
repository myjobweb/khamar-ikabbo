import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wheat, Lock, Mail, AlertCircle, ArrowLeft, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setCurrentRoute } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await loginAdmin(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'ভুল ইমেইল বা পাসওয়ার্ড প্রদান করা হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('লগইন প্রক্রিয়ায় ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#E8F5E9] selection:text-[#1B5E20]">
      
      {/* Return to website link */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <button
          onClick={() => setCurrentRoute('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5E20] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>ওয়েবসাইটে ফিরে যান</span>
        </button>

        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>সিকিউর অ্যাডমিন পোর্টাল</span>
        </span>
      </div>

      <div className="w-full max-w-md bg-white border border-[#E8E5DF] rounded-3xl shadow-xl p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto bg-[#1B5E20] rounded-2xl flex items-center justify-center text-white shadow-md">
            <Wheat className="w-8 h-8 text-[#F57C00]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#1B5E20] tracking-tight">
              খামারি কাব্য
            </h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5">
              Admin Panel Login
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-[#2E3333] mb-1.5">
              অ্যাডমিন ইমেইল (Admin Email)
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@khamarikabbo.com"
                className="w-full pl-9.5 pr-4 py-3 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 rounded-xl outline-none font-medium text-[#2E3333] transition-all"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#2E3333] mb-1.5">
              পাসওয়ার্ড (Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9.5 pr-10 py-3 bg-[#FDFCF9] border border-[#E8E5DF] focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 rounded-xl outline-none font-medium text-[#2E3333] transition-all"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2 text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <span>লগইন করুন</span>
            )}
          </button>
        </form>

      </div>

    </div>
  );
};
