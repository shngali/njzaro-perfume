import { useState, FormEvent } from 'react';
import { MapPin, Clock, Phone, MessageCircle, Instagram, Check, ShieldCheck, Truck, Droplets } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Footer() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer id="contact" className="border-t border-[#D4AF37]/25 bg-[#080305] pt-14 sm:pt-18 lg:pt-22 pb-8 sm:pb-12 text-[#FDFBF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 pb-10 sm:pb-16 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#1E0B13] border border-[#D4AF37]/35 flex items-center justify-center text-[#ECC870] flex-shrink-0 shadow-xs">
              <ShieldCheck size={19} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#FDFBF7] block uppercase tracking-wider">
                {t.trustAuthentic || '100% Authentic'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#D8CCC4]">
                {t.trustAuthenticSub || 'Original sealed flacons'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#1E0B13] border border-[#D4AF37]/35 flex items-center justify-center text-[#ECC870] flex-shrink-0 shadow-xs">
              <Droplets size={19} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#FDFBF7] block uppercase tracking-wider">
                {t.trustDecants || 'Hand-Poured Decants'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#D8CCC4]">
                {t.trustDecantsSub || 'Laboratory precision atomizers'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#1E0B13] border border-[#D4AF37]/35 flex items-center justify-center text-[#ECC870] flex-shrink-0 shadow-xs">
              <Truck size={19} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#FDFBF7] block uppercase tracking-wider">
                {t.trustDelivery || 'Fast Iraq Delivery'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#D8CCC4]">
                {t.trustDeliverySub || 'All cities within 24-48 hours'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#1E0B13] border border-[#D4AF37]/35 flex items-center justify-center text-[#ECC870] flex-shrink-0 shadow-xs">
              <MessageCircle size={19} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#FDFBF7] block uppercase tracking-wider">
                {t.trustConcierge || 'Fragrance Concierge'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#D8CCC4]">
                {t.trustConciergeSub || 'WhatsApp recommendations'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Bio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 py-10 sm:py-16 border-b border-[#D4AF37]/20">
          {/* Col 1: Brand & About */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#240A15] border border-[#D4AF37]/45 text-[#ECC870] flex items-center justify-center serif font-bold text-xl shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                N
              </div>
              <div>
                <span className="serif text-xl font-bold tracking-wider text-[#FDFBF7] block leading-none">
                  NJZARO
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#D4AF37] font-bold">
                  HAUTE PARFUMERIE
                </span>
              </div>
            </div>

            <p className="text-xs text-[#D8CCC4] font-light leading-relaxed max-w-sm">
              {language === 'en'
                ? 'Curating the world’s most distinguished niche fragrances and oriental extraits. Authentic luxury bottles and custom hand-poured decants crafted for true connoisseurs.'
                : language === 'badini'
                ? 'کۆمەلەکا دەستنیشانکری ژ باشترین و ناڤدارترین عەترێن جیهانی و ڕۆژهەڵاتی. شوشەیێن ئەسڵی یێن مۆرکری و دیکانتێن تایبەت.'
                : language === 'sorani'
                ? 'کۆکراوەیەکی دەستنیشانکراو لە باشترین و ناوبانگترین بۆنە جیهانی و ڕۆژهەڵاتییەکان. شووشەی ئەسڵی مۆرکراو و دیکانتی تایبەت.'
                : 'وجهتكم الأولى لأرقى عطور النيش العالمية والنفحات الشرقية الفاخرة. عبوات أصلية كاملة وتقسيم ديكانت احترافي لعشاق التميز.'}
            </p>

            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <a
                href="https://wa.me/9647508491439"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#15070D] border border-[#D4AF37]/30 text-[#FDFBF7] hover:text-[#25D366] hover:border-[#25D366]/60 text-xs font-medium transition-colors shadow-xs"
              >
                <MessageCircle size={14} className="text-[#25D366]" />
                <span>WhatsApp</span>
              </a>

              <a
                href="https://www.instagram.com/njzaro/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#15070D] border border-[#D4AF37]/30 text-[#FDFBF7] hover:text-[#E4405F] hover:border-[#E4405F]/60 text-xs font-medium transition-colors shadow-xs"
              >
                <Instagram size={14} className="text-[#E4405F]" />
                <span>Instagram</span>
              </a>

              <a
                href="https://www.tiktok.com/@njzaro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#15070D] border border-[#D4AF37]/30 text-[#FDFBF7] hover:text-[#ECC870] hover:border-[#D4AF37] text-xs font-medium transition-colors shadow-xs"
              >
                <span className="font-bold text-xs text-[#ECC870]">TT</span>
                <span>TikTok</span>
              </a>

              <a
                href="https://www.google.com/maps?q=36.86967468261719,42.99406051635742&z=17&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#15070D] border border-[#D4AF37]/30 text-[#FDFBF7] hover:text-[#ECC870] hover:border-[#D4AF37] text-xs font-medium transition-colors shadow-xs"
              >
                <MapPin size={14} className="text-[#ECC870]" />
                <span>{language === 'en' ? 'Location' : language === 'badini' ? 'جهـ' : language === 'sorani' ? 'ناونیشان' : 'الموقع'}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="serif uppercase tracking-[0.18em] font-bold text-[#ECC870] mb-4">
              {t.navigation || 'روابط سريعة'}
            </h4>
            <ul className="space-y-2.5 text-[#D8CCC4]">
              <li>
                <a href="#home" className="hover:text-[#ECC870] transition-colors">
                  {t.navHome}
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-[#ECC870] transition-colors">
                  {t.navCollection}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#ECC870] transition-colors">
                  {t.shopByCategory || (language === 'en' ? 'Categories' : 'التصنيفات')}
                </a>
              </li>
              <li>
                <a href="#brands" className="hover:text-[#ECC870] transition-colors">
                  {t.navBrands}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#ECC870] transition-colors">
                  {t.boutiqueVisit || (language === 'en' ? 'Boutique & Contact' : 'الفرع والتواصل')}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Boutique Location & Hours */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="serif uppercase tracking-[0.18em] font-bold text-[#ECC870] mb-4">
              {t.boutiqueVisit || 'Boutique Visit'}
            </h4>
            <div className="space-y-2.5 text-[#D8CCC4]">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>{t.boutiqueAddressFull || 'Duhok, Kurdistan Region, Iraq · Central Commercial District'}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={15} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>{t.openingHoursFull || 'Open Daily: 10:00 AM – 11:00 PM'}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone size={15} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span dir="ltr" className="text-[#FDFBF7] font-semibold">+964 750 849 1439</span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="serif uppercase tracking-[0.18em] font-bold text-[#ECC870] mb-4">
              {t.priveNewsletter || 'Privé Newsletter'}
            </h4>
            <p className="text-[#D8CCC4] font-light leading-relaxed">
              {t.newsletterDesc || 'Receive private invitations to limited decant releases and rare perfume arrivals.'}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-1">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.enterEmailPlaceholder || 'Enter your email...'}
                  className="w-full bg-[#15070D] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-full px-4 py-2.5 text-xs text-[#FDFBF7] placeholder-[#A69B92] outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#F5DE88] via-[#D4AF37] to-[#A67C1E] hover:brightness-110 text-[#0A0407] text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_2px_14px_rgba(212,175,55,0.3)]"
              >
                {subscribed ? (
                  <>
                    <Check size={14} className="text-[#0A0407]" />
                    <span>{t.subscribed || 'Subscribed'}</span>
                  </>
                ) : (
                  <span>{t.subscribe || 'Subscribe'}</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright & Language */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8F877E]">
          <div>
            © 2026 NJZARO Haute Parfumerie. All rights reserved. Decants & Luxury Fragrances.
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
