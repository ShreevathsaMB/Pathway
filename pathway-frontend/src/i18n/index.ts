import { en } from './en';
import { kn } from './kn';
import { hi } from './hi';
import { te } from './te';
import { ta } from './ta';
import { ml } from './ml';

export type { Translations } from './en';
export type Language = 'en' | 'kn' | 'hi' | 'te' | 'ta' | 'ml';

export const translations: Record<Language, typeof en> = {
  en,
  kn,
  hi,
  te,
  ta,
  ml,
};

export const languageLabels: Record<Language, string> = {
  en: 'English',
  kn: 'ಕನ್ನಡ (Kannada)',
  hi: 'हिन्दी (Hindi)',
  te: 'తెలుగు (Telugu)',
  ta: 'தமிழ் (Tamil)',
  ml: 'മലയാളം (Malayalam)',
};

export { en, kn, hi, te, ta, ml };
