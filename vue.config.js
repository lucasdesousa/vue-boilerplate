module.exports = {
  chainWebpack: config => {
    config.plugins.delete("prefetch");
  },
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "i18n/locales",
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true
    }
  },
  devServer: {
    port: 8087
  },
  pwa: {
    name: "AppTalk",
    themeColor: "#4290f6",
    msTileColor: "#4290f6",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "white",
    manifestOptions: {
      start_url: "/",
      display: "standalone",
      background_color: "#FFFFFF"
    },
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      skipWaiting: true
    }
  }
};
