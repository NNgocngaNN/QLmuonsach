const express = require("express");
const router = express.Router();

// Import controller xử lý đăng nhập và đăng xuất cho client
const controller = require("../../controllers/client/auth.controller");

// Định nghĩa route POST cho đăng nhập, gọi controller.loginPost khi người dùng gửi yêu cầu đăng nhập
router.post("/login", controller.loginPost);

// Định nghĩa route GET cho đăng xuất, gọi controller.logout khi người dùng yêu cầu đăng xuất
router.get("/logout", controller.logout);

// Xuất router để sử dụng trong các file khác
module.exports = router;
