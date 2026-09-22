import { useState } from 'react';
import { useAuth, ADMIN_EMAILS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Crown, X, AlertCircle, Shield } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: Props) {
  const { user, signIn, authError, clearAuthError } = useAuth();
  const { language, direction } = useLanguage();
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearAuthError();
    setIsSigningInGoogle(true);
    try {
      const res = await signIn();
      if (res) {
        onSuccess();
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        return;
      }
      setLocalError(err?.message || 'Failed to sign in with Google');
    } finally {
      setIsSigningInGoogle(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        id="adminAccessModal"
        className="relative w-full max-w-md bg-[#0A0407] text-[#FDFBF7] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(107,23,39,0.25)] border border-[#D4AF37]/35 p-5 sm:p-6 z-10 max-h-[92vh] overflow-y-auto overscroll-contain text-start"
        dir={direction}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 w-8 h-8 rounded-full bg-[#15070D] hover:bg-[#1E0B13] text-[#D8CCC4] hover:text-[#ECC870] border border-[#D4AF37]/30 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header Lockup */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#D4AF37]/25 pe-8">
          <div className="w-10 h-10 rounded-2xl bg-[#1E0B13] border border-[#D4AF37]/40 text-[#ECC870] flex items-center justify-center flex-shrink-0 shadow-xs">
            <Crown size={20} />
          </div>
          <div>
            <h3 className="serif text-base sm:text-lg font-bold text-[#FDFBF7]">
              {language === 'en'
                ? 'Admin Dashboard Access'
                : language === 'badini'
                ? 'چوونەژوورا پانێلا ڕێڤەبەری'
                : language === 'sorani'
                ? 'چوونەژوورەوەی پانێڵی بەڕێوەبەر'
                : 'دخول لوحة تحكم المسؤول'}
            </h3>
            <p className="text-[11px] text-[#ECC870]">
              {language === 'en'
                ? 'NJZARO Haute Parfumerie Management'
                : language === 'badini'
                ? 'ڕێڤەبرنا عەتران و بهایێن NJZARO'
                : language === 'sorani'
                ? 'بەڕێوەبردنی بۆن و نرخەکانی NJZARO'
                : 'إدارة متجر NJZARO للعطور والأسعار'}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#D8CCC4] leading-relaxed pt-3">
          {language === 'en'
            ? 'Access to this management dashboard requires signing in with an authorized Google Administrator account.'
            : language === 'badini'
            ? 'ڤەکرنا پانێلا ڕێڤەبەریێ پێدڤی ب چوونەژوورێ یە ب هەژمارەکا ڕێپێدای یا Google Admin.'
            : language === 'sorani'
            ? 'دەستپێگەیشتن بەم پانێڵە پێویستی بە چوونەژوورەوەیە بە هەژمارێکی ڕێگەپێدراوی Google Admin.'
            : 'لوحة التحكم مخصصة لحسابات المشرفين المعتمدة لإدارة المنتجات، العروض، والطلبات. يرجى تسجيل الدخول بحساب المشرف.'}
        </p>

        {user && (
          <div className="mt-3 p-3 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 text-xs text-[#FDFBF7]">
            <span className="text-[#D8CCC4] block text-[10px]">
              {language === 'en'
                ? 'Current Account:'
                : language === 'badini'
                ? 'هەژمارا نوکە:'
                : language === 'sorani'
                ? 'هەژماری ئێستا:'
                : 'الحساب الحالي:'}
            </span>
            <span className="font-semibold font-mono truncate block mt-0.5 text-[#ECC870]">{user.email}</span>
            <span className="text-[10.5px] text-red-300 mt-1 block">
              {language === 'en'
                ? 'This account does not have admin permissions.'
                : language === 'badini'
                ? 'ئەڤ هەژمارە دەستهەلاتا ڕێڤەبەریێ نینە، هیڤیە هەژمارا ڕێڤەبەری هەلبژێرە.'
                : language === 'sorani'
                ? 'ئەم هەژمارە مۆڵەتی بەڕێوەبەری نییە، تکایە هەژماری بەڕێوەبەر هەڵبژێرە.'
                : 'هذا الحساب ليس لديه صلاحيات الإشراف، يرجى التبديل لحساب المشرف أدناه.'}
            </span>
          </div>
        )}

        {/* Error Messages */}
        {(localError || authError) && (
          <div className="mt-3 p-3 rounded-xl bg-[#6B1727]/30 border border-[#6B1727] text-red-200 text-xs flex items-start gap-2">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-400" />
            <span className="leading-snug">{localError || authError}</span>
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSigningInGoogle}
            className="w-full py-3 px-4 rounded-xl border border-[#D4AF37]/35 hover:border-[#D4AF37] bg-[#15070D] hover:bg-[#1E0B13] text-[#FDFBF7] text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-xs disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {isSigningInGoogle
                ? (language === 'en' ? 'Signing in...' : language === 'badini' ? 'چوونەژوور...' : language === 'sorani' ? 'چوونەژوورەوە...' : 'جاري التحقق...')
                : (language === 'en'
                    ? 'Sign in with Google Admin'
                    : language === 'badini'
                    ? 'چوونەژوور ب ڕێکا Google Admin'
                    : language === 'sorani'
                    ? 'چوونەژوورەوە بە Google Admin'
                    : 'تسجيل الدخول بحساب Google المشرف')}
            </span>
          </button>

          {/* Authorized Admin Accounts list */}
          <div className="p-3 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 space-y-1.5">
            <span className="text-[10px] text-[#ECC870] font-bold flex items-center gap-1">
              <Shield size={12} className="text-[#D4AF37]" />
              {language === 'en'
                ? 'Authorized Admin Accounts:'
                : language === 'badini'
                ? 'هەژمارێن ڕێپێدای بۆ ڕێڤەبەریێ:'
                : language === 'sorani'
                ? 'هەژمارە ڕێگەپێدراوەکان بۆ بەڕێوەبردن:'
                : 'الحسابات المصرح لها بالإشراف:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ADMIN_EMAILS.map((email) => (
                <span
                  key={email}
                  className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#1E0B13] border border-[#D4AF37]/35 text-[#FDFBF7] font-mono font-medium"
                >
                  {email}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
