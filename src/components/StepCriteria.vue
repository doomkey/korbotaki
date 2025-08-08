<template>
  <div>
    <ion-card class="md-filled" color="secondary">
      <ion-card-header>
        <ion-card-title>{{ t("criteria.title") }}</ion-card-title>
        <ion-card-subtitle>{{ t("criteria.subtitle") }}</ion-card-subtitle>
      </ion-card-header>
    </ion-card>
    <ion-list>
      <ion-item>
        <ion-input
          :label="t('criteria.newCriterionLabel')"
          label-placement="stacked"
          v-model="newCriterionName"
          :placeholder="t('criteria.newCriterionPlaceholder')"
          @keyup.enter="addCriterionFromInput"
        ></ion-input>
      </ion-item>
    </ion-list>
    <ion-button
      expand="block"
      @click="addCriterionFromInput"
      class="ion-margin-top"
    >
      <ion-icon slot="start" :icon="addCircleOutline"></ion-icon>
      {{ t("criteria.add_single") }}
    </ion-button>
    <div class="common-criteria-container ion-padding-top ion-text-center">
      <ion-label
        ><small> {{ t("criteria.commonPrompt") }}</small></ion-label
      >
      <div class="chip-wrapper">
        <ion-chip
          v-for="name in commonCriteria"
          :key="name"
          @click="addCriterion(name)"
        >
          <ion-label>{{ name }}</ion-label>
        </ion-chip>
      </div>
    </div>
    <p
      class="ion-text-center ion-padding-top"
      v-if="decision.criteria.length > 0"
    >
      <ion-text style="font-size: 0.9em">{{
        t("alternative.swipe_hint")
      }}</ion-text>
    </p>
    <ion-list>
      <ion-item-sliding
        v-for="(criterion, index) in decision.criteria"
        :key="criterion.id"
      >
        <ion-item-options side="end">
          <ion-item-option color="danger" @click="removeCriterion(index)">
            <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
          </ion-item-option>
        </ion-item-options>
        <ion-item>
          <div class="criterion-editor-item">
            <ion-input
              :label="t('criteria.criterionNameLabel')"
              label-placement="stacked"
              v-model="criterion.name"
            ></ion-input>
            <ion-item lines="none" class="toggle-item">
              <ion-label>{{ t("criteria.lowerBetter") }}</ion-label>
              <ion-toggle
                :checked="criterion.direction === 'high'"
                @ionChange="
                  criterion.direction = $event.detail.checked ? 'high' : 'low'
                "
              ></ion-toggle>
              <ion-label>{{ t("criteria.higherBetter") }}</ion-label>
            </ion-item>
          </div>
        </ion-item>
      </ion-item-sliding>
    </ion-list>
    <div class="step-nav">
      <ion-button fill="outline" @click="$emit('prev')">
        <ion-icon slot="start" :icon="arrowBackOutline"></ion-icon>
        {{ t("criteria.navAlternatives") }}
      </ion-button>
      <ion-button
        @click="$emit('next')"
        :disabled="decision.criteria.length < 2"
      >
        {{ t("criteria.navRank") }}
        <ion-icon slot="end" :icon="arrowForwardOutline"></ion-icon>
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonLabel,
  IonCardSubtitle,
  IonText,
  IonChip,
  toastController,
  IonToggle,
} from "@ionic/vue";
import {
  addCircleOutline,
  trashOutline,
  arrowBackOutline,
  arrowForwardOutline,
} from "ionicons/icons";
import { Decision } from "../stores/decisions";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps<{
  decision: Decision;
}>();

defineEmits(["next", "prev"]);

const newCriterionName = ref("");
const commonCriteria = ref([
  "Cost",
  "Benefit",
  "Time Needed",
  "Satisfaction",
  "Effort",
]);

const addCriterionFromInput = () => {
  if (newCriterionName.value.trim() === "") return;
  addCriterion(newCriterionName.value);
  newCriterionName.value = "";
};

const addCriterion = async (name: string) => {
  if (!props.decision) return;
  const trimmedName = name.trim();
  const isDuplicate = props.decision.criteria.some(
    (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
  );
  if (isDuplicate) {
    const toast = await toastController.create({
      message: t("criteria.toast.duplicate", { name: trimmedName }),
      duration: 2000,
      color: "warning",
    });
    toast.present();
    return;
  }

  props.decision.isRanked = false;
  const lowerCaseName = trimmedName.toLowerCase();
  props.decision.criteria.push({
    id: Date.now(),
    name: trimmedName,
    direction:
      lowerCaseName === "cost" ||
      lowerCaseName === "effort" ||
      lowerCaseName === "time needed"
        ? "low"
        : "high",
  });
  props.decision.alternatives.forEach((alt) => alt.values.push(5));
};

const removeCriterion = (index: number) => {
  if (!props.decision) return;
  props.decision.isRanked = false;
  props.decision.criteria.splice(index, 1);
  props.decision.alternatives.forEach((alt) => alt.values.splice(index, 1));
};
</script>

<style scoped>
.step-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
.common-criteria-container {
  margin-top: 16px;
}
.chip-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  justify-content: center;
}
.criterion-editor-item {
  width: 100%;
}
.criterion-direction-segment {
  margin-top: 8px;
  --ion-background-color: rgba(var(--ion-color-step-100-rgb), 0.5);
}
</style>
