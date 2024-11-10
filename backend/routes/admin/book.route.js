const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/book.controller");
const multer = require("multer");
const storageMulterHelper = require("../../helpers/storageMulter");

// Cấu hình multer để lưu trữ file
const storage = storageMulterHelper();
const upload = multer({ storage: storage });

// Tạo sách mới
router.post("/", upload.single("thumbnail"), controller.createBook);

// Lấy danh sách sách
router.get("/", controller.getAll);

// Lấy thông tin một sách theo id
router.get("/:id", controller.getOne);

// Cập nhật thông tin sách theo id
router.put("/:id", upload.single("thumbnail"), controller.updateOne);

// Xóa sách theo id
router.delete("/:id", controller.deleteOne);

// Xóa tất cả sách
router.delete("/", controller.deleteAll);

module.exports = router;
