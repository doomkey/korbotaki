<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ t("settings.title") }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list-header>{{ t("settings.language") }}</ion-list-header>
      <div style="padding: 0 16px">
        <ion-segment
          :value="language"
          @ionChange="onLanguageChange($event)"
          class="full-width-segment"
          color="warning"
        >
          <ion-segment-button value="en">
            <ion-label>{{ t("settings.english") }}</ion-label>
          </ion-segment-button>
          <ion-segment-button value="bn">
            <ion-label>{{ t("settings.bangla") }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <ion-list :inset="false">
        <ion-list-header>{{ t("settings.appearance") }}</ion-list-header>
        <ion-item>
          <ion-icon :icon="moon" slot="start" aria-hidden="true"></ion-icon>
          <ion-label>{{ t("settings.darkMode") }}</ion-label>
          <ion-toggle
            :checked="isDarkMode"
            @ionChange="toggleTheme"
            slot="end"
            :aria-label="t('settings.darkModeAriaLabel')"
          ></ion-toggle>
        </ion-item>

        <ion-item>
          <ion-icon :icon="text" slot="start" aria-hidden="true"></ion-icon>
          <ion-select
            :label="t('settings.textSize')"
            :value="textSize"
            @ionChange="onTextSizeChange($event)"
          >
            <ion-select-option value="small">{{
              t("settings.size.small")
            }}</ion-select-option>
            <ion-select-option value="medium">{{
              t("settings.size.medium")
            }}</ion-select-option>
            <ion-select-option value="large">{{
              t("settings.size.large")
            }}</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>

      <ion-list :inset="false">
        <ion-item button @click="goToAboutPage" :detail="true">
          <ion-icon :icon="informationCircle" slot="start"></ion-icon>
          <ion-label>{{ t("settings.aboutApp") }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonListHeader,
  IonLabel,
  IonToggle,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
} from "@ionic/vue";
import { moon, text, informationCircle } from "ionicons/icons";
import { useRouter } from "vue-router";
import { useTheme } from "@/composables/useTheme";
import { useTextSize, TextSize } from "@/composables/useTextSize";
import { useLanguage } from "@/composables/useLanguage";

const { language, setLanguage, t } = useLanguage();

const router = useRouter();

const { isDarkMode, toggleTheme } = useTheme();
const { textSize, setTextSize } = useTextSize();
const onTextSizeChange = (event: CustomEvent) => {
  const newSize = event.detail.value as TextSize;
  if (newSize) {
    setTextSize(newSize);
  }
};

const goToAboutPage = () => {
  router.push("/about");
};

const onLanguageChange = (event: CustomEvent) => {
  const newLang = event.detail.value;
  if (newLang) {
    setLanguage(newLang);
  }
};
</script>

<style scoped>
ion-list {
  margin-top: 20px;
}
ion-label p {
  font-size: 0.8em;
}
</style>
