const Book = require("../../models/book.model");
const fs = require("fs");
const path = require("path");
const fsx = require("fs-extra");

// Tạo sách mới
const createBook = async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      thumbnail: req.file ? req.file.filename : null, // Nếu có ảnh, lưu tên ảnh
    });
    res.status(200).json({ message: "Sách đã thêm thành công", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả sách
const getAll = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy sách theo ID
const getOne = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res
        .status(404)
        .json({ message: `Không tìm thấy sách với ID: ${req.params.id}` });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật thông tin sách theo ID
const updateOne = async (req, res) => {
  try {
    const bookId = req.params.id;
    const existingBook = await Book.findById(bookId);

    // Kiểm tra xem sách có tồn tại hay không
    if (!existingBook) {
      return res
        .status(404)
        .json({ message: `Không tìm thấy sách với ID: ${bookId}` });
    }

    // Nếu có ảnh mới, xóa ảnh cũ
    if (req.file && existingBook.thumbnail) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "uploads",
        existingBook.thumbnail
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(`Lỗi xóa ảnh cũ: ${err}`);
        } else {
          console.log(`Ảnh cũ đã được xóa: ${existingBook.thumbnail}`);
        }
      });
    }

    // Cập nhật thông tin sách
    const updatedData = {
      ...req.body,
      thumbnail: req.file ? req.file.filename : existingBook.thumbnail, // Cập nhật ảnh nếu có
    };

    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, {
      new: true,
    });

    if (!updatedBook) {
      return res
        .status(404)
        .json({ message: `Không tìm thấy sách với ID: ${bookId}` });
    }

    res
      .status(200)
      .json({ message: "Sách đã được cập nhật", book: updatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa sách theo ID
const deleteOne = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res
        .status(404)
        .json({ message: `Không thể xóa sách với ID: ${req.params.id}` });
    }

    // Nếu sách có ảnh, xóa ảnh liên quan
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
          console.error(`Lỗi khi xóa ảnh: ${err}`);
        } else {
          console.log(`Ảnh đã được xóa: ${book.thumbnail}`);
        }
      });
    }

    res
      .status(200)
      .json({ message: `Sách với ID: ${req.params.id} đã bị xóa` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa tất cả sách
const deleteAll = async (req, res) => {
  try {
    const result = await Book.deleteMany({});
    const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");

    // Xóa tất cả các tệp tin trong thư mục uploads
    await fsx.emptyDir(uploadDir);

    res
      .status(200)
      .json({ message: `Đã xóa ${result.deletedCount} quyển sách` });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
