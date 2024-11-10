const Reader = require("../../models/reader.model");

module.exports.authRequire = async (req, res, next) => {
  // Kiểm tra nếu không có cookie 'tokenUser'
  if (!req.cookies.tokenUser) {
    // Nếu không có token, chuyển hướng người dùng đến trang đăng nhập
    return res.redirect("http://localhost:3001/auth/login");
  }

  try {
    // Tìm người dùng trong cơ sở dữ liệu với token trong cookie
    const user = await Reader.findOne({
      token: req.cookies.tokenUser,
    });

    // Nếu không tìm thấy người dùng với token này
    if (!user) {
      // Nếu có token nhưng không tìm thấy người dùng, xóa cookie và chuyển hướng đến trang đăng nhập
      res.clearCookie("tokenUser");
      return res.redirect("http://localhost:3001/auth/login");
    }

    // Nếu tìm thấy người dùng, tiếp tục với route tiếp theo
    next();
  } catch (error) {
    // Nếu có lỗi khi tìm người dùng, xóa cookie và chuyển hướng đến trang đăng nhập
    console.error(error);
    res.clearCookie("tokenUser");
    return res.redirect("http://localhost:3001/auth/login");
  }
};