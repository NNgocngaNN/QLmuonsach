<template>
  <div class="login-page">
    <div class="container">
      <div class="login-header">
        <h2>Cập nhật thông tin tài khoản</h2>
      </div>
      <form @submit.prevent="update" class="form">
        <!-- Global Error Message -->
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <!-- Full Name -->
        <div class="form-item">
          <label class="label" for="fullName">Họ và Tên:</label><br />
          <input
            class="input"
            type="text"
            id="fullName"
            placeholder="Nhập Họ và Tên"
            v-model="formData.fullName"
          />
          <p v-if="errors.fullName" class="error-text">{{ errors.fullName }}</p>
        </div>

        <!-- Email (disabled) -->
        <div class="form-item">
          <label class="label" for="email">Email:</label><br />
          <input
            class="input"
            type="email"
            id="email"
            placeholder="Nhập email"
            v-model="formData.email"
            disabled
          />
          <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
        </div>

        <!-- Address -->
        <div class="form-item">
          <label class="label" for="address">Địa chỉ:</label><br />
          <input
            class="input"
            type="text"
            id="address"
            placeholder="Nhập địa chỉ"
            v-model="formData.address"
          />
          <p v-if="errors.address" class="error-text">{{ errors.address }}</p>
        </div>

        <!-- Phone -->
        <div class="form-item">
          <label class="label" for="phone">Số điện thoại:</label><br />
          <input
            class="input"
            type="text"
            id="phone"
            placeholder="Nhập số điện thoại"
            v-model="formData.phone"
          />
          <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary">Cập nhật</button>
      </form>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ReaderService from "@/services/client/reader.service"; // Service API để cập nhật thông tin

export default {
  data() {
    return {
      formData: {
        fullName: "",
        email: "",
        password: "",
        address: "",
        phone: "",
      },
      errors: {
        fullName: "",
        email: "",
        password: "",
        address: "",
        phone: "",
      },
      errorMessage: "", // Global error message
    };
  },
  mounted() {
    this.getUserDetails(); // Khi component được mount, lấy thông tin người dùng
  },
  methods: {
    // Lấy thông tin người dùng để hiển thị
    async getUserDetails() {
      try {
        const response = await ReaderService.getUserDetails(); // Gọi API để lấy thông tin người dùng
        this.formData = response.data; // Gán dữ liệu lấy được vào formData
      } catch (error) {
        console.log("Lỗi khi lấy thông tin người dùng:", error);
        this.errorMessage = "Không thể lấy thông tin người dùng.";
      }
    },

    // Hàm cập nhật thông tin người dùng
    async update() {
      // Reset lỗi
      this.errors.fullName = "";
      this.errors.email = "";
      this.errors.address = "";
      this.errors.phone = "";
      this.errorMessage = "";

      // Validate các trường
      if (!this.formData.fullName) {
        this.errors.fullName = "Vui lòng nhập Họ và Tên";
      }
      if (!this.formData.address) {
        this.errors.address = "Vui lòng nhập địa chỉ";
      }
      if (!this.formData.phone) {
        this.errors.phone = "Vui lòng nhập số điện thoại";
      }

      // Nếu có lỗi, dừng lại
      if (
        this.errors.fullName ||
        this.errors.address ||
        this.errors.phone
      ) {
        return;
      }

      try {
        // Gọi API cập nhật thông tin người dùng
        const response = await ReaderService.updateUser(this.formData);

        if (response.success) {
          // Nếu thành công, hiển thị thông báo và chuyển trang
          toast.success("Cập nhật thông tin thành công!", { autoClose: 1200 });
          setTimeout(() => {
            this.$router.push({ name: "profile" }); // Chuyển đến trang thông tin cá nhân
          }, 800);
        } else {
          toast.error(response.error || "Có lỗi xảy ra khi cập nhật!", { autoClose: 3000 });
        }
      } catch (error) {
        console.log(error);
        // Xử lý lỗi từ server
        this.errorMessage = error.response?.data?.message || "Có lỗi xảy ra!";
        toast.error(this.errorMessage, { autoClose: 3000 });
      }
    },
  },
};
</script>


<style scoped>
/* Cấu trúc tổng thể của trang đăng nhập */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f9;
}

.container {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Tiêu đề đăng nhập */
.login-header h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

/* Form đăng nhập */
.form {
  display: flex;
  flex-direction: column;
}

/* Thông báo lỗi chung ở trên form */
.error-text {
  color: #d0011b;
  font-size: 14px;
}

/* Cấu trúc các item trong form */
.form-item {
  margin-bottom: 20px;
  text-align: left;
}

/* Các label trong form */
.label {
  font-weight: bold;
  color: #555;
}

/* Các input trong form */
.input {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 16px;
  color: #333;
}

/* Hiệu ứng khi input có focus */
.input:focus {
  border-color: #d0011b; /* Màu viền khi focus */
  outline: none; /* Loại bỏ viền mặc định */
}

/* Nút đăng nhập */
.btn {
  width: 100%;
  padding: 12px;
  margin-top: 7.5px;
  background-color: #d0011b;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Hiệu ứng hover cho nút đăng nhập */
.btn:hover {
  background-color: #a50018;
}

/* Cải thiện hiển thị lỗi */
.error-message {
  color: #d0011b;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Phần đăng ký */
.register {
  margin-top: 20px;
  font-size: 16px;
  color: #333;
  display: flex;
  justify-content: center; /* Căn giữa theo chiều ngang */
  align-items: center; /* Căn giữa theo chiều dọc nếu cần */
}

.register a {
  color: #d0011b; /* Màu chữ của liên kết */
  text-decoration: none;
  font-weight: bold;
  margin-left: 5px; /* Khoảng cách giữa văn bản và liên kết */
}

.register a:hover {
  text-decoration: underline; /* Thêm gạch chân khi hover */
}
</style>
