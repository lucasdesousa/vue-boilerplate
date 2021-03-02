import axios from "axios";
import store from "../store";
import StorageService from "./storage.service";

export const ApiService = {
  _401interceptor: null,

  init(baseURL) {
    axios.defaults.baseURL = baseURL;
  },

  setHeader() {
    axios.defaults.headers.common.Authorization = `Bearer ${StorageService.get(
      "access_token"
    )}`;
  },

  removeHeader() {
    axios.defaults.headers.common = {};
  },

  get(resource) {
    return axios.get(resource);
  },

  getParams(resource, params) {
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        if (params[key] === "") delete params[key];
      }
    }
    return axios.get(resource, {
      params
    });
  },

  post(resource, data) {
    return axios.post(resource, data);
  },

  put(resource, data) {
    return axios.put(resource, data);
  },

  delete(resource) {
    return axios.delete(resource);
  },

  /**
   * Perform a custom Axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   * */
  customRequest(data) {
    return axios(data);
  },

  mount401Interceptor() {
    this._401interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.request.status === 401) {
          if (error.config.url.includes("/web/v1/auth/refresh")) {
            // Refresh token has failed. Logout the user
            store.dispatch("auth/logout");
            throw error;
          } else {
            // Refresh the access token
            try {
              await store.dispatch("auth/refreshToken");
              // Retry the original request
              return this.customRequest({
                method: error.config.method,
                url: error.config.url,
                data: error.config.data
              });
            } catch (e) {
              // Refresh has failed - reject the original request
              throw error;
            }
          }
        }

        // If error was not 401 just reject as is
        throw error;
      }
    );
  },

  unmount401Interceptor() {
    // Eject the interceptor
    // eslint-disable-next-line no-underscore-dangle
    axios.interceptors.response.eject(this._401interceptor);
  }
};

export default ApiService;
