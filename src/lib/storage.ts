import { UserProfile, GymBuddy, WorkoutPost, PersonalPR, GroupChat, GroupMessage } from '../types';

const ACCOUNTS_KEY = 'repcheck_accounts_v2';
const CURRENT_USER_KEY = 'repcheck_current_user_v2';

// Default initial accounts empty so user only sees accounts they created
const DEFAULT_ACCOUNTS: UserProfile[] = [];

export function getSavedAccounts(): UserProfile[] {
  try {
    const saved = localStorage.getItem(ACCOUNTS_KEY);
    if (!saved) {
      // Check legacy key
      const legacy = localStorage.getItem('repcheck_all_accounts');
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (Array.isArray(parsedLegacy)) {
          // Filter out default sample users if present
          const userCreatedOnly = parsedLegacy.filter((a: UserProfile) => !a.id.startsWith('user-default-'));
          saveAccounts(userCreatedOnly);
          return userCreatedOnly;
        }
      }
      saveAccounts(DEFAULT_ACCOUNTS);
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      saveAccounts(DEFAULT_ACCOUNTS);
      return DEFAULT_ACCOUNTS;
    }
    // Filter out default sample users if previously saved
    const userCreatedOnly = parsed.filter((a: UserProfile) => !a.id.startsWith('user-default-'));
    return userCreatedOnly;
  } catch (err) {
    console.error('Failed reading accounts:', err);
    return DEFAULT_ACCOUNTS;
  }
}

export function saveAccounts(accounts: UserProfile[]) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    localStorage.setItem('repcheck_all_accounts', JSON.stringify(accounts)); // Legacy mirror fallback
  } catch (e) {
    console.error('Failed saving accounts:', e);
  }
}

export function getSavedCurrentUser(): UserProfile | null {
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) return JSON.parse(saved);
    const legacy = localStorage.getItem('repcheck_current_user');
    if (legacy) return JSON.parse(legacy);
    return null;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: UserProfile | null) {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      localStorage.setItem('repcheck_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem('repcheck_current_user');
    }
  } catch (e) {
    console.error('Failed saving current user:', e);
  }
}

// User specific persistent key helpers
export function loadUserData<T>(userId: string, itemKey: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`repcheck_${itemKey}_${userId}`);
    if (raw) return JSON.parse(raw);
    
    // Legacy fallback
    const legacyRaw = localStorage.getItem(`gymsocial_${itemKey}_${userId}`);
    if (legacyRaw) return JSON.parse(legacyRaw);

    return fallback;
  } catch {
    return fallback;
  }
}

export function saveUserData<T>(userId: string, itemKey: string, data: T) {
  try {
    localStorage.setItem(`repcheck_${itemKey}_${userId}`, JSON.stringify(data));
    localStorage.setItem(`gymsocial_${itemKey}_${userId}`, JSON.stringify(data)); // Legacy mirror
  } catch (e) {
    console.error(`Failed saving ${itemKey} for user ${userId}:`, e);
  }
}
