const Reader = require("../../models/reader.model");
const Book = require("../../models/book.model");
const generateString = require("../../helpers/generateString");

// Tạo người đọc mới
const create = async (req, res) => {
  try {
    req.body.token = generateString.generateRandomString(20); // Tạo token ngẫu nhiên cho người đọc mới
    const user = await Reader.create(req.body); // Tạo người đọc mới trong cơ sở dữ liệu
    res.status(201).json(user); // Trả về thông tin người đọc mới cùng mã trạng thái 201 (Created)
  } catch (error) {
    res.status(500).json({ error: `Lỗi khi tạo người đọc: ${error.message}` });
  }
};

// Lấy thông tin người đọc từ token
const getUser = async (req, res) => {
  try {
    // Tách token từ header 'Authorization' (kiểu Bearer <token>)
    const tokenUser = req.headers.authorization.split(" ")[1];

    const reader = await Reader.findOne({ token: tokenUser }); // Tìm người đọc dựa trên token

    if (!reader) {
      // Nếu không tìm thấy người đọc, trả về lỗi 404
      return res.status(404).json({ message: "Người đọc không tồn tại." });
    }

    res
      .status(200)
      .json({ message: "Gửi thông tin người đọc thành công", reader }); // Trả về thông tin người đọc
  } catch (error) {
    res
      .status(500)
      .json({ error: `Lỗi khi lấy thông tin người đọc: ${error.message}` });
  }
};

// Lấy tất cả người đọc
const getAll = async (req, res) => {
  try {
    const readers = await Reader.find({}); // Lấy tất cả người đọc
    res.status(200).json(readers); // Trả về danh sách người đọc
  } catch (error) {
    res
      .status(500)
      .json({ error: `Lỗi khi lấy tất cả người đọc: ${error.message}` });
  }
};

