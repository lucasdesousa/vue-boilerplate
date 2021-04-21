<template>
  <Header />
  <Navbar />
  <router-view />
</template>

<script>
import Header from "@/components/ui/Header";
import Navbar from "@/components/ui/Navbar";

import {
  setDocumentDirectionPerLocale,
  setDocumentLang
} from "./translations/helpers";

export default {
  components: {
    Header,
    Navbar
  },
  mounted() {
    this.$watch(
      "$i18n.locale",
      (newLocale, oldLocale) => {
        if (newLocale === oldLocale) {
          return;
        }
        setDocumentLang(newLocale);
        setDocumentDirectionPerLocale(newLocale);
      },
      { immediate: true }
    );
  }
};
</script>
