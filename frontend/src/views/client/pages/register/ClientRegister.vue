<template>
  <div class="login-page">
    <div class="container mt-3 mb-3">
      <div class="login-header">
        <h2>Đăng Kí</h2>
      </div>
      <div class="form">
        <form @submit.prevent="add" action="">
          <!-- Full Name Input -->
          <div class="form-item">
            <label class="label" for="fullName">Họ và tên:</label><br />
            <input
              class="input"
              type="text"
              id="fullName"
              placeholder="Nhập họ và tên"
              v-model="formData.fullName"
            />
            <p v-if="errors.fullName" class="error-text">
              {{ errors.fullName }}
            </p>
          </div>

          <!-- Email Input -->
          <div class="form-item">
            <label class="label" for="email">Email:</label><br />
            <input
              class="input"
              type="email"
              id="email"
              placeholder="Nhập email"
              v-model="formData.email"
            />
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
          </div>

          <!-- Password Input -->
          <div class="form-item">
            <label class="label" for="password">Mật khẩu:</label><br />
            <input
              class="input"
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              v-model="formData.password"
            />
            <p v-if="errors.password" class="error-text">
              {{ errors.password }}
            </p>
          </div>

          <!-- Address Input -->
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

          <!-- Phone Input -->
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
          <button type="submit" class="btn btn-primary">Tạo</button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ClientAppHeader from "@/components/client/ClientAppHeader.vue";
import ReaderService from "@/services/client/reader.service";

export default {
  components: {
    ClientAppHeader,
  },
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
    };
  },

  methods: {
    async add() {
      // Reset previous error messages
      this.errors = {
        fullName: "",
        email: "",
        password: "",
        address: "",
        phone: "",
      };

      // Validate if all required fields are filled
      let valid = true;

      if (!this.formData.fullName) {
        this.errors.fullName = "Vui lòng nhập họ và tên";
        valid = false;
      }

      if (!this.formData.email) {
        this.errors.email = "Vui lòng nhập email";
        valid = false;
      }

      if (!this.formData.password) {
        this.errors.password = "Vui lòng nhập mật khẩu";
        valid = false;
      }

      if (!this.formData.address) {
        this.errors.address = "Vui lòng nhập địa chỉ";
        valid = false;
      }

      if (!this.formData.phone) {
        this.errors.phone = "Vui lòng nhập số điện thoại";
        valid = false;
      }

      // Stop if there are validation errors
      if (!valid) {
        return;
      }

      try {
        const formData = new FormData();
        formData.append("fullName", this.formData.fullName);
        formData.append("email", this.formData.email);
        formData.append("password", this.formData.password);
        formData.append("address", this.formData.address);
        formData.append("phone", this.formData.phone);

        // Call API to create user
        const response = await ReaderService.createUser(this.formData);
        toast.success("Đăng ký thành công!", {
          autoClose: 1200,
        });

        // Redirect to login page after success
        setTimeout(() => {
          this.$router.push({ name: "login-client" });
        }, 800);
      } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Có lỗi xảy ra!";
        toast.error(errorMessage, { autoClose: 3000 });
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
  min-height: 100vh;
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
