import Vue from "vue";
import VueRouter, { type NavigationGuardNext } from "vue-router";
import Login from "@/views/Login.vue";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

import Dashboard from "@/views/Dashboard.vue";
import AuthorDashboard from "@/views/Author/Index.vue";
import AddAuthor from "@/views/Author/AddAuthor.vue";
import EditAuthor from "@/views/Author/EditAuthor.vue";
import LanguageDashboard from "@/views/Language/Index.vue";
import AddLanguage from "@/views/Language/AddLanguage.vue";
import EditLanguage from "@/views/Language/EditLanguage.vue";
import BookDashboard from "@/views/Book/Index.vue";
import AddBook from "@/views/Book/AddBook.vue";
import EditBook from "@/views/Book/EditBook.vue";
import CategoryDashboard from "@/views/Category/Index.vue";
import AddCategory from "@/views/Category/AddCategory.vue";
import EditCategory from "@/views/Category/EditCategory.vue";
import StudentDashboard from "@/views/Student/Index.vue";
import AddStudent from "@/views/Student/AddStudent.vue";
import EditStudent from "@/views/Student/EditStudent.vue";
import BookingDashboard from "@/views/Booking/Index.vue";
import AddBooking from "@/views/Booking/AddBooking.vue";
import EditBooking from "@/views/Booking/EditBooking.vue";
import BorrowDashboard from "@/views/Borrow/Index.vue";
import AddBorrow from "@/views/Borrow/AddBorrow.vue";

const authGuardRole = async (next: NavigationGuardNext, role: string[]) => {
  const store = useAuthStore();
  const { checkUser, isLogin, token } = store;

  const checkRole = async () => {
    const response = await axios({
      url:'/me',
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
    // Route Author
    {
      path: "/dashboard/author",
      name: "dashboard-author",
      component: AuthorDashboard,
    },
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
      name: "edit-language",
      component: EditLanguage,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    // Route Book
    {
      path: "/dashboard/book",
      name: "dashboard-book",
      component: BookDashboard,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    {
      path: "/dashboard/book/add",
      name: "add-book",
      component: AddBook,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    {
      path: "/dashboard/book/:id",
      name: "edit-book",
      component: EditBook,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    // Category
    {
      path: "/dashboard/category",
      name: "dashboard-category",
      component: CategoryDashboard,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    {
      path: "/dashboard/category/add",
      name: "add-category",
      component: AddCategory,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    {
      path: "/dashboard/category/:id",
      name: "edit-category",
      component: EditCategory,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    // Student
    {
      path: "/dashboard/student",
      name: "dashboard-student",
      component: StudentDashboard,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    {
      path: "/dashboard/student/add",
      name: "add-student",
      component: AddStudent,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    {
      path: "/dashboard/student/:id",
      name: "edit-student",
      component: EditStudent,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    // Booking
    {
      path: "/dashboard/booking",
      name: "dashboard-booking",
      component: BookingDashboard,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    {
      path: "/dashboard/booking/add",
      name: "add-booking",
      component: AddBooking,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    {
      path: "/dashboard/booking/:id",
      name: "edit-booking",
      component: EditBooking,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    // Borrow
    {
      path: "/dashboard/borrow",
      name: "dashboard-borrow",
      component: BorrowDashboard,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    {
      path: "/dashboard/borrow/add",
      name: "add-borrow",
      component: AddBorrow,
      meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    },
    // {
    //   path: "/dashboard/borrow/:id",
    //   name: "edit-borrow",
    //   component: EditBooking,
    //   meta: { requiresAuth: true, role: ["ADMIN", "EMPLOYEE"] },
    // },
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
