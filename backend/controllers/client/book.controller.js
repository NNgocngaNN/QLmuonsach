const Book = require("../../models/book.model");

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
        .json({ message: `Khong the tim thay sach voi ID: ${req.params.id}` });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

module.exports = {
  getAll,
  getOne,
};