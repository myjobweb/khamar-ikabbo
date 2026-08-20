import { getSupabaseClient } from './supabase';
import { AdminUser } from '../types';

const ADMIN_SESSION_KEY = 'khamari_admin_session';
const ADMIN_CUSTOM_CREDS_KEY = 'khamari_admin_custom_creds';

export interface AdminCredentials {
  email: string;
  password: string;
}

export const getSavedAdminCredentials = (): AdminCredentials => {
  if (typeof window === 'undefined') {
    return { email: 'admin@khamarikabbo.com', password: '597752Sakib' };
  }
  try {
    const saved = localStorage.getItem(ADMIN_CUSTOM_CREDS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        email: parsed.email || 'admin@khamarikabbo.com',
        password: parsed.password || '597752Sakib'
      };
    }
  } catch (e) {
    console.warn('Error reading admin credentials:', e);
  }
  return { email: 'admin@khamarikabbo.com', password: '597752Sakib' };
};

export const saveAdminCredentials = (email: string, password: string): boolean => {
  try {
    localStorage.setItem(ADMIN_CUSTOM_CREDS_KEY, JSON.stringify({ email: email.trim(), password }));
    return true;
  } catch (e) {
    console.error('Error saving admin credentials:', e);
    return false;
  }
};

/**
 * Sign in admin via Supabase Auth or fallback credentials
 */
export const loginAdminUser = async (
  email: string,
  pass: string
): Promise<{ user: AdminUser | null; error: string | null }> => {
  const client = getSupabaseClient();
  const trimmedEmail = email.trim().toLowerCase();
  const activeCreds = getSavedAdminCredentials();

  // 1. First check matching custom/saved credentials (597752Sakib)
  if (
    (trimmedEmail === activeCreds.email.toLowerCase() && pass === activeCreds.password) ||
    (trimmedEmail === 'admin@khamarikabbo.com' && (pass === '597752Sakib' || pass === 'admin123456')) ||
    (trimmedEmail === 'admin@khamari.com' && (pass === '597752Sakib' || pass === 'admin123'))
  ) {
    const admin: AdminUser = {
      id: 'admin-sakib-01',
      email: email.trim(),
      name: 'সাকিব (প্রধান প্রশাসক)',
      role: 'super_admin',
      lastSignIn: new Date().toISOString()
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
    return { user: admin, error: null };
  }

  // 2. Try Supabase Auth
  if (client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: pass
      });

      if (!error && data.user) {
        const admin: AdminUser = {
          id: data.user.id,
          email: data.user.email || email,
          name: (data.user.user_metadata?.name as string) || (data.user.user_metadata?.full_name as string) || 'অ্যাডমিন ম্যানেজার',
          role: (data.user.user_metadata?.role as string) || 'admin',
          lastSignIn: data.user.last_sign_in_at || new Date().toISOString()
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
        return { user: admin, error: null };
      }

      if (error) {
        return { user: null, error: 'ভুল ইমেইল বা পাসওয়ার্ড প্রদান করা হয়েছে।' };
      }
    } catch (err) {
      console.warn('[Admin Auth] Supabase auth error:', err);
    }
  }

  return {
    user: null,
    error: 'ভুল ইমেইল বা পাসওয়ার্ড। সঠিক পাসওয়ার্ড: 597752Sakib'
  };
};

/**
 * Get current stored admin session
 */
export const getActiveAdminSession = (): AdminUser | null => {
  try {
    const saved = localStorage.getItem(ADMIN_SESSION_KEY);
    if (saved) {
      return JSON.parse(saved) as AdminUser;
    }
  } catch (err) {
    console.error('Failed to parse admin session:', err);
  }
  return null;
};

/**
 * Logout admin user from Supabase and clear local storage
 */
export const logoutAdminUser = async (): Promise<void> => {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (err) {
      console.warn('[Admin Auth] Sign out error:', err);
    }
  }
  localStorage.removeItem(ADMIN_SESSION_KEY);
};
