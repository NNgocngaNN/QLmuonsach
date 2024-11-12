<template>
  <div>
    <AppHeader />
    <div class="container mt-3 mb-3">
      <div class="page row">
        <!-- Phần trên: Danh sách sách -->
        <h4>Danh Sách Sách Trong Kho</h4>

        <!-- Phần dưới: Các button và Tìm kiếm -->
        <div class="col-md-12">
          <div class="item row mt-3">
            <div class="col-md-8">
              <div class="button-group">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                  <i class="fas fa-redo"></i> Làm mới
                </button>
                <button class="btn btn-sm btn-success" @click="goToAddBook">
                  <i class="fas fa-plus"></i> Thêm mới
                </button>
                <button class="btn btn-sm btn-danger" @click="removeAllBooks">
                  <i class="fas fa-trash"></i> Xóa tất cả
                </button>
              </div>
            </div>

            <div class="col-md-4">
              <div class="input-group">
                <input
                  type="text"
                  v-model="searchText"
                  class="form-control"
                  placeholder="Nhập từ khóa"
                />
                <button class="btn btn-danger" @click="searchBooks">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Phần dưới: Danh sách sách -->
        <div class="col-md-12 mt-3">
          <div v-for="(book, index) in paginatedBooks" :key="book._id">
            <div
              @click="
                activeIndex === index
                  ? (activeIndex = -1)
                  : (activeIndex = index)
              "
              class="book-item"
              :class="{ active: activeIndex === index }"
            >
              {{ book.bookTitle }}

              <!-- Icon hiệu chỉnh và xóa -->
              <div class="book-actions">
                <router-link
                  :to="{ name: 'book.edit', params: { id: book._id } }"
                  class="action-icon edit-icon"
                >
                  <i class="fas fa-edit"></i>
                </router-link>
                <span
                  class="action-icon delete-icon"
                  @click.stop="removeOneBook(book)"
                >
                  <i class="fa-solid fa-trash"></i>
                </span>
              </div>
            </div>

            <!-- Chi tiết sách -->
            <div v-if="activeIndex === index" class="book-detail">
              <BookDetail :book="book" />
            </div>
          </div>

          <!-- Phân trang -->
          <div class="pagination-container mt-4">
            <button
              class="btn btn-outline-secondary"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="mx-2">Trang {{ currentPage }} / {{ totalPages }}</span>
            <button
              class="btn btn-outline-secondary"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <BackToTop />
      </div>
    </div>
  </div>
</template>


<script>
import BookDetail from "@/components/admin/BookDetail.vue";
import AppHeader from "@/components/admin/AppHeader.vue";
import BookService from "@/services/admin/book.service";
import BackToTop from "@/components/admin/BackToTop.vue";

