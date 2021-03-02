import { createApp } from "vue";

import App from "./App.vue";

import router from "./router";
import store from "./store";
import i18n from "./translations";

import ApiService from "./services/api.service";
import StorageService from "./services/storage.service";

import "./registerServiceWorker";
import "./index.css";

ApiService.init(process.env.VUE_APP_BACKEND_SERVER);
if (StorageService.get("access_token")) {
  ApiService.setHeader();
  ApiService.mount401Interceptor();
}

createApp(App)
  .use(i18n)
  .use(store)
  .use(router)
  .mount("#app");
