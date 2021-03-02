import { StorageService } from "../../services/storage.service";
import { getSupportedLocales } from "../../translations/helpers";
import { i18n, loadLocaleMessagesAsync } from "../../translations";

const supportedLanguages = getSupportedLocales().map(item => item.code);

const preference = StorageService.get("language");
const initialState = preference || i18n.locale;

export const language = {
  namespaced: true,
  state: initialState,
  actions: {
    setLanguage({ commit }, languages) {
      if (typeof languages === "string") {
        commit("languageSucess", languages);
      } else {
        const supportedLanguage = supportedLanguages.find(sl =>
          languages.find(l =>
            l.split(new RegExp(sl, "gi")).length - 1 > 0 ? sl : null
          )
        );
        commit("languageSucess", supportedLanguage);
      }
    },

    resetLanguage({ commit }) {
      commit("languageReset");
    }
  },
  mutations: {
    languageSucess(state, lang) {
      StorageService.set("language", lang, 3600 * 14);
      loadLocaleMessagesAsync(lang);
      i18n.locale = lang;
      this.state = lang;
    },
    languageReset() {
      StorageService.remove("language");
      this.state = null;
    }
  }
};
