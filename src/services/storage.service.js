import CryptoJS from "crypto-js";

export const StorageService = {
  testStorage() {
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      return true;
    } catch (e) {
      return false;
    }
  },

  get(key, entireObject = false) {
    if (this.testStorage()) {
      try {
        const now = Date.now();

        const decrypted = CryptoJS.AES.decrypt(
          localStorage.getItem(key),
          process.env.VUE_APP_CLIENT_SECRET
        ).toString(CryptoJS.enc.Utf8);
        const object = JSON.parse(decrypted);
        let expiresIn = object.expires;
        if (expiresIn === undefined || expiresIn === null) {
          expiresIn = 0;
        }

        if (expiresIn < now) {
          this.remove(key);
          return null;
        }
        return entireObject === true ? object : object.value;
      } catch (e) {
        return null;
      }
    } else {
      const name = `${key}=`;
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i += 1) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          const decrypted = CryptoJS.AES.decrypt(
            c.substring(name.length, c.length),
            process.env.VUE_APP_CLIENT_SECRET
          ).toString(CryptoJS.enc.Utf8);
          const object = JSON.parse(decrypted);
          return entireObject === true ? object : object.value;
        }
      }
      return null;
    }
  },

  set(key, value, expires) {
    let expiresAt;
    if (expires === undefined || expires === null) {
      expiresAt = 24 * 60 * 60;
    } else {
      expiresAt = Math.abs(expires);
    }
    const now = Date.now();
    const schedule = now + expiresAt * 1000;

    const object = { value, expires: schedule };
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(object),
      process.env.VUE_APP_CLIENT_SECRET
    ).toString();

    if (this.testStorage()) {
      try {
        localStorage.setItem(key, encrypted);
      } catch (e) {
        return false;
      }
      return true;
    }
    document.cookie = `${key}=${encrypted};expires=${new Date(
      schedule
    ).toUTCString()};path=/;SameSite=Lax;`;
    return true;
  },

  remove(key) {
    if (this.testStorage()) {
      localStorage.removeItem(key);
      return true;
    }
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    return true;
  },

  clean() {
    if (this.testStorage()) {
      localStorage.clear();
    }
    const cookies = document.cookie.split("; ");
    for (let c = 0; c < cookies.length; c += 1) {
      const d = window.location.hostname.split(".");
      while (d.length > 0) {
        const cookieBase = `${encodeURIComponent(
          cookies[c].split(";")[0].split("=")[0]
        )}=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=${d.join(
          "."
        )} ;path=`;
        const p = window.location.pathname.split("/");
        document.cookie = `${cookieBase}/`;
        while (p.length > 0) {
          document.cookie = cookieBase + p.join("/");
          p.pop();
        }
        d.shift();
      }
    }
  }
};

export default StorageService;
