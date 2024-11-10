const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/employee.controller");

// Lấy thông tin nhân viên
router.get("/infor", controller.getInfor);

// Lấy thông tin độc giả
router.get("/reader", controller.getInfor);

// Cập nhật trạng thái sách theo readerId và bookId
router.put("/statusbook/:readerId/:bookId", controller.getInfor);

module.exports = router;
