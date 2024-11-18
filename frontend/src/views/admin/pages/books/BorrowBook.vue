<template>
  <div>
    <AppHeader />
    <div class="container mt-3">
      <h4>Danh Sách Mượn Của Người Đọc</h4>
      <!-- Tìm kiếm theo tên người đọc -->
      <div class="input-group">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm theo tên người đọc"
          class="form-control mb-4"
        />
      </div>

      <div v-for="(reader, readerIndex) in filteredReaders" :key="readerIndex">
        <template v-if="reader.borrow.length > 0">
          <h4 class="reader-name">{{ reader.fullName }}</h4>
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
                v-for="(borrowedBook, bookIndex) in reader.borrow"
                :key="bookIndex"
              >
                <td>{{ bookIndex + 1 }}</td>
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
                    @click="statusBook(reader, borrowedBook, 'accepted')"
                    class="btn btn-success"
                    :disabled="
                      borrowedBook.status === 'returned' ||
                      borrowedBook.status === 'accepted' ||
                      borrowedBook.status === 'cancelled' ||
                      borrowedBook.status === 'refused'
                    "
                  >
                    Duyệt
                  </button>
                  <button
                    @click="statusBook(reader, borrowedBook, 'refused')"
                    class="btn btn-danger"
                    :disabled="
                      borrowedBook.status === 'returned' ||
                      borrowedBook.status === 'accepted' ||
                      borrowedBook.status === 'cancelled' ||
                      borrowedBook.status === 'refused'
                    "
                  >
                    Từ chối
                  </button>
                  <button
                    @click="deleteBook(reader, borrowedBook)"
                    class="btn btn-danger"
                    :disabled="
                      borrowedBook.status !== 'returned' &&
                      borrowedBook.status !== 'cancelled' &&
                      borrowedBook.status !== 'refused'
                    "
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>

      <BackToTop />
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/admin/AppHeader.vue";
import BookService from "@/services/admin/book.service";
import EmployeeService from "@/services/admin/employee.service";

export default {
  components: {
    AppHeader,
  },
  data() {
    return {
      books: [],
      readers: [],
      searchQuery: "", // Biến chứa giá trị tìm kiếm
    };
  },
  computed: {
    // Computed property để lọc danh sách người đọc theo tên
    filteredReaders() {
      return this.readers.filter((reader) => {
        return reader.fullName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
      });
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
        this.readers = await EmployeeService.getReaders();
      } catch (error) {
        console.log(error);
      }
    },
    async statusBook(reader, borrowedBook, status) {
      try {
        const response = await EmployeeService.statusBook(
          reader._id,
          borrowedBook.id_book,
          status
        );
        // Refresh data after changing status
        await this.retrieveReaders();
        await this.retrieveBooks();
      } catch (error) {
        console.log(error);
      }
    },
    async deleteBook(reader, borrowedBook) {
      try {
        // Kiểm tra nếu trạng thái là "returned" hoặc "cancelled" trước khi xóa
        if (
          borrowedBook.status === "returned" ||
          borrowedBook.status === "cancelled" ||
          borrowedBook.status === "refused"
        ) {
          await EmployeeService.deleteBorrowedBook(
            reader._id,
            borrowedBook.id_book
          );
          this.retrieveBooks(); // Cập nhật lại danh sách sách
          await this.retrieveReaders(); // Cập nhật lại danh sách người đọc
        } else {
          console.log(
            "Chỉ có thể xóa khi trạng thái là 'returned' hoặc 'cancelled'."
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    getBookName(bookId) {
      const book = this.books.find((book) => book._id === bookId);
      return book ? book.bookTitle : "Unknown";
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
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 10px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

h4 {
  margin-bottom: 20px;
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

.btn-success {
  color: #6fd97b;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-success:hover {
  color: #57b761;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 14px;
}

.reader-name {
  color: #333; /* Màu chữ tối */
  font-size: 19px; /* Kích thước chữ */
  margin-bottom: 10px; /* Khoảng cách dưới */
  text-decoration: underline; /* Thêm gạch dưới */
  font-weight: bold;
}

td button:disabled {
  background-color: #fff;
  color: #666;
  cursor: not-allowed;
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
</style>