export default {
  components: {
    BookDetail,
    AppHeader,
    BackToTop,
  },
  data() {
    return {
      books: [],
      activeIndex: -1,
      searchText: "",
      currentPage: 1,
      booksPerPage: 10, // Số sách hiển thị mỗi trang
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
      this.currentPage = 1; // Khi tìm kiếm, trở về trang đầu
    },
  },
  computed: {
    booksStrings() {
      return this.books.map((book) => {
        const { bookTitle, price, quantity, publishYear, author, thumbnail } =
          book;
        return [bookTitle, price, quantity, publishYear, author, thumbnail]
          .join("")
          .toLowerCase(); // Chuyển về chữ thường
      });
    },
    filteredBooks() {
      if (!this.searchText) return this.books;
      const searchTextLower = this.searchText.toLowerCase(); // Chuyển từ khóa tìm kiếm thành chữ thường
      return this.books.filter(
        (_book, index) => this.booksStrings[index].includes(searchTextLower) // So sánh với chuỗi tìm kiếm
      );
    },
    filteredBooksCount() {
      return this.filteredBooks.length;
    },
    totalPages() {
      return Math.ceil(this.filteredBooksCount / this.booksPerPage);
    },
    paginatedBooks() {
      const startIndex = (this.currentPage - 1) * this.booksPerPage;
      const endIndex = startIndex + this.booksPerPage;
      return this.filteredBooks.slice(startIndex, endIndex);
    },
  },
  methods: {
    async retrieveBooks() {
      try {
        this.books = await BookService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrieveBooks();
      this.searchText = "";
      this.activeIndex = -1;
      this.currentPage = 1; // Khi làm mới, quay về trang đầu
    },
    async removeOneBook(book) {
      if (confirm("Bạn muốn xóa cuốn sách này?")) {
        try {
          await BookService.delete(book._id);
          this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },
    async removeAllBooks() {
      if (confirm("Bạn muốn xóa tất cả sách?")) {
        try {
          await BookService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },
    goToAddBook() {
      this.$router.push({ name: "book.add" });
    },
    goToPage(pageNumber) {
      if (pageNumber < 1 || pageNumber > this.totalPages) return;
      this.currentPage = pageNumber;
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 10px;
}

.page {
  text-align: left;
}

.custom-margin {
  margin-right: 10px;
}

.button-group {
  display: flex;
  justify-content: start;
  gap: 10px;
}

.button-group .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 13px;
  text-align: center;
  min-width: 100px;
  border: 2px solid #d0011b;
  color: #d0011b;
  background-color: transparent;
  transition: all 0.3s ease;
}

.button-group .btn i {
  margin-right: 8px; /* Thêm khoảng cách giữa icon và chữ */
}

.button-group .btn:hover {
  background-color: #d0011b;
  color: white;
  border-color: #d0011b;
}

.button-group .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px; /* Cập nhật padding để các nút có chiều cao và chiều ngang đồng đều */
  font-size: 14px; /* Cỡ chữ đồng đều */
  text-align: center;
  min-width: 120px; /* Đảm bảo các nút có chiều rộng tương đương */
}

.input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-group .form-control {
  padding: 10px 15px; /* Thêm padding để đồng đều với các nút */
  font-size: 14px;
}

.input-group .btn-danger {
  padding: 10px 20px; /* Điều chỉnh padding cho nút tìm kiếm */
  font-size: 14px;
}

.input-group .form-control:focus {
  border-color: #d0011b; /* Đổi màu border khi ô input được chọn */
  box-shadow: 0 0 2.5px rgba(208, 1, 27, 0.5); /* Thêm hiệu ứng bóng nhẹ để làm nổi bật */
}

.item {
  padding-bottom: 10px;
}

.row {
  display: flex;
  justify-content: space-between;
}

/* CSS cho phần hiển thị chi tiết sách khi nhấn */
.book-item {
  cursor: pointer;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.book-item:hover {
  color: #d0011b;
}

.book-item + .book-detail {
  margin-top: 10px;
  margin-bottom: 9px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* Ẩn các chi tiết sách khi không chọn */
.book-detail {
  display: none;
}

.book-item.active + .book-detail {
  display: block;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-container button {
  margin: 0 10px;
  font-size: 20px;
  padding: 8px 16px; /* Cải thiện padding để nút đẹp hơn */
  border: none;
  color: #fff; /* Dùng màu chủ đạo cho chữ và icon */
  background-color: #d0011b; /* Nền trong suốt */
  transition: all 0.3s ease; /* Hiệu ứng chuyển động mượt mà */
}

.pagination-container button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.pagination-container button:hover {
  background-color: #bb2d3b; /* Đổi nền khi hover */
  color: white; /* Chữ và icon sẽ đổi thành màu trắng khi hover */
}

.pagination-container span {
  font-size: 16px;
}

.book-item {
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.book-item:hover {
  color: #d0011b;
}

.book-item.active {
  color: #d0011b;
}

.book-actions {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  gap: 15px;
}

.action-icon {
  cursor: pointer;
  color: #d0011b;
}

.action-icon:hover {
  color: #bb2d3b;
}

.book-item.active + .book-detail {
  display: block;
}


</style>