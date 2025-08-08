import { defineStore } from "pinia";
import { ref, watch } from "vue";

export interface Criterion {
  id: number;
  name: string;
  direction: "high" | "low";
}
export interface Alternative {
  id: number;
  name: string;
  values: number[];
}
export interface Result {
  name: string;
  score: number;
}
export interface Decision {
  id: number;
  title: string;
  createdAt: string;
  step: "alternatives" | "criteria" | "ranking" | "scoring" | "results";
  criteria: Criterion[];
  alternatives: Alternative[];
  finalScores: Result[];
  isRanked: boolean;
  isSample?: boolean;
}

const sampleDecision: Decision = {
  id: 1,
  title: "Choose a new laptop",
  createdAt: new Date().toISOString(),
  step: "results",
  isRanked: true,
  isSample: true,
  criteria: [
    { id: 1, name: "Performance", direction: "high" },
    { id: 2, name: "Battery Life", direction: "high" },
    { id: 3, name: "Price", direction: "low" },
    { id: 4, name: "Portability", direction: "high" },
  ],
  alternatives: [
    { id: 101, name: "Macbook", values: [9, 7, 4, 9] },
    { id: 102, name: "Dell", values: [10, 5, 3, 4] },
    { id: 103, name: "HP", values: [6, 9, 8, 7] },
  ],
  finalScores: [
    { name: "Macbook", score: 81.5 },
    { name: "Dell", score: 70.0 },
    { name: "HP", score: 63.5 },
  ],
};

export const useDecisionStore = defineStore("decisions", () => {
  const decisions = ref<Decision[]>([]);

  /**
   * Loads all decisions from localStorage into the state.
   * If no decisions exist, it loads the sample one.
   */
  function loadDecisions() {
    const savedDecisions = localStorage.getItem("decisions_app_data");
    if (savedDecisions && JSON.parse(savedDecisions).length > 0) {
      const parsedDecisions = JSON.parse(savedDecisions);

      decisions.value = parsedDecisions.map((d: any) => ({
        ...d,
        isRanked: d.isRanked || false,
      }));
    } else {
      decisions.value = [sampleDecision];
    }
  }

  /**
   * Creates a new, blank decision object.
   * @param {string} title - The title for the new decision.
   * @returns {Decision} The newly created decision object.
   */
  function createDecision(title: string) {
    const newDecision: Decision = {
      id: Date.now(),
      title: title || "Untitled Decision",
      createdAt: new Date().toISOString(),
      step: "alternatives",
      criteria: [],
      alternatives: [],
      finalScores: [],
      isRanked: false,
    };
    decisions.value.unshift(newDecision);
    return newDecision;
  }

  /**
   * Updates a specific decision in the state.
   * @param {Decision} updatedDecision - The decision object with updated data.
   */
  function updateDecision(updatedDecision: Decision) {
    const index = decisions.value.findIndex((d) => d.id === updatedDecision.id);
    if (index !== -1) {
      decisions.value[index] = updatedDecision;
    }
  }

  /**
   * Deletes a decision by its ID.
   * @param {number} id - The ID of the decision to delete.
   */
  function deleteDecision(id: number) {
    const index = decisions.value.findIndex((d) => d.id === id);
    if (index !== -1) {
      decisions.value.splice(index, 1);
    }
  }

  /**
   * Gets a single decision by its ID.
   * @param {number} id - The ID of the decision to find.
   * @returns {Decision | undefined} The found decision or undefined.
   */
  function getDecisionById(id: number) {
    return decisions.value.find((d) => d.id === id);
  }

  watch(
    decisions,
    (newDecisions) => {
      localStorage.setItem("decisions_app_data", JSON.stringify(newDecisions));
    },
    { deep: true }
  );

  loadDecisions();

  return {
    decisions,
    createDecision,
    updateDecision,
    getDecisionById,
    deleteDecision,
  };
});
