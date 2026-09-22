import { useState, FormEvent, ChangeEvent } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { settingsCol } from '../lib/firebase';
import { HeroShowcaseConfig } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Sparkles,
  UploadCloud,
  Check,
  RotateCcw,
  Image as ImageIcon,
  ExternalLink,
  Layers,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const DEFAULT_SHOWCASE_CONFIG: HeroShowcaseConfig = {
  imageUrl: 'https://f.top4top.io/p_33703v0s91.png',
  fallbackImageUrl: 'https://g.top4top.io/p_33703y6x32.png',
  badgeLeft: 'HAUTE PARFUMERIE',
  badgeRight: 'NJZARO EXCLUSIVE',
  titleEn: 'Ibrahim Al Qurashi & Niche Decants',
  titleAr: 'إبراهيم القرشي ومختارات النيش',
  tagEn: 'FEATURED SHOWCASE',
  tagAr: 'مختارات الموسم',
  actionType: 'shop',
  actionTarget: 'All',
};

const PRESET_IMAGES = [
  {
    label: 'Ibrahim Al Qurashi (Original)',
    url: 'https://f.top4top.io/p_33703v0s91.png',
  },
  {
    label: 'Decant Collection (Alt)',
    url: 'https://g.top4top.io/p_33703y6x32.png',
  },
  {
    label: 'Royal Niche Decant Flacon',
    url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Golden Amber Essence',
    url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Dark Wood & Oud Silhouette',
    url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
  },
];

interface Props {
  currentConfig: HeroShowcaseConfig;
  onClose: () => void;
  onSaveSuccess: (updated: HeroShowcaseConfig) => void;
}

