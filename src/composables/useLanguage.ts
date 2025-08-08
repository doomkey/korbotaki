import { useI18n } from "vue-i18n";
import { readonly } from "vue";

export type Language = "en" | "bn";

const STORAGE_KEY = "decision_app_language";

export function useLanguage() {
  const { t, locale } = useI18n();

  /**
   * Sets the application's language, updates the DOM, and saves it to localStorage.
   * @param lang The language to set ('en' or 'bn').
   */
  const setLanguage = (lang: Language) => {
    if (lang) {
      locale.value = lang;

      document.documentElement.setAttribute("lang", lang);

      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  /**
   * Loads the language from localStorage on app startup.
   * Should be called once in your main App.vue component.
   */
  const loadLanguage = () => {
    const storedLang = localStorage.getItem(STORAGE_KEY) as Language | null;

    setLanguage(storedLang || "en");
  };

  return {
    language: readonly(locale),

    setLanguage,

    loadLanguage,

    t,
  };
}
