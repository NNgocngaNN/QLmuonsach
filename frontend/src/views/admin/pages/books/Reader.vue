<template>
  <div>
    <AppHeader />
    <div class="container mt-3 mb-3">
      <div class="page row">
        <!-- Phần trên: Danh sách người đọc -->
        <h4>Danh Sách Người Đọc</h4>

        <!-- Phần dưới: Các button và Tìm kiếm -->
        <div class="col-md-12">
          <div class="item row mt-3">
            <div class="col-md-8">
              <div class="button-group">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                  <i class="fas fa-redo"></i> Làm mới
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
                <button class="btn btn-danger" @click="searchReaders">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Phần dưới: Danh sách người đọc -->
        <div class="col-md-12 mt-3">
          <div v-for="(reader, index) in paginatedReaders" :key="reader._id">
            <div
              @click="
                activeIndex === index
                  ? (activeIndex = -1)
                  : (activeIndex = index)
              "
              class="reader-item"
              :class="{ active: activeIndex === index }"
            >
              {{ reader.fullName }}
            </div>

            <!-- Chi tiết người đọc -->
            <div v-if="activeIndex === index" class="reader-detail">
              <ReaderDetail :reader="reader" />
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
import ReaderDetail from "@/components/admin/ReaderDetail.vue";
import AppHeaderTemp from "@/components/admin/AppHeader.vue";
import ReaderService from "@/services/admin/reader.service";
import BackToTop from "@/components/admin/BackToTop.vue";

export default {
  components: {
    ReaderDetail,
    AppHeaderTemp,
    BackToTop,
  },
  data() {
    return {
      readers: [],
      activeIndex: -1,
      searchText: "",
      currentPage: 1,
      readersPerPage: 10, // Số người đọc hiển thị mỗi trang
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
      this.currentPage = 1; // Khi tìm kiếm, trở về trang đầu
    },
  },
  computed: {
    readersStrings() {
      return this.readers.map((reader) => {
        const { readerName, email, phoneNumber, registrationDate } = reader;
        return [readerName, email, phoneNumber, registrationDate]
          .join(" ")
          .toLowerCase(); // Chuyển về chữ thường
      });
    },
    filteredReaders() {
      if (!this.searchText) return this.readers;
      const searchTextLower = this.searchText.toLowerCase(); // Chuyển từ khóa tìm kiếm thành chữ thường
      return this.readers.filter(
        (reader) => reader.fullName.toLowerCase().includes(searchTextLower) // Tìm kiếm theo tên người đọc
      );
    },
    filteredReadersCount() {
      return this.filteredReaders.length;
    },
    totalPages() {
      return Math.ceil(this.filteredReadersCount / this.readersPerPage);
    },
    paginatedReaders() {
      const startIndex = (this.currentPage - 1) * this.readersPerPage;
      const endIndex = startIndex + this.readersPerPage;
      return this.filteredReaders.slice(startIndex, endIndex);
    },
  },
  methods: {
    async retrieveReaders() {
      try {
        this.readers = await ReaderService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrieveReaders();
      this.searchText = "";
      this.activeIndex = -1;
      this.currentPage = 1; // Khi làm mới, quay về trang đầu
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
  padding: 10px 20px; /* Cập nhật padding để các nút có chiều cao và chiều ngang đồng đều */
  font-size: 14px; /* Cỡ chữ đồng đều */
  text-align: center;
  min-width: 120px; /* Đảm bảo các nút có chiều rộng tương đương */
  border: 2px solid #d0011b;
  color: #d0011b;
  background-color: transparent;
  transition: all 0.3s ease; /* Thêm hiệu ứng chuyển động */
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
  justify-content: space-between;
}

/* CSS cho phần hiển thị chi tiết sách khi nhấn */
.reader-item {
  cursor: pointer;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.reader-item:hover {
  color: #d0011b;
}

.reader-item + .reader-detail {
  margin-top: 10px;
  margin-bottom: 9px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* CSS cho phần hiển thị chi tiết người đọc khi nhấn */
.reader-item {
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.reader-item:hover {
  color: #d0011b;
}

.reader-item.active {
  color: #d0011b;
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

.pagination-container button:hover {
  background-color: #bb2d3b; /* Đổi nền khi hover */
  color: white; /* Chữ và icon sẽ đổi thành màu trắng khi hover */
}

.pagination-container span {
  font-size: 16px;
}
</style>
