const multer = require("multer"); // Import thư viện multer để xử lý tải lên tệp
const path = require("path"); // Import thư viện path để xử lý đường dẫn tệp

// Định nghĩa nơi lưu trữ và tên tệp sau khi tải lên
const storage = multer.diskStorage({
  // Xác định thư mục lưu trữ tệp tải lên
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../uploads/")); // Lưu tệp vào thư mục 'uploads'
  },

  // Xác định tên tệp sau khi tải lên
  filename: (req, file, callback) => {
    // Tạo tên tệp bằng cách kết hợp thời gian hiện tại với tên tệp gốc
    const filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename); // Trả về tên tệp mới
  },
});

// Kiểm tra loại tệp có hợp lệ hay không
const fileFilter = (req, file, callback) => {
  const allowedMimes = ["image/jpg", "image/png"]; // Định nghĩa loại tệp cho phép tải lên (JPG và PNG)

  if (allowedMimes.includes(file.mimetype)) {
    // Nếu loại tệp hợp lệ, cho phép tải lên
    callback(null, true);
  } else {
    // Nếu loại tệp không hợp lệ, trả về thông báo lỗi và không cho phép tải lên
    callback(
      new Error("Loại tệp không hợp lệ, chỉ JPG và PNG được phép tải lên"),
      false
    );
  }
};

// Giới hạn kích thước tệp tải lên (tối đa 5MB)
const limits = {
  fileSize: 1024 * 1024 * 5, // 5MB = 1024KB * 1024 * 5
};

// Khởi tạo multer với cấu hình đã định nghĩa
const upload = multer({
  storage: storage, // Cấu hình lưu trữ
  fileFilter: fileFilter, // Kiểm tra loại tệp
  limits: limits, // Giới hạn kích thước tệp
});

module.exports = upload; // Xuất đối tượng upload để sử dụng trong các route