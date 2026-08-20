import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Key,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Eye,
  EyeOff,
  Save,
  Lock
} from 'lucide-react';
import { getSavedAdminCredentials, saveAdminCredentials } from '../../services/adminAuth';

export const AdminProfile: React.FC = () => {
  const {
    adminUser,
    testSupabaseConnection,
    showToast
  } = useApp();

  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbResult, setDbResult] = useState<boolean | null>(null);

  // Password Management
  const [currentEmail, setCurrentEmail] = useState('admin@khamarikabbo.com');
  const [currentPassword, setCurrentPassword] = useState('597752Sakib');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);

  useEffect(() => {
    const creds = getSavedAdminCredentials();
    setCurrentEmail(creds.email);
    setCurrentPassword(creds.password);
  }, []);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 6) {
      showToast('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।', 'error');
      return;
    }

    setIsSavingPass(true);
    try {
      const ok = saveAdminCredentials(currentEmail, newPassword.trim());
      if (ok) {
        setCurrentPassword(newPassword.trim());
        setNewPassword('');
        showToast('অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!', 'success');
      } else {
        showToast('পাসওয়ার্ড সংরক্ষণে সমস্যা হয়েছে।', 'error');
      }
    } finally {
      setIsSavingPass(false);
    }
  };

  const handleTestDb = async () => {
    setIsTestingDb(true);
    setDbResult(null);
    try {
      const ok = await testSupabaseConnection();
      setDbResult(ok);
      if (ok) {
        showToast('Supabase ডাটাবেজ সংযোগ সক্রিয় ও সুস্থ রয়েছে!');
      } else {
        showToast('সরাসরি Supabase সংযোগ পাওয়া যায়নি, লোকাল স্টোর ব্যবহার হচ্ছে।', 'warning');
      }
    } finally {
      setIsTestingDb(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Admin Profile Card */}
      <div className="bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white flex items-center justify-center text-xl font-black shadow-md">
            {adminUser?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#2E3333]">{adminUser?.name || 'সাকিব (প্রধান প্রশাসক)'}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase">
                {adminUser?.role || 'Super Admin'}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3 h-3 text-[#1B5E20]" />
              <span>{adminUser?.email || currentEmail}</span>
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#FDFCF9] rounded-2xl border border-[#E8E5DF] space-y-1">
            <span className="text-[11px] font-bold text-gray-400">অ্যাডমিন রোল ও অনুমোদন</span>
            <p className="font-bold text-gray-800">Super Administrator</p>
          </div>

          <div className="p-3.5 bg-[#FDFCF9] rounded-2xl border border-[#E8E5DF] space-y-1">
            <span className="text-[11px] font-bold text-gray-400">লগইন সেশন স্ট্যাটাস</span>
            <p className="font-bold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>অনুমোদিত ও সুরক্ষিত সেশন</span>
            </p>
          </div>
        </div>
      </div>

      {/* Password & Security Card */}
      <div className="bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-black text-[#2E3333] border-b border-gray-100 pb-2.5 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#1B5E20]" />
          <span>পাসওয়ার্ড ও নিরাপত্তা সেটিংস</span>
        </h3>

        {/* Current Password Display */}
        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[11px] text-gray-500 font-bold">বর্তমান সক্রিয় অ্যাডমিন পাসওয়ার্ড:</span>
            <div className="flex items-center gap-2 mt-1">
              <Lock className="w-3.5 h-3.5 text-[#1B5E20]" />
              <span className="font-mono font-bold text-[#1B5E20] text-sm">
                {showCurrentPass ? currentPassword : '••••••••••••'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCurrentPass(!showCurrentPass)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-emerald-800 font-bold text-xs hover:bg-emerald-50 cursor-pointer self-start sm:self-auto"
          >
            {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showCurrentPass ? 'লুকান' : 'পাসওয়ার্ড দেখুন'}</span>
          </button>
        </div>

        {/* Change Password Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-4 pt-2">
          <p className="text-xs font-bold text-gray-700">নতুন পাসওয়ার্ড সেট করুন:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-600 mb-1">অ্যাডমিন ইমেইল</label>
              <input
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-600 mb-1">নতুন পাসওয়ার্ড</label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="যেমন: 597752Sakib"
                  className="w-full px-3.5 pr-10 py-2.5 bg-white border border-[#E8E5DF] rounded-xl focus:border-[#1B5E20] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingPass || !newPassword.trim()}
              className="px-5 py-2.5 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>পাসওয়ার্ড আপডেট করুন</span>
            </button>
          </div>
        </form>
      </div>

      {/* Supabase Connection Test & Health Card */}
      <div className="bg-white rounded-3xl border border-[#E8E5DF] p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-[#2E3333] border-b border-gray-100 pb-2.5 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#1B5E20]" />
          <span>Supabase ক্লাউড ডাটাবেজ সংযোগ স্ট্যাটাস</span>
        </h3>

        <div className="p-4 bg-[#FDFCF9] rounded-2xl border border-[#E8E5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-bold text-[#2E3333]">PostgreSQL & Real-Time Storage</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              বর্তমান ডাটাবেজ সার্ভিস স্ট্যাটাস যাচাই করতে নিচের বাটনে ক্লিক করুন।
            </p>
            
            {dbResult !== null && (
              <div className="mt-2 flex items-center gap-1.5 font-bold">
                {dbResult ? (
                  <span className="text-emerald-700 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Supabase সার্ভার সক্রিয় ও রেসপন্স করছে (Live Connected)</span>
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center gap-1 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>লোকাল ক্যাশ ও ফোলব্যাক স্টোরেজ মোডে চালু রয়েছে।</span>
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleTestDb}
            disabled={isTestingDb}
            className="px-4 py-2 bg-[#1B5E20] hover:bg-[#124116] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isTestingDb ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>যাচাই হচ্ছে...</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5" />
                <span>সংযোগ টেস্ট করুন</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
