import { useState } from 'react';
import { Share2, Check, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

export default function SectionFour() {
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
      id="section-four"
      className="relative flex min-h-screen flex-col justify-between supports-[height:100svh]:min-h-[100svh]"
    >
      {/* Top marker */}
      <div className="relative flex justify-end px-5 pt-24 sm:px-8 sm:pt-32 md:px-12">
        <Reveal delay={100}>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-16 font-mono text-white md:gap-24">
              <span className="text-lg">{t.sectionFour.markerLabel}</span>
              <span className="text-xs text-white/70">{t.sectionFour.markerIndex}</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
              {t.sectionFour.markerValue}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Center — headline + CTA */}
      <div className="relative flex flex-1 flex-col justify-center gap-10 px-5 sm:px-8 md:px-12">
        <h2 className="max-w-2xl text-4xl font-medium uppercase leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
          <Reveal delay={160} className="block">
            {t.sectionFour.headingLine1Text}{' '}
            <span className="font-light normal-case italic">{t.sectionFour.headingLine1Italic}</span>
          </Reveal>
          <Reveal delay={280} className="block pl-10 sm:pl-20">
            {t.sectionFour.headingLine2}
          </Reveal>
        </h2>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <Reveal delay={400} className="max-w-xs">
            <p className="text-sm leading-relaxed text-white/85 drop-shadow-md">
              {t.sectionFour.paragraph}
            </p>
          </Reveal>

          <Reveal delay={520} className="w-full max-w-xs sm:w-auto">
            <a
              href={`mailto:${t.sectionFour.email}`}
              className="group flex w-full items-center justify-center gap-2 rounded-full border border-white/60 px-10 py-3 text-center font-mono text-xs uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-white hover:text-black sm:w-auto"
            >
              {t.sectionFour.cta}
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </Reveal>
        </div>
      </div>

      {/* Bottom bar — email + share */}
      <div className="relative flex items-center justify-between px-5 pb-6 sm:px-8 sm:pb-8 md:px-12">
        <Reveal delay={640}>
          <a
            href={`mailto:${t.sectionFour.email}`}
            className="font-mono text-[10px] text-white/50 transition-colors duration-300 hover:text-white sm:text-xs"
          >
            {t.sectionFour.email}
          </a>
        </Reveal>

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
