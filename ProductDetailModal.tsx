import { useState, useEffect } from 'react';
import { Perfume, PerfumeSize } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage, LANGUAGES, Language } from '../context/LanguageContext';
import {
  translatePerfumeCategory,
  translatePerfumeBrand,
  getLocalizedPerfumeDescription,
  getLocalizedPyramid,
  formatVolume,
  getLocalizedSpecs,
} from '../utils/fragranceTranslator';
import {
  X,
  Heart,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Star,
  Check,
  Layers,
  Sparkles,
  Clock,
  Wind,
} from 'lucide-react';

interface ProductDetailModalProps {
  perfume: Perfume;
  onClose: () => void;
}

export function ProductDetailModal({ perfume, onClose }: ProductDetailModalProps) {
  const { addToCart, isInWishlist, toggleWishlist, setIsCheckoutOpen } = useCart();
  const { t, language, setLanguage, direction } = useLanguage();
  const [selectedSize, setSelectedSize] = useState<PerfumeSize>(
    perfume.sizes[0] || { ml: 50, price: 25000 }
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const isRTL = direction === 'rtl';

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const originalPrice =
    selectedSize.originalPrice ||
    (perfume.discountPercent
      ? Math.round(selectedSize.price / (1 - perfume.discountPercent / 100))
      : undefined);
  const hasDiscount = !!originalPrice && originalPrice > selectedSize.price;
  const isOutOfStock = perfume.inStock === false;
  const isFavorite = isInWishlist(perfume.id);

  // Multilingual dynamic translations
  const localizedBrand = translatePerfumeBrand(perfume.brand, language);
  const localizedCategory = translatePerfumeCategory(perfume.category, language);
  const localizedDescription = getLocalizedPerfumeDescription(perfume, language);
  const pyramid = getLocalizedPyramid(perfume, language);
  const specs = getLocalizedSpecs(perfume, language);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      ...perfume,
      key: `${perfume.id}-${selectedSize.ml}`,
      ml: selectedSize.ml,
      price: selectedSize.price,
      originalPrice: selectedSize.originalPrice,
      qty: quantity,
    } as any);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppOrder = () => {
    const sizeText = formatVolume(selectedSize.ml, language);
    const msg =
      language === 'en'
        ? `Hello NJZARO! I'd like to order:\n- Perfume: ${perfume.brand} - ${perfume.name}\n- Size: ${sizeText}\n- Quantity: ${quantity}\n- Price: ${(selectedSize.price * quantity).toLocaleString('en-US')} IQD`
        : language === 'badini'
        ? `سلاڤ NJZARO! دخوازم ڤی عەتری داوا بکەم:\n- عەتر: ${localizedBrand} - ${perfume.name}\n- قەبارە: ${sizeText}\n- ژمارە: ${quantity}\n- بها: ${(selectedSize.price * quantity).toLocaleString('en-US')} دینار`
        : language === 'sorani'
        ? `سڵاو NJZARO! حەز دەکەم ئەم بۆنە داوا بکەم:\n- بۆن: ${localizedBrand} - ${perfume.name}\n- قەبارە: ${sizeText}\n- ژمارە: ${quantity}\n- کۆی نرخ: ${(selectedSize.price * quantity).toLocaleString('en-US')} دینار`
        : `مرحباً NJZARO! أود طلب هذا العطر:\n- العطر: ${localizedBrand} - ${perfume.name}\n- الحجم: ${sizeText}\n- الكمية: ${quantity}\n- السعر الإجمالي: ${(selectedSize.price * quantity).toLocaleString('en-US')} د.ع`;
    window.open(`https://wa.me/9647508491439?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${perfume.name} details`}
      className="fixed inset-0 z-[1050] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#0A0407] text-[#FDFBF7] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(107,23,39,0.25)] border border-[#D4AF37]/35 overflow-y-auto flex flex-col md:flex-row animate-scale-in"
      >
        {/* Top Controls: Instant In-Modal Language Switcher & Close Button */}
        <div className="absolute top-3.5 end-3.5 z-30 flex items-center gap-1.5 sm:gap-2">
          {/* Quick Language Toggle Pills */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-[#15070D]/95 backdrop-blur-md p-1 rounded-full border border-[#D4AF37]/35 shadow-xs">
            {(['ar', 'badini', 'sorani', 'en'] as const).map((code) => {
              const isAct = language === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer select-none ${
                    isAct
                      ? 'bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] shadow-xs'
                      : 'text-[#D8CCC4] hover:text-[#ECC870] hover:bg-[#1E0B13]'
                  }`}
                  title={LANGUAGES[code].nativeName}
                >
                  {code === 'ar' ? 'العربية' : code === 'badini' ? 'بادینی' : code === 'sorani' ? 'سۆرانی' : 'EN'}
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#15070D]/95 hover:bg-[#1E0B13] border border-[#D4AF37]/35 flex items-center justify-center text-[#D8CCC4] hover:text-[#ECC870] transition-colors cursor-pointer shadow-xs"
          >
            <X size={17} />
          </button>
        </div>

        {/* Left: Product Imagery Showcase */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 bg-[#12050B] flex flex-col items-center justify-between relative border-b md:border-b-0 md:border-e border-[#D4AF37]/25">
          {/* Top Badges */}
          <div className="w-full flex items-center justify-between pe-36 sm:pe-40">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#18070F] border border-[#D4AF37]/35 text-[#ECC870] text-[10px] uppercase tracking-wider font-bold">
                {localizedCategory}
              </span>
              {hasDiscount && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#6B1727] border border-[#D4AF37]/40 text-[#FDFBF7] text-[10px] uppercase font-bold tracking-wider">
                  {t.sale || 'SALE'}
                </span>
              )}
            </div>

            <button
              onClick={() => toggleWishlist(perfume.id)}
              className="p-2 rounded-full bg-[#18070F] border border-[#D4AF37]/35 text-[#D8CCC4] hover:text-[#ECC870] transition-colors cursor-pointer shadow-xs"
              title={t.addToWishlist || 'Add to Wishlist'}
            >
              <Heart
                size={18}
                className={isFavorite ? 'fill-[#ECC870] text-[#ECC870]' : ''}
              />
            </button>
          </div>

          {/* Centered Image */}
          <div className="my-auto py-8 flex items-center justify-center">
            {perfume.img ? (
              <img
                src={perfume.img}
                alt={perfume.name}
                className="max-h-64 sm:max-h-80 w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-48 h-64 rounded-2xl border border-[#D4AF37]/30 bg-[#18070F] flex flex-col items-center justify-center">
                <span className="serif text-5xl font-bold text-[#ECC870]">N</span>
                <span className="text-xs text-[#D4AF37] mt-2 font-bold tracking-widest">NJZARO HAUTE</span>
              </div>
            )}
          </div>

          {/* Authenticity Guarantee Micro-Pill */}
          <div className="w-full py-2.5 px-3.5 rounded-xl bg-[#18070F] border border-[#D4AF37]/30 flex items-center justify-center gap-2 text-xs text-[#ECC870] text-center font-medium">
            <ShieldCheck size={14} className="text-[#D4AF37] flex-shrink-0" />
            <span>{specs.authenticity}</span>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#0D0408]">
          <div>
            {/* Brand & Reviews */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                {localizedBrand}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#FDFBF7]">
                <Star size={13} className="fill-[#D4AF37] text-[#D4AF37]" />
                <span className="text-[#ECC870]">5.0</span>
                <span className="text-[#8F877E]">(28 {t.reviewsCount || 'reviews'})</span>
              </div>
            </div>

            {/* Product Name */}
            <h2 className="serif text-2xl sm:text-3xl font-bold text-[#FDFBF7] mb-3">
              {perfume.name}
            </h2>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="serif text-2xl sm:text-3xl font-bold text-[#ECC870]">
                {selectedSize.price.toLocaleString('en-US')} {t.currency || 'IQD'}
              </span>
              {hasDiscount && (
                <span className="text-sm text-[#8F877E] line-through">
                  {originalPrice?.toLocaleString('en-US')} {t.currency || 'IQD'}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs font-bold text-[#FDFBF7] bg-[#6B1727] border border-[#D4AF37]/30 px-2 py-0.5 rounded-md">
                  {t.saveAmount || 'Save'} {((originalPrice! - selectedSize.price)).toLocaleString('en-US')} {t.currency || 'IQD'}
                </span>
              )}
            </div>

            {/* Localized Fragrance Description */}
            <p className="text-xs sm:text-sm text-[#D8CCC4] font-normal leading-relaxed mb-5 border-y border-[#D4AF37]/20 py-3">
              {localizedDescription}
            </p>

            {/* Luxury Fragrance Specs Chips */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="bg-[#15070D] p-2.5 rounded-xl border border-[#D4AF37]/25 text-center shadow-xs">
                <span className="text-[10px] text-[#8F877E] uppercase block font-semibold tracking-wider">
                  {language === 'en' ? 'Concentration' : language === 'badini' ? 'خەستی' : language === 'sorani' ? 'خەستی' : 'التركيز'}
                </span>
                <span className="text-[11px] font-bold text-[#FDFBF7] leading-tight block mt-0.5">
                  {specs.concentration}
                </span>
              </div>
              <div className="bg-[#15070D] p-2.5 rounded-xl border border-[#D4AF37]/25 text-center shadow-xs">
                <span className="text-[10px] text-[#8F877E] uppercase block font-semibold tracking-wider">
                  {language === 'en' ? 'Longevity' : language === 'badini' ? 'مانەڤە' : language === 'sorani' ? 'مانەوە' : 'الثبات'}
                </span>
                <span className="text-[11px] font-bold text-[#ECC870] leading-tight block mt-0.5">
                  {specs.longevity}
                </span>
              </div>
              <div className="bg-[#15070D] p-2.5 rounded-xl border border-[#D4AF37]/25 text-center shadow-xs">
                <span className="text-[10px] text-[#8F877E] uppercase block font-semibold tracking-wider">
                  {language === 'en' ? 'Sillage' : language === 'badini' ? 'بێهنڤەدان' : language === 'sorani' ? 'بڵاوبوونەوە' : 'الفوحان'}
                </span>
                <span className="text-[11px] font-bold text-[#ECC870] leading-tight block mt-0.5">
                  {specs.sillage}
                </span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#FDFBF7] uppercase tracking-wider">
                  {t.selectVolume || 'Select Volume / Decant:'}
                </span>
                <span className="text-[11px] text-[#ECC870] font-bold">
                  {formatVolume(selectedSize.ml, language)}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {perfume.sizes.map((size) => {
                  const isSelected = selectedSize.ml === size.ml;
                  return (
                    <button
                      key={size.ml}
                      onClick={() => setSelectedSize(size)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] border-[#D4AF37] font-bold shadow-[0_2px_10px_rgba(212,175,55,0.3)]'
                          : 'bg-[#15070D] text-[#D8CCC4] border-[#D4AF37]/25 hover:border-[#D4AF37] hover:text-[#FDFBF7]'
                      }`}
                    >
                      <span className="text-xs block">{formatVolume(size.ml, language)}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-[#0A0407]' : 'text-[#ECC870]'}`}>
                        {size.price.toLocaleString('en-US')} {t.currency || 'IQD'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Olfactory Pyramid / Fragrance Notes Breakdown */}
            <div className="p-4 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 space-y-2.5 mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#ECC870] uppercase tracking-wider">
                <Layers size={14} className="text-[#D4AF37]" />
                <span>{t.fragrancePyramid || 'Fragrance Pyramid'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2.5 bg-[#1E0B13] rounded-xl border border-[#D4AF37]/20">
                  <span className="text-[#ECC870] font-bold block text-[10px] uppercase mb-0.5">
                    {t.topNotes || 'Top Notes'}
                  </span>
                  <span className="text-[#FDFBF7] font-medium leading-tight line-clamp-2">{pyramid.topNotes}</span>
                </div>
                <div className="p-2.5 bg-[#1E0B13] rounded-xl border border-[#D4AF37]/20">
                  <span className="text-[#ECC870] font-bold block text-[10px] uppercase mb-0.5">
                    {t.heartNotes || 'Heart Notes'}
                  </span>
                  <span className="text-[#FDFBF7] font-medium leading-tight line-clamp-2">{pyramid.heartNotes}</span>
                </div>
                <div className="p-2.5 bg-[#1E0B13] rounded-xl border border-[#D4AF37]/20">
                  <span className="text-[#ECC870] font-bold block text-[10px] uppercase mb-0.5">
                    {t.baseNotes || 'Base Notes'}
                  </span>
                  <span className="text-[#FDFBF7] font-medium leading-tight line-clamp-2">{pyramid.baseNotes}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#D4AF37]/20 space-y-2.5">
            {/* Quantity Selector & Add to Bag */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-[#D4AF37]/30 rounded-full px-2 py-1 bg-[#15070D]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center text-[#D8CCC4] hover:text-[#ECC870] cursor-pointer text-sm font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-[#FDFBF7]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 flex items-center justify-center text-[#D8CCC4] hover:text-[#ECC870] cursor-pointer text-sm font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-[0_4px_16px_rgba(212,175,55,0.35)] ${
                  isOutOfStock
                    ? 'bg-[#1E0B13] text-[#8F877E] cursor-not-allowed border border-[#D4AF37]/20'
                    : isAdded
                    ? 'bg-[#25D366] text-[#0A0407]'
                    : 'bg-gradient-to-r from-[#F5DE88] via-[#D4AF37] to-[#A67C1E] text-[#0A0407] hover:brightness-110'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={16} />
                    <span>{t.addedToBag || 'Added to Bag'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>{t.addToBag || 'Add to Bag'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Buy Now & WhatsApp Row */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#6B1727] hover:bg-[#851D31] border border-[#D4AF37]/40 text-white text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shadow-xs"
              >
                {t.buyNow || 'Buy Now'}
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="py-2.5 px-4 rounded-full border border-[#25D366]/50 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-[#0A0407] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title={t.orderViaWhatsApp || 'WhatsApp'}
              >
                <MessageCircle size={15} />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
