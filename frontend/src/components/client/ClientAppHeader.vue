<template>
  <header>
    <div class="header-top">
      <a href="/books" class="logo-container">
        <div class="logo-text">
          <span class="book">BOOK</span><span class="store">STORE</span>
        </div>
      </a>
      <div class="logout-container">
        <button class="btn btn-danger button-logout" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
    <hr class="divider" />
    <nav class="navbar">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link
            :to="{ name: 'book-client' }"
            class="nav-link"
            :class="{ active: $route.name === 'book-client' }"
          >
            <h6>TRANG CHỦ</h6>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'borrow-client' }"
            class="nav-link"
            :class="{ active: $route.name === 'borrow-client' }"
          >
            <h6>SÁCH CỦA TÔI</h6>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            :to="{ name: 'account' }"
            class="nav-link"
            :class="{ active: $route.name === 'account' }"
          >
            <h6>QUẢN LÝ TÀI KHOẢN</h6>
          </router-link>
        </li>
      </ul>
    </nav>
    <hr class="bottom-divider" />
  </header>
</template>

<script>
import Authorization from "@/services/client/authorization.service";

export default {
  computed: {},
  name: "client-app-header",
  methods: {
    async logout() {
      // Xử lý đăng xuất ở đây
      try {
        const respone = await Authorization.logOut();
        this.$router.push({ name: "login-client" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 50px;
}

.logo-container {
  display: flex;
  align-items: center;
  text-decoration: none; /* Bỏ gạch chân của logo */
}

.logo-text {
  display: flex;
  align-items: center;
  font-size: 25px;
  font-weight: bold;
  text-decoration: none;
  margin: 8px 0; /* Đảm bảo không có gạch chân cho chữ */
}

.book {
  color: white;
  background-color: #d0011b;
  padding: 5px 10px;
  border-radius: 5px;
}

.store {
  color: #d0011b;
  background-color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.logout-container {
  display: flex;
  align-items: center;
}

.divider {
  height: 1px;
  background-color: #ccc;
  border: none;
  margin: 0 10px;
}

.navbar {
  padding: 12.5px 0;
  display: flex;
  justify-content: center;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  border-radius: 10px;
  color: black;
  text-decoration: none;
  transition: all 0.2s linear;
}

.nav-link:hover,
.nav-link.active {
  color: #d0011b;
}

/* Đường phân cách cuối cùng */
.bottom-divider {
  height: 3px;
  background-color: #d0011b;
  border: none;
  margin: 0;
  opacity: 1;
}

/* Định dạng cho nút đăng xuất */
.button-logout {
  background-color: transparent; /* Không có màu nền */
  border: none; /* Không có border */
  color: #d0011b; /* Màu chữ */
  padding: 8px 16px; /* Điều chỉnh padding */
  font-size: 20px; /* Kích thước icon */
  cursor: pointer; /* Đổi con trỏ khi hover */
  transition: color 0.3s; /* Hiệu ứng chuyển màu chữ */
}

.button-logout:hover {
  color: #a10015; /* Màu chữ khi hover */
}

.button-logout:focus {
  outline: none; /* Loại bỏ viền focus */
  background-color: transparent; /* Đảm bảo không có nền */
}

.button-logout i {
  margin-right: 8px; /* Khoảng cách giữa icon và text */
}
</style>