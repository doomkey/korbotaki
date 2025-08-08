<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding" v-if="decision">
      <StepAlternatives
        v-if="decision.step === 'alternatives'"
        :decision="decision"
        @next="nextStep"
      />
      <StepCriteria
        v-if="decision.step === 'criteria'"
        :decision="decision"
        @next="nextStep"
        @prev="prevStep"
      />
      <StepRanking
        v-if="decision.step === 'ranking'"
        :decision="decision"
        @next="nextStep"
        @prev="prevStep"
      />
      <StepScoring
        v-if="decision.step === 'scoring'"
        :decision="decision"
        @prev="prevStep"
        @calculate="calculateResults"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
} from "@ionic/vue";
import { useDecisionStore, Decision } from "@/stores/decisions";

import StepAlternatives from "@/components/StepAlternatives.vue";
import StepCriteria from "@/components/StepCriteria.vue";
import StepRanking from "@/components/StepRanking.vue";
import StepScoring from "@/components/StepScoring.vue";

const route = useRoute();
const router = useRouter();
const decisionStore = useDecisionStore();
const decision = ref<Decision | null>(null);

onMounted(() => {
  const decisionId = parseInt(route.params.id as string, 10);
  const foundDecision = decisionStore.getDecisionById(decisionId);
  if (foundDecision) {
    decision.value = foundDecision;
    if (decision.value.step === "results") {
      decision.value.step = "alternatives";
    }
  } else {
    router.replace("/");
  }
});

const pageTitle = computed(() => decision.value?.title || "Decision");

const nextStep = () => {
  if (!decision.value) return;
  if (decision.value.step === "alternatives") decision.value.step = "criteria";
  else if (decision.value.step === "criteria") decision.value.step = "ranking";
  else if (decision.value.step === "ranking") decision.value.step = "scoring";
};

const prevStep = () => {
  if (!decision.value) return;
  if (decision.value.step === "scoring") decision.value.step = "ranking";
  else if (decision.value.step === "ranking") decision.value.step = "criteria";
  else if (decision.value.step === "criteria")
    decision.value.step = "alternatives";
};

const calculateResults = () => {
  if (!decision.value) return;
  const numCriteria = decision.value.criteria.length;
  const weights = decision.value.criteria.map(
    (_, index) => numCriteria - index
  );
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const normalizedWeights = weights.map((w) => w / totalWeight);

  const scores = decision.value.alternatives.map((alt) => {
    let totalScore = 0;
    for (let i = 0; i < numCriteria; i++) {
      const criterion = decision.value!.criteria[i];
      const rawValue = alt.values[i];
      let normalizedValue = (rawValue - 1) / 9;
      if (criterion.direction === "low") {
        normalizedValue = 1 - normalizedValue;
      }
      totalScore += normalizedValue * normalizedWeights[i];
    }
    return { name: alt.name, score: totalScore * 100 };
  });

  scores.sort((a, b) => b.score - a.score);
  decision.value.finalScores = scores;
  decision.value.step = "results";
  router.push(`/decision/${decision.value.id}`);
};
</script>
