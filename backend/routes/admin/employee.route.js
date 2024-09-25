const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/employee.controller");

router.get("/infor", controller.getInfor);
router.get("/reader", controller.getInfor);
router.put("/statusbook/:readerId/:bookId", controller.getInfor);

module.exports = router;
