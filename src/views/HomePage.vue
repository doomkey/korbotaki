<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ t("homepage.title") }}</ion-title>
        <ion-button slot="end" fill="clear" router-link="/settings">
          <ion-icon :icon="settings"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <update-card
        v-if="updateInfo?.isUpdateAvailable"
        :version="updateInfo?.latestVersion"
        @update-click="handleUpdateClick"
      ></update-card>
      <div v-if="decisionStore.decisions.length === 0" class="empty-state">
        <ion-icon :icon="fileTrayOutline" class="empty-icon"></ion-icon>
        <h2 class="ion-padding-top">{{ t("homepage.empty_state_heading") }}</h2>
        <p>{{ t("homepage.empty_state_prompt") }}</p>
      </div>

      <ion-list v-else>
        <ion-item
          v-for="decision in decisionStore.decisions"
          :key="decision.id"
          button
          :detail="true"
          @click="navigateToDecision(decision)"
        >
          <ion-label>
            <h2>{{ decision.title }}</h2>
            <div class="item-meta">
              <div class="meta-tag">
                <ion-icon :icon="calendarOutline" size="small"></ion-icon>
                <ion-text>{{ formatDate(decision.createdAt) }}</ion-text>
              </div>
              <div class="meta-tag">
                <ion-icon
                  :icon="getStatus(decision).icon"
                  :color="getStatus(decision).color"
                  size="small"
                ></ion-icon>
                <ion-text :color="getStatus(decision).color">{{
                  getStatus(decision).text
                }}</ion-text>
              </div>
            </div>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="handleCreateNew">
          <ion-icon :icon="addOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  alertController,
  IonText,
  IonButton,
  onIonViewDidLeave,
  onIonViewWillEnter,
  toastController,
  useIonRouter,
} from "@ionic/vue";
import {
  addOutline,
  fileTrayOutline,
  calendarOutline,
  checkmarkDoneCircleOutline,
  syncCircleOutline,
  settings,
} from "ionicons/icons";
import { useRouter } from "vue-router";
import { useDecisionStore, Decision } from "@/stores/decisions";
import { useI18n } from "vue-i18n";
import { useAppUpdate } from "@/composables/useAppUpdate";
import { useUpdater } from "@/composables/useUpdater";
import UpdateCard from "@/components/UpdateCard.vue";
import { App } from "@capacitor/app";
const { t } = useI18n();
const router = useRouter();
const ionRouter = useIonRouter();
const decisionStore = useDecisionStore();
const { presentUpdateAlert } = useUpdater();
const { updateInfo } = useAppUpdate();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};
let lastBackPress = 0;

onIonViewWillEnter(() => {
  App.addListener("backButton", () => {
    if (!ionRouter.canGoBack()) {
      const currentTime = new Date().getTime();
      // If the last press was less than 2 seconds ago, exit
      if (currentTime - lastBackPress < 2000) {
        App.exitApp();
      } else {
        // Otherwise, show a toast and update the last press time
        showExitToast();
        lastBackPress = currentTime;
      }
    }
  });
});

onIonViewDidLeave(() => {
  App.removeAllListeners();
});
const handleUpdateClick = () => {
  if (updateInfo.value) {
    presentUpdateAlert(updateInfo.value);
  }
};

const showExitToast = async () => {
  const toast = await toastController.create({
    message: "Press back again to exit",
    duration: 2000,
    position: "bottom",
    color: "dark",
  });
  await toast.present();
};
/**
 * Creates a new decision after prompting for a title.
 */
const handleCreateNew = async () => {
  const alert = await alertController.create({
    header: t("homepage.new_decision"),
    message: t("homepage.new_decision_subtitle"),
    cssClass: "create-alert",
    inputs: [
      {
        name: "title",
        type: "text",
        placeholder: t("homepage.new_decision_example"),
      },
    ],
    buttons: [
      { text: t("common.cancel"), role: "cancel" },
      {
        text: t("common.create"),
        handler: (data) => {
          if (data.title) {
            const newDecision = decisionStore.createDecision(data.title);

            router.push(`/edit/${newDecision.id}`);
          }
        },
      },
    ],
  });
  await alert.present();
};

/**
 * Navigates to the correct page based on the decision's status.
 * @param {Decision} decision - The decision to navigate to.
 */
const navigateToDecision = (decision: Decision) => {
  if (decision.step === "results") {
    router.push(`/decision/${decision.id}`);
  } else {
    router.push(`/edit/${decision.id}`);
  }
};

/**
 * Returns an object with text, icon, and color for the decision's status.
 * @param {Decision} decision - The decision to check.
 * @returns {object} The status object.
 */
const getStatus = (decision: Decision) => {
  if (decision.step === "results") {
    return {
      text: t("homepage.status_completed"),
      icon: checkmarkDoneCircleOutline,
      color: "success",
    };
  }
  return {
    text: t("homepage.status_in_progress"),
    icon: syncCircleOutline,
    color: "warning",
  };
};
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70%;
}
.empty-state h2,
.empty-state p {
  text-align: center;
}
.empty-icon {
  font-size: 4rem;
}
.item-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}
.meta-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8em;
}
</style>
