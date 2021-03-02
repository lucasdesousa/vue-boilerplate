import supportedLocales from "./supported-languages";

export function getSupportedLocales() {
  const annotatedLocales = [];
  for (const code of Object.keys(supportedLocales)) {
    annotatedLocales.push({
      code,
      name: supportedLocales[code]
    });
  }
  return annotatedLocales;
}

export function supportedLocalesInclude(locale) {
  return Object.keys(supportedLocales).includes(locale);
}

export function getBrowserLocale(options = {}) {
  const defaultOptions = { countryCodeOnly: false };
  const opt = { ...defaultOptions, ...options };
  const navigatorLocale =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language;
  if (!navigatorLocale) {
    return undefined;
  }
  const trimmedLocale = opt.countryCodeOnly
    ? navigatorLocale.trim().split(/-|_/)[0]
    : navigatorLocale.trim();
  return trimmedLocale;
}

export function setDocumentDirectionPerLocale(locale) {
  document.dir = locale === "ar" ? "rtl" : "ltr";
}

export function setDocumentLang(lang) {
  document.documentElement.lang = lang;
}

export function setDocumentTitle(newTitle) {
  document.title = newTitle;
}

let defaultChoiceIndex;
export function setDefaultChoiceIndexGet(fn) {
  defaultChoiceIndex = fn;
}

export function getChoiceIndex(choice, choicesLength) {
  if (defaultChoiceIndex === undefined) {
    return choice;
  }
  if (this.locale !== "ar") {
    return defaultChoiceIndex.apply(this, [choice, choicesLength]);
  }
  if ([0, 1, 2].includes(choice)) {
    return choice;
  }
  if (choice >= 3 && choice <= 10) {
    return 3;
  }
  if (choice >= 11 && choice <= 99) {
    return 4;
  }
  return 5;
}
