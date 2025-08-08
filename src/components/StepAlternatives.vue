<template>
  <div>
    <ion-card class="md-filled" color="secondary">
      <ion-card-header>
        <ion-card-title>{{ t("alternative.heading") }}</ion-card-title>
        <ion-card-subtitle>{{ t("alternative.subheading") }}</ion-card-subtitle>
      </ion-card-header>
    </ion-card>
    <ion-list>
      <ion-item>
        <ion-input
          :label="t('alternative.new_label')"
          label-placement="stacked"
          v-model="newAlternativeName"
          :placeholder="t('alternative.new_placeholder')"
          @keyup.enter="addAlternative"
        ></ion-input>
      </ion-item>
    </ion-list>
    <ion-button expand="block" @click="addAlternative" class="ion-margin-top">
      <ion-icon slot="start" :icon="addCircleOutline"></ion-icon>
      {{ t("alternative.add_button") }}
    </ion-button>
    <p
      class="ion-text-center ion-padding-top"
      v-if="decision.alternatives.length > 0"
    >
      <ion-text style="font-size: 0.9em">{{
        t("alternative.swipe_hint")
      }}</ion-text>
    </p>
    <ion-list>
      <ion-item-sliding
        v-for="(alternative, index) in decision.alternatives"
        :key="alternative.id"
      >
        <ion-item-options side="end">
          <ion-item-option color="danger" @click="removeAlternative(index)">
            <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
          </ion-item-option>
        </ion-item-options>
        <ion-item>
          <ion-input
            :label="t('alternative.name_label')"
            label-placement="stacked"
            v-model="alternative.name"
          ></ion-input>
        </ion-item>
      </ion-item-sliding>
    </ion-list>
    <div class="step-nav">
      <ion-button
        @click="$emit('next')"
        :disabled="decision.alternatives.length < 2"
        expand="block"
      >
        {{ t("criteria.add") }}
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
  IonCardSubtitle,
  IonText,
} from "@ionic/vue";
import {
  addCircleOutline,
  trashOutline,
  arrowForwardOutline,
} from "ionicons/icons";
import { Decision } from "../stores/decisions";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  decision: Decision;
}>();

defineEmits(["next"]);

const newAlternativeName = ref("");

const addAlternative = () => {
  if (!props.decision || newAlternativeName.value.trim() === "") return;
  props.decision.alternatives.push({
    id: Date.now(),
    name: newAlternativeName.value,
    values: Array(props.decision.criteria.length).fill(5),
  });
  newAlternativeName.value = "";
};

const removeAlternative = (index: number) => {
  if (!props.decision) return;
  props.decision.alternatives.splice(index, 1);
};
</script>

<style scoped>
.step-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
</style>
