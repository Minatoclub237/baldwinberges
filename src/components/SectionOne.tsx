import { useState } from 'react';
import { Share2, ArrowDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

export default function SectionOne() {
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

  const handleScrollDown = () => {
    const nextSection = document.getElementById('section-two');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="section-one"
      className="relative flex min-h-screen flex-col justify-end supports-[height:100svh]:min-h-[100svh]"
    >
      <div className="relative flex flex-col gap-10 px-5 pb-16 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:px-8 md:px-12 md:pb-20">
        
        {/* Left Column - Large Staggered Typographic Heading */}
        <h1 className="max-w-xl text-4xl font-medium uppercase leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
          <Reveal as="span" delay={100} className="block pl-6 sm:pl-12">
            {t.sectionOne.headingLine1}
          </Reveal>
          <Reveal as="span" delay={220} className="block">
            {t.sectionOne.headingLine2Text} <span className="font-light normal-case italic">{t.sectionOne.headingLine2Italic}</span>
          </Reveal>
          <Reveal as="span" delay={340} className="block pl-10 sm:pl-20">
            {t.sectionOne.headingLine3}
          </Reveal>
          <Reveal as="span" delay={460} className="block pl-16 sm:pl-32">
            {t.sectionOne.headingLine4}
          </Reveal>
        </h1>

        {/* Right Column - Secondary Hero Narrative & Call-To-Action */}
        <div className="flex w-full max-w-xs flex-col items-start">
          <Reveal delay={400} className="w-full">
            <div className="mb-6 flex w-full items-center justify-between font-mono text-white sm:mb-8">
              <span className="text-lg">{t.sectionOne.markerLabel}</span>
              <span className="text-xs text-white/70">{t.sectionOne.markerValue}</span>
            </div>
          </Reveal>

          <Reveal delay={520} className="w-full">
            <p className="mb-6 text-sm leading-relaxed text-white/85 drop-shadow-md sm:mb-8">
              {t.sectionOne.paragraph}
            </p>
          </Reveal>

          <Reveal delay={640} className="w-full">
            <a
              href="https://www.linkedin.com/in/baldwinberges/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-full border border-white/60 px-8 py-3 text-center font-mono text-xs uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              {t.sectionOne.cta}
            </a>
          </Reveal>
        </div>
      </div>

      {/* Share Action Button */}
      <div className="absolute bottom-5 left-5 z-20 sm:bottom-6 sm:left-8 md:left-12">
        <Reveal delay={760}>
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

      {/* Bounce indicator arrow down */}
      <div className="absolute bottom-5 left-1/2 z-20 sm:bottom-6">
        <Reveal delay={760}>
          <button
            onClick={handleScrollDown}
            className="flex items-center justify-center text-white/80 hover:text-white transition-colors animate-bounce-center"
            aria-label="Scroll Down"
          >
            <ArrowDown size={18} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
