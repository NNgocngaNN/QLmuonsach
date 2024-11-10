const adminRoutes = [
  {
    path: "/admin/books",
    name: "book",
    component: () => import("@/views/admin/pages/books/Book.vue"),
  },
  {
    path: "/admin/books/reader",
    name: "reader",
    component: () => import("@/views/admin/pages/books/ReaderTemp.vue"),
  },
  {
    path: "/admin/books/:id",
    name: "book.edit",
    component: () => import("@/views/admin/pages/books/BookEdit.vue"),
  },
  {
    path: "/admin/books/create",
    name: "book.add",
    component: () => import("@/views/admin/pages/books/CreateBook.vue"),
  },
];

export default adminRoutes;
