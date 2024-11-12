<template>
  <div class="login-page">
    <div class="container">
      <div class="login-header">
        <h2>Đăng nhập</h2>
      </div>
      <form @submit.prevent="login" class="form">
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
        <!-- Hiển thị lỗi chung ở trên form -->
        <div class="form-item">
          <label for="email" class="label">Email:</label>
          <input
            v-model="formData.email"
            type="email"
            id="email"
            class="input"
            placeholder="Nhập email của bạn"
          />
          <p
            v-if="errors.email"
            class="error-text"
            style="margin-top: 8px; margin-bottom: 0"
          >
            {{ errors.email }}
          </p>
        </div>
        <div class="form-item">
          <label for="password" class="label">Mật khẩu:</label>
          <input
            v-model="formData.password"
            type="password"
            id="password"
            class="input"
            placeholder="Nhập mật khẩu"
          />
          <p
            v-if="errors.password"
            class="error-text"
            style="margin-top: 8px; margin-bottom: 0"
          >
            {{ errors.password }}
          </p>
        </div>
        <button type="submit" class="btn btn-primary">Đăng nhập</button>

        <div class="register">
            Bạn chưa có tài khoản?
            <router-link :to="{ name: 'register-client' }">Đăng ký</router-link>
          </div>
      </form>
    </div>
  </div>
</template>
<script>
import AuthorizationServiceClient from "../../../../services/client/authorization.service";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      errors: {
        email: "",
        password: "",
      },
      errorMessage: "", // Biến chứa thông báo lỗi chung
    };
  },
  methods: {
    async login() {
      // Reset errors
      this.errors.email = "";
      this.errors.password = "";
      this.errorMessage = ""; // Reset lỗi chung

      // Check if fields are empty
      if (!this.formData.email) {
        this.errors.email = "Vui lòng nhập email";
      }
      if (!this.formData.password) {
        this.errors.password = "Vui lòng nhập mật khẩu";
      }

      if (this.errors.email || this.errors.password) {
        return; // Stop if there are validation errors
      }

      try {
        const response = await AuthorizationServiceClient.submitLogin(
          this.formData
        );
        switch (response.data) {
          case "wrong info":
            this.errorMessage =
              "Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập và thử lại."; // Hiển thị lỗi chung
            break;
          case "success":
            setTimeout(() => {
              this.$router.push({ name: "book-client" });
            }, 500);
            break;
          default:
            break;
        }
      } catch (error) {
        console.log(error);
        this.errorMessage = "Tên người dùng hoặc mật khẩu không đúng"; // Hiển thị lỗi chung
        toast.error(this.errorMessage, {
          autoClose: 800,
        });
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
