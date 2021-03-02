import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { StorageService } from "../services/storage.service";

import { language } from "./modules/language.module";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    language
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => StorageService.get(key),
        setItem: (key, value) => StorageService.set(key, value, 5600),
        removeItem: key => StorageService.remove(key)
      }
    })
  ]
});
