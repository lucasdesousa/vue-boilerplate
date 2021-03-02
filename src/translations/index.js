import { createI18n } from "vue-i18n";
import { getBrowserLocale, supportedLocalesInclude } from "./helpers";

function getStartingLocale() {
  const browserLocale = getBrowserLocale({ countryCodeOnly: true });
  if (supportedLocalesInclude(browserLocale)) {
    return browserLocale;
  }
  return process.env.VUE_APP_I18N_LOCALE || "en";
}

const startingLocale = getStartingLocale();

export const i18n = createI18n({
  legacy: true,
  locale: startingLocale,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: {}
});

const loadedLanguages = [];
export function loadLocaleMessagesAsync(locale) {
  if (loadedLanguages.length > 0 && i18n.global.locale === locale) {
    return Promise.resolve(locale);
  }

  // If the language was already loaded
  if (loadedLanguages.includes(locale)) {
    i18n.global.locale = locale;
    return Promise.resolve(locale);
  }

  // If the language hasn't been loaded yet
  return import(`@/translations/locales/${locale}.json`).then(messages => {
    i18n.global.setLocaleMessage(locale, messages.default);
    loadedLanguages.push(locale);
    i18n.global.locale = locale;
    return Promise.resolve(locale);
  });
}

loadLocaleMessagesAsync(startingLocale);

export default i18n;
