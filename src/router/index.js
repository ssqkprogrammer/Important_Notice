import { createRouter, createWebHistory } from "vue-router";
import DefaultPage from "../layouts/default.vue";
import Login from "../layouts/login.vue";
import NotFound from "../layouts/404.vue";

const routes = [
  {
    path: "/",
    component: DefaultPage,
    children: [
      {
        path: "",
        name: "home",
        component: function () {
          return import("../pages/Index.vue");
        },
        meta: { auth: true },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/404",
    name: "404",
    component: NotFound,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const reqAuth = to.meta.auth;
  const token = localStorage.getItem("token");

  if (reqAuth && token) {
    if (to.name == "login") {
      next({ name: "home" });
      return;
    }

    next();
    return;
  }

  if (token) {
    if (to.name == "login") {
      next({ name: "home" });
      return;
    }
  } else {
    if (to.name != "login") {
      next({ name: "login" });
      return;
    }
  }

  next();
});

export default router;
