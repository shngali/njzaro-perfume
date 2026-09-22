import { useEffect, useState } from 'react';
import { settingsCol, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { StoreSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, X } from 'lucide-react';

export function AnnouncementBar() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<StoreSettings>({
    announcement: '',
    announcementActive: true,
    whatsappNumber: '9647508491439',
    deliveryFee: 5000,
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onSnapshot(
        doc(settingsCol, 'main'),
        (snap) => {
          if (snap.exists()) {
            setSettings((prev) => ({ ...prev, ...(snap.data() as StoreSettings) }));
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'njzaro_settings/main');
        }
      );
    } catch (e) {
      console.warn('Could not listen to store settings:', e);
    }
    return () => unsubscribe();
  }, []);

  const isDefaultArabic =
    !settings.announcement ||
    settings.announcement.includes('عروض خاصة: خصم 20% على جميع عطور إبراهيم القرشي');

  const displayAnnouncement =
    !isDefaultArabic && settings.announcement
      ? settings.announcement
      : t.announcementDefault || 'Free delivery on all orders over 50,000 IQD | Authentic Niche Fragrances & Decants';

  if (!settings.announcementActive || dismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Announcement"
      className="relative z-50 bg-gradient-to-r from-[#24060C] via-[#3B0A13] to-[#24060C] text-[#FDFBF7] border-b border-[#D4AF37]/35 py-2 px-4 text-center text-[11px] sm:text-xs shadow-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 font-medium tracking-wide">
        <Sparkles size={12} className="text-[#D4AF37] flex-shrink-0 animate-pulse" />
        <span className="text-[#FDFBF7] truncate max-w-[85vw] font-normal tracking-wider">{displayAnnouncement}</span>
        <Sparkles size={12} className="text-[#D4AF37] flex-shrink-0 hidden sm:inline animate-pulse" />
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-[#D4AF37]/70 hover:text-[#ECC870] transition-colors cursor-pointer"
        aria-label={t.closeAnnouncement || 'Close announcement'}
      >
        <X size={13} />
      </button>
    </aside>
  );
}
