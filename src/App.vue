<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { onMounted } from "vue";
import { useLanguage } from "./composables/useLanguage";
import { loadTheme } from "@/composables/useTheme";
import { loadTextSize } from "./composables/useTextSize";
const { loadLanguage } = useLanguage();
onMounted(() => {
  loadLanguage();
  loadTheme();
  loadTextSize();
});
</script>
