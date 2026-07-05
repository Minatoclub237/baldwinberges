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
  const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260611_104107_121bfb5a-b1df-4e0d-8240-25b81f7cc85d.mp4';

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

