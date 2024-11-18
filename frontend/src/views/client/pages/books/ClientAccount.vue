<template>
  <div>
    <ClientAppHeader />
    <div class="container mt-3 mb-3">
      <div class="page row">
        <!-- Thông tin tài khoản -->
        <div class="col-md-12">
          <div class="row">
            <div class="col-12 col-md-6">
              <h6 class="name">Thông tin tài khoản</h6>
              <div class="account-info">
                <div class="info-item">
                  <strong>Họ và tên: </strong> {{ user.fullName }}
                </div>
                <div class="info-item">
                  <strong>Email: </strong> {{ user.email }}
                </div>
                <div class="info-item">
                  <strong>Số điện thoại: </strong> {{ user.phone }}
                </div>
                <div class="info-item">
                  <strong>Địa chỉ: </strong> {{ user.address }}
                </div>
              </div>
            </div>

            <div class="account-actions">
              <!-- Hiển thị nút Cập nhật nếu không ở chế độ chỉnh sửa -->
              <button class="btn btn-warning" @click="editAccount">
                Cập nhật tài khoản
              </button>
            </div>

            <!-- Hiển thị form chỉnh sửa khi isEditing là true -->
            <div v-if="isEditing" class="update-form">
              <form @submit.prevent="handleSubmit">
                <div class="form-group">
                  <label for="fullName">Họ và tên</label>
                  <input
                    v-model="user.fullName"
                    type="text"
                    placeholder="Họ và tên"
                  />
                </div>
                <div class="form-group">
                  <label for="fullName">Email</label>
                  <input
                    v-model="user.email"
                    type="email"
                    placeholder="Email"
                    disabled
                  />
                  <small class="text-danger">*Email không thể thay đổi</small>
                </div>

                <div class="form-group">
                  <label for="fullName">Số điện thoại</label>
                  <input
                    v-model="user.phone"
                    type="text"
                    placeholder="Số điện thoại"
                  />
                </div>
                <div class="form-group">
                  <label for="fullName">Địa chỉ</label>
                  <input
                    v-model="user.address"
                    type="text"
                    placeholder="Địa chỉ"
                  />
                </div>

                <div class="form-group">
                  <button type="submit" class="btn btn-primary">
                    Lưu thay đổi
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="cancelEdit"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <BackToTop />
      </div>
    </div>
    <ClientAppFooter />
  </div>
</template>

<script>
import Cookies from "js-cookie";
import ReaderService from "@/services/client/reader.service"; // Đảm bảo bạn import đúng ReaderService

export default {
  data() {
    return {
      user: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
      },
      errorMessage: "",
      isEditing: false, // Thêm biến để kiểm soát chế độ chỉnh sửa
    };
  },
  computed: {
    formattedJoinDate() {
      const joinDate = new Date(this.user.joinDate);
      return joinDate.toLocaleDateString();
    },
  },
  methods: {
    async getUserDetails() {
      try {
        // Lấy tokenUser từ cookie
        const tokenUser = Cookies.get("tokenUser");
        console.log("Token User: ", tokenUser);

        // Kiểm tra tokenUser
        if (!tokenUser) {
          console.error("Không tìm thấy tokenUser trong cookie!");
          return;
        }

        // Gọi API để lấy thông tin người dùng dựa trên token
        const response = await ReaderService.getInforUserByToken({
          token: tokenUser,
        });

        // Nếu response trả về đúng dữ liệu, gán vào user
        if (response) {
          this.user = response;
        } else {
          console.error("Không tìm thấy thông tin người dùng!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    },
    // Mở chế độ chỉnh sửa
    editAccount() {
      this.isEditing = true;
    },
    // Hủy bỏ chỉnh sửa
    cancelEdit() {
      this.isEditing = false;
    },
    // Lưu các thay đổi
    async handleSubmit() {
      try {
        // Lấy tokenUser từ cookie
        const token = Cookies.get("tokenUser");
        console.log("Token User: ", token);

        // Gọi service để gửi yêu cầu cập nhật thông tin người dùng
        const response = await ReaderService.updateUser(token, this.user);

        if (response.error) {
          // Hiển thị lỗi nếu có
          this.errorMessage = response.error;
        } else {
          // Xử lý thành công, ví dụ: thông báo thành công
          alert("Cập nhật thông tin người dùng thành công");

          // Reload the page to reflect the updated information
          window.location.reload();
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      }
    },
  },
  mounted() {
    this.getUserDetails();
  },
};
</script>
<style scoped>
.container {
  max-width: 1200px;
  min-height: 459px;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 10px;
}

.name {
  color: #000;
  font-size: 28px;
}

.account-info {
  padding: 15px;
  border-radius: 8px;
}

.info-item {
  margin-bottom: 10px;
}

.info-item strong {
  font-weight: bold;
  color: #333;
}

.account-actions {
  margin-bottom: 20px;
}

.account-actions button {
  margin-right: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.account-actions .btn-success {
  background-color: #28a745;
  color: white;
  border: none;
}

.account-actions .btn-success:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.account-actions .btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
}

.account-actions .btn-secondary:hover {
  background-color: #5a6268;
  transform: scale(1.05);
}

.account-actions .btn-warning {
  background-color: #d0011b;
  color: white;
  border: none;
}

.account-actions .btn-warning:hover {
  background-color: #bb2d3b;
}

.account-actions .btn-danger {
  background-color: #e74c3c;
  color: white;
  border: none;
}

.account-actions .btn-danger:hover {
  background-color: #c0392b;
  transform: scale(1.05);
}

.update-form {
  padding: 20px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.update-form h3 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.update-form .form-group {
  margin-bottom: 15px;
}

.update-form label {
  font-weight: bold;
  margin-bottom: 8px;
}

.update-form input[type="text"],
.update-form input[type="email"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 5px;
}

.update-form input[type="text"]:focus,
.update-form input[type="email"]:focus {
  border-color: #007bff;
  outline: none;
}

.update-form .btn {
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 5px;
}

.update-form .btn-primary {
  background-color: #007bff;
  color: #fff;
  border: none;
}

.update-form .btn-secondary {
  background-color: #6c757d;
  color: #fff;
  border: none;
}

.update-form .btn-primary:hover,
.update-form .btn-secondary:hover {
  opacity: 0.9;
}

.update-form .btn-primary:focus,
.update-form .btn-secondary:focus {
  outline: none;
}

@media (max-width: 768px) {
  .account-info {
    padding: 10px;
  }

  .update-form {
    padding: 15px;
  }

  .update-form h3 {
    font-size: 20px;
  }
}

.update-form .form-group button {
  margin-right: 15px;
}

</style>
