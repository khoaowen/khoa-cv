/** UI label translations (section headings, buttons). CV data itself lives in
 *  src/content/cv/{en,fr}.yaml — this is only for chrome/labels. */

export type Locale = 'en' | 'fr';

export const ui = {
  en: {
    'nav.summary': 'Summary',
    'nav.experience': 'Experience',
    'nav.earlier': 'Earlier experience',
    'nav.education': 'Education',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.languages': 'Languages',
    'nav.certifications': 'Certifications',
    'nav.sideProjects': 'Side Projects',
    'action.downloadPdf': 'Download 2-page CV',
    'action.downloadPdfSub': 'Concise PDF version',
    'action.viewLinkedin': 'LinkedIn',
    'action.website': 'Website',
    'action.github': 'GitHub',
    'date.present': 'Present',
    'lang.switchTo': 'Français',
    'lang.label': 'Language',
    'a11y.skipToContent': 'Skip to content',
    'meta.description': 'curriculum vitae',
  },
  fr: {
    'nav.summary': 'Profil',
    'nav.experience': 'Expérience',
    'nav.earlier': 'Expérience antérieure',
    'nav.education': 'Formation',
    'nav.skills': 'Compétences',
    'nav.projects': 'Projets',
    'nav.languages': 'Langues',
    'nav.certifications': 'Certifications',
    'nav.sideProjects': 'Projets personnels',
    'action.downloadPdf': 'Télécharger le CV 2 pages',
    'action.downloadPdfSub': 'Version PDF concise',
    'action.viewLinkedin': 'LinkedIn',
    'action.website': 'Site web',
    'action.github': 'GitHub',
    'date.present': 'Présent',
    'lang.switchTo': 'English',
    'lang.label': 'Langue',
    'a11y.skipToContent': 'Aller au contenu',
    'meta.description': 'curriculum vitae',
  },
} as const;

export function useTranslations(locale: Locale) {
  return function t(key: keyof (typeof ui)['en']): string {
    return ui[locale][key];
  };
}
