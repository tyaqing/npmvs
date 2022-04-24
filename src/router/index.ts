import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeIndex from "../views/HomeIndex.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeIndex,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "_",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "_" */ "../views/_.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
