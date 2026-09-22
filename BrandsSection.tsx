import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export function BrandsSection() {
  const { t, language, direction } = useLanguage();
  const { setActiveBrandFilter } = useCart();
  const isRTL = direction === 'rtl';

  const brands = [
    { name: 'Ibrahim Al Qurashi', origin: 'Saudi Arabia', specialty: 'Oud & Royal Musk', logoText: 'إبراهيم القرشي' },
    { name: 'Lattafa', origin: 'UAE', specialty: 'Khamrah & Asad', logoText: 'LATTAFA' },
    { name: 'Afnan', origin: 'UAE', specialty: '9PM & Supremacy', logoText: 'AFNAN' },
    { name: 'Rasasi', origin: 'UAE', specialty: 'Hawas & Shuhrah', logoText: 'RASASI' },
    { name: 'Armaf', origin: 'UAE', specialty: 'Club de Nuit', logoText: 'ARMAF' },
    { name: 'Dior', origin: 'France', specialty: 'Sauvage & Homme', logoText: 'DIOR' },
    { name: 'Yves Saint Laurent', origin: 'France', specialty: 'Y & Tuxedo', logoText: 'YSL' },
    { name: 'Chanel', origin: 'France', specialty: 'Bleu de Chanel', logoText: 'CHANEL' },
    { name: 'Tom Ford', origin: 'USA', specialty: 'Ombré Leather & Tobacco Vanille', logoText: 'TOM FORD' },
    { name: 'Creed', origin: 'France', specialty: 'Aventus & Green Irish', logoText: 'CREED' },
    { name: 'Versace', origin: 'Italy', specialty: 'Eros & Dylan Blue', logoText: 'VERSACE' },
    { name: 'Parfums de Marly', origin: 'France', specialty: 'Layton & Althaïr', logoText: 'DE MARLY' },
  ];

  const handleBrandClick = (brandName: string) => {
    setActiveBrandFilter(brandName);
    const el = document.getElementById('shop') || document.getElementById('collection');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="brands" className="py-14 sm:py-18 lg:py-24 bg-[#0D0408] border-b border-[#D4AF37]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#3B0C15]/40 border border-[#D4AF37]/35 text-[#ECC870] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3 shadow-xs">
            <Sparkles size={12} className="text-[#D4AF37]" />
            <span>{t.renownedPerfumeHouses || (language === 'en' ? 'Renowned Perfume Houses' : 'دور العطور العالمية')}</span>
          </div>
          <h2 className="serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FDFBF7] mb-2 sm:mb-3">
            {t.explorePrestigiousBrands || (language === 'en' ? 'Explore Prestigious Brands' : 'استكشف الماركات العالمية')}
          </h2>
          <p className="text-xs sm:text-sm text-[#D8CCC4] font-light leading-relaxed">
            {t.brandsSectionDesc || (language === 'en'
              ? 'Discover original creations from the worlds most acclaimed oriental masters and Parisian ateliers.'
              : 'اكتشف إبداعات أصلية من كبرى دور العطور الشرقية المرموقة وبيوت الأزياء الفرنسية.')}
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {brands.map((b) => (
            <div
              key={b.name}
              onClick={() => handleBrandClick(b.name)}
              className="group p-3 sm:p-5 rounded-2xl border border-[#D4AF37]/20 bg-[#15070D] hover:border-[#D4AF37] hover:bg-[#1E0B13] hover:shadow-[0_8px_25px_rgba(212,175,55,0.2),0_0_15px_rgba(107,23,39,0.3)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[110px] sm:min-h-[140px]"
            >
              <span className="cinzel text-sm sm:text-base md:text-lg font-bold text-[#FDFBF7] group-hover:text-[#ECC870] transition-colors mb-0.5 sm:mb-1 tracking-wider">
                {b.logoText}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#D8CCC4] group-hover:text-[#FDFBF7] transition-colors truncate max-w-full font-medium">
                {b.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#A69B92] mt-0.5 sm:mt-1 truncate max-w-full">
                {b.specialty}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Banner inside Brands */}
        <div className="mt-8 sm:mt-12 p-5 sm:p-7 md:p-9 rounded-3xl bg-gradient-to-r from-[#17060E] via-[#240A15] to-[#17060E] border border-[#D4AF37]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(107,23,39,0.2)]">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-[#D4AF37] tracking-widest uppercase block mb-1">
              {t.decantBarExperience || (language === 'en' ? 'Decant Bar Experience' : 'تجربة عينات الديكانت')}
            </span>
            <h3 className="serif text-lg sm:text-xl md:text-2xl font-bold text-[#FDFBF7]">
              {t.sampleAnyNiche || (language === 'en'
                ? 'Sample Any Niche Fragrance Before Buying Full Bottle'
                : 'جرّب عينات العطور النيش والأصلية بحجم 2 مل، 5 مل، و10 مل')}
            </h3>
          </div>
          <button
            onClick={() => {
              setActiveBrandFilter(null);
              const el = document.getElementById('shop') || document.getElementById('collection');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#F5DE88] via-[#D4AF37] to-[#A67C1E] text-[#0A0407] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 flex-shrink-0 cursor-pointer shadow-[0_4px_18px_rgba(212,175,55,0.3)] border border-[#FFE79E]/40"
          >
            <span>{t.shopDecants || (language === 'en' ? 'Shop Decants' : 'تسوق الديكانت')}</span>
            {isRTL ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
          </button>
        </div>
      </div>
    </section>
  );
}