export function HeroShowcaseModal({ currentConfig, onClose, onSaveSuccess }: Props) {
  const { language } = useLanguage();
  const { perfumes } = useProducts();
  const isArabic = language === 'ar';

  const [formConfig, setFormConfig] = useState<HeroShowcaseConfig>({
    ...DEFAULT_SHOWCASE_CONFIG,
    ...currentConfig,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle local file upload with auto client-side compression
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg(null);
    try {
      const { dataUrl } = await compressImage(file, 800, 800, 0.85);
      setFormConfig((prev) => ({
        ...prev,
        imageUrl: dataUrl,
      }));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(isArabic ? 'تعذر ضغط أو قراءة الصورة' : 'Failed to process image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!formConfig.imageUrl.trim()) {
      setErrorMsg(isArabic ? 'يرجى تحديد رابط أو صورة للعرض' : 'Please provide an image URL');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      // 1. Save to Firestore
      await setDoc(doc(settingsCol, 'hero_showcase'), formConfig, { merge: true });

      // 2. Save to localStorage for instant hydration
      localStorage.setItem('njzaro_hero_showcase', JSON.stringify(formConfig));
      window.dispatchEvent(new CustomEvent('njzaro-hero-showcase-updated', { detail: formConfig }));

      setSavedSuccess(true);
      onSaveSuccess(formConfig);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Error saving showcase settings to Firestore:', err);
      // Fallback save to localStorage even if offline
      localStorage.setItem('njzaro_hero_showcase', JSON.stringify(formConfig));
      window.dispatchEvent(new CustomEvent('njzaro-hero-showcase-updated', { detail: formConfig }));
      onSaveSuccess(formConfig);
      setSavedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setFormConfig(DEFAULT_SHOWCASE_CONFIG);
  };

  const handleSelectPerfume = (perfumeIdStr: string) => {
    if (!perfumeIdStr) return;
    const found = perfumes.find((p) => p.id === Number(perfumeIdStr));
    if (found && found.img) {
      setFormConfig((prev) => ({
        ...prev,
        imageUrl: found.img as string,
        titleEn: `${found.brand} - ${found.name}`,
        titleAr: `${found.brand} - ${found.name}`,
      }));
    }
  };

  return (
    <div
      id="hero-showcase-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-[#0A0407] text-[#FDFBF7] rounded-3xl border border-[#D4AF37]/35 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(107,23,39,0.25)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#D4AF37]/25 flex items-center justify-between bg-[#15070D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E0B13] border border-[#D4AF37]/40 text-[#ECC870] flex items-center justify-center shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="serif text-base sm:text-lg font-bold text-[#FDFBF7]">
                {isArabic ? 'التحكم في صورة وبطاقة الواجهة' : 'Edit Hero Showcase & Image'}
              </h3>
              <p className="text-[11px] text-[#D8CCC4]">
                {isArabic
                  ? 'تحكم المالك والمدير في الصورة المعروضة والنصوص في واجهة الموقع'
                  : 'Manage the primary visual showcase displayed to all visitors'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#15070D] hover:bg-[#1E0B13] border border-[#D4AF37]/35 flex items-center justify-center text-[#D8CCC4] hover:text-[#ECC870] transition-colors cursor-pointer shadow-xs"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#6B1727]/30 border border-[#6B1727] text-red-200 flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Live Mini Preview */}
          <div>
            <label className="block font-bold text-[#D8CCC4] mb-2 uppercase tracking-wider text-[11px]">
              {isArabic ? 'معاينة فورية للبطاقة:' : 'Live Showcase Preview:'}
            </label>
            <div className="p-4 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-36 rounded-xl bg-[#1E0B13] border border-[#D4AF37]/25 flex items-center justify-center overflow-hidden p-2 flex-shrink-0 shadow-xs relative">
                {formConfig.imageUrl ? (
                  <img
                    src={formConfig.imageUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        DEFAULT_SHOWCASE_CONFIG.imageUrl;
                    }}
                  />
                ) : (
                  <div className="text-[#A69B92] text-center text-[10px] flex flex-col items-center">
                    <ImageIcon size={24} className="mb-1 opacity-50 text-[#ECC870]" />
                    <span>{isArabic ? 'لا توجد صورة' : 'No image'}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center justify-between text-[10px] text-[#D8CCC4]">
                  <span className="bg-[#1E0B13] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/35 font-bold text-[#ECC870]">
                    {formConfig.badgeLeft || 'HAUTE PARFUMERIE'}
                  </span>
                  <span className="font-bold text-[#D4AF37]">
                    {formConfig.badgeRight || 'NJZARO EXCLUSIVE'}
                  </span>
                </div>

                <div className="bg-[#1E0B13] p-3 rounded-xl border border-[#D4AF37]/25">
                  <span className="text-[10px] font-bold text-[#ECC870] uppercase tracking-wider block">
                    {isArabic ? formConfig.tagAr || formConfig.tagEn : formConfig.tagEn}
                  </span>
                  <span className="text-xs font-bold text-[#FDFBF7] block truncate">
                    {isArabic ? formConfig.titleAr || formConfig.titleEn : formConfig.titleEn}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Selection Controls */}
          <div className="space-y-3 pt-2 border-t border-[#D4AF37]/20">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#D8CCC4] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <ImageIcon size={14} className="text-[#D4AF37]" />
                <span>{isArabic ? 'صورة العرض الرئيسية (Image URL or Upload):' : 'Showcase Image:'}</span>
              </label>
              {uploadingImage && (
                <span className="text-[11px] text-[#ECC870] flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" />
                  <span>{isArabic ? 'جاري معالجة الصورة...' : 'Processing image...'}</span>
                </span>
              )}
            </div>

            {/* Direct Input */}
            <input
              type="text"
              required
              value={formConfig.imageUrl}
              onChange={(e) => setFormConfig({ ...formConfig, imageUrl: e.target.value })}
              placeholder="https://example.com/perfume-photo.png"
              className="w-full bg-[#15070D] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#FDFBF7] placeholder-[#A69B92] outline-none transition-colors"
            />

            {/* Upload File or Camera */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="px-4 py-2.5 rounded-xl border border-[#D4AF37]/35 bg-[#15070D] hover:bg-[#1E0B13] text-[#FDFBF7] text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors">
                <UploadCloud size={14} className="text-[#ECC870]" />
                <span>{isArabic ? 'رفع صورة من جهازك / الكاميرا' : 'Upload File / Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Or Pick from Catalog */}
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Layers size={14} className="text-[#D4AF37] flex-shrink-0" />
                <select
                  onChange={(e) => handleSelectPerfume(e.target.value)}
                  defaultValue=""
                  className="w-full bg-[#15070D] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-[#FDFBF7] outline-none"
                >
                  <option value="" disabled className="bg-[#15070D] text-[#A69B92]">
                    {isArabic ? 'اختر صورة من عطور المتجر...' : 'Or choose from store perfumes...'}
                  </option>
                  {perfumes.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#15070D] text-[#FDFBF7]">
                      {p.brand} - {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Luxury Presets */}
            <div className="pt-2">
              <span className="text-[11px] text-[#D8CCC4] font-medium block mb-2">
                {isArabic ? 'أو اختر من النماذج الجاهزة:' : 'Or pick from curated presets:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setFormConfig({ ...formConfig, imageUrl: preset.url })}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                      formConfig.imageUrl === preset.url
                        ? 'bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] border-[#D4AF37] font-bold'
                        : 'bg-[#15070D] text-[#D8CCC4] border-[#D4AF37]/25 hover:border-[#D4AF37]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Titles & Texts Section */}
          <div className="space-y-4 pt-3 border-t border-[#D4AF37]/20">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#ECC870]">
              {isArabic ? 'النصوص والعناوين (Titles & Badges)' : 'Texts & Headlines'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#D8CCC4] mb-1">
                  {isArabic ? 'العنوان بالعربية:' : 'Title (Arabic):'}
                </label>
                <input
                  type="text"
                  value={formConfig.titleAr}
                  onChange={(e) => setFormConfig({ ...formConfig, titleAr: e.target.value })}
                  placeholder="إبراهيم القرشي ومختارات النيش"
                  className="w-full bg-[#15070D] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-[#FDFBF7] placeholder-[#A69B92] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#D8CCC4] mb-1">
                  {isArabic ? 'العنوان بالإنجليزية:' : 'Title (English):'}
                </label>
                <input
                  type="text"
                  value={formConfig.titleEn}
                  onChange={(e) => setFormConfig({ ...formConfig, titleEn: e.target.value })}
                  placeholder="Ibrahim Al Qurashi & Niche Decants"
                  className="w-full bg-[#15070D] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-[#FDFBF7] placeholder-[#A69B92] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#D8CCC4] mb-1">
                  {isArabic ? 'الشارة الفرعية بالعربية:' : 'Subtitle/Tag (Arabic):'}
                </label>
                <input
                  type="text"
                  value={formConfig.tagAr}
                  onChange={(e) => setFormConfig({ ...formConfig, tagAr: e.target.value })}
                  placeholder="مختارات الموسم"
                  className="w-full bg-[#15070D] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-[#FDFBF7] placeholder-[#A69B92] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#D8CCC4] mb-1">
                  {isArabic ? 'الشارة الفرعية بالإنجليزية:' : 'Subtitle/Tag (English):'}
                </label>
                <input
                  type="text"
                  value={formConfig.tagEn}
                  onChange={(e) => setFormConfig({ ...formConfig, tagEn: e.target.value })}
                  placeholder="FEATURED SHOWCASE"
                  className="w-full bg-[#15070D] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-[#FDFBF7] placeholder-[#A69B92] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#D8CCC4] mb-1">
                  {isArabic ? 'الشارة العلوية (يسار):' : 'Upper Badge (Left):'}
                </label>
                <input
                  type="text"
                  value={formConfig.badgeLeft}
                  onChange={(e) => setFormConfig({ ...formConfig, badgeLeft: e.target.value })}
                  placeholder="HAUTE PARFUMERIE"
                  className="w-full bg-[#15070D] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-[#FDFBF7] placeholder-[#A69B92] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#D8CCC4] mb-1">
                  {isArabic ? 'الشارة العلوية (يمين):' : 'Upper Badge (Right):'}
                </label>
                <input
                  type="text"
                  value={formConfig.badgeRight}
                  onChange={(e) => setFormConfig({ ...formConfig, badgeRight: e.target.value })}
                  placeholder="NJZARO EXCLUSIVE"
                  className="w-full bg-[#15070D] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-[#FDFBF7] placeholder-[#A69B92] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Destination */}
          <div className="pt-3 border-t border-[#D4AF37]/20">
            <label className="block font-bold text-[#D8CCC4] mb-2 uppercase tracking-wider text-[11px]">
              {isArabic ? 'وجهة زر العرض (Action Target):' : 'View Button Action:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  formConfig.actionType === 'shop'
                    ? 'border-[#D4AF37] bg-[#1E0B13]'
                    : 'border-[#D4AF37]/25 bg-[#15070D] hover:border-[#D4AF37]/50'
                }`}
              >
                <input
                  type="radio"
                  name="actionType"
                  value="shop"
                  checked={formConfig.actionType === 'shop'}
                  onChange={() => setFormConfig({ ...formConfig, actionType: 'shop', actionTarget: 'All' })}
                  className="accent-[#D4AF37]"
                />
                <span className="font-semibold text-[#FDFBF7]">
                  {isArabic ? 'تصفح المتجر' : 'Shop All'}
                </span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  formConfig.actionType === 'brand'
                    ? 'border-[#D4AF37] bg-[#1E0B13]'
                    : 'border-[#D4AF37]/25 bg-[#15070D] hover:border-[#D4AF37]/50'
                }`}
              >
                <input
                  type="radio"
                  name="actionType"
                  value="brand"
                  checked={formConfig.actionType === 'brand'}
                  onChange={() =>
                    setFormConfig({
                      ...formConfig,
                      actionType: 'brand',
                      actionTarget: 'Ibrahim Al Qurashi',
                    })
                  }
                  className="accent-[#D4AF37]"
                />
                <span className="font-semibold text-[#FDFBF7]">
                  {isArabic ? 'ماركة إبراهيم القرشي' : 'Ibrahim Al Qurashi'}
                </span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  formConfig.actionType === 'whatsapp'
                    ? 'border-[#D4AF37] bg-[#1E0B13]'
                    : 'border-[#D4AF37]/25 bg-[#15070D] hover:border-[#D4AF37]/50'
                }`}
              >
                <input
                  type="radio"
                  name="actionType"
                  value="whatsapp"
                  checked={formConfig.actionType === 'whatsapp'}
                  onChange={() => setFormConfig({ ...formConfig, actionType: 'whatsapp' })}
                  className="accent-[#D4AF37]"
                />
                <span className="font-semibold text-[#FDFBF7]">
                  {isArabic ? 'واتساب مباشر' : 'WhatsApp Concierge'}
                </span>
              </label>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2.5 rounded-full border border-[#D4AF37]/35 text-[#D8CCC4] hover:text-[#ECC870] hover:bg-[#15070D] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw size={13} />
              <span>{isArabic ? 'استعادة الإعدادات الأصلية' : 'Reset Defaults'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-[#D4AF37]/35 text-[#D8CCC4] hover:text-[#ECC870] hover:bg-[#15070D] text-xs font-semibold cursor-pointer transition-colors"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F5DE88] via-[#D4AF37] to-[#A67C1E] hover:brightness-110 text-[#0A0407] text-xs font-bold flex items-center gap-2 shadow-[0_2px_14px_rgba(212,175,55,0.35)] cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-[#0A0407]" />
                    <span>{isArabic ? 'جاري الحفظ...' : 'Saving...'}</span>
                  </>
                ) : savedSuccess ? (
                  <>
                    <Check size={14} className="text-[#0A0407]" />
                    <span>{isArabic ? 'تم الحفظ بنجاح' : 'Saved!'}</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>{isArabic ? 'حفظ وتطبيق التغييرات' : 'Save & Apply'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
