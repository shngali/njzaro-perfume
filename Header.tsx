import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AnnouncementBar } from './AnnouncementBar';
import { OwnerDashboardModal } from './OwnerDashboardModal';
import { AdminLoginModal } from './AdminLoginModal';
import {
  ShoppingBag,
  Search,
  Heart,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
  ShieldCheck,
  Crown,
  ChevronRight,
  Phone,
} from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ownerDashboardOpen, setOwnerDashboardOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const { cartCount, cartTotal, setIsCartOpen, wishlistCount, setIsWishlistOpen, setIsSearchOpen, setActiveCategoryFilter } = useCart();
  const { user, signIn, signOut, isAdmin, isOwner, role } = useAuth();
  const { t, language, direction } = useLanguage();

  const isPrivileged = isOwner || isAdmin;
  const isRTL = direction === 'rtl';

  const handleOpenDashboard = () => {
    setMobileMenuOpen(false);
    if (isPrivileged) {
      setOwnerDashboardOpen(true);
    } else {
      setAdminLoginOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (categoryFilter?: string, hashTarget?: string) => {
    setMobileMenuOpen(false);
    if (categoryFilter !== undefined) {
      setActiveCategoryFilter(categoryFilter);
    }
    const target = hashTarget || (categoryFilter ? 'shop' : 'home');
    const el = document.getElementById(target) || document.getElementById('collection');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        id="siteHeader"
        className="fixed top-0 inset-x-0 z-[900] pointer-events-auto bg-[#0A0407]/95 backdrop-blur-md transition-shadow duration-300"
      >
        <AnnouncementBar />

        {/* Main Header Bar */}
        <div
          className={`border-b border-[#D4AF37]/20 transition-all duration-300 ${
            scrolled ? 'py-3 shadow-[0_4px_30px_rgba(0,0,0,0.85)]' : 'py-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left Section: Mobile Navigation & Search, Desktop Search */}
            <div className="flex-1 basis-0 flex items-center justify-start gap-1 sm:gap-2.5 min-w-0">
              {/* Mobile Hamburger (Three lines) */}
              <button
                id="mobileMenuTriggerBtn"
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#FDFBF7] hover:text-[#ECC870] hover:bg-[#1E0B12] active:bg-[#2A0F1A] transition-colors cursor-pointer flex-shrink-0"
                aria-label="Open Navigation Menu"
              >
                <Menu size={21} />
              </button>

              {/* Mobile Search Icon */}
              <button
                type="button"
                id="mobileSearchHeaderBtn"
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#FDFBF7] hover:text-[#ECC870] hover:bg-[#1E0B12] active:bg-[#2A0F1A] transition-colors cursor-pointer flex-shrink-0"
                aria-label="Search"
                title={t.searchPlaceholder || 'بحث'}
              >
                <Search size={19} />
              </button>

              {/* Desktop Search Trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#14070C] hover:bg-[#1E0B12] border border-[#D4AF37]/25 text-[#D6CEC4] hover:text-[#FDFBF7] transition-colors cursor-pointer text-xs w-full max-w-[210px] xl:max-w-[240px]"
              >
                <Search size={15} className="text-[#D4AF37] flex-shrink-0" />
                <span className="truncate">{t.searchPlaceholder || 'ابحث عن العطور...'}</span>
              </button>
            </div>

            {/* Center Section: Logo Lockup */}
            <div className="flex-shrink-0 flex items-center justify-center text-center px-4 sm:px-8">
              <a href="#home" className="flex flex-col items-center group cursor-pointer" dir="ltr">
                <span className="cinzel text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.18em] sm:tracking-[0.26em] text-[#FDFBF7] group-hover:text-[#ECC870] transition-colors leading-tight whitespace-nowrap drop-shadow-[0_2px_8px_rgba(212,175,55,0.2)]">
                  NJZARO
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.24em] sm:tracking-[0.36em] uppercase text-[#D4AF37] font-semibold mt-0.5 whitespace-nowrap">
                  HAUTE PARFUMERIE
                </span>
              </a>
            </div>

            {/* Right Section: Actions (Crown, Language, Wishlist, Cart) */}
            <div className="flex-1 basis-0 flex items-center justify-end gap-1 sm:gap-2.5 min-w-0">
              {/* Crown Icon Button for Admins */}
              {isPrivileged && (
                <button
                  type="button"
                  id="mobileHeaderAdminCrownBtn"
                  onClick={handleOpenDashboard}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer bg-[#3B0C15] hover:bg-[#52101E] text-[#ECC870] hover:text-white border border-[#D4AF37]/50 shadow-[0_0_12px_rgba(212,175,55,0.2)] flex-shrink-0"
                  title={t.openDashboard || 'لوحة تحكم المسؤول'}
                  aria-label="Admin Dashboard"
                >
                  <Crown size={15} />
                </button>
              )}

              {/* Language Switcher (Desktop) */}
              <div className="hidden sm:block">
                <LanguageSwitcher variant="header" />
              </div>

              {/* Account Sign Out / In Trigger (Desktop) */}
              {!isPrivileged && (
                user ? (
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="hidden sm:flex items-center gap-1 p-2 text-[#D6CEC4] hover:text-[#ECC870] transition-colors cursor-pointer"
                    title={t.signOut}
                  >
                    <LogOut size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      signIn().catch(() => {});
                    }}
                    className="hidden sm:flex items-center gap-1.5 p-2 text-[#D6CEC4] hover:text-[#ECC870] transition-colors cursor-pointer"
                    title={t.signIn}
                  >
                    <User size={19} />
                  </button>
                )
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-1.5 sm:p-2 text-[#FDFBF7] hover:text-[#ECC870] transition-colors cursor-pointer flex-shrink-0"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart size={18} className="sm:hidden" />
                <Heart size={20} className="hidden sm:block" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 end-0.5 sm:top-1 sm:end-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#D4AF37] text-[#0A0407] text-[8px] sm:text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-[#F5DE88] via-[#D4AF37] to-[#A67C1E] hover:brightness-110 text-[#0A0407] font-bold border border-[#FFE79E]/40 transition-all cursor-pointer flex-shrink-0 shadow-[0_2px_14px_rgba(212,175,55,0.3)]"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={16} className="text-[#0A0407] sm:hidden" />
                <ShoppingBag size={18} className="text-[#0A0407] hidden sm:block" />
                <span className="text-[11px] sm:text-xs font-bold">{cartCount}</span>
                {cartTotal > 0 && (
                  <span className="hidden md:inline text-xs text-[#0A0407] border-s border-[#0A0407]/30 ps-2 font-bold">
                    {cartTotal.toLocaleString('en-US')} {t.currency || 'IQD'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Row */}
        <nav aria-label="Main Navigation" className="hidden lg:block border-b border-[#D4AF37]/15 bg-[#0F0508]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center gap-8 py-2.5 text-xs uppercase tracking-[0.18em] font-medium text-[#D6CEC4]">
              <li>
                <button
                  onClick={() => handleNavClick('', 'home')}
                  className="hover:text-[#ECC870] transition-colors cursor-pointer"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('All', 'shop')}
                  className="hover:text-[#ECC870] transition-colors cursor-pointer"
                >
                  {t.catalogTitle ? `${t.all} - ${t.navCollection}` : t.navCollection}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('Men', 'shop')}
                  className="hover:text-[#ECC870] transition-colors cursor-pointer"
                >
                  {t.navMen}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('Women', 'shop')}
                  className="hover:text-[#ECC870] transition-colors cursor-pointer"
                >
                  {t.navWomen}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('Unisex', 'shop')}
                  className="hover:text-[#ECC870] transition-colors cursor-pointer"
                >
                  {t.navUnisex}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('Arabian', 'shop')}
                  className="hover:text-[#ECC870] transition-colors cursor-pointer"
                >
                  {t.navArabian}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick(undefined, 'brands')}
                  className="hover:text-[#ECC870] transition-colors cursor-pointer"
                >
                  {t.navBrands}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick(undefined, 'new-arrivals')}
                  className="hover:text-[#ECC870] transition-colors cursor-pointer text-[#ECC870] font-semibold flex items-center gap-1"
                >
                  <Sparkles size={11} className="text-[#D4AF37]" />
                  <span>{t.navNewArrivals}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick(undefined, 'best-sellers')}
                  className="hover:text-[#ECC870] transition-colors cursor-pointer"
                >
                  {t.navBestSellers}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick(undefined, 'offers')}
                  className="hover:text-[#ECC870] transition-colors cursor-pointer text-[#F5DE88] font-bold"
                >
                  {t.navOffers}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick(undefined, 'about')}
                  className="hover:text-[#ECC870] transition-colors cursor-pointer"
                >
                  {t.navAbout}
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer (Left sliding on LTR, Right on RTL) */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-[1000] lg:hidden overflow-hidden animate-fade-in"
        >
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            className={`fixed top-0 bottom-0 ${
              isRTL ? 'right-0' : 'left-0'
            } w-[84vw] max-w-[340px] bg-[#111017] shadow-2xl z-10 flex flex-col justify-between border-e border-[#D4AF37]/25 animate-fade-up`}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#15141D] flex-shrink-0">
              <div className="flex flex-col" dir="ltr">
                <span className="cinzel text-lg font-bold tracking-[0.22em] text-[#FDFBF7]">
                  NJZARO
                </span>
                <span className="text-[8px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
                  HAUTE PARFUMERIE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D6CEC4] hover:text-[#ECC870] hover:bg-[#1E1D28] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={17} />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Admin / Owner Status Row */}
              <button
                type="button"
                onClick={handleOpenDashboard}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#24060C] to-[#3B0A13] border border-[#D4AF37]/35 text-start cursor-pointer transition-transform active:scale-[0.99] shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#111017] border border-[#D4AF37]/40 flex items-center justify-center text-[#ECC870] flex-shrink-0 shadow-xs">
                    <Crown size={15} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#FDFBF7] block truncate">
                      NJZARO BOUTIQUE
                    </span>
                    <span className="text-[10px] text-[#ECC870] block truncate mt-0.5 font-medium">
                      {isPrivileged
                        ? (isOwner ? (t.owner || 'المالك - التحكم بالمتجر') : (t.admin || 'المشرف - التحكم بالمتجر'))
                        : (t.tapToOpenDashboard || 'انقر لفتح لوحة التحكم')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ms-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0B0B0E] font-bold">
                    {isPrivileged ? (t.activeAdmin || '✓ Active') : (t.admin || 'Admin')}
                  </span>
                  <ChevronRight
                    size={15}
                    className={`text-[#ECC870] ${isRTL ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* Navigation Links */}
              <nav className="space-y-1" aria-label="Mobile Navigation">
                {[
                  {
                    label: t.navHome,
                    cat: '',
                    target: 'home',
                  },
                  {
                    label: t.catalogTitle ? `${t.all} - ${t.navCollection}` : t.navCollection,
                    cat: 'All',
                    target: 'shop',
                  },
                  {
                    label: t.navMen,
                    cat: 'Men',
                    target: 'shop',
                  },
                  {
                    label: t.navWomen,
                    cat: 'Women',
                    target: 'shop',
                  },
                  {
                    label: t.navUnisex,
                    cat: 'Unisex',
                    target: 'shop',
                  },
                  {
                    label: t.navArabian,
                    cat: 'Arabian',
                    target: 'shop',
                  },
                  {
                    label: t.navBrands,
                    target: 'brands',
                  },
                  {
                    label: t.navNewArrivals,
                    target: 'new-arrivals',
                    isNew: true,
                  },
                  {
                    label: t.navBestSellers,
                    target: 'best-sellers',
                  },
                  {
                    label: t.navOffers,
                    target: 'offers',
                    isSale: true,
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleNavClick(item.cat, item.target)}
                    className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-start text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none ${
                      item.isSale
                        ? 'text-[#F5DE88] bg-[#8B1E30]/25 hover:bg-[#8B1E30]/40 border border-[#8B1E30]/50 font-bold'
                        : item.isNew
                        ? 'text-[#ECC870] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/30 font-semibold'
                        : 'text-[#FDFBF7] hover:bg-[#1C1B26] active:bg-[#242232]'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {item.isSale && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#8B1E30] text-white font-semibold">
                          %
                        </span>
                      )}
                      {item.isNew && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#D4AF37] text-[#0B0B0E] font-bold">
                          ★
                        </span>
                      )}
                      <ChevronRight
                        size={15}
                        className={`text-[#D6CEC4]/50 ${isRTL ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>
                ))}
              </nav>

              {/* Quick Contact & Wishlist in Drawer */}
              <div className="pt-3 border-t border-[#D4AF37]/20 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="drawerWishlistBtn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="py-2.5 px-2.5 rounded-xl border border-[#D4AF37]/25 bg-[#171622] hover:bg-[#1E1D2B] flex items-center justify-center gap-1.5 text-xs font-medium text-[#FDFBF7] cursor-pointer transition-colors"
                >
                  <Heart size={14} className="text-[#ECC870] fill-[#ECC870]/20 flex-shrink-0" />
                  <span className="truncate">{t.wishlist}</span>
                  {wishlistCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-[#0B0B0E] font-bold flex-shrink-0 shadow-xs">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <a
                  href="https://wa.me/9647508491439"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-2.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#4ADE80] hover:bg-[#25D366]/25 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors"
                >
                  <Phone size={14} className="text-[#4ADE80] flex-shrink-0" />
                  <span className="truncate">{language === 'en' ? 'WhatsApp' : 'واتساب'}</span>
                </a>
              </div>

              {/* Language Switcher for Mobile */}
              <div className="pt-3 border-t border-[#D4AF37]/20">
                <LanguageSwitcher variant="mobile" />
              </div>
            </div>

            {/* Drawer Bottom Details */}
            <div className="p-3.5 sm:p-4 pb-6 sm:pb-4 border-t border-[#D4AF37]/20 bg-[#15141D] flex-shrink-0 space-y-2">
              <button
                type="button"
                id="drawerOwnerDashboardBtn"
                onClick={handleOpenDashboard}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F5DE88] via-[#D4AF37] to-[#A67C1E] text-[#0B0B0E] font-bold border border-[#FFE79E]/40 flex items-center justify-center gap-2 text-xs cursor-pointer transition-transform active:scale-[0.99] shadow-sm"
              >
                <Crown size={14} className="text-[#0B0B0E]" />
                <span>{t.openDashboard || 'لوحة تحكم المسؤول'}</span>
                {isPrivileged && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#0B0B0E] text-[#ECC870] font-bold">
                    {isOwner ? t.owner : t.admin}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 rounded-xl bg-[#1C1B26] border border-[#D4AF37]/20 text-xs text-[#FDFBF7] truncate">
                    <span className="font-semibold block truncate">{user.displayName || user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="p-2.5 rounded-xl border border-[#D4AF37]/25 text-[#D6CEC4] hover:text-[#ECC870] hover:border-[#ECC870] transition-colors cursor-pointer"
                    title={t.signOut}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  id="drawerSignInBtn"
                  onClick={() => {
                    signIn().catch(() => {});
                  }}
                  className="w-full py-2 rounded-xl border border-[#D4AF37]/25 hover:border-[#D4AF37] bg-[#171622] text-[#D6CEC4] hover:text-[#ECC870] text-[11px] font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <User size={13} />
                  <span>{t.signIn}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={() => {
          setAdminLoginOpen(false);
          setOwnerDashboardOpen(true);
        }}
      />

      {/* Owner Dashboard Modal */}
      {ownerDashboardOpen && (
        <OwnerDashboardModal onClose={() => setOwnerDashboardOpen(false)} />
      )}
    </>
  );
}
