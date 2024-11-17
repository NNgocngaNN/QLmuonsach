<template>
  <div>
    <ClientAppHeader />
    <div class="container mt-3 mb-3">
      <div class="page row">
        <!-- Phần dưới: Các button và Tìm kiếm -->
        <div class="col-md-12">
          <div class="item row mt-3">
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
            <!-- Phần chọn sắp xếp theo giá -->
            <div
              class="col-md-3"
              style="display: flex; align-items: center; gap: 15px"
            >
              <div>
                <label for="sortOrder">Sắp xếp theo: </label>
              </div>
              <div class="price-filter">
                <select
                  v-model="sortOrder"
                  class="form-control sort-select"
                  @change="sortBooks"
                >
                  <option value="none">Giá</option>
                  <option value="asc">Giá tăng dần</option>
                  <option value="desc">Giá giảm dần</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Phần dưới: Danh sách sách -->
        <div class="col-md-12 mt-3">
          <div class="mt-3 col-12">
            <ClientBookList
              v-if="filteredBooksCount > 0"
              :books="paginatedBooks"
              v-model:activeIndex="activeIndex"
            />
            <p v-else>Không có sách trong kho.</p>
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
    <ClientAppFooter />
  </div>
</template>

<script>
import BookDetail from "@/components/client/ClientBookDetail.vue";
import AppHeader from "@/components/client/ClientAppHeader.vue";
import AppFooter from "@/components/client/ClientAppFooter.vue";
import BookService from "@/services/client/book.service";
import BackToTop from "@/components/client/BackToTop.vue";
import axios from "axios";

export default {
  components: {
    BookDetail,
    AppHeader,
    AppFooter,
    BackToTop,
    async get(bookId) {
      return (await axios.get(`/api/books/${bookId}`)).data;
    },
  },
  data() {
    return {
      books: [],
      activeIndex: -1,
      searchText: "",
      currentPage: 1,
      booksPerPage: 8, // Số sách hiển thị mỗi trang
      sortOrder: "none", // Mặc định không sắp xếp
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
          .join(" ")
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
    // Sắp xếp sách theo giá nếu cần
    sortedBooks() {
      let booksToDisplay = this.filteredBooks;

      if (this.sortOrder === "asc") {
        booksToDisplay = booksToDisplay.sort((a, b) => a.price - b.price);
      } else if (this.sortOrder === "desc") {
        booksToDisplay = booksToDisplay.sort((a, b) => b.price - a.price);
      }

      return booksToDisplay;
    },
    totalPages() {
      return Math.ceil(this.filteredBooksCount / this.booksPerPage);
    },
    paginatedBooks() {
      const startIndex = (this.currentPage - 1) * this.booksPerPage;
      const endIndex = startIndex + this.booksPerPage;
      return this.sortedBooks.slice(startIndex, endIndex);
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
    sortBooks() {
      // Không làm gì nếu chọn không sắp xếp
      if (this.sortOrder === "none") return;

      this.currentPage = 1; // Quay lại trang đầu tiên khi thay đổi sắp xếp
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
  justify-content: center;
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

/* Điều chỉnh nút sắp xếp */
.sort-select {
  padding: 10px 15px;
  font-size: 14px;
  min-width: 160px; /* Đảm bảo nút sắp xếp không quá rộng */
}

.sort-select:focus {
  border-color: #d0011b; /* Đổi màu viền khi nhấn vào ô chọn */
  box-shadow: 0 0 2px rgba(208, 1, 27, 0.5); /* Thêm hiệu ứng bóng nhẹ để làm nổi bật */
}
</style>
