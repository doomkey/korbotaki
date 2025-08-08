<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goHome">
            <ion-icon :icon="home"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ decision?.title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="presentActionSheet">
            <ion-icon
              slot="icon-only"
              :icon="ellipsisVerticalOutline"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding" v-if="decision">
      <ion-card class="md-filled" color="secondary">
        <ion-card-header>
          <ion-card-title>{{ t("detail.resultsCard.title") }}</ion-card-title>
          <ion-card-subtitle>{{
            t("detail.resultsCard.subtitle")
          }}</ion-card-subtitle>
        </ion-card-header>
      </ion-card>
      <ion-list>
        <ion-item
          v-for="(result, index) in decision.finalScores"
          :key="result.name"
          class="result-item"
        >
          <ion-badge slot="start" :color="index === 0 ? 'success' : 'light'"
            >#{{ index + 1 }}</ion-badge
          >
          <ion-label class="ion-text-wrap">
            <div class="score-display">
              <div class="score-header">
                <h2>{{ result.name }}</h2>
                <ion-note>{{ result.score.toFixed(1) }}%</ion-note>
              </div>
              <ion-progress-bar
                :value="result.score / 100"
                :color="index === 0 ? 'success' : 'primary'"
              ></ion-progress-bar>
            </div>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-card class="md-filled ion-margin-top" color="secondary">
        <ion-card-header>
          <ion-card-title>{{ t("detail.breakdownCard.title") }}</ion-card-title>
          <ion-card-subtitle>{{
            t("detail.breakdownCard.subtitle")
          }}</ion-card-subtitle>
        </ion-card-header>
      </ion-card>

      <div
        v-for="(criterion, critIndex) in decision.criteria"
        :key="criterion.id"
        class="criterion-breakdown"
      >
        <ion-item-divider sticky>
          <ion-label>{{ criterion.name }}</ion-label>
          <ion-chip
            slot="end"
            :color="criterion.direction === 'high' ? 'success' : 'warning'"
          >
            <ion-icon
              :icon="
                criterion.direction === 'high'
                  ? trendingUpOutline
                  : trendingDownOutline
              "
            ></ion-icon>
            <ion-label class="chip-label">{{
              criterion.direction === "high"
                ? t("detail.chip.higherBetter")
                : t("detail.chip.lowerBetter")
            }}</ion-label>
          </ion-chip>
        </ion-item-divider>
        <ion-list>
          <ion-item
            v-for="alternative in decision.alternatives"
            :key="alternative.id"
          >
            <ion-label class="ion-text-wrap">
              <div class="score-display">
                <div class="score-header">
                  <h3>{{ alternative.name }}</h3>
                  <ion-note>{{ alternative.values[critIndex] }} / 10</ion-note>
                </div>
                <ion-progress-bar
                  :value="alternative.values[critIndex] / 10"
                ></ion-progress-bar>
              </div>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonBadge,
  IonButtons,
  IonIcon,
  IonChip,
  IonItemDivider,
  IonNote,
  IonProgressBar,
  alertController,
  IonButton,
  actionSheetController,
} from "@ionic/vue";
import {
  pencilOutline,
  trendingUpOutline,
  trendingDownOutline,
  trashOutline,
  ellipsisVerticalOutline,
  closeOutline,
  home,
} from "ionicons/icons";
import { useDecisionStore, Decision } from "../stores/decisions";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const decisionStore = useDecisionStore();
const decision = ref<Decision | null>(null);

const goHome = () => {
  router.replace("/home");
};

onMounted(() => {
  const decisionId = parseInt(route.params.id as string, 10);
  const foundDecision = decisionStore.getDecisionById(decisionId);
  if (foundDecision) {
    decision.value = foundDecision;
  } else {
    router.replace("/home");
  }
});

const editDecision = () => {
  if (decision.value) {
    router.push(`/edit/${decision.value.id}`);
  }
};

const confirmDelete = async () => {
  if (!decision.value) return;

  const alert = await alertController.create({
    header: t("detail.deleteDialog.header"),
    message: t("detail.deleteDialog.message"),
    buttons: [
      {
        text: t("common.cancel"),
        role: "cancel",
        cssClass: "secondary",
      },
      {
        text: t("common.delete"),
        handler: () => {
          if (decision.value) {
            decisionStore.deleteDecision(decision.value.id);
            router.replace("/home");
          }
        },
      },
    ],
  });
  await alert.present();
};

const presentActionSheet = async () => {
  const actionSheet = await actionSheetController.create({
    header: t("common.options"),
    buttons: [
      {
        text: t("common.edit"),
        icon: pencilOutline,
        handler: () => {
          editDecision();
        },
      },
      {
        text: t("common.delete"),
        role: "destructive",
        icon: trashOutline,
        handler: () => {
          confirmDelete();
        },
      },
      {
        text: t("common.cancel"),
        icon: closeOutline,
        role: "cancel",
      },
    ],
  });
  await actionSheet.present();
};
</script>

<style scoped>
.result-item {
  --inner-padding-top: 16px;
  --inner-padding-bottom: 16px;
}
.result-item ion-badge {
  font-size: 1rem;
  margin-right: 16px;
  align-self: center; /* This centers the badge vertically */
}
.score-display {
  width: 100%;
  padding-block: 4px;
}
.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.score-header h2 {
  margin: 0;
  font-weight: bold;
  font-size: 1.1rem;
}
.score-header h3 {
  margin: 0;
  font-size: 1rem;
}
ion-progress-bar {
  height: 8px;
  border-radius: 4px;
}
.criterion-breakdown {
  margin-bottom: 1rem;
}
.chip-label {
  font-size: 0.8em;
}
</style>
