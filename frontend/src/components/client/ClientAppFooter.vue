<template>
  <div>
    <hr class="bottom-divider" />
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-info">
          <h5>BOOK STORE</h5>
          <p>Địa chỉ: Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ</p>
          <p>Email: ngocngan@sinhvien.vn</p>
          <p>Điện thoại: 0123 456 789</p>
        </div>
        <div class="footer-links">
          <a href="#">Trang chủ</a>
          <a href="#">Sách đã mượn</a>
          <a href="#">Tài khoản của tôi</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Footer */
.footer {
  /* background: linear-gradient(to bottom, #ffffff, #ffffff, #fcfcfc, #fcfcfc, #fbfbfb, #fbfbfb, #fbfbfb);  */
  background-color: #fbfbfb;
  text-align: center;
  padding: 30px 0; /* Tăng khoảng cách dọc */
}

.bottom-divider {
  height: 2px;
  background-color: #ccc;
  border: none;
  margin: 0 10px;
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px; /* Tăng khoảng cách giữa các khối */
}

.footer-info h5 {
  font-size: 1.5em;
  margin: 0 0 10px;
  color: #333; /* Đảm bảo độ tương phản tốt */
}

.footer-info p {
  margin: 5px 0;
  color: #555; /* Màu chữ thân thiện hơn */
}

.footer-links {
  display: flex;
  gap: 20px; /* Tăng khoảng cách giữa các liên kết */
}

.footer-links a {
  color: #d0011b;
  text-decoration: none;
  transition: color 0.3s ease-in-out; /* Làm mượt hiệu ứng */
}

.footer-links a:hover {
  color: #b02a37;
}
</style>