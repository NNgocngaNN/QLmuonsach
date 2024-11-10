const bcrypt = require("bcrypt");
const Reader = require("../../models/reader.model");

// Xử lý đăng nhập
module.exports.loginPost = async (req, res, next) => {
  try {
    // Lấy email và mật khẩu từ yêu cầu đăng nhập
    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;

    // Tìm người dùng trong cơ sở dữ liệu bằng email
    const user = await Reader.findOne({ email: enteredEmail });

    // Kiểm tra nếu người dùng không tồn tại
    if (!user) {
      res.json("wrong info"); // Phản hồi nếu không tìm thấy người dùng
      return;
    }

    // Kiểm tra nếu mật khẩu không được nhập
    if (!enteredPassword) {
      res.json("wrong info"); // Phản hồi nếu mật khẩu không được nhập
      return;
    }

    // So sánh mật khẩu người dùng nhập với mật khẩu trong cơ sở dữ liệu
    if (enteredPassword !== user.password) {
      res.json("wrong info"); // Phản hồi nếu mật khẩu không khớp
      return;
    }

    // Đặt cookie 'tokenUser' nếu đăng nhập thành công
    res.cookie("tokenUser", user.token);
    res.json("success"); // Phản hồi thành công khi đăng nhập
  } catch (error) {
    // Xử lý lỗi bất ngờ
    console.log("error:", error);
    return next(new ApiError(500, error)); // Gửi lỗi hệ thống nếu có lỗi xảy ra
  }
};

// Xử lý đăng xuất
module.exports.logout = async (req, res) => {
  // Xóa cookie 'tokenUser' khi người dùng đăng xuất
  res.clearCookie("tokenUser");
  res.send({
    success: true, // Phản hồi xác nhận đăng xuất thành công
  });
};
