import { useState, useEffect, MouseEvent } from 'react';
import { Perfume } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AdminProductModal } from './AdminProductModal';
import { permanentlyDeletePerfume } from '../utils/productManager';
import {
  translatePerfumeBrand,
  translatePerfumeNotes,
  formatVolume,
} from '../utils/fragranceTranslator';
import {
  Edit2,
  Plus,
  Check,
  MessageCircle,
  Trash2,
  Heart,
  Eye,
  X,
  Droplet,
} from 'lucide-react';

export function ProductCard({ perfume, index }: { perfume: Perfume; index: number; key?: any }) {
  const { t, language, direction } = useLanguage();
  const [selectedSize, setSelectedSize] = useState(perfume.sizes[0] || { ml: 50, price: 25000 });
  const [isAdded, setIsAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { addToCart, setIsCartOpen, isInWishlist, toggleWishlist, setQuickViewProduct } = useCart();
  const { isAdmin, isOwner } = useAuth();

  useEffect(() => {
    setImgError(false);
  }, [perfume.img]);

  const isPrivileged = isAdmin || isOwner;
  const isOutOfStock = perfume.inStock === false;
  const isFavorite = isInWishlist(perfume.id);

  // Discount calculation
  const originalPrice =
    selectedSize.originalPrice ||
    (perfume.discountPercent
      ? Math.round(selectedSize.price / (1 - perfume.discountPercent / 100))
      : undefined);
  const hasDiscount = !!originalPrice && originalPrice > selectedSize.price;
  const discountPercent =
    perfume.discountPercent ||
    (hasDiscount ? Math.round(((originalPrice - selectedSize.price) / originalPrice) * 100) : 0);

  const handleAdd = (e: MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({
      ...perfume,
      key: `${perfume.id}-${selectedSize.ml}`,
      ml: selectedSize.ml,
      price: selectedSize.price,
      originalPrice: selectedSize.originalPrice,
      qty: 1,
    } as any);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleCardClick = () => {
    setQuickViewProduct(perfume);
  };

  const handleDirectWhatsApp = (e: MouseEvent) => {
    e.stopPropagation();
    const discountNote = hasDiscount ? ` (Sale: -${discountPercent}%)` : '';
    const msg =
      language === 'en'
        ? `Hello NJZARO! I'd like to order:\n- Perfume: ${perfume.brand} - ${perfume.name}\n- Size: ${selectedSize.ml}ml\n- Price: ${selectedSize.price.toLocaleString('en-US')} IQD${discountNote}`
        : language === 'badini'
        ? `سلاڤ NJZARO! دخوازم ڤی عەتری داوا بکەم:\n- عەتر: ${perfume.brand} - ${perfume.name}\n- قەبارە: ${selectedSize.ml} مل\n- بها: ${selectedSize.price.toLocaleString('en-US')} دینار${discountNote}`
        : language === 'sorani'
        ? `سڵاو NJZARO! حەز دەکەم ئەم بۆنە داوا بکەم:\n- بۆن: ${perfume.brand} - ${perfume.name}\n- قەبارە: ${selectedSize.ml} مل\n- نرخ: ${selectedSize.price.toLocaleString('en-US')} دینار${discountNote}`
        : `مرحباً NJZARO! أود طلب هذا العطر:\n- العطر: ${perfume.brand} - ${perfume.name}\n- الحجم: ${selectedSize.ml} مل\n- السعر: ${selectedSize.price.toLocaleString('en-US')} د.ع${discountNote}`;
    window.open(`https://wa.me/9647508491439?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const executeQuickDelete = async (e: MouseEvent) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      await permanentlyDeletePerfume(perfume);
    } catch (err: any) {
      console.error('Error deleting perfume:', err);
    }
  };

  if (deleting) return null;

  const hasDecants = perfume.sizes.some((s) => s.ml <= 10);

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`luxury-card group flex flex-col justify-between overflow-hidden cursor-pointer ${
          isOutOfStock ? 'opacity-65 grayscale-[0.3]' : ''
        }`}
        style={{
          animation: 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: `${Math.min(index, 12) * 40}ms`,
        }}
      >
        {/* Top Floating Badges & Action Buttons */}
        <div className="absolute top-2.5 sm:top-3 inset-x-2.5 sm:inset-x-3 z-10 flex items-start justify-between gap-1 pointer-events-none">
          {/* Badges Left */}
          <div className="flex flex-col items-start gap-1 pointer-events-auto">
            {hasDiscount && (
              <span className="badge-sale text-[9px] sm:text-[10px] px-2 py-0.5 font-bold">
                -{discountPercent}%
              </span>
            )}
            {perfume.isBestSeller && (
              <span className="badge-gold text-[9px] sm:text-[10px] px-2 py-0.5 uppercase font-bold tracking-wider">
                {t.bestSellerBadge || 'BEST SELLER'}
              </span>
            )}
            {perfume.isNew && (
              <span className="bg-[#15070D] text-[#ECC870] border border-[#D4AF37]/50 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                {t.newBadge || 'NEW'}
              </span>
            )}
            {hasDecants && !hasDiscount && (
              <span className="bg-[#1E0B13] text-[#D8CCC4] border border-[#D4AF37]/30 text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Droplet size={9} className="text-[#ECC870]" />
                <span>{t.decantBadge || 'Decant'}</span>
              </span>
            )}
          </div>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-1 pointer-events-auto">
            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(perfume);
              }}
              className="w-7 h-7 rounded-full bg-[#18090F]/90 border border-[#D4AF37]/30 text-[#D8CCC4] hover:text-[#ECC870] hover:border-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer shadow-xs backdrop-blur-xs"
              title={t.quickView || 'Quick View'}
              aria-label={t.quickView || 'Quick View'}
            >
              <Eye size={12} />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(perfume.id);
              }}
              className="w-7 h-7 rounded-full bg-[#18090F]/90 border border-[#D4AF37]/30 text-[#D8CCC4] hover:text-[#ECC870] hover:border-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer shadow-xs backdrop-blur-xs"
              title={t.addToWishlist || 'Add to Wishlist'}
              aria-label={t.addToWishlist || 'Add to Wishlist'}
            >
              <Heart
                size={12}
                className={isFavorite ? 'fill-[#ECC870] text-[#ECC870]' : ''}
              />
            </button>

            {/* Admin / Owner Controls */}
            {isPrivileged && (
              <div className="flex items-center gap-0.5 sm:gap-1 ms-0.5 bg-[#18090F] border border-[#D4AF37]/40 p-0.5 rounded-full shadow-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#2A0F1B] text-[#ECC870] hover:bg-[#D4AF37] hover:text-[#0A0407] flex items-center justify-center transition-colors cursor-pointer"
                  title="Edit Fragrance"
                >
                  <Edit2 size={10} />
                </button>

                {confirmDelete ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-0.5 bg-[#4A0B15] border border-[#D4AF37]/50 rounded-full px-1 py-0.5 animate-fade-in"
                  >
                    <button
                      onClick={executeQuickDelete}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#D4AF37] text-[#0A0407] font-bold flex items-center justify-center cursor-pointer"
                      title="Confirm Permanent Deletion"
                    >
                      <Check size={10} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(false);
                      }}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#15070D] text-[#D8CCC4] flex items-center justify-center cursor-pointer"
                      title="Cancel"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(true);
                    }}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#4A0B15] text-[#ECC870] hover:bg-red-700 flex items-center justify-center transition-colors cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Product Image Canvas (Minimal Luxury Pedestal) */}
        <div className="product-image-container h-38 sm:h-48 md:h-56 p-3 sm:p-4 md:p-6 relative overflow-hidden">
          <div className="absolute inset-x-8 bottom-2 h-6 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18),transparent_70%)] pointer-events-none" />
          {perfume.img && !imgError ? (
            <img
              src={perfume.img}
              alt={perfume.name}
              onError={() => setImgError(true)}
              loading="lazy"
              className="max-h-30 sm:max-h-40 md:max-h-48 w-auto object-contain transition-transform duration-500 group-hover:scale-106 drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <span className="serif text-3xl sm:text-4xl font-bold text-[#ECC870]">N</span>
              <span className="text-[9px] sm:text-[10px] text-[#D4AF37] uppercase tracking-wider mt-1">
                NJZARO HAUTE
              </span>
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="p-3.5 sm:p-4 md:p-5 flex flex-col flex-1 justify-between bg-[#15070D] border-t border-[#D4AF37]/20">
          <div>
            {/* Brand */}
            <span className="text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.16em] font-bold text-[#D4AF37] block mb-0.5 sm:mb-1 truncate">
              {translatePerfumeBrand(perfume.brand, language)}
            </span>

            {/* Perfume Name */}
            <h3 className="serif text-xs sm:text-base md:text-lg font-bold text-[#FDFBF7] tracking-tight mb-1 sm:mb-1.5 line-clamp-1 group-hover:text-[#ECC870] transition-colors">
              {perfume.name}
            </h3>

            {/* Notes */}
            <p className="text-[10px] sm:text-xs text-[#D8CCC4] font-light line-clamp-1 mb-2.5 sm:mb-4 italic">
              {translatePerfumeNotes(perfume.notes, language)}
            </p>
          </div>

          <div>
            {/* Size Selector Pills */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-4" onClick={(e) => e.stopPropagation()}>
              {perfume.sizes.map((s) => {
                const isActive = selectedSize.ml === s.ml;
                return (
                  <button
                    key={s.ml}
                    onClick={() => setSelectedSize(s)}
                    className={`flex-1 min-w-[32px] sm:min-w-[44px] py-1 px-1.5 rounded-lg text-[9px] sm:text-[10px] font-medium transition-all cursor-pointer text-center border ${
                      isActive
                        ? 'bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] border-transparent font-bold shadow-xs'
                        : 'bg-[#1E0B13] text-[#D8CCC4] border-[#D4AF37]/25 hover:border-[#D4AF37] hover:text-[#ECC870]'
                    }`}
                  >
                    <span>{formatVolume(s.ml, language)}</span>
                  </button>
                );
              })}
            </div>

            {/* Price & Action Row */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-2.5 sm:pt-3 border-t border-[#D4AF37]/20">
              <div className="truncate">
                <div className="flex items-baseline gap-1 sm:gap-1.5 truncate">
                  <span className="text-xs sm:text-sm md:text-base font-bold text-[#FDFBF7]">
                    {selectedSize.price.toLocaleString('en-US')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#ECC870] font-bold uppercase">{t.currency || 'IQD'}</span>
                  {hasDiscount && (
                    <span className="hidden sm:inline text-[10px] text-[#A69B92] line-through ms-0.5">
                      {originalPrice?.toLocaleString('en-US')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {/* WhatsApp Quick Link */}
                <button
                  onClick={handleDirectWhatsApp}
                  className="p-1.5 sm:p-2 rounded-xl bg-[#1E0B13] border border-[#D4AF37]/25 hover:border-[#25D366] text-[#D8CCC4] hover:text-[#25D366] transition-colors cursor-pointer"
                  title={t.orderOnWhatsApp || 'WhatsApp'}
                >
                  <MessageCircle size={13} />
                </button>

                {/* Add to Bag */}
                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-[#1E0B13] text-[#A69B92] cursor-not-allowed border border-white/10'
                      : isAdded
                      ? 'bg-[#25D366] text-white'
                      : 'bg-gradient-to-r from-[#F5DE88] via-[#D4AF37] to-[#A67C1E] text-[#0A0407] hover:brightness-110 shadow-[0_2px_12px_rgba(212,175,55,0.3)] active:scale-95'
                  }`}
                >
                  {isAdded ? (
                    <Check size={13} className="stroke-[2.5]" />
                  ) : (
                    <Plus size={13} className="stroke-[2.5]" />
                  )}
                  <span className="hidden sm:inline">
                    {isAdded ? (t.addedToBag || 'Added') : (t.addToBag || 'Add')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && <AdminProductModal perfume={perfume} onClose={() => setIsEditing(false)} />}
    </>
  );
}
