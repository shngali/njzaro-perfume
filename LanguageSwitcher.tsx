import { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGES, Language } from '../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'header' | 'mobile' | 'footer';
  className?: string;
}

export function LanguageSwitcher({ variant = 'header', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage, info } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const languageKeys = Object.keys(LANGUAGES) as Language[];
  const isRtl = info.direction === 'rtl';

  if (variant === 'mobile') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-1.5 text-[11px] text-[#D4AF37] font-semibold uppercase tracking-wider mb-1.5 px-1">
          <Globe size={13} className="text-[#D4AF37] flex-shrink-0" />
          <span>هەڵبژاردنی زمان / اختر اللغة / Language</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {languageKeys.map((code) => {
            const lang = LANGUAGES[code];
            const isActive = language === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl border text-[11px] sm:text-xs font-medium transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] border-[#D4AF37] font-bold shadow-xs'
                    : 'bg-[#15070D] text-[#D6CEC4] border-[#D4AF37]/25 hover:border-[#D4AF37] hover:text-[#ECC870]'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm flex-shrink-0">{lang.flag}</span>
                  <span className="truncate">{lang.nativeName}</span>
                </div>
                {isActive && <Check size={13} className="stroke-[2.5] flex-shrink-0 ms-1 text-[#0A0407]" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
        {languageKeys.map((code) => {
          const lang = LANGUAGES[code];
          const isActive = language === code;
          return (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#D4AF37] text-[#0A0407] font-bold'
                  : 'bg-[#15070D] text-[#D6CEC4] hover:text-[#ECC870] hover:bg-[#1E0B13] border border-[#D4AF37]/25'
              }`}
            >
              <span>{lang.nativeName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Header Dropdown (Minimal Luxury)
  return (
    <div className={`relative z-[950] ${className}`} ref={dropdownRef}>
      <button
        type="button"
        id="languageSwitcherBtn"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`flex items-center gap-1.5 bg-[#15070D] hover:bg-[#1E0B13] border ${
          isOpen ? 'border-[#D4AF37]' : 'border-[#D4AF37]/30 hover:border-[#D4AF37]'
        } rounded-full px-2.5 sm:px-3 py-1.5 transition-all duration-200 cursor-pointer text-xs text-[#FDFBF7] select-none shadow-xs`}
        title="Change Language"
        aria-label="Language selector"
        aria-expanded={isOpen}
      >
        <Globe size={14} className="text-[#D4AF37] flex-shrink-0" />
        <span className="text-xs font-medium hidden sm:inline">{info.nativeName}</span>
        <span className="text-[11px] font-bold sm:hidden tracking-wider">{info.code.toUpperCase()}</span>
        <ChevronDown
          size={12}
          className={`text-[#D4AF37]/70 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          id="languageDropdownMenu"
          className={`absolute top-full mt-2 ${isRtl ? 'left-0' : 'right-0'} w-52 rounded-xl bg-[#12070B] border border-[#D4AF37]/35 p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(107,23,39,0.25)] z-[1000] animate-fade-in`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1 text-[10px] uppercase font-semibold text-[#D4AF37] border-b border-[#D4AF37]/20 mb-1">
            Language / اللغة
          </div>
          <div className="flex flex-col gap-0.5">
            {languageKeys.map((code) => {
              const lang = LANGUAGES[code];
              const isActive = language === code;
              return (
                <button
                  type="button"
                  key={code}
                  onClick={() => {
                    setLanguage(code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#D4AF37]/15 text-[#ECC870] font-bold border border-[#D4AF37]/30'
                      : 'text-[#D6CEC4] hover:text-[#FDFBF7] hover:bg-[#1E0B13]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  {isActive && <Check size={14} className="text-[#D4AF37] stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
