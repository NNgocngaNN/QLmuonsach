<template>
  <div>
    <ClientAppHeader />
    <div class="container mt-3 mb-3">
      <h6 class="name">Danh Sách Sách Đã Mượn</h6>
      <template v-if="reader.borrow && reader.borrow.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sách</th>
              <th>Số lượng</th>
              <th>Ngày mượn</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(borrowedBook, index) in paginatedBooks"
              :key="borrowedBook._id"
            >
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td style="text-align: left">
                {{ getBookName(borrowedBook.id_book) }}
              </td>
              <td>{{ borrowedBook.initialQuantity }}</td>
              <td>{{ borrowedBook.borrowDate }}</td>
              <td>{{ borrowedBook.returnDate }}</td>
              <td class="text-primary">
                {{
                  borrowedBook.status === "accepted"
                    ? "Đã duyệt"
                    : borrowedBook.status === "refused"
                    ? "Từ chối"
                    : borrowedBook.status === "returned"
                    ? "Đã trả"
                    : borrowedBook.status === "processing"
                    ? "Chờ xử lí"
                    : borrowedBook.status === "cancelled"
                    ? "Đã huỷ"
                    : "Unknown"
                }}
              </td>
              <td>
                <button
                  v-if="canReturn(borrowedBook.status)"
                  class="btn btn-danger"
                  @click="statusBookReturn(reader, borrowedBook, 'returned')"
                >
                  Trả
                </button>
                <button
                  v-if="canDelete(borrowedBook.status)"
                  class="btn btn-danger"
                >
                  
                </button>
                <button
                  v-if="canReturnprocessing(borrowedBook.status)"
                  class="btn btn-danger"
                  @click="statusBookReturn(reader, borrowedBook, 'cancelled')"
                >
                  Huỷ yêu cầu
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Nút điều khiển phân trang -->
        <div class="pagination mt-4">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span>Trang {{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </template>
      <template v-else>
        <p style="text-align: center">
          <i>Bạn chưa có đăng ký đơn mượn nào.</i>
        </p>
      </template>
       <BackToTop />
    </div>
    <ClientAppFooter />
  </div>
</template>

<script>
import ClientAppHeader from "@/components/client/ClientAppHeader.vue";
import AppFooter from "@/components/client/ClientAppFooter.vue";
import BookService from "@/services/client/book.service";
import readerService from "@/services/client/reader.service";
import Cookies from "js-cookie";

export default {
  components: {
    ClientAppHeader,
    AppFooter,
  },
  data() {
    return {
      books: [],
      activeIndex: -1,
      searchText: "",
      token: "",
      reader: {},
      currentPage: 1,
      itemsPerPage: 15, // Số mục trên mỗi trang
    };
  },
  computed: {
    // Chỉ lấy các sách thuộc trang hiện tại
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.reader.borrow.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.reader.borrow.length / this.itemsPerPage);
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
    async retrieveReaders() {
      try {
        const token = Cookies.get("tokenUser");
        this.token = token;
        let formData = new FormData();
        formData.append("tokenUser", token);
        this.reader = await readerService.getUserByToken(formData);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin độc giả:", error);
      }
    },
    async statusBookReturn(reader, borrowedBook, status) {
      try {
        await readerService.statusBookReturn(
          reader._id,
          borrowedBook.id_book,
          status
        );
        await this.retrieveReaders();
        await this.retrieveBooks();
      } catch (error) {
        console.log(error);
      }
    },
    getBookName(bookId) {
      const book = this.books.find((book) => book._id === bookId);
      return book ? book.bookTitle : "Unknown";
    },
    canDelete(status) {
      return (
        status === "refused" || status === "returned" || status === "cancelled"
      );
    },
    canReturn(status) {
      return status === "accepted";
    },

    canReturnprocessing(status) {
      return status === "processing";
    },

    async deleteBook(id) {
      await readerService.returnBookBorrow(id);
      this.retrieveReaders();
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  mounted() {
    this.retrieveBooks();
    this.retrieveReaders();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  /* min-height: 547.5px; */
  min-height: 459px;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 10px;
}

.name {
  text-align: center;
  color: #000;
  margin-bottom: 20px;
  font-size: 28px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  vertical-align: middle;
}

th {
  background-color: #d0011b;
  color: white;
}

tr:hover {
  background-color: #f2f2f2;
}

td button {
  margin-right: 5px;
  background-color: #fff;
  color: #d0011b;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

td button:hover {
  color: #b10017;
  background-color: #fff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}

.pagination button {
  background-color: #d0011b;
  color: #fff;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 14px;
}
</style>