// Xử lý việc mượn sách
const borrowBook = async (req, res) => {
  try {
    // Lấy token của người dùng từ cookies
    const tokenUser = req.cookies.tokenUser;
    if (tokenUser) {
      // Tìm kiếm người dùng dựa trên token
      const reader = await Reader.findOne({ token: tokenUser });

      // Nếu không tìm thấy người dùng
      if (!reader) {
        return res.status(404).json({ message: "Reader not found" });
      }

      // Kiểm tra xem trường borrow có phải là mảng không, nếu không thì gán thành mảng rỗng
      if (!Array.isArray(reader.borrow)) {
        reader.borrow = [];
      }

      // Tạo đối tượng mượn sách mới từ dữ liệu trong request
      const newBorrow = {
        id_book: req.body.borrow.id_book,
        status: req.body.borrow.status || "processing",
        borrowDate: req.body.borrow.borrowDate || "01/01/2024",
        returnDate: req.body.borrow.returnDate || "31/12/2024",
        quantity: req.body.borrow.quantity || 1,
      };

      // Tính tổng số lượng sách đã mượn cho sách này
      const readers = await Reader.find({});
      let borrowedBookQuantity = 0;

      readers.forEach(function (reader) {
        reader.borrow.forEach(function (borrow) {
          if (borrow.id_book === req.body.borrow.id_book) {
            borrowedBookQuantity += borrow.quantity;
          }
        });
      });

      // Kiểm tra xem sách có tồn tại không
      const book = await Book.findById(req.body.borrow.id_book);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Kiểm tra số lượng sách còn trong kho
      if (book.quantity === 0) {
        return res
          .status(400)
          .json({ message: "Không còn sách trong kho để mượn" });
      } else if (
        book.quantity - borrowedBookQuantity - newBorrow.quantity <
        0
      ) {
        return res
          .status(400)
          .json({ message: "Số lượng sách đã mượn đã đạt tới giới hạn" });
      }

      // Kiểm tra xem sách đã có trong danh sách mượn chưa
      const existingBook = reader.borrow.find(
        (book) => book.id_book === newBorrow.id_book
      );

      if (existingBook) {
        // Nếu đã có, cập nhật số lượng và thông tin mượn
        existingBook.quantity += newBorrow.quantity;
        existingBook.borrowDate = newBorrow.borrowDate || "01/01/2024";
        existingBook.returnDate = newBorrow.returnDate || "31/12/2024";
        existingBook.status = newBorrow.status || "processing";
      } else {
        // Nếu chưa có, thêm sách vào danh sách mượn
        reader.borrow.push(newBorrow);
      }

      // Lưu thay đổi vào cơ sở dữ liệu
      await reader.save();
      res
        .status(200)
        .json({ message: "Cập nhật mượn sách thành công", reader });
    }
  } catch (error) {
    // Xử lý lỗi khi có vấn đề trong quá trình cập nhật
    console.error("Cập nhật mượn sách thất bại:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Xử lý việc xóa sách khỏi danh sách mượn
const deleteBookFromBorrow = async (req, res) => {
  try {
    // Lấy token của người dùng từ cookies và ID sách cần xóa từ request
    const tokenUser = req.cookies.tokenUser;
    const id = req.params.id;

    if (tokenUser) {
      // Tìm kiếm người dùng dựa trên token
      const reader = await Reader.findOne({ token: tokenUser });

      if (reader) {
        // Lọc danh sách mượn để loại bỏ sách cần xóa
        reader.borrow = reader.borrow.filter((book) => book.id_book !== id);
        await reader.save();

        res.status(200).json({ message: "Book deleted successfully." });
      } else {
        res.status(404).json({ message: "Reader not found." });
      }
    } else {
      res.status(401).json({ message: "Unauthorized." });
    }
  } catch (error) {
    // Xử lý lỗi khi không thể xóa sách
    res.status(500).json({ message: `Error! ${error.message}` });
  }
};

// Cập nhật trạng thái trả sách
const statusBookReturn = async (req, res) => {
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
    if (status === "returned" || status === "refused") {
      // Giảm quantity đi 1, nhưng không thay đổi initialQuantity
      reader.borrow[bookIndex].quantity -= 1;
    }

    // Lưu thay đổi vào CSDL
    await reader.save();

    // Trả về thông báo thành công
    res.status(200).json({ message: "Status updated successfully." });
  } catch (error) {
    res.status(500).json({ message: `Error! ${error}` });
  }
};

// Lấy số lượng sách đã được mượn
const getNumberBookBorrowed = async (req, res) => {
  try {
    // Lấy tất cả người dùng
    const readers = await Reader.find({});
    let borrowedBookQuantity = 0;

    // Tính tổng số lượng sách đã mượn cho ID sách cụ thể
    readers.forEach(function (reader) {
      reader.borrow.forEach(function (borrow) {
        if (borrow.id_book === req.params.id_book) {
          borrowedBookQuantity += borrow.quantity;
        }
      });
    });

    // Trả về số lượng sách đã mượn
    res.status(200).json({
      message: "Send NumberBookBorrowed successfully",
      borrowedBookQuantity,
    });
  } catch (error) {
    // Xử lý lỗi khi không thể lấy thông tin số lượng sách đã mượn
    res.status(500).json({ error: error.message });
  }
};

const getInforUserByToken = async (req, res) => {
  try {
    // Kiểm tra xem header Authorization có tồn tại hay không
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res
        .status(400)
        .json({ message: "Authorization token missing or malformed" });
    }

    // Tách token từ header Authorization
    const tokenUser = req.headers.authorization.split(" ")[1];

    // Tìm người dùng với token
    const reader = await Reader.findOne({ token: tokenUser });

    if (!reader) {
      return res.status(404).json({ message: "Reader not found" });
    }

    res.status(200).json({ message: "Send reader successfully.", reader });
  } catch (error) {
    res.status(500).json({ message: `Error! ${error}` });
  }
};

const updateUser = async (req, res) => {
  try {
    const { token } = req.params; // Lấy token từ URL
    const { fullName, email, phone, address } = req.body; // Lấy thông tin cần cập nhật từ body request

    // Kiểm tra xem token có hợp lệ không (ví dụ, kiểm tra token trong cơ sở dữ liệu)
    const user = await Reader.findOne({ token }); // Tìm người dùng dựa trên token

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra email đã tồn tại chưa (ngoại trừ email của người dùng hiện tại)
    if (email) {
      const emailExists = await Reader.findOne({
        email,
        _id: { $ne: user._id },
      }); // Tìm người dùng khác có email này
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
      user.email = email; // Cập nhật email nếu không có vấn đề
    }

    // Kiểm tra số điện thoại đã tồn tại chưa (ngoại trừ số điện thoại của người dùng hiện tại)
    if (phone) {
      const phoneExists = await Reader.findOne({
        phone,
        _id: { $ne: user._id },
      }); // Tìm người dùng khác có số điện thoại này
      if (phoneExists) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      user.phone = phone; // Cập nhật số điện thoại nếu không có vấn đề
    }

    // Cập nhật các thông tin khác (nếu có)
    if (fullName) user.fullName = fullName;
    if (address) user.address = address;

    // Lưu thay đổi vào cơ sở dữ liệu
    await user.save();

    // Trả về phản hồi thành công
    return res.status(200).json({
      message: "User updated successfully",
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        // Bạn có thể trả thêm các thông tin khác nếu cần
      },
    });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({
        message: "An error occurred while updating the user",
        error: error.message,
      });
  }
};


module.exports = {
  create,
  getUser,
  getAll,
  borrowBook,
  deleteBookFromBorrow,
  statusBookReturn,
  getNumberBookBorrowed,
  getInforUserByToken,
  updateUser,
};
