export function Marquee() {
  const brands = [
    "Ibrahim Al Qurashi",
    "Rayhaan",
    "Assaf",
    "Laverne",
    "Gissah",
    "Iven",
    "Stevano",
    "Club de Nuit",
    "Encre Noire",
    "Samam",
    "Sedra",
    "Unique",
    "Sultan",
    "Afnan",
    "Hawas"
  ];

  return (
    <div className="relative py-5 border-y border-[#D4AF37]/25 overflow-hidden bg-gradient-to-r from-[#18070F] via-[#2A0A15] to-[#18070F] shadow-inner">
      {/* Subtle edge fades */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#18070F] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#18070F] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max" style={{ animation: 'marquee 35s linear infinite' }}>
        {[...brands, ...brands, ...brands].map((brand, i) => (
          <div key={i} className="flex items-center gap-6 sm:gap-8 mx-4 sm:mx-6 flex-shrink-0">
            <span className="serif text-sm sm:text-base tracking-[0.2em] uppercase text-[#FDFBF7]/85 hover:text-[#ECC870] transition-colors font-medium">
              {brand}
            </span>
            <span className="text-[#D4AF37]/70 text-xs">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
