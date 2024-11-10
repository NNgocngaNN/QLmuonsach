const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/book.controller");

// Lấy danh sách tất cả các sách
router.get("/", controller.getAll);

// Lấy thông tin chi tiết của một sách theo id
router.get("/:id", controller.getOne);

module.exports = router;
