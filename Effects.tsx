import { useEffect, useState, useRef } from 'react';

export function Effects() {
  const [sparkles, setSparkles] = useState<{ size: string, left: string, top: string, duration: string, delay: string }[]>([]);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateSparkles = () => {
      const count = window.innerWidth < 480 ? 12 : (window.innerWidth < 700 ? 18 : 45);
      const newSparkles = [];
      for (let i = 0; i < count; i++) {
        newSparkles.push({
          size: (Math.random() * 3 + 1.5).toFixed(1),
          left: (Math.random() * 100).toFixed(2),
          top: (Math.random() * 100).toFixed(2),
          duration: (Math.random() * 4 + 3).toFixed(2),
          delay: (Math.random() * 6).toFixed(2),
        });
      }
      setSparkles(newSparkles);
    };
    generateSparkles();
    window.addEventListener('resize', generateSparkles);
    return () => window.removeEventListener('resize', generateSparkles);
  }, []);

  useEffect(() => {
    const isHoverCapable = window.matchMedia('(hover:hover)').matches;
    if (!isHoverCapable) return;

    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
    let frameId: number;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.classList.add('show');
      }
    };

    const ringLoop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      }
      frameId = requestAnimationFrame(ringLoop);
    };

    window.addEventListener('pointermove', handlePointerMove);
    frameId = requestAnimationFrame(ringLoop);

    const interactiveEls = document.querySelectorAll('a, button, .card');
    const onEnter = () => cursorRingRef.current?.classList.add('active');
    const onLeave = () => cursorRingRef.current?.classList.remove('active');

    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(frameId);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div id="aurora"><span></span><span></span><span></span></div>
      <div id="grain"></div>
      <div id="cursorGlow" ref={cursorGlowRef}></div>
      <div id="cursorRing" ref={cursorRingRef}></div>
      <div id="sparkleField">
        {sparkles.map((s, i) => (
          <span
            key={i}
            style={{
              width: `${s.size}px`,
              height: `${s.size}px`,
              left: `${s.left}%`,
              top: `${s.top}%`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
