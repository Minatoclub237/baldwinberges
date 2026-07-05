/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ScrollVideo from './components/ScrollVideo';
import Navbar from './components/Navbar';
import SectionOne from './components/SectionOne';
import SectionTwo from './components/SectionTwo';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  // Vidéo hébergée localement (dossier /public) — permanente, plus de lien CloudFront temporaire
  const videoUrl = '/background.mp4';

  return (
    <LanguageProvider>
      <div className="relative">
        <ScrollVideo videoUrl={videoUrl} />
        <Navbar />
        <main>
          <SectionOne />
          <div aria-hidden className="h-[80vh]" />
          <SectionTwo />
        </main>
      </div>
    </LanguageProvider>
  );
}

