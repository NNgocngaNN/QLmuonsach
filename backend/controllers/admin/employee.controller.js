const Employee = require("../../models/employee.model");
const Reader = require("../../models/reader.model");

// Lấy thông tin nhân viên dựa trên token trong cookies
const getInfor = async (req, res) => {
  try {
    const token = req.cookies.token; // Lấy token từ cookies
    const employee = await Employee.findOne({ token: token }); // Tìm nhân viên theo token

    if (!employee) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    // Trả về thông tin nhân viên nếu tìm thấy
    res
      .status(200)
      .json({ message: "Lấy thông tin nhân viên thành công", employee });
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

// Lấy tất cả thông tin bạn đọc
const getReaders = async (req, res) => {
  try {
    const readers = await Reader.find({}); // Lấy tất cả bạn đọc
    res.status(200).json(readers); // Trả về danh sách bạn đọc
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

// Cập nhật trạng thái của sách mà người đọc đang mượn
const statusBook = async (req, res) => {
  try {
    const { readerId, bookId } = req.params; // Lấy ID người đọc và ID sách từ tham số URL
    const { status } = req.body; // Lấy trạng thái từ body yêu cầu

    // Tìm người đọc theo ID
    const reader = await Reader.findById(readerId);
    if (!reader) {
      return res.status(404).json({ message: "Người đọc không tồn tại." }); // Nếu không tìm thấy người đọc
    }

    // Tìm sách trong danh sách mượn của người đọc
    const bookIndex = reader.borrow.findIndex(
      (book) => book.id_book === bookId
    );
    if (bookIndex === -1) {
      return res
        .status(404)
        .json({ message: "Sách không tồn tại trong danh sách mượn." }); // Nếu không tìm thấy sách
    }

    // Cập nhật trạng thái của sách
    reader.borrow[bookIndex].status = status;
    await reader.save(); // Lưu thông tin người đọc với trạng thái sách đã được cập nhật

    // Trả về phản hồi thành công
    res
      .status(200)
      .json({ message: "Trạng thái sách đã được cập nhật thành công." });
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

module.exports = {
  getInfor,
  getReaders,
  statusBook,
};