<template>
  <div>
    <ion-card class="md-filled" color="secondary">
      <ion-card-header>
        <ion-card-title>{{ $t("ranking.title") }}</ion-card-title>
        <ion-card-subtitle>{{ $t("ranking.subtitle") }}</ion-card-subtitle>
        <p class="ion-padding-top ion-text-center" v-if="currentPair">
          {{
            $t("ranking.comparisonCounter", {
              current: currentPairIndex + 1,
              total: pairwisePairs.length,
            })
          }}
        </p>
      </ion-card-header>
    </ion-card>

    <div v-if="!decision.isRanked && currentPair">
      <div class="comparison-box" :key="currentPairIndex">
        <ion-button
          expand="block"
          size="large"
          @click="selectWinner(currentPair[0])"
          class="ranking-button"
        >
          {{ currentPair[0].name }}
        </ion-button>
        <ion-text
          ><p class="ion-text-center">{{ $t("ranking.vs") }}</p></ion-text
        >
        <ion-button
          expand="block"
          size="large"
          @click="selectWinner(currentPair[1])"
          class="ranking-button"
        >
          {{ currentPair[1].name }}
        </ion-button>
      </div>
    </div>
    <div v-else>
      <p class="ion-text-center">{{ $t("ranking.completed") }}</p>
      <ion-button
        expand="block"
        fill="outline"
        @click="reRank"
        class="ion-margin-top"
      >
        <ion-icon slot="start" :icon="refreshOutline"></ion-icon>
        {{ $t("ranking.reRankButton") }}
      </ion-button>
    </div>
    <div class="step-nav">
      <ion-button fill="outline" @click="$emit('prev')">
        <ion-icon slot="start" :icon="arrowBackOutline"></ion-icon>
        {{ $t("ranking.navCriteria") }}
      </ion-button>
      <ion-button @click="$emit('next')" :disabled="!decision.isRanked">
        {{ $t("ranking.navScores") }}
        <ion-icon slot="end" :icon="arrowForwardOutline"></ion-icon>
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonText,
} from "@ionic/vue";
import {
  arrowBackOutline,
  arrowForwardOutline,
  refreshOutline,
} from "ionicons/icons";
import { Decision, Criterion } from "../stores/decisions";

const props = defineProps<{
  decision: Decision;
}>();

defineEmits(["next", "prev"]);

const pairwisePairs = ref<[Criterion, Criterion][]>([]);
const currentPairIndex = ref(0);
const comparisonResults = ref<Record<number, number>>({});

onMounted(() => {
  if (props.decision && !props.decision.isRanked) {
    generatePairs();
  }
});

const currentPair = computed(
  () => pairwisePairs.value[currentPairIndex.value] || null
);

const generatePairs = () => {
  if (!props.decision) return;
  const pairs: [Criterion, Criterion][] = [];
  for (let i = 0; i < props.decision.criteria.length; i++) {
    for (let j = i + 1; j < props.decision.criteria.length; j++) {
      pairs.push([props.decision.criteria[i], props.decision.criteria[j]]);
    }
  }
  pairwisePairs.value = pairs;
  currentPairIndex.value = 0;
  const results: Record<number, number> = {};
  props.decision.criteria.forEach((c) => (results[c.id] = 0));
  comparisonResults.value = results;
};

const reRank = () => {
  if (!props.decision) return;
  props.decision.isRanked = false;
  generatePairs();
};

const selectWinner = (winner: Criterion) => {
  if (!props.decision) return;
  comparisonResults.value[winner.id]++;
  if (currentPairIndex.value < pairwisePairs.value.length - 1) {
    currentPairIndex.value++;
  } else {
    const oldCriteriaOrder = [...props.decision.criteria];
    props.decision.criteria.sort(
      (a, b) => comparisonResults.value[b.id] - comparisonResults.value[a.id]
    );
    props.decision.alternatives.forEach((alt) => {
      const newValues: number[] = [];
      for (let i = 0; i < props.decision!.criteria.length; i++) {
        const newCriterion = props.decision!.criteria[i];
        const oldIndex = oldCriteriaOrder.findIndex(
          (c) => c.id === newCriterion.id
        );
        newValues[i] = alt.values[oldIndex];
      }
      alt.values = newValues;
    });
    props.decision.isRanked = true;
    currentPairIndex.value++;
  }
};
</script>

<style scoped>
.step-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
.comparison-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ranking-button {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
