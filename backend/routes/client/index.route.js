const bookRouter = require("./book.route");
const readerRoutes = require("./reader.route");
const authRoutes = require("./auth.route");

const authMiddleware = require("../../middlewares/client/auth.middleware");
const controllerReader = require("../../controllers/client/reader.controller");

module.exports = (app) => {
  // Định tuyến cho quản lý sách
  app.use("/books", authMiddleware.authRequire, bookRouter);

  // Đăng ký tài khoản mới cho độc giả
  app.post("/reader/register", controllerReader.create);

  // Định tuyến cho các chức năng khác của độc giả
  app.use("/reader", authMiddleware.authRequire, readerRoutes);

  // Đăng nhập, đăng xuất
  app.use("/auth", authRoutes);
};
