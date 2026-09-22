import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  Truck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQty,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    cartTotal,
    cartCount,
    setIsCheckoutOpen,
  } = useCart();
  const { t, language, direction } = useLanguage();
  const isRTL = direction === 'rtl';

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 50000;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartTotal);
  const deliveryProgressPercent = Math.min(100, (cartTotal / freeDeliveryThreshold) * 100);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      className="fixed inset-0 z-[1000] overflow-hidden animate-fade-in"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 ${
          isRTL ? 'left-0 border-r' : 'right-0 border-l'
        } w-full max-w-md bg-[#0E0408] border-[#D4AF37]/30 shadow-[0_0_60px_rgba(0,0,0,0.95),0_0_40px_rgba(107,23,39,0.2)] z-10 flex flex-col justify-between text-[#FDFBF7]`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#15070D]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={20} className="text-[#D4AF37]" />
            <h3 className="serif text-lg font-bold text-[#FDFBF7]">
              {t.cartTitle || (language === 'en' ? 'Your Shopping Bag' : 'حقيبة التسوق')}
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#1E0B13] text-[#ECC870] border border-[#D4AF37]/35">
              {cartCount}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-[#D8CCC4] hover:text-[#ECC870] hover:bg-[#1E0B13] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        <div className="p-4 bg-[#180910] border-b border-[#D4AF37]/20">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <div className="flex items-center gap-1.5 text-[#D8CCC4]">
              <Truck size={14} className="text-[#D4AF37]" />
              {remainingForFreeDelivery === 0 ? (
                <span className="text-[#25D366] font-bold">
                  {t.freeDeliveryUnlocked || (language === 'en'
                    ? '🎉 You unlocked FREE Delivery!'
                    : '🎉 مبروك! حصلت على توصيل مجاني!')}
                </span>
              ) : (
                <span>
                  {t.freeDeliveryRemaining
                    ? t.freeDeliveryRemaining(remainingForFreeDelivery.toLocaleString('en-US'))
                    : language === 'en'
                    ? `Add ${remainingForFreeDelivery.toLocaleString('en-US')} IQD more for FREE delivery`
                    : `أضف ${remainingForFreeDelivery.toLocaleString('en-US')} د.ع للحصول على توصيل مجاني`}
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#ECC870] font-mono font-bold">
              {Math.round(deliveryProgressPercent)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#1E0B13] rounded-full overflow-hidden border border-[#D4AF37]/20">
            <div
              className={`h-full transition-all duration-300 ${
                remainingForFreeDelivery === 0 ? 'bg-[#25D366]' : 'bg-gradient-to-r from-[#F5DE88] to-[#D4AF37]'
              }`}
              style={{ width: `${deliveryProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#D4AF37]/15">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#15070D] border border-[#D4AF37]/35 flex items-center justify-center text-[#ECC870] shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h4 className="serif text-lg font-bold text-[#FDFBF7] mb-1">
                  {t.cartEmptyTitle || (language === 'en' ? 'Your bag is empty' : 'حقيبة التسوق فارغة')}
                </h4>
                <p className="text-xs text-[#D8CCC4] max-w-xs font-light">
                  {t.cartEmptyDesc || (language === 'en'
                    ? 'Explore our curated collection and discover your signature fragrance or bespoke decant.'
                    : 'استكشف تشكيلتنا الحصرية من العطور الفاخرة وعينات الديكانت المميزة.')}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] text-xs uppercase font-bold hover:brightness-110 transition-transform active:scale-95 cursor-pointer shadow-xs"
              >
                {t.startShopping || (language === 'en' ? 'Start Shopping' : 'ابدأ التسوق')}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.key} className="py-4 first:pt-0 last:pb-0 flex gap-3.5 items-center">
                {/* Item Image */}
                <div className="w-16 h-16 rounded-xl bg-[#15070D] border border-[#D4AF37]/25 flex items-center justify-center p-1 flex-shrink-0">
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.name}
                      className="max-h-14 w-auto object-contain"
                    />
                  ) : (
                    <span className="serif text-lg font-bold text-[#ECC870]">N</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] block truncate">
                    {item.brand}
                  </span>
                  <h4 className="serif text-sm font-bold text-[#FDFBF7] truncate mb-1">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-1.5 py-0.5 rounded-md bg-[#1E0B13] border border-[#D4AF37]/25 text-[10px] font-semibold text-[#D8CCC4]">
                      {item.ml}ml
                    </span>
                    <span className="font-bold text-[#ECC870]">
                      {(item.price * item.qty).toLocaleString('en-US')} {t.currency || 'IQD'}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center border border-[#D4AF37]/30 rounded-full px-1.5 py-0.5 bg-[#15070D]">
                    <button
                      onClick={() => updateQty(item.key, -1)}
                      className="w-5 h-5 flex items-center justify-center text-[#D8CCC4] hover:text-[#ECC870] cursor-pointer"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#FDFBF7]">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.key, 1)}
                      className="w-5 h-5 flex items-center justify-center text-[#D8CCC4] hover:text-[#ECC870] cursor-pointer"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="text-[#9E3F3F] hover:text-red-400 p-1 text-xs transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Actions */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#D4AF37]/25 bg-[#15070D] space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#D8CCC4]">
                <span>{t.subtotal || (language === 'en' ? 'Subtotal' : 'المجموع الفرعي')}</span>
                <span className="font-semibold text-[#FDFBF7]">
                  {cartTotal.toLocaleString('en-US')} {t.currency || 'IQD'}
                </span>
              </div>
              <div className="flex justify-between text-[#D8CCC4]">
                <span>{t.estimatedDelivery || (language === 'en' ? 'Estimated Delivery' : 'أجور التوصيل')}</span>
                <span>
                  {remainingForFreeDelivery === 0 ? (
                    <span className="text-[#25D366] font-bold">{t.freeDelivery || 'FREE'}</span>
                  ) : (
                    `5,000 ${t.currency || 'IQD'}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#FDFBF7] pt-2 border-t border-[#D4AF37]/20">
                <span>{t.estimatedTotal || (language === 'en' ? 'Estimated Total' : 'المجموع الإجمالي')}</span>
                <span className="text-[#ECC870] font-bold">
                  {(cartTotal + (remainingForFreeDelivery === 0 ? 0 : 5000)).toLocaleString('en-US')} {t.currency || 'IQD'}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#F5DE88] via-[#D4AF37] to-[#A67C1E] hover:brightness-110 text-[#0A0407] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(212,175,55,0.35)] transition-transform active:scale-95 cursor-pointer border border-[#FFE79E]/40"
              >
                <span>{t.checkout || (language === 'en' ? 'Proceed to Checkout' : 'متابعة الطلب والدفع')}</span>
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-xs text-[#D8CCC4] hover:text-[#ECC870] underline cursor-pointer"
                >
                  {t.continueShopping || (language === 'en' ? 'Continue Shopping' : 'متابعة التسوق')}
                </button>

                <button
                  onClick={clearCart}
                  className="text-xs text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                >
                  {t.clearBag || (language === 'en' ? 'Clear Bag' : 'إفراغ السلة')}
                </button>
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#D8CCC4] pt-1">
              <ShieldCheck size={13} className="text-[#D4AF37]" />
              <span>{t.cashOnDeliveryNote || (language === 'en' ? 'Cash on Delivery & Direct WhatsApp Verification' : 'الدفع عند الاستلام مع تأكيد فوري عبر واتساب')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
