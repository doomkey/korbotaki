<template>
  <div>
    <ion-button fill="clear" @click="$emit('prev')" expand="block">
      <ion-icon slot="start" :icon="arrowBackOutline"></ion-icon>
      {{ t("scoring.backButton") }}
    </ion-button>
    <ion-card
      v-if="currentScoringCriterion"
      class="md-filled"
      color="secondary"
    >
      <ion-card-header>
        <ion-card-title>{{
          t("scoring.title", { name: currentScoringCriterion.name })
        }}</ion-card-title>
        <ion-card-subtitle>{{ t("scoring.subtitle") }}</ion-card-subtitle>
      </ion-card-header>
    </ion-card>

    <div v-if="currentScoringCriterion">
      <ion-segment
        v-model="currentScoringCriterion.direction"
        class="ion-padding-vertical"
        color="success"
      >
        <ion-segment-button value="high">
          <ion-label class="ion-text-wrap">{{
            t("criteria.higherBetter")
          }}</ion-label>
        </ion-segment-button>
        <ion-segment-button value="low">
          <ion-label class="ion-text-wrap">{{
            t("criteria.lowerBetter")
          }}</ion-label>
        </ion-segment-button>
      </ion-segment>

      <ion-list>
        <ion-item
          v-for="alternative in decision.alternatives"
          :key="alternative.id"
          class="scoring-item"
        >
          <ion-label class="ion-text-wrap">
            {{ alternative.name }}
            <ion-range
              :aria-label="t('scoring.rangeAriaLabel')"
              :min="1"
              :max="10"
              :pin="true"
              :snaps="true"
              v-model="alternative.values[currentScoringCriterionIndex]"
            >
              <ion-label slot="start">1</ion-label>
              <ion-label slot="end">10</ion-label>
            </ion-range>
          </ion-label>
        </ion-item>
      </ion-list>
    </div>

    <div class="scoring-nav">
      <ion-button
        fill="outline"
        @click="prevScoringCriterion"
        :disabled="currentScoringCriterionIndex === 0"
      >
        <ion-icon slot="start" :icon="arrowBackOutline"></ion-icon>
        {{ t("scoring.prevCriterionButton") }}
      </ion-button>
      <ion-button
        fill="outline"
        @click="nextScoringCriterion"
        :disabled="currentScoringCriterionIndex >= decision.criteria.length - 1"
      >
        {{ t("scoring.nextCriterionButton") }}
        <ion-icon slot="end" :icon="arrowForwardOutline"></ion-icon>
      </ion-button>
    </div>

    <ion-button
      expand="block"
      class="ion-margin-top"
      @click="$emit('calculate')"
      :disabled="currentScoringCriterionIndex < decision.criteria.length - 1"
    >
      {{ t("scoring.resultsButton") }}
      <ion-icon slot="end" :icon="analyticsOutline"></ion-icon>
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  IonList,
  IonItem,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonLabel,
  IonCardSubtitle,
  IonRange,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import {
  arrowBackOutline,
  arrowForwardOutline,
  analyticsOutline,
} from "ionicons/icons";
import { Decision } from "../stores/decisions";

const { t } = useI18n();

const props = defineProps<{
  decision: Decision;
}>();

defineEmits(["prev", "calculate"]);

const currentScoringCriterionIndex = ref(0);

const currentScoringCriterion = computed(
  () => props.decision?.criteria[currentScoringCriterionIndex.value] || null
);

const nextScoringCriterion = () => {
  if (
    !props.decision ||
    currentScoringCriterionIndex.value >= props.decision.criteria.length - 1
  )
    return;
  currentScoringCriterionIndex.value++;
};

const prevScoringCriterion = () => {
  if (currentScoringCriterionIndex.value > 0) {
    currentScoringCriterionIndex.value--;
  }
};
</script>

<style scoped>
.scoring-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.scoring-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
</style>
