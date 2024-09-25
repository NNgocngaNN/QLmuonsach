const Book = require("../../models/book.model");
const ApiError = require("../../helpers/api-error");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const upload = require("../../middlewares/admin/upload");
const path = require("path");
const fsx = require("fs-extra");

const createBook = async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      thumbnail: req.file ? req.file.filename : null,
    });
    res.status(200).json({ message: "Sach da them thanh cong", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const book = await Book.find({});
    res.status(200).json(book);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

const getOne = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res
        .status(404)
        .json({ message: `Khong the tim kiem sach voi ID: ${req.params.id}` });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

const updateOne = async (req, res) => {
  try {
    const bookId = req.params.id;
    const existingBook = await Book.findById(bookId);

    if (!existingBook) {
      return res
        .status(404)
        .json({ message: `Khong the tim thay sach voi ID: ${bookId}` });
    }

    //Kiem tra neu hinh anh moi duoc them vao
    if (req.file) {
      if (existingBook.thumbnail) {
        // D:/qlmuonsach/backend/public/uploads/test1.jpg
        const imagePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "uploads",
          existingBook.thumbnail
        );

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Loi xoa tep hinh anh cu${err}`);
          } else {
            console.log(`tep hinh anh cu da duoc xoa${existingBook.thumbnail}`);
          }
        });
      }
    }

    const data = {
      ...req.body,
      thumbnail: req.file ? req.file.filename : existingBook.thumbnail,
    };

    const book = await Book.findByIdAndUpdate(bookId, data, { new: true });

    if (!book) {
      res
        .status(404)
        .json({ message: `Khong the tim kiem sach voi ID: ${req.params.id}` });
    }
    res.status(200).json({ message: "Sach da duoc cap nhat" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

const deleteOne = async (req, res) => {
  try {
    // Tìm và xóa sách dựa vào ID
    const book = await Book.findByIdAndDelete(req.params.id);

    // Nếu không tìm thấy sách, trả về lỗi 404
    if (!book) {
      return res.status(404).json({
        message: `Khong the xoa sach voi ID: ${req.params.id}`,
      });
    }

    // Nếu sách có hình ảnh, tiến hành xóa hình ảnh
    if (book.thumbnail) {
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "uploads",
        book.thumbnail
      );

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Loi khi xoa tep hinh anh: ${err}`);
        } else {
          console.log(`hinh anh da duoc xoa: ${book.thumbnail}`);
        }
      });
    }

    // Trả về phản hồi thành công
    res.status(200).json({ message: `Sach voi ID: ${req.params.id} da xoa` });
  } catch (error) {
    // Xử lý lỗi và trả về phản hồi lỗi 500
    res.status(500);
    throw new Error(error.message);
  }
};

const deleteAll = async (req, res) => {
  try {
    const result = await Book.deleteMany({});
    const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");

    await fsx.emptyDir(uploadDir);

    res
      .status(200)
      .json({ message: `Da xoa ${result.deletedCount} quyen sach` });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

module.exports = {
  createBook,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  deleteAll,
};
