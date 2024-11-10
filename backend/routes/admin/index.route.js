const configSystem = require("../../config/system");
const bookRouter = require("./book.route");
const authRouter = require("./auth.route");
const employeeRouter = require("./employee.route");
const readerRouter = require("../client/reader.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
  // Định nghĩa đường dẫn gốc cho admin
  const ADMIN_PATH = "/" + configSystem.adminPrefix;

  // Định tuyến đăng nhập, đăng xuất
  app.use(
    ADMIN_PATH + "/auth", 
    authRouter
  );

  // Định tuyến cho quản lý sách
  app.use(
    ADMIN_PATH + "/books",
    // Bảo vệ bằng middleware xác thực
    authMiddleware.authRequire,
    bookRouter
  );

  // Định tuyến cho quản lý nhân viên
  app.use(
    ADMIN_PATH + "/employee", 
    //authMiddleware.authRequire,
    employeeRouter
  );

  // Định tuyến cho quản lý độc giả
  app.use(
    ADMIN_PATH + "/reader",
    //authMiddleware.authRequire,
    readerRouter
  );
};
