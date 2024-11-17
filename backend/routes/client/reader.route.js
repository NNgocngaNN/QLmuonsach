const express = require("express");
const router = express.Router();

// Import controller cho các thao tác liên quan đến reader
const controller = require("../../controllers/client/reader.controller");

// Lấy danh sách tất cả các reader
router.get("/", controller.getAll);

// Thực hiện thao tác mượn sách
router.put("/borrow", controller.borrowBook);

// Lấy thông tin người dùng (reader)
router.get("/user", controller.getUser);

// Cập nhật trạng thái trả sách của một reader
router.put("/statusBookReturn/:readerId/:bookId", controller.statusBookReturn);

// Xóa sách khỏi danh sách sách đã mượn (trả sách)
router.delete("/return/:id", controller.deleteBookFromBorrow);

// Lấy số lượng sách đã được mượn của một đầu sách cụ thể
router.get("/numberbookborrowed/:id_book", controller.getNumberBookBorrowed);

router.get("/userinfor", controller.getInforUserByToken);

router.put('/:token', controller.updateUser);

module.exports = router;
