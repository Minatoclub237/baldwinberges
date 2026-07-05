import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  const handleNavClick = (linkKey: 'main' | 'tiers' | 'features' | 'talkToUs') => {
    if (linkKey === 'main') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetId = {
      tiers: 'section-two',
      features: 'section-three',
      talkToUs: 'section-four',
    }[linkKey];
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { key: 'main', label: t.nav.main },
    { key: 'tiers', label: t.nav.tiers },
    { key: 'features', label: t.nav.features },
    { key: 'talkToUs', label: t.nav.talkToUs },
  ] as const;

  return (
    <>
      {/* Top-Left Brand Wordmark & Language Selector */}
      <div id="navbar-brand-container" className="fixed left-5 top-5 z-50 sm:left-8 sm:top-7 md:left-12">
        <Reveal as="div">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('main');
            }}
            className="font-mono text-lg font-medium tracking-tight text-white drop-shadow-md sm:text-xl md:text-2xl"
          >
            ({t.brand})
          </a>
        </Reveal>
        <Reveal as="div" delay={150}>
          <div className="mt-5 flex flex-col gap-2 font-mono text-[10px] sm:mt-7 sm:text-xs">
            <div className="text-white/60">{t.version}</div>
            
            {/* Minimal Language Switcher */}
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => setLanguage('fr')}
                className={`transition-all duration-300 border-b cursor-pointer ${
                  language === 'fr'
                    ? 'text-white border-white/80 font-medium'
                    : 'text-white/40 border-transparent hover:text-white/80'
                }`}
              >
                FR
              </button>
              <span className="text-white/20 select-none">/</span>
              <button
                onClick={() => setLanguage('en')}
                className={`transition-all duration-300 border-b cursor-pointer ${
                  language === 'en'
                    ? 'text-white border-white/80 font-medium'
                    : 'text-white/40 border-transparent hover:text-white/80'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Top-Right Navigation Links Menu */}
      <nav id="navbar-menu-container" className="fixed right-5 top-5 z-50 sm:right-8 sm:top-7 md:right-12">
        <ul className="flex flex-col items-end gap-1.5 sm:gap-2">
          {navItems.map((item, i) => (
            <li key={item.key} id={`nav-item-${item.key}`}>
              <Reveal delay={100 + i * 120}>
                <a
                  href={`#${item.key}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.key);
                  }}
                  className="group flex items-center gap-1 font-mono text-xs text-white/80 drop-shadow-md transition-colors duration-300 hover:text-white sm:text-sm uppercase tracking-wider"
                >
                  {item.label}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
