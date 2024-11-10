const bcrypt = require("bcrypt");
const Account = require("../../models/employee.model");
const ApiError = require("../../helpers/api-error");

// Xử lý đăng nhập
module.exports.loginPost = async (req, res, next) => {
  try {
    // Lấy email và mật khẩu từ yêu cầu đăng nhập
    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;

    // Tìm tài khoản trong cơ sở dữ liệu bằng email
    const user = await Account.findOne({ email: enteredEmail });

    // Kiểm tra nếu tài khoản không tồn tại
    if (!user) {
      res.json("wrong info"); // Phản hồi thông báo nếu thông tin không đúng
      return;
    }

    // Kiểm tra nếu mật khẩu không được nhập
    if (!enteredPassword) {
      res.json("wrong info"); // Phản hồi thông báo nếu thông tin không đúng
      return;
    }

    // Kiểm tra nếu mật khẩu nhập không trùng khớp với mật khẩu lưu trong cơ sở dữ liệu
    if (enteredPassword !== user.password) {
      res.json("wrong info"); // Phản hồi thông báo nếu thông tin không đúng
      return;
    }

    // Đặt cookie 'token' nếu đăng nhập thành công
    res.cookie("token", user.token);
    res.json("success"); // Phản hồi thông báo đăng nhập thành công
  } catch (error) {
    // Xử lý lỗi bất ngờ
    console.log("error:", error);
    return next(new ApiError(500, error));
  }
};

// Xử lý đăng xuất
module.exports.logout = async (req, res) => {
  // Xóa cookie 'token'
  res.clearCookie("token");
  res.send({
    success: true, // Phản hồi xác nhận đăng xuất thành công
  });
};
