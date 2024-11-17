const requireClientAuth = (to, from, next) => {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tokenUser"))
      .split("=")[1];
    if (token) {
      next();
    } else {
      next("/auth/login");
    }
  } catch (error) {
    next("/auth/login");
  }
};

const clientRoutes = [
  {
    path: "/books",
    name: "book-client",
    component: () => import("@/views/client/pages/books/ClientBook.vue"),
    beforeEnter: requireClientAuth,
  },

  {
    path: "/account",
    name: "account",
    component: () => import("@/views/client/pages/books/ClientAccount.vue"),
    beforeEnter: requireClientAuth,
  },

  {
    path: "/books/:id",
    name: "book.detail",
    component: () => import("@/components/client/ClientBookDetail.vue"),
  },

  {
    path: "/reader/register",
    name: "register-client",
    component: () => import("@/views/client/pages/register/ClientRegister.vue"),
  },

  {
    path: "/auth/login",
    name: "login-client",
    component: () => import("@/views/client/pages/login/ClientLogin.vue"),
  },

  {
    path: "/reader/borrow",
    name: "borrow-client",
    component: () => import("@/views/client/pages/books/BorrowBook.vue"),
  },
  {
    path: "/reader/borrow/:id",
    name: "borrow-book",
    component: () => import("@/views/client/pages/books/ClientBorrow.vue"),
  },
];

export default clientRoutes;
