const Account = require("../../models/employee.model");

module.exports.authRequire = async (req, res, next) => {
  // Kiểm tra xem có cookie token hay không
  if (!req.cookies.token) {
    // Nếu không có token, chuyển hướng người dùng đến trang đăng nhập
    return res.redirect("http://localhost:3001/admin/auth/login");
  }

  try {
    // Tìm người dùng trong cơ sở dữ liệu dựa trên token trong cookie
    const user = await Account.findOne({
      token: req.cookies.token,
    });

    // Nếu không tìm thấy người dùng khớp với token
    if (!user) {
      // Nếu có token nhưng không khớp với người dùng, xóa cookie và chuyển hướng đến trang đăng nhập
      res.clearCookie("token");
      return res.redirect("http://localhost:3001/admin/auth/login");
    }

    // Nếu tìm thấy người dùng, cho phép tiếp tục với route tiếp theo
    next();
  } catch (error) {
    // Nếu có lỗi khi tìm kiếm người dùng, xóa cookie và chuyển hướng đến trang đăng nhập
    console.error(error);
    res.clearCookie("token");
    return res.redirect("http://localhost:3001/admin/auth/login");
  }
};
