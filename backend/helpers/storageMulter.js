// Sử dụng multer để xử lý tải lên tệp tin
const multer = require("multer");

module.exports = () => {
  // Cấu hình lưu trữ tệp tin
  const storage = multer.diskStorage({
    // Xác định thư mục lưu trữ tệp tin sau khi tải lên
    destination: function (req, file, cb) {
      // Chỉ định thư mục lưu trữ là './public/uploads'
      cb(null, "./public/uploads");
    },

    // Xác định tên tệp sau khi tải lên
    filename: function (req, file, cb) {
      // Tạo tên tệp dựa trên thời gian hiện tại và tên tệp gốc
      const filename = Date.now() + "-" + file.originalname;
      // Trả về tên tệp mới
      cb(null, filename);
    },
  });

  // Trả về đối tượng cấu hình lưu trữ
  return storage;
};