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
    markerIndex: string;
    markerValue: string;
    paragraph: string;
    cta: string;
  };
  sectionTwo: {
    headingLine1Text: string;
    headingLine1Italic: string;
    headingLine2: string;
    markerLabel: string;
    markerIndex: string;
    markerValue: string;
    paragraph: string;
    cta: string;
  };
  sectionThree: {
    headingLine1Text: string;
    headingLine1Italic: string;
    headingLine2: string;
    markerLabel: string;
    markerIndex: string;
    markerValue: string;
    paragraph: string;
    pillar1Title: string;
    pillar1Text: string;
    pillar2Title: string;
    pillar2Text: string;
    pillar3Title: string;
    pillar3Text: string;
    cta: string;
  };
  sectionFour: {
    headingLine1Text: string;
    headingLine1Italic: string;
    headingLine2: string;
    markerLabel: string;
    markerIndex: string;
    markerValue: string;
    paragraph: string;
    email: string;
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
      markerIndex: '[ 001 / 004 ]',
      markerValue: '[ INVESTISSEUR & PROMOTEUR ]',
      paragraph: "Avec plus de 30 ans d'expérience professionnelle, je me spécialise dans la finance durable, l'investissement stratégique et l'accès aux marchés mondiaux, menant des initiatives d'impact majeures dans les pays en développement.",
      cta: "Découvrir le Parcours",
    },
    sectionTwo: {
      headingLine1Text: 'Bâtir',
      headingLine1Italic: 'le changement',
      headingLine2: 'Durablement',
      markerLabel: '( B )',
      markerIndex: '[ 002 / 004 ]',
      markerValue: '[ EXPERTISE CLÉ ]',
      paragraph: "Expertise approfondie des marchés de capitaux, de la finance durable reliant fonds privés et publics, et des investissements dans les infrastructures physiques. Une décennie d'engagement pour transformer les économies partenaires.",
      cta: "Voir l'Impact",
    },
    sectionThree: {
      headingLine1Text: 'Trois',
      headingLine1Italic: 'leviers',
      headingLine2: 'Concrets',
      markerLabel: '( C )',
      markerIndex: '[ 003 / 004 ]',
      markerValue: "[ DOMAINES D'IMPACT ]",
      paragraph: "De la structuration des marchés de capitaux à la finance durable, chaque intervention vise un impact mesurable dans les économies partenaires.",
      pillar1Title: 'Marchés de capitaux',
      pillar1Text: 'Structurer et mobiliser les financements à grande échelle.',
      pillar2Title: 'Finance durable',
      pillar2Text: 'Relier capitaux privés et publics vers un impact réel.',
      pillar3Title: 'Infrastructures',
      pillar3Text: 'Investir dans les actifs physiques qui transforment les économies.',
      cta: 'Collaborons',
    },
    sectionFour: {
      headingLine1Text: 'Construisons',
      headingLine1Italic: "l'avenir",
      headingLine2: 'Ensemble',
      markerLabel: '( D )',
      markerIndex: '[ 004 / 004 ]',
      markerValue: '[ COLLABORATION ]',
      paragraph: "Vous portez un projet à fort impact ? Parlons de la façon dont le capital et l'expertise peuvent l'accélérer.",
      email: 'baldwin@baldwinberges.com',
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
      markerIndex: '[ 001 / 004 ]',
      markerValue: '[ INVESTOR & DEVELOPER ]',
      paragraph: 'With over 30 years of professional experience, I specialize in sustainable finance, strategic investment, and market access, driving impactful initiatives across low- and middle-income countries.',
      cta: 'Explore Biography',
    },
    sectionTwo: {
      headingLine1Text: 'Build',
      headingLine1Italic: 'for change',
      headingLine2: 'Brilliantly',
      markerLabel: '( B )',
      markerIndex: '[ 002 / 004 ]',
      markerValue: '[ KEY FOCUS ]',
      paragraph: 'Extensive expertise across capital markets, sustainable finance bridging private and public capital, and physical infrastructure investments. Ten years dedicated to empowering partnership-driven economies.',
      cta: 'See The Impact',
    },
    sectionThree: {
      headingLine1Text: 'Three',
      headingLine1Italic: 'levers',
      headingLine2: 'That Matter',
      markerLabel: '( C )',
      markerIndex: '[ 003 / 004 ]',
      markerValue: '[ AREAS OF IMPACT ]',
      paragraph: 'From structuring capital markets to sustainable finance, every move targets measurable impact across partner economies.',
      pillar1Title: 'Capital Markets',
      pillar1Text: 'Structuring and mobilising financing at scale.',
      pillar2Title: 'Sustainable Finance',
      pillar2Text: 'Bridging private and public capital toward real impact.',
      pillar3Title: 'Infrastructure',
      pillar3Text: 'Investing in the physical assets that transform economies.',
      cta: "Let's Collaborate",
    },
    sectionFour: {
      headingLine1Text: "Let's Build",
      headingLine1Italic: 'the future',
      headingLine2: 'Together',
      markerLabel: '( D )',
      markerIndex: '[ 004 / 004 ]',
      markerValue: '[ COLLABORATION ]',
      paragraph: "Working on a high-impact project? Let's talk about how capital and expertise can accelerate it.",
      email: 'baldwin@baldwinberges.com',
      cta: 'Connect With Me',
    },
    actions: {
      copied: 'COPIED',
      share: 'Share',
      demoAlert: 'Opening contact inquiries for Baldwin Berges (simulator)...',
    },
  },
};
