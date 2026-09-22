import { Sparkles, ShieldCheck, Award, HeartHandshake, Droplet } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function About() {
  const { t, language } = useLanguage();

  return (
    <section id="about" className="py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Left Visual Stage */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] sm:aspect-square max-w-xs sm:max-w-md mx-auto rounded-3xl bg-gradient-to-b from-[#180910] to-[#0F0408] border border-[#D4AF37]/35 p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(107,23,39,0.2)]">
            {/* Spinning decorative orbit rings */}
            <div
              className="absolute w-56 sm:w-72 h-56 sm:h-72 rounded-full border border-[#D4AF37]/25 pointer-events-none"
              style={{ animation: 'spin 40s linear infinite' }}
            />
            <div
              className="absolute w-44 sm:w-56 h-44 sm:h-56 rounded-full border border-dashed border-[#D4AF37]/20 pointer-events-none"
              style={{ animation: 'spin 30s linear infinite reverse' }}
            />

            {/* Centered Luxury Emblem */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2A0C18] border border-[#D4AF37]/45 shadow-[0_0_25px_rgba(212,175,55,0.25)] flex items-center justify-center mb-3 sm:mb-4">
                <span className="serif text-2xl sm:text-3xl font-bold text-[#ECC870]">N</span>
              </div>
              <h3 className="serif text-xl sm:text-2xl font-bold text-[#FDFBF7] tracking-wider mb-1">
                NJZARO
              </h3>
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-bold">
                HAUTE PARFUMERIE
              </span>
              <div className="mt-3 sm:mt-4 px-3 py-1 rounded-full bg-[#200A13] border border-[#D4AF37]/35 text-[10px] sm:text-[11px] text-[#ECC870] font-semibold flex items-center gap-1.5 shadow-xs">
                <ShieldCheck size={13} className="text-[#D4AF37]" />
                <span>{t.originalSealedGuarantee || '100% Original Flacons & Decants'}</span>
              </div>
            </div>

            {/* Corner Luxury Accent Marks */}
            <div className="absolute top-4 sm:top-5 left-4 sm:left-5 text-[#ECC870]/60 text-xs">✦</div>
            <div className="absolute bottom-4 sm:bottom-5 right-4 sm:right-5 text-[#ECC870]/60 text-xs">✦</div>
          </div>
        </div>

        {/* Right Story Content */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3B0C15]/40 border border-[#D4AF37]/35 text-[#ECC870] w-max mb-3 sm:mb-5 shadow-xs">
            <Sparkles size={12} className="text-[#D4AF37]" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-bold">
              {t.aboutEyebrow || 'OUR HERITAGE'}
            </span>
          </div>

          <h2 className="serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7] mb-4 sm:mb-6 leading-tight">
            {t.aboutTitle || 'The Art of'}{' '}
            <span className="italic font-normal text-[#ECC870] drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]">
              {t.aboutTitleEm || 'Haute Parfumerie'}
            </span>
          </h2>

          <div className="space-y-3 sm:space-y-4 text-xs sm:text-base text-[#D8CCC4] font-light leading-relaxed mb-6 sm:mb-8">
            <p>
              {t.aboutP1 ||
                'Founded with an unwavering passion for olfactory excellence, NJZARO brings the world’s most prestigious fragrances to Iraq and the Kurdistan Region.'}
            </p>
            <p>
              {t.aboutP2 ||
                'Every decant is sterilely hand-poured from sealed authentic master bottles into medical-grade glass atomizers, ensuring uncompromised purity and original silage.'}
            </p>
          </div>

          {/* 3 Modern Stat Cards */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-4 sm:pt-6 border-t border-[#D4AF37]/20">
            <div className="p-3 sm:p-5 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 shadow-xs">
              <span className="serif text-lg sm:text-2xl md:text-3xl font-bold text-[#FDFBF7] block mb-0.5">
                {t.aboutFragrancesCount || '150+'}
              </span>
              <span className="text-[9px] sm:text-xs text-[#D8CCC4] uppercase tracking-wider block font-semibold leading-tight">
                {t.aboutFragrancesLabel || 'Rare Fragrances'}
              </span>
            </div>

            <div className="p-3 sm:p-5 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 shadow-xs">
              <span className="serif text-lg sm:text-2xl md:text-3xl font-bold text-[#ECC870] block mb-0.5">
                {t.aboutAuthenticPercent || '100%'}
              </span>
              <span className="text-[9px] sm:text-xs text-[#D8CCC4] uppercase tracking-wider block font-semibold leading-tight">
                {t.aboutAuthenticLabel || 'Original Sealed'}
              </span>
            </div>

            <div className="p-3 sm:p-5 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 shadow-xs">
              <span className="serif text-lg sm:text-2xl md:text-3xl font-bold text-[#F5DE88] block mb-0.5">
                {t.aboutRatingScore || '5.0★'}
              </span>
              <span className="text-[9px] sm:text-xs text-[#D8CCC4] uppercase tracking-wider block font-semibold leading-tight">
                {t.aboutRatingLabel || 'Client Trust'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
