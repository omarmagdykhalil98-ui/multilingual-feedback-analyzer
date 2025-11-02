const languageMap = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  en: 'English',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese',
  ar: 'Arabic',
  ja: 'Japanese',
};

export const getFullLanguageName = (code) => {
  return languageMap[code] || code;
};
