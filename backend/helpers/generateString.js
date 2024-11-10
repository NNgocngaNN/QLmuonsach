// Hàm tạo chuỗi ngẫu nhiên có độ dài tùy chỉnh
module.exports.generateRandomString = (length) => {
  // Tập hợp các ký tự có thể xuất hiện trong chuỗi ngẫu nhiên
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = ""; // Khởi tạo biến kết quả là một chuỗi rỗng

  // Vòng lặp để tạo chuỗi ngẫu nhiên với độ dài 'length'
  for (let i = 0; i < length; i++) {
    // Chọn ngẫu nhiên một ký tự từ 'characters' và nối vào chuỗi kết quả
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Trả về chuỗi ngẫu nhiên đã tạo
  return result;
};
