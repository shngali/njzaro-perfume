import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, ShieldCheck, Truck, Droplets, Award, Edit3, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { settingsCol, handleFirestoreError, OperationType } from '../lib/firebase';
import { HeroShowcaseConfig } from '../types';
import { HeroShowcaseModal, DEFAULT_SHOWCASE_CONFIG } from './HeroShowcaseModal';

export function Hero() {
  const { t, language, direction } = useLanguage();
  const { setActiveCategoryFilter } = useCart();
  const { isAdmin, isOwner } = useAuth();
  const isPrivileged = isAdmin || isOwner;
  const isRTL = direction === 'rtl';
  const isArabic = language === 'ar';
  const isKurdish = language === 'badini' || language === 'sorani';

  const [showcaseConfig, setShowcaseConfig] = useState<HeroShowcaseConfig>(() => {
    try {
      const saved = localStorage.getItem('njzaro_hero_showcase');
      if (saved) return { ...DEFAULT_SHOWCASE_CONFIG, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_SHOWCASE_CONFIG;
  });

  const [showEditModal, setShowEditModal] = useState(false);

  // Synchronize showcase settings with Firestore in real-time
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onSnapshot(
        doc(settingsCol, 'hero_showcase'),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as HeroShowcaseConfig;
            setShowcaseConfig((prev) => ({ ...prev, ...data }));
            localStorage.setItem('njzaro_hero_showcase', JSON.stringify({ ...DEFAULT_SHOWCASE_CONFIG, ...data }));
          }
        },
        (err) => {
          handleFirestoreError(err, OperationType.GET, 'njzaro_settings/hero_showcase');
        }
      );
    } catch (e) {
      console.warn('Could not attach hero showcase listener:', e);
    }

    const handleLocalUpdate = (e: any) => {
      if (e.detail) {
        setShowcaseConfig(e.detail);
      }
    };
    window.addEventListener('njzaro-hero-showcase-updated', handleLocalUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('njzaro-hero-showcase-updated', handleLocalUpdate);
    };
  }, []);

  const scrollToShop = (category?: string) => {
    if (category) setActiveCategoryFilter(category);
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBrands = () => {
    document.getElementById('brands')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShowcaseAction = () => {
    if (showcaseConfig.actionType === 'whatsapp') {
      const msg = encodeURIComponent(
        isArabic
          ? `مرحباً NJZARO، أود الاستفسار والطلب بخصوص: ${showcaseConfig.titleAr || showcaseConfig.titleEn}`
          : isKurdish
          ? `سڵاو NJZARO، حەز دەکەم دەربارەی ئەمە بپرسم: ${showcaseConfig.titleAr || showcaseConfig.titleEn}`
          : `Hello NJZARO, I would like to inquire about: ${showcaseConfig.titleEn}`
      );
      window.open(`https://wa.me/9647504452033?text=${msg}`, '_blank');
      return;
    }
    if (showcaseConfig.actionType === 'brand' && showcaseConfig.actionTarget) {
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    scrollToShop('All');
  };

  return (
    <section
      id="home"
      className="relative pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-20 bg-gradient-to-b from-[#1B080F] via-[#110509] to-[#0A0407] overflow-hidden"
    >
      {/* Royal Amber & Dim Crimson Luxury Atmosphere Light */}
      <div className="absolute top-0 inset-x-0 h-[650px] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(107,23,39,0.28),rgba(212,175,55,0.12)_45%,transparent_75%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[460px] sm:min-h-[520px]">
          {/* Left / Text Side */}
          <div className="lg:col-span-7 flex flex-col items-start text-start space-y-4 sm:space-y-6 animate-fade-up">
            {/* Subtle Eyebrow */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#ECC870] text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <Sparkles size={12} className="text-[#D4AF37]" />
              <span>{t.heroEyebrow}</span>
            </div>

            {/* Main Headline */}
            <h1 className="serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#FDFBF7] leading-[1.12] sm:leading-[1.08] tracking-tight">
              {language === 'en' ? (
                <>
                  Discover Your <br />
                  <span className="text-[#ECC870] italic font-normal drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)]">Signature Scent</span>
                </>
              ) : language === 'badini' ? (
                <>
                  بۆهنا خۆ یا تایبەت <br />
                  <span className="text-[#ECC870] font-bold drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)]">و شاهانە ببینە</span>
                </>
              ) : language === 'sorani' ? (
                <>
                  بۆنی تایبەت و <br />
                  <span className="text-[#ECC870] font-bold drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)]">شایستەی خۆت بدۆزەرەوە</span>
                </>
              ) : (
                <>
                  اكتشف عطرك <br />
                  <span className="text-[#ECC870] font-bold drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)]">المميز والفريد</span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-[#D8CCC4] text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl">
              {t.heroDescription}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-1 sm:pt-2 w-full sm:w-auto">
              <button
                onClick={() => scrollToShop('All')}
                className="px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F5DE88] via-[#D4AF37] to-[#A67C1E] hover:brightness-110 text-[#0A0407] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_22px_rgba(212,175,55,0.35)] transition-all hover:scale-[1.02] cursor-pointer flex-1 sm:flex-initial border border-[#FFE79E]/40"
              >
                <span>{t.exploreFragrances || t.navShop}</span>
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>

              <button
                onClick={scrollToBrands}
                className="px-5 sm:px-7 py-3.5 rounded-full border border-[#D4AF37]/35 bg-[#18090F] hover:bg-[#250D17] hover:border-[#D4AF37] text-[#FDFBF7] font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex-1 sm:flex-initial text-center justify-center shadow-xs"
              >
                {t.navBrands}
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-5 sm:pt-6 border-t border-[#D4AF37]/20 w-full max-w-md">
              <div>
                <span className="serif text-xl sm:text-2xl md:text-3xl font-bold text-[#FDFBF7] block">100+</span>
                <span className="text-[10px] sm:text-xs text-[#D8CCC4] block leading-tight mt-0.5 font-medium">
                  {language === 'en' ? 'Luxury Fragrances' : isKurdish ? 'عەترێن شاهانە' : 'عطر فاخر أصلي'}
                </span>
              </div>
              <div>
                <span className="serif text-xl sm:text-2xl md:text-3xl font-bold text-[#ECC870] block">100%</span>
                <span className="text-[10px] sm:text-xs text-[#D8CCC4] block leading-tight mt-0.5 font-medium">
                  {t.authentic100}
                </span>
              </div>
              <div>
                <span className="serif text-xl sm:text-2xl md:text-3xl font-bold text-[#F5DE88] block">5.0 ★</span>
                <span className="text-[10px] sm:text-xs text-[#D8CCC4] block leading-tight mt-0.5 font-medium">
                  {language === 'en' ? 'Customer Rating' : isKurdish ? 'ڕایێن کڕیاران' : 'تقييم العملاء'}
                </span>
              </div>
            </div>
          </div>

          {/* Right / Visual Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center animate-fade-in w-full">
            {/* Visual Frame */}
            <div
              id="hero-showcase-card"
              className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl bg-gradient-to-b from-[#18090F] to-[#0F0408] border border-[#D4AF37]/35 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(107,23,39,0.2)] overflow-hidden group"
            >
              {/* Owner / Admin Edit Trigger Button */}
              {isPrivileged && (
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="absolute top-3 right-3 z-30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#3B0C15] hover:bg-[#52101E] text-[#ECC870] text-[10px] sm:text-[11px] font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-all cursor-pointer hover:scale-105 border border-[#D4AF37]/50"
                  title={isArabic ? 'تعديل صورة وقسم الواجهة (خاص بالمالك)' : 'Edit Hero Showcase & Image'}
                >
                  <Edit3 size={11} className="text-[#ECC870]" />
                  <span>{isArabic ? 'تحكم المالك' : 'Edit Showcase'}</span>
                </button>
              )}

              {/* Decorative Subtle Background Arch */}
              <div className="absolute inset-x-6 sm:inset-x-8 top-6 sm:top-8 bottom-14 sm:bottom-16 rounded-t-full border border-[#D4AF37]/25 bg-[#240D16]/40 pointer-events-none shadow-inner" />

              {/* Floating Badges */}
              <div className="relative z-10 w-full flex items-center justify-between text-[9px] sm:text-[10px]">
                <span className="badge-gold tracking-wider uppercase font-bold">
                  {showcaseConfig.badgeLeft || 'HAUTE PARFUMERIE'}
                </span>
                <span className="font-bold text-[#ECC870] tracking-wider uppercase">
                  {showcaseConfig.badgeRight || 'NJZARO EXCLUSIVE'}
                </span>
              </div>

              {/* Main Center Image */}
              <div
                onClick={() => {
                  if (isPrivileged) setShowEditModal(true);
                }}
                className={`relative z-10 my-auto flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105 ${
                  isPrivileged ? 'cursor-pointer' : ''
                }`}
                title={isPrivileged ? (isArabic ? 'انقر لتعديل الصورة (للمالك)' : 'Click to edit image') : undefined}
              >
                <img
                  src={showcaseConfig.imageUrl}
                  alt={isArabic ? showcaseConfig.titleAr || showcaseConfig.titleEn : showcaseConfig.titleEn}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      showcaseConfig.fallbackImageUrl || DEFAULT_SHOWCASE_CONFIG.imageUrl;
                  }}
                  className="max-h-48 sm:max-h-64 md:max-h-72 w-auto object-contain drop-shadow-[0_25px_40px_rgba(212,175,55,0.18)]"
                />

                {/* Owner hover camera indicator */}
                {isPrivileged && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-2xl backdrop-blur-xs">
                    <span className="px-3 py-1.5 rounded-full bg-[#15070D] text-[#ECC870] text-[11px] font-bold shadow-lg flex items-center gap-1.5 border border-[#D4AF37]/50">
                      <Camera size={13} className="text-[#D4AF37]" />
                      <span>{isArabic ? 'تغيير الصورة' : 'Change Image'}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Card Ribbon */}
              <div className="relative z-10 w-full bg-[#1A0A10]/95 backdrop-blur-xs rounded-xl p-3 sm:p-3.5 border border-[#D4AF37]/35 flex items-center justify-between shadow-xs">
                <div className="pr-2 truncate">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block truncate">
                    {isArabic ? showcaseConfig.tagAr || showcaseConfig.tagEn : showcaseConfig.tagEn}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-[#FDFBF7] block truncate">
                    {isArabic ? showcaseConfig.titleAr || showcaseConfig.titleEn : showcaseConfig.titleEn}
                  </span>
                </div>
                <button
                  onClick={handleShowcaseAction}
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] font-bold text-[10px] sm:text-[11px] transition-transform active:scale-95 cursor-pointer flex-shrink-0"
                >
                  {language === 'en' ? 'View' : isKurdish ? 'دیتن' : 'عرض'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Minimal Trust Pillars Bar */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-[#D4AF37]/20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-0 rounded-2xl bg-[#14070C] sm:bg-transparent border sm:border-0 border-[#D4AF37]/25 shadow-xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1E0B13] border border-[#D4AF37]/35 flex items-center justify-center text-[#ECC870] flex-shrink-0 shadow-xs">
              <ShieldCheck size={19} />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-[#FDFBF7]">
                {t.trustAuthentic || (language === 'en' ? '100% Authentic' : 'أصلي 100%')}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-[#D8CCC4]">
                {t.trustAuthenticSub || (language === 'en' ? 'Original batch guaranteed' : 'مستورد ومفحوص رسمياً')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-0 rounded-2xl bg-[#14070C] sm:bg-transparent border sm:border-0 border-[#D4AF37]/25 shadow-xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1E0B13] border border-[#D4AF37]/35 flex items-center justify-center text-[#ECC870] flex-shrink-0 shadow-xs">
              <Droplets size={19} />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-[#FDFBF7]">
                {t.trustDecants || (language === 'en' ? 'Decant Bar' : 'عينات ديكانت')}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-[#D8CCC4]">
                {t.trustDecantsSub || (language === 'en' ? 'From 2ml to 100ml' : 'من 2 مل وحتى 100 مل')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-0 rounded-2xl bg-[#14070C] sm:bg-transparent border sm:border-0 border-[#D4AF37]/25 shadow-xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1E0B13] border border-[#D4AF37]/35 flex items-center justify-center text-[#ECC870] flex-shrink-0 shadow-xs">
              <Truck size={19} />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-[#FDFBF7]">
                {t.trustDelivery || (language === 'en' ? 'Express Delivery' : 'توصيل سريع')}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-[#D8CCC4]">
                {t.trustDeliverySub || (language === 'en' ? 'All Iraq Governorates' : 'لكافة محافظات العراق')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-0 rounded-2xl bg-[#14070C] sm:bg-transparent border sm:border-0 border-[#D4AF37]/25 shadow-xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1E0B13] border border-[#D4AF37]/35 flex items-center justify-center text-[#ECC870] flex-shrink-0 shadow-xs">
              <Award size={19} />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-[#FDFBF7]">
                {t.trustConcierge || (language === 'en' ? 'Concierge Care' : 'خدمة VIP للعملاء')}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-[#D8CCC4]">
                {t.trustConciergeSub || (language === 'en' ? 'Fast WhatsApp support' : 'استشارات عطور فورية')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <HeroShowcaseModal
          currentConfig={showcaseConfig}
          onClose={() => setShowEditModal(false)}
          onSaveSuccess={(updated) => {
            setShowcaseConfig(updated);
          }}
        />
      )}
    </section>
  );
}
