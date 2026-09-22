import { useEffect, useState } from 'react';

export function Loader() {
  const [isOpen, setIsOpen] = useState(false);
  const [displayNone, setDisplayNone] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsOpen(true);
    }, 1600);

    const timer2 = setTimeout(() => {
      setDisplayNone(true);
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (displayNone) return null;

  return (
    <div
      id="loader"
      className={isOpen ? 'open' : ''}
      onClick={() => {
        setIsOpen(true);
        setTimeout(() => setDisplayNone(true), 400);
      }}
      title="Click to skip"
    >
      <div id="loader-ambient" />
      <div className="loader-content">
        <div className="loader-hud">
          <svg viewBox="0 0 200 200">
            <circle className="hud-ring-outer" cx="100" cy="100" r="92" fill="none" stroke="rgba(212,175,55,.5)" strokeWidth="1" />
            <circle className="hud-ring-inner" cx="100" cy="100" r="76" fill="none" stroke="rgba(236,200,112,.7)" strokeWidth="1" />
          </svg>
        </div>

        <div className="intro-stage">
          <h1 className="intro-word" aria-label="NJZARO">
            <span>N</span>
            <span>J</span>
            <span>Z</span>
            <span>A</span>
            <span>R</span>
            <span>O</span>
          </h1>
          <div className="intro-tagline-mask">
            <span className="intro-tagline">Haute Parfumerie</span>
          </div>
          <div className="intro-rule" />
        </div>
      </div>
    </div>
  );
}
