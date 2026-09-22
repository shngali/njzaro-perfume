import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  CheckCircle2,
  Truck,
  ShieldCheck,
  MessageCircle,
  ShoppingBag,
  CreditCard,
  MapPin,
  User,
  Phone,
} from 'lucide-react';

const IRAQI_GOVERNORATES = [
  'Duhok / دهوك',
  'Erbil / أربيل',
  'Baghdad / بغداد',
  'Sulaymaniyah / السليمانية',
  'Basra / البصرة',
  'Mosul / الموصل',
  'Kirkuk / كركوك',
  'Najaf / النجف',
  'Karbala / كربلاء',
  'Hillah (Babil) / الحلة',
  'Nasiriyah (Dhi Qar) / الناصرية',
  'Amarah (Maysan) / العمارة',
  'Diwaniyah / الديوانية',
  'Kut (Wasit) / الكوت',
  'Ramadi (Anbar) / الرمادي',
  'Samawah (Muthanna) / السماوة',
  'Baqubah (Diyala) / بعقوبة',
  'Tikrit (Saladin) / تكريت',
  'Other / محافظة أخرى',
];

export function CheckoutModal() {
  const { cart, cartTotal, clearCart, isCheckoutOpen, setIsCheckoutOpen } = useCart();
  const { t, language, direction } = useLanguage();
  const isRTL = direction === 'rtl';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(IRAQI_GOVERNORATES[0]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsCompleted(false);
      setError('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const deliveryFee = cartTotal >= 50000 ? 0 : 5000;
  const finalTotal = cartTotal + deliveryFee;

  const handleSubmitOrder = () => {
    if (!name.trim()) {
      setError(
        language === 'en'
          ? 'Please enter your full name'
          : language === 'badini'
          ? 'هیڤیە ناڤێ خۆ یێ دروست بنڤیسە'
          : language === 'sorani'
          ? 'تکایە ناوی تەواوی خۆت بنووسە'
          : 'يرجى إدخال الاسم الكريم'
      );
      return;
    }
    if (!phone.trim()) {
      setError(
        language === 'en'
          ? 'Please enter your phone number'
          : language === 'badini'
          ? 'هیڤیە ژمارا مۆبایلێ بنڤیسە'
          : language === 'sorani'
          ? 'تکایە ژمارەی مۆبایلی خۆت بنووسە'
          : 'يرجى إدخال رقم الهاتف للتواصل'
      );
      return;
    }

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

    let slip = `*NJZARO HAUTE PARFUMERIE · ORDER CONFIRMATION*\n`;
    slip += `═══════════════════════════\n`;
    slip += `👤 *${language === 'en' ? 'Client' : language === 'badini' ? 'کڕیار' : language === 'sorani' ? 'کڕیار' : 'العميل'}:* ${name.trim()}\n`;
    slip += `📞 *${language === 'en' ? 'Phone' : language === 'badini' ? 'مۆبایل' : language === 'sorani' ? 'مۆبایل' : 'الهاتف'}:* ${phone.trim()}\n`;
    slip += `📍 *${language === 'en' ? 'City' : language === 'badini' ? 'باژێڕ' : language === 'sorani' ? 'شار' : 'المدينة'}:* ${city}\n`;
    if (address.trim()) slip += `🏠 *${language === 'en' ? 'Address' : language === 'badini' ? 'ناڤونیشان' : language === 'sorani' ? 'ناونیشان' : 'العنوان'}:* ${address.trim()}\n`;
    if (notes.trim()) slip += `📝 *${language === 'en' ? 'Notes' : language === 'badini' ? 'تێبینی' : language === 'sorani' ? 'تێبینی' : 'ملاحظات'}:* ${notes.trim()}\n`;
    slip += `🗓️ *Date:* ${formattedDate}\n`;
    slip += `═══════════════════════════\n`;
    slip += `*${language === 'en' ? 'ORDERED FRAGRANCES' : language === 'badini' ? 'عەترێن داخوازیێ' : language === 'sorani' ? 'بۆنە داواکراوەکان' : 'العطور المطلوبة'}:*\n`;

    cart.forEach((item, index) => {
      slip += `${index + 1}. *${item.brand}* - ${item.name}\n`;
      slip += `   ${item.ml}ml × ${item.qty} = ${(item.price * item.qty).toLocaleString('en-US')} IQD\n`;
    });

    slip += `───────────────────────────\n`;
    slip += `${t.subtotal || 'Subtotal'}: ${cartTotal.toLocaleString('en-US')} IQD\n`;
    slip += `${t.deliveryFee || (language === 'en' ? 'Delivery' : 'التوصيل')}: ${deliveryFee === 0 ? (t.freeDeliveryUnlocked || 'FREE') : `${deliveryFee.toLocaleString('en-US')} IQD`}\n`;
    slip += `*${t.total || 'TOTAL'}:* ${finalTotal.toLocaleString('en-US')} IQD\n`;
    slip += `${t.cashOnDelivery || 'Cash on Delivery'}\n`;
    slip += `═══════════════════════════\n`;
    slip += `NJZARO Haute Parfumerie`;

    window.open(`https://wa.me/9647508491439?text=${encodeURIComponent(slip)}`, '_blank');
    clearCart();
    setIsCompleted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
      className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={() => setIsCheckoutOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] bg-[#0A0407] text-[#FDFBF7] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(107,23,39,0.25)] border border-[#D4AF37]/35 overflow-y-auto p-6 sm:p-8 animate-scale-in"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute top-5 end-5 p-1 text-[#D8CCC4] hover:text-[#ECC870] rounded-full hover:bg-[#1E0B13] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {isCompleted ? (
          <div className="py-12 text-center space-y-4 animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(37,211,102,0.2)]">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="serif text-2xl font-bold text-[#FDFBF7]">
              {t.orderSuccessTitle || (language === 'en' ? 'Thank You For Your Order!' : 'تم إرسال طلبك بنجاح!')}
            </h3>
            <p className="text-xs sm:text-sm text-[#D8CCC4] max-w-md mx-auto leading-relaxed">
              {t.orderSuccessDesc || (language === 'en'
                ? 'Your order slip has been dispatched to our concierge team on WhatsApp. We will contact you promptly to confirm dispatch and delivery timing.'
                : 'تم إرسال تفاصيل طلبك إلى فريق خدمة العملاء عبر واتساب. سنتواصل معك لتأكيد موعد التوصيل.')}
            </p>
            <div className="pt-4">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer shadow-xs"
              >
                {t.continueShopping || (language === 'en' ? 'Continue Browsing' : 'متابعة التصفح')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Modal Header */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4AF37] block mb-1">
                {t.checkoutExpress || 'EXPRESS CHECKOUT'}
              </span>
              <h3 className="serif text-2xl font-bold text-[#FDFBF7]">
                {t.checkoutModalTitle || (language === 'en' ? 'Complete Your Fragrance Order' : 'إتمام الطلب وبيانات التوصيل')}
              </h3>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#6B1727]/30 border border-[#6B1727] text-red-200 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Order Items Preview */}
            <div className="p-4 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#ECC870] uppercase tracking-wider mb-2">
                <span>{t.orderSummary || (language === 'en' ? 'Order Summary' : 'ملخص العطور المطلوبة')}</span>
                <span>({cart.length})</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-2 pe-1">
                {cart.map((item) => (
                  <div key={item.key} className="flex items-center justify-between text-xs">
                    <span className="text-[#D8CCC4] truncate max-w-[65%]">
                      {item.brand} - {item.name} ({item.ml}ml × {item.qty})
                    </span>
                    <span className="font-bold text-[#FDFBF7]">
                      {(item.price * item.qty).toLocaleString('en-US')} {t.currency || 'IQD'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-[#D4AF37]/20 flex justify-between text-sm font-bold text-[#FDFBF7]">
                <span>{t.totalWithDelivery || (language === 'en' ? 'Total with Delivery:' : 'المجموع مع التوصيل:')}</span>
                <span className="text-[#ECC870] font-bold">{finalTotal.toLocaleString('en-US')} {t.currency || 'IQD'}</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block font-bold text-[#D8CCC4] mb-1.5 uppercase tracking-wider text-[11px]">
                    {t.fullNameLabel || (language === 'en' ? 'Full Name *' : 'الاسم الكامل *')}
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.fullNamePlaceholder || (language === 'en' ? 'e.g. Sarah Ahmed' : 'مثال: سارة أحمد')}
                      className="w-full bg-[#15070D] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl ps-9 pe-3 py-2.5 text-xs text-[#FDFBF7] placeholder-[#A69B92] outline-none"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block font-bold text-[#D8CCC4] mb-1.5 uppercase tracking-wider text-[11px]">
                    {t.phoneLabel || (language === 'en' ? 'Phone Number (WhatsApp) *' : 'رقم الهاتف (واتساب) *')}
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0750 000 0000"
                      className="w-full bg-[#15070D] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl ps-9 pe-3 py-2.5 text-xs text-[#FDFBF7] placeholder-[#A69B92] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block font-bold text-[#D8CCC4] mb-1.5 uppercase tracking-wider text-[11px]">
                  {t.cityLabel || (language === 'en' ? 'City / Governorate *' : 'المحافظة / المدينة *')}
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full appearance-none bg-[#15070D] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl ps-9 pe-3 py-2.5 text-xs text-[#FDFBF7] outline-none cursor-pointer"
                  >
                    {IRAQI_GOVERNORATES.map((c) => (
                      <option key={c} value={c} className="bg-[#15070D] text-[#FDFBF7]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Detailed Address */}
              <div>
                <label className="block font-bold text-[#D8CCC4] mb-1.5 uppercase tracking-wider text-[11px]">
                  {t.addressLabel || (language === 'en' ? 'Neighborhood / Street Address' : 'العنوان بالتفصيل (المنطقة، أقرب نقطة دالة)')}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t.addressPlaceholder || (language === 'en' ? 'e.g. Karrada, near Babel Hotel' : 'مثال: حي الجامعة، مجاور مجمع السلام')}
                  className="w-full bg-[#15070D] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs text-[#FDFBF7] placeholder-[#A69B92] outline-none"
                />
              </div>

              {/* Payment Method Badge */}
              <div className="p-3.5 rounded-xl border border-[#D4AF37]/25 bg-[#15070D] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard size={18} className="text-[#ECC870]" />
                  <div>
                    <span className="font-bold text-[#FDFBF7] block">
                      {t.cashOnDelivery || (language === 'en' ? 'Cash on Delivery' : 'الدفع نقداً عند الاستلام')}
                    </span>
                    <span className="text-[11px] text-[#D8CCC4]">
                      {t.cashOnDeliveryDesc || (language === 'en' ? 'Inspect your package before payment' : 'عاين طلبك وتأكد من عطرك قبل الدفع')}
                    </span>
                  </div>
                </div>
                <ShieldCheck size={18} className="text-[#25D366]" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmitOrder}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#25D366] via-[#20BA5A] to-[#128C7E] hover:brightness-110 text-[#0A0407] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(37,211,102,0.35)] transition-transform active:scale-95 cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>
                  {t.confirmOrderWhatsApp || (language === 'en'
                    ? 'Confirm Order via WhatsApp'
                    : 'تأكيد الطلب الفوري عبر واتساب')}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
