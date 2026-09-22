import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, logOut } from '../lib/firebase';

export const OWNER_EMAIL = 'gust89662@gmail.com';
export const ADMIN_EMAILS = [
  'warzheen0@gmail.com',
  'gust89662@gmail.com',
  'njperfumee@gmail.com',
  'kurddln@gmail.com',
  'mindaurora82@gmail.com',
];

export type UserRole = 'owner' | 'admin' | 'member' | 'guest';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  role: UserRole;
  authError: string | null;
  clearAuthError: () => void;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [role, setRole] = useState<UserRole>('guest');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        const emailLower = currentUser.email.toLowerCase();
        const ownerMatch = emailLower === OWNER_EMAIL.toLowerCase();
        const adminMatch = ownerMatch || ADMIN_EMAILS.some((e) => e.toLowerCase() === emailLower);

        setIsOwner(ownerMatch);
        setIsAdmin(adminMatch);
        setRole(ownerMatch ? 'owner' : adminMatch ? 'admin' : 'member');
      } else {
        setIsOwner(false);
        setIsAdmin(false);
        setRole('guest');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (): Promise<User | null> => {
    setAuthError(null);
    try {
      const signedInUser = await signInWithGoogle();
      return signedInUser || null;
    } catch (error: any) {
      const errorCode = error?.code || '';
      if (
        errorCode === 'auth/popup-closed-by-user' ||
        errorCode === 'auth/cancelled-popup-request' ||
        errorCode === 'auth/user-cancelled'
      ) {
        return null;
      }
      const msg = error?.message || 'Authentication error';
      setAuthError(msg);
      throw error;
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const signOutUser = async () => {
    setIsAdmin(false);
    setIsOwner(false);
    setRole('guest');
    try {
      await logOut();
    } catch (error: any) {
      setAuthError(error?.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isOwner,
        role,
        authError,
        clearAuthError,
        signIn,
        signOut: signOutUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
