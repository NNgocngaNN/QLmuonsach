// Lớp ApiError kế thừa từ lớp Error để tạo ra lỗi tùy chỉnh với mã trạng thái và thông điệp lỗi
class ApiError extends Error {
  // Constructor nhận vào mã trạng thái HTTP và thông điệp lỗi
  constructor(statusCode, message) {
    super(message); // Gọi constructor của lớp Error và truyền thông điệp lỗi vào
    this.statusCode = statusCode; // Gán mã trạng thái HTTP cho thuộc tính statusCode
    this.message = message || "Có lỗi xảy ra"; // Gán thông điệp lỗi, nếu không có thông điệp thì dùng mặc định
    this.name = this.constructor.name; // Gán tên lỗi là 'ApiError'
  }
}

// Xuất lớp ApiError để sử dụng ở các module khác
module.exports = ApiError;
