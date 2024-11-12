<template>
  <div>
    <ClientAppHeader />
    <div class="container mt-5 mb-5">
      <div class="page row">
        <div v-if="book" class="book-detail-container">
          <div class="book-image">
            <img
              class="center-image"
              :src="'/api/uploads/' + book.thumbnail"
              alt="Hình sách"
            />
          </div>

          <div class="book-info">
            <div>
              <h2>{{ book.bookTitle }}</h2>
              <div class="p-1"><strong>Tác giả:</strong> {{ book.author }}</div>
              <div class="p-1">
                <strong>Giá:</strong> {{ formatPrice(book.price) }} VND
              </div>
              <div class="p-1">
                <strong>Năm xuất bản:</strong> {{ book.publishYear }}
              </div>
              <div class="p-1">
                <strong>Số lượng trong kho:</strong> {{ book.quantity }}
              </div>
              <div class="p-1">
                <strong>Số lượng còn lại:</strong> {{ remain }}
              </div>
              <div class="p-1">
                <strong>Nhà xuất bản:</strong> {{ book.publisherName }}
              </div>
            </div>

            <div>
              <router-link
                :to="{
                  name: 'borrow-book',
                  params: { id: book._id },
                }"
              >
                <span class="btn btn-borrow"> Mượn sách </span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      style="background: linear-gradient(to right, #fbfbfb, #fbfbfb, #fbfbfb)"
    >
      <hr class="bottom-divider" />
      <footer>
        <div class="footer-container">
          <div class="footer-info">
            <h5>BOOK STORE</h5>
            <p>Địa chỉ: Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ</p>
            <p>Email: ngocngan@sinhvien.vn</p>
            <p>Điện thoại: 0123 456 789</p>
          </div>
          <div class="footer-links" style="color: #1f763b">
            <a href="#">Trang chủ</a>
            <a href="#">Sách đã mượn</a>
            <a href="#">Tài khoản của tôi</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import BookService from "@/services/client/book.service";
import ReaderService from "@/services/client/reader.service";

export default {
  data() {
    return {
      book: null,
      remain: 0,
    };
  },
  async created() {
    const bookId = this.$route.params.id;
    try {
      this.book = await BookService.get(bookId);
      this.updateremain();
    } catch (error) {
      console.error("Không thể tải chi tiết sách:", error);
    }
  },
  methods: {
    async updateremain() {
      try {
        const response = await ReaderService.getNumberBookBorrowed(
          this.book._id
        );
        this.remain = this.book.quantity - response;
      } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Error!";
        toast.error(errorMessage, { autoClose: 3000 });
      }
    },

    formatPrice(price) {
      return price.toLocaleString(); // Định dạng số với dấu phân cách hàng nghìn
    },
  },
  watch: {
    book: {
      handler() {
        this.updateremain();
      },
      deep: true,
    },
  },
};
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 10px;
}

.book-detail-container {
  display: grid;
  grid-template-columns: 1fr 2fr; /* Tạo 2 cột, 1 cột cho ảnh và 1 cột cho thông tin */
  gap: 20px; /* Khoảng cách giữa ảnh và thông tin */
}

.book-image {
  display: flex;
  justify-content: center; /* Căn giữa ảnh trong phần tử */
}

.book-info {
  display: flex;
  flex-direction: column; /* Xếp các thông tin theo chiều dọc */
  gap: 30px;
}

.center-image {
  width: 100%; /* Cho phép ảnh tự động điều chỉnh theo kích thước của phần chứa */
  max-width: 400px; /* Kích thước tối đa của ảnh */
  height: auto;
  border-radius: 10px;
}

.book-info .p-1 {
  margin-bottom: 10px; /* Khoảng cách giữa các dòng thông tin */
}

h2 {
  margin-bottom: 15px; /* Khoảng cách dưới tiêu đề */
  font-size: 1.8rem; /* Kích thước font tiêu đề */
  color: #333; /* Màu chữ tiêu đề */
}

.btn-borrow {
  background-color: #d0011b;
  color: #fff;
}

.btn-borrow:hover {
  background-color: #bb2d3b;
  color: #fff;
}

/* footer */
.bottom-divider {
  margin: 0 10px;
}

footer {
  padding: 20px 0;
  text-align: center;
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
}

.footer-info h5 {
  margin: 0;
  font-size: 1.7em;
}

.footer-info h3 {
  margin: 0;
  font-size: 1.5em;
}

.footer-info p {
  margin: 5px 0;
}

.footer-links {
  display: flex;
  gap: 15px;
}

.footer-links a {
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a {
  color: #d0011b;
}

.footer-links a:hover {
  color: #b02a37;
}
</style>
