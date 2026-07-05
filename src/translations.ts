export interface TranslationSet {
  brand: string;
  version: string;
  nav: {
    main: string;
    tiers: string;
    features: string;
    talkToUs: string;
  };
  sectionOne: {
    headingLine1: string;
    headingLine2Text: string;
    headingLine2Italic: string;
    headingLine3: string;
    headingLine4: string;
    markerLabel: string;
    markerValue: string;
    paragraph: string;
    cta: string;
  };
  sectionTwo: {
    headingLine1Text: string;
    headingLine1Italic: string;
    headingLine2: string;
    markerLabel: string;
    markerValue: string;
    paragraph: string;
    cta: string;
  };
  actions: {
    copied: string;
    share: string;
    demoAlert: string;
  };
}

export const translations: Record<'fr' | 'en', TranslationSet> = {
  fr: {
    brand: 'Baldwin Berges',
    version: '[ EXP. 30+ ]',
    nav: {
      main: 'biographie',
      tiers: 'expertise',
      features: 'impact',
      talkToUs: 'contact',
    },
    sectionOne: {
      headingLine1: "Le Capital",
      headingLine2Text: "S'allie",
      headingLine2Italic: 'à',
      headingLine3: "// L'Impact",
      headingLine4: 'Durable',
      markerLabel: '( A )',
      markerValue: '[ INVESTISSEUR & PROMOTEUR ]',
      paragraph: "Avec plus de 30 ans d'expérience professionnelle, je me spécialise dans la finance durable, l'investissement stratégique et l'accès aux marchés mondiaux, menant des initiatives d'impact majeures dans les pays en développement.",
      cta: "Découvrir le Parcours",
    },
    sectionTwo: {
      headingLine1Text: 'Bâtir',
      headingLine1Italic: 'le changement',
      headingLine2: 'Durablement',
      markerLabel: '( B )',
      markerValue: '[ EXPERTISE CLÉ ]',
      paragraph: "Expertise approfondie des marchés de capitaux, de la finance durable reliant fonds privés et publics, et des investissements dans les infrastructures physiques. Une décennie d'engagement pour transformer les économies partenaires.",
      cta: 'Me Contacter',
    },
    actions: {
      copied: 'COPIÉ',
      share: 'Partager',
      demoAlert: 'Ouverture du formulaire de contact avec Baldwin Berges (simulateur)...',
    },
  },
  en: {
    brand: 'Baldwin Berges',
    version: '[ EXP. 30+ ]',
    nav: {
      main: 'biography',
      tiers: 'expertise',
      features: 'impact',
      talkToUs: 'contact',
    },
    sectionOne: {
      headingLine1: 'Capital',
      headingLine2Text: 'Aligns',
      headingLine2Italic: 'with',
      headingLine3: '// Sustainable',
      headingLine4: 'Impact',
      markerLabel: '( A )',
      markerValue: '[ INVESTOR & DEVELOPER ]',
      paragraph: 'With over 30 years of professional experience, I specialize in sustainable finance, strategic investment, and market access, driving impactful initiatives across low- and middle-income countries.',
      cta: 'Explore Biography',
    },
    sectionTwo: {
      headingLine1Text: 'Build',
      headingLine1Italic: 'for change',
      headingLine2: 'Brilliantly',
      markerLabel: '( B )',
      markerValue: '[ KEY FOCUS ]',
      paragraph: 'Extensive expertise across capital markets, sustainable finance bridging private and public capital, and physical infrastructure investments. Ten years dedicated to empowering partnership-driven economies.',
      cta: 'Connect With Me',
    },
    actions: {
      copied: 'COPIED',
      share: 'Share',
      demoAlert: 'Opening contact inquiries for Baldwin Berges (simulator)...',
    },
  },
};
