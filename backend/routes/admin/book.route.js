const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/book.controller");
const multer = require("multer");
const storageMulterHelper = require("../../helpers/storageMulter");
const storge = storageMulterHelper();
const upload = multer({ storage: storge });

router.post("/", upload.single("thumbnail"), controller.createBook);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.put("/:id", upload.single("thumbnail"), controller.updateOne);
router.delete("/:id", controller.deleteOne);
router.delete("/", controller.deleteAll);

module.exports = router;
