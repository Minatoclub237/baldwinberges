import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

export default function SectionTwo() {
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

  return (
    <section
      id="section-two"
      className="relative flex min-h-screen flex-col supports-[height:100svh]:min-h-[100svh]"
    >
      {/* Middle content block */}
      <div className="relative flex flex-1 flex-col justify-center gap-10 px-5 pt-24 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:pt-0 md:px-12">
        
        {/* Left Headline */}
        <h2 className="max-w-sm text-4xl font-medium uppercase leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
          <Reveal delay={100} className="block">
            {t.sectionTwo.headingLine1Text} <span className="font-light normal-case italic">{t.sectionTwo.headingLine1Italic}</span>
          </Reveal>
          <Reveal delay={220} className="block">
            {t.sectionTwo.headingLine2}
          </Reveal>
        </h2>

        {/* Right Labeling metadata */}
        <Reveal delay={340}>
          <div className="flex items-center justify-between font-mono text-white sm:justify-start sm:gap-16 md:gap-24">
            <span className="text-lg">{t.sectionTwo.markerLabel}</span>
            <span className="text-xs text-white/70">{t.sectionTwo.markerValue}</span>
          </div>
        </Reveal>
      </div>

      {/* Bottom info and Call-to-Action block */}
      <div className="relative flex flex-col gap-10 px-5 pb-16 sm:px-8 md:px-12 md:pb-20">
        
        {/* Supporting description copy */}
        <Reveal delay={460}>
          <p className="max-w-xs text-sm leading-relaxed text-white/85 drop-shadow-md">
            {t.sectionTwo.paragraph}
          </p>
        </Reveal>

        {/* CTA "Me Contacter" / "Connect With Me" to mailto link */}
        <Reveal delay={580} className="w-full max-w-xs sm:absolute sm:bottom-16 sm:left-1/2 sm:w-auto sm:max-w-none sm:-translate-x-1/2 md:bottom-20">
          <a
            href="mailto:baldwin@baldwinberges.com"
            className="block rounded-full border border-white/60 px-10 py-3 text-center font-mono text-xs uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            {t.sectionTwo.cta}
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
