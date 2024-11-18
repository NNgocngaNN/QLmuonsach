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
     // Lấy thông tin từ request
     const { readerId, bookId } = req.params;
     const { status } = req.body;
     // Kiểm tra xem reader và book có tồn tại không
     const reader = await Reader.findById(readerId);
     if (!reader) {
       res.status(404).json({ message: "Reader not found." });
       return;
     }
     const bookIndex = reader.borrow.findIndex(
       (book) => book.id_book === bookId
     );
     if (bookIndex === -1) {
       res.status(404).json({ message: "Book not found." });
       return;
     }
     console.log("bookIndex", bookIndex);
     // Thay đổi trạng thái sách
     reader.borrow[bookIndex].status = status;

     // Nếu trạng thái là "đã trả", giảm quantity đi 1
     if (status === "refused") {
       // Giảm quantity đi 1, nhưng không thay đổi initialQuantity
       reader.borrow[bookIndex].quantity -= 1;
     }

     // // Lưu thay đổi vào CSDL
     await reader.save();

     // Trả về thông báo thành công
     res.status(200).json({ message: "Status updated successfully." });
   } catch (error) {
     res.status(500);
     throw new Error(error.message);
   }
};

const deleteBorrowedBook = async (req, res) => {
  try {
    const { readerId, bookId } = req.params;

    // Kiểm tra xem reader có tồn tại không
    const reader = await Reader.findById(readerId);
    if (!reader) {
      return res.status(404).json({ message: "Reader not found." });
    }

    // Tìm sách trong danh sách mượn của độc giả
    const bookIndex = reader.borrow.findIndex(
      (book) => book.id_book === bookId
    );
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Kiểm tra trạng thái của sách, nếu là 'returned' hoặc 'cancelled' thì xóa sách
    if (
      reader.borrow[bookIndex].status === "returned" ||
      reader.borrow[bookIndex].status === "cancelled" ||
      reader.borrow[bookIndex].status === "refused"
    ) {
      // Xóa sách khỏi danh sách mượn
      reader.borrow.splice(bookIndex, 1);

      // Lưu thay đổi vào CSDL
      await reader.save();

      // Trả về thông báo thành công
      return res
        .status(200)
        .json({ message: "Borrowed book deleted successfully." });
    } else {
      return res.status(400).json({
        message: "Only 'returned' or 'cancelled' books can be deleted.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getInfor,
  getReaders,
  statusBook,
  deleteBorrowedBook,
};