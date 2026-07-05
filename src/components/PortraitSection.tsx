import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

export default function PortraitSection() {
  const { t } = useLanguage();

  return (
    <section
      id="section-portrait"
      className="relative flex min-h-screen items-center supports-[height:100svh]:min-h-[100svh]"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-5 py-24 sm:px-8 md:flex-row md:justify-between md:gap-16 md:px-12">
        {/* Portrait */}
        <Reveal className="shrink-0">
          <div className="relative">
            <img
              src="/baldwin.jpg"
              alt={t.portrait.alt}
              width={400}
              height={400}
              loading="lazy"
              className="h-64 w-64 rounded-2xl object-cover shadow-2xl ring-1 ring-white/20 sm:h-72 sm:w-72 md:h-80 md:w-80"
            />
            {/* subtle dark edge to seat the photo into the cinematic background */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/30" />
          </div>
        </Reveal>

        {/* Quote */}
        <div className="max-w-xl text-center md:text-left">
          <Reveal delay={140}>
            <span className="block font-mono text-6xl leading-none text-white/25">“</span>
          </Reveal>
          <Reveal delay={220}>
            <p className="-mt-3 text-2xl font-light leading-relaxed text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-3xl">
              {t.portrait.quote}
            </p>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-8 flex items-center justify-center gap-4 md:justify-start">
              <span className="h-px w-10 bg-white/50" />
              <div className="font-mono text-left">
                <div className="text-sm uppercase tracking-wide text-white">{t.portrait.name}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/70">{t.portrait.role}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
