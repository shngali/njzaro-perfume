import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Crown, Sparkles, AlertCircle, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  onContinueAsGuest?: () => void;
}

export function AuthModal({ onContinueAsGuest }: AuthModalProps) {
  const { signIn, authError, clearAuthError } = useAuth();
  const { t, language, direction } = useLanguage();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);
  const isRTL = direction === 'rtl';

  const handleGoogleSignIn = async () => {
    setIsSubmittingGoogle(true);
    setLocalError(null);
    clearAuthError();
    try {
      const res = await signIn();
      if (!res) {
        return;
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to authenticate';
      if (
        msg.includes('popup-closed-by-user') ||
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        return;
      }
      if (msg.includes('popup-blocked')) {
        setLocalError(
          t.popupBlockedError ||
            (language === 'en'
              ? 'Sign-in popup was blocked. Please allow popups in your browser to sign in.'
              : 'تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة في متصفحك للمتابعة.')
        );
      } else {
        setLocalError(
          t.authFailedError ||
            (language === 'en'
              ? 'Unable to complete sign-in. Please try again.'
              : 'تعذر إكمال تسجيل الدخول. يرجى المحاولة مجدداً.')
        );
      }
    } finally {
      setIsSubmittingGoogle(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] min-h-screen w-full bg-[#0A0407] flex flex-col items-center justify-center p-4 overflow-y-auto"
      dir={direction}
    >
      {/* Luxury Background Ambient Gold Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.12)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#18070F]/40 to-transparent pointer-events-none" />

      {/* Language Switcher at Top */}
      <div className="absolute top-4 end-4 z-20">
        <LanguageSwitcher variant="header" />
      </div>

      {/* Main Sign-In Gate Card */}
      <div
        id="mandatoryAuthGate"
        className="relative w-full max-w-md bg-[#12070B] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(107,23,39,0.2)] border border-[#D4AF37]/35 p-6 sm:p-8 text-center my-auto z-10 animate-fade-up"
      >
        {/* Brand Lockup Header */}
        <div className="flex flex-col items-center pt-2 mb-4" dir="ltr">
          <div className="w-16 h-16 rounded-2xl bg-[#1E0B13] border border-[#D4AF37]/60 flex items-center justify-center text-[#ECC870] mb-3 shadow-[0_0_25px_rgba(212,175,55,0.25)]">
            <Crown size={32} className="stroke-[1.75]" />
          </div>
          <span className="cinzel text-2xl sm:text-3xl font-bold tracking-[0.24em] text-[#FDFBF7]">
            NJZARO
          </span>
          <span className="text-[9px] tracking-[0.35em] uppercase text-[#D4AF37] font-semibold mt-1">
            HAUTE PARFUMERIE
          </span>
        </div>

        {/* Exclusive Royal Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[10.5px] tracking-wider uppercase font-bold text-[#ECC870] mb-3">
          <Sparkles size={12} className="text-[#D4AF37]" />
          <span>
            {t.privateBoutique || (language === 'en' ? 'Exclusive Fragrance Salon' : 'صالون العطور الفاخرة')}
          </span>
        </div>

        <h2 className="serif text-xl sm:text-2xl font-bold text-[#FDFBF7] mb-2">
          {t.signInToExplore || (language === 'en' ? 'Welcome to NJZARO' : 'أهلاً بك في NJZARO')}
        </h2>

        <p className="text-xs sm:text-sm text-[#D6CEC4] leading-relaxed mb-6 max-w-sm mx-auto font-light">
          {t.authModalInstructions ||
            (language === 'en'
              ? 'Enter our private fragrance boutique to discover curated flacons, authentic decants, and bespoke oriental scents.'
              : 'ادخل إلى عالم العطور الراقية لاكتشاف أرقى العطور النيش الأصلية وتوليفات الديكانت الملكية.')}
        </p>

        {/* Error notification */}
        {(localError || authError) && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-start flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{localError || authError}</span>
          </div>
        )}

        {/* Action 1: Google Sign In */}
        <button
          type="button"
          id="mandatorySignInBtn"
          onClick={handleGoogleSignIn}
          disabled={isSubmittingGoogle}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#F5DE88] via-[#D4AF37] to-[#A67C1E] hover:brightness-110 active:scale-[0.99] text-[#0B0B0E] font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] cursor-pointer disabled:opacity-50"
        >
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <span>
            {isSubmittingGoogle
              ? (language === 'en' ? 'Authenticating...' : language === 'badini' ? 'چوونەژوور...' : language === 'sorani' ? 'چوونەژوورەوە...' : 'جاري تسجيل الدخول...')
              : (t.continueWithGoogleBtn || (language === 'en' ? 'Sign in with Google' : 'تسجيل الدخول بحساب Google'))}
          </span>
        </button>

        {/* Action 2: Continue as Guest / Explore Preview */}
        {onContinueAsGuest && (
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="w-full mt-3 py-3 px-4 rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-[#FDFBF7] hover:text-[#ECC870] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>
              {language === 'en'
                ? 'Explore Boutique as Guest'
                : language === 'badini'
                ? 'تەماشاکرنا عەتران وەک مێڤان'
                : language === 'sorani'
                ? 'تەماشاکردنی بۆنەکان وەک میوان'
                : 'تصفح البوتيك والتشكيلة كزائر'}
            </span>
            {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </button>
        )}

        {/* Trust Footnote */}
        <div className="mt-6 pt-5 border-t border-[#D4AF37]/15 flex items-center justify-center gap-2 text-[11px] text-[#8F877E]">
          <ShieldCheck size={14} className="text-[#D4AF37]" />
          <span>
            {t.secureAuthNote || (language === 'en'
              ? 'Secure 256-bit SSL Google Authentication'
              : 'تسجيل آمن ومحمي بالكامل عبر Google')}
          </span>
        </div>
      </div>
    </div>
  );
}
