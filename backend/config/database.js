// Import thư viện mongoose để kết nối với MongoDB
const mongoose = require("mongoose");

// Hàm kết nối tới MongoDB
module.exports.connect = async () => {
  try {
    // Kết nối tới MongoDB sử dụng URL từ biến môi trường MONGO_URL
    await mongoose.connect(process.env.MONGO_URL);

    // Nếu kết nối thành công, thông báo trên console
    console.log("Kết nối thành công!");
  } catch (error) {
    // Nếu có lỗi trong quá trình kết nối, in ra lỗi
    console.log("Kết nối thất bại!", error);
  }
};
