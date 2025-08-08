import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import DecisionEditorView from "@/views/DecisionEditorView.vue";
import DecisionDetailView from "@/views/DecisionDetailView.vue";
import SettingsPage from "@/views/SettingsPage.vue";
import AboutPage from "@/views/AboutPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/edit/:id",
    name: "DecisionEditor",
    component: DecisionEditorView,
  },
  {
    path: "/decision/:id",
    name: "DecisionDetail",
    component: DecisionDetailView,
  },
  {
    path: "/settings",
    component: SettingsPage,
  },
  { path: "/about", component: AboutPage },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
