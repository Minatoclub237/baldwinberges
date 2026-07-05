import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

export default function SectionThree() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const pillars = [
    { n: '01', title: t.sectionThree.pillar1Title, text: t.sectionThree.pillar1Text },
    { n: '02', title: t.sectionThree.pillar2Title, text: t.sectionThree.pillar2Text },
    { n: '03', title: t.sectionThree.pillar3Title, text: t.sectionThree.pillar3Text },
  ];

  return (
    <section
      id="section-three"
      className="relative flex min-h-screen flex-col supports-[height:100svh]:min-h-[100svh]"
    >
      {/* Top block — headline + marker */}
      <div className="relative flex flex-col justify-center gap-10 px-5 pt-24 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:px-8 sm:pt-32 md:px-12">
        <h2 className="max-w-sm text-4xl font-medium uppercase leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
          <Reveal delay={100} className="block">
            {t.sectionThree.headingLine1Text}{' '}
            <span className="font-light normal-case italic">{t.sectionThree.headingLine1Italic}</span>
          </Reveal>
          <Reveal delay={220} className="block">
            {t.sectionThree.headingLine2}
          </Reveal>
        </h2>

        <Reveal delay={340}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-white sm:justify-start sm:gap-16 md:gap-24">
              <span className="text-lg">{t.sectionThree.markerLabel}</span>
              <span className="text-xs text-white/70">{t.sectionThree.markerIndex}</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
              {t.sectionThree.markerValue}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Pillars grid */}
      <div className="relative flex flex-1 flex-col justify-center px-5 py-16 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 gap-px overflow-hidden sm:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={420 + i * 120}>
              <div className="flex h-full flex-col gap-3 border-t border-white/30 pt-5 sm:pr-8">
                <span className="font-mono text-xs text-white/60">{p.n}</span>
                <h3 className="font-mono text-lg font-bold uppercase tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {p.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                  {p.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Bottom block — supporting copy + CTA */}
      <div className="relative flex flex-col gap-10 px-5 pb-16 sm:px-8 md:px-12 md:pb-20">
        <Reveal delay={460}>
          <p className="max-w-xs text-sm leading-relaxed text-white/85 drop-shadow-md">
            {t.sectionThree.paragraph}
          </p>
        </Reveal>

        {/* CTA — scrolls down to the Contact section (004) */}
        <Reveal delay={580} className="w-full max-w-xs sm:absolute sm:bottom-16 sm:left-1/2 sm:w-auto sm:max-w-none sm:-translate-x-1/2 md:bottom-20">
          <a
            href="#section-four"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('section-four')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="block rounded-full border border-white/60 px-10 py-3 text-center font-mono text-xs uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            {t.sectionThree.cta}
          </a>
        </Reveal>
      </div>

      {/* Bottom Left Share Trigger */}
      <div className="absolute bottom-5 left-5 z-20 sm:bottom-6 sm:left-8 md:left-12">
        <Reveal delay={700}>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-white/80 transition-colors duration-300 hover:text-white"
            aria-label="Share"
          >
            {copied ? (
              <>
                <Check size={18} className="text-emerald-400" />
                <span className="font-mono text-[10px] text-emerald-400">{t.actions.copied}</span>
              </>
            ) : (
              <Share2 size={18} />
            )}
          </button>
        </Reveal>
      </div>
    </section>
  );
}
