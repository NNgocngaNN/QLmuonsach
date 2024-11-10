const Book = require("../../models/book.model");

// Lấy tất cả sách
const getAll = async (req, res) => {
  try {
    const books = await Book.find({}); // Tìm tất cả sách trong cơ sở dữ liệu
    res.status(200).json(books); // Trả về danh sách sách
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

// Lấy thông tin sách theo ID
const getOne = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id); // Tìm sách theo ID trong URL

    // Kiểm tra xem sách có tồn tại không
    if (!book) {
      return res
        .status(404)
        .json({ message: `Không thể tìm thấy sách với ID: ${req.params.id}` });
    }

    // Trả về thông tin sách nếu tìm thấy
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getOne,
};
