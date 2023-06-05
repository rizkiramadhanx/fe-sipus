import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Login from "@/views/Login.vue";
import { useAuthStore } from "@/stores/auth";
import AuthorDashboard from "@/views/Author/Index.vue";
import AddAuthor from "@/views/Author/AddAuthor.vue";
import EditAuthor from "@/views/Author/EditAuthor.vue";
import LanguageDashboard from "@/views/Language/Index.vue";
import AddLanguage from "@/views/Language/AddLanguage.vue";
import EditLanguage from "@/views/Language/EditLanguage.vue";

import axios from "axios";

const authGuardRole = async (next: any, role: string[]) => {
  const store = useAuthStore();
  const { checkUser, isLogin, token } = store;

  const checkRole = async () => {
    const response = await axios("http://localhost:3000/api/v1/me", {
      headers: {
        Authorization: token,
      },
    });

    return response.data.data.role;
  };

  if (!isLogin) {
    return router.push({
      name: "login",
      replace: true,
    });
  }

  checkUser();
  // this from fetching get me

  const checkAccess = async () => {
    const roleAPI = await checkRole();

    const isOke = role.some((element: string) => element === roleAPI);

    return isOke;
  };

  if (await checkAccess()) {
    next();
    return;
  } else {
    return router.push({
      name: "page404",
      replace: true,
    });
  }
};

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/dashboard/author",
      name: "dashboard-author",
      component: AuthorDashboard,
    },
    // Route Author
    {
      path: "/dashboard/author/add",
      name: "add-author",
      component: AddAuthor,
    },
    {
      path: "/dashboard/author/:id",
      name: "edit-author",
      component: EditAuthor,
    },
    // Route Language
    {
      path: "/dashboard/language",
      name: "dashboard-language",
      component: LanguageDashboard,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    {
      path: "/dashboard/language/add",
      name: "add-language",
      component: AddLanguage,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    {
      path: "/dashboard/language/:id",
      name: "edit-author",
      component: EditLanguage,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const store = useAuthStore();

  const { isLogin } = store;

  if (isLogin && to.matched.some((record) => record.name === "login")) {
    router.push({
      name: "dashboard",
    });
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // its protecd route logic
    authGuardRole(next, to.meta?.role as string[]);
  } else {
    next();
  }
});

export default router;
