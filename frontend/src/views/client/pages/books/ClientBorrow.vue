<template>
  <div>
    <ClientAppHeader />
    <div class="container mt-3 mb-3">
      <div class="add-new"><b>Mượn Sách</b></div>
      <div class="form">
        <form @submit.prevent="onSubmit">
          <div class="form-item">
            <label class="label" for="bookTitle">Tên sách:</label><br />
            <input
              class="input"
              type="text"
              id="bookTitle"
              v-model="formData.bookTitle"
            />
          </div>

          <div class="form-item">
            <label class="label" for="price">Giá:</label><br />
            <input
              class="input"
              type="number"
              id="price"
              v-model="formData.price"
            />
          </div>

          <div class="form-item">
            <label class="label" for="price">Số lượng:</label><br />
            <input
              class="input"
              type="number"
              id="quantity"
              v-model="formData.quantity"
            />
          </div>

          <div class="form-item">
            <label class="label" for="quantity">Ngày mượn:</label><br />
            <input
              class="input"
              type="date"
              id="borrowDate"
              v-model="formData.borrowDate"
            />
          </div>

          <div class="form-item">
            <label class="label" for="quantity">Ngày trả:</label><br />
            <input
              class="input"
              type="date"
              id="returnDate"
              v-model="formData.returnDate"
            />
          </div>
          <button type="submit" class="btn btn-primary">Mượn Sách</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import ClientAppHeader from "@/components/client/ClientAppHeader.vue";
import BookService from "@/services/client/book.service";
import readerService from "@/services/client/reader.service";
import Cookies from "js-cookie";

export default {
  components: {},
  data() {
    return {
      formData: {
        id_book: "",
        bookTitle: "",
        price: 0,
        quantity: 1,
        borrowDate: "",
        returnDate: "",
      },
      token: "",
    };
  },
  mounted() {
    // Tự động đặt ngày mượn là ngày hiện tại
    const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại theo định dạng 'YYYY-MM-DD'
    this.formData.borrowDate = today; // Đặt ngày mượn là ngày hiện tại

    // Lấy thông tin sách từ API nếu cần
    this.retrieve(this.$route.params.id);
  },

  methods: {
    async retrieve(bookId) {
      try {
        const token = Cookies.get("tokenUser");
        this.token = token;
        const book = await BookService.get(bookId);
        console.log(token);
        if (book) {
          this.formData.bookTitle = book.bookTitle;
          this.formData.price = book.price;
          this.formData.id_book = bookId;
        } else {
          console.log("Sách không tìm thấy");
        }

        console.log(book);
      } catch (error) {
        console.log(error);
      }
    },

    async updateBook() {
      try {
        const book = await BookService.get(this.formData.id_book); // Lấy thông tin sách từ API
        console.log("book", book);
        if (this.formData.quantity > book.quantity) {
          // Kiểm tra số lượng sách
          alert("Số lượng bạn mượn vượt quá số lượng sách còn lại.");
          return; // Dừng phương thức updateBook()
        }
        const formData = new FormData();
        formData.append("id_book", this.formData.id_book);
        formData.append("price", this.formData.quantity);
        formData.append("borrowDate", this.formData.borrowDate);
        formData.append("returnDate", this.formData.returnDate);
        console.log(this.formData);
        const response = await readerService.updateBorrow(
          this.token,
          this.formData
        );
      } catch (error) {
        console.log(error);
      }
    },

    onSubmit() {
      // Kiểm tra xem ngày trả có nhỏ hơn ngày mượn không
      const borrowDate = new Date(this.formData.borrowDate);
      const returnDate = new Date(this.formData.returnDate);

      // Nếu ngày trả chưa được nhập, tự động đặt là ngày 31 tháng 12 của năm hiện tại
      if (!this.formData.returnDate) {
        const lastDayOfYear = new Date(borrowDate.getFullYear(), 11, 31); // Lấy ngày 31 tháng 12 của năm hiện tại
        this.formData.returnDate = lastDayOfYear.toISOString().split('T')[0]; // Định dạng thành 'YYYY-MM-DD'
      }

      // Kiểm tra nếu ngày trả trước ngày mượn
      if (returnDate < borrowDate) {
        alert("Ngày trả không được nhỏ hơn ngày mượn.");
        return; // Dừng việc gửi form nếu kiểm tra không hợp lệ
      }

      this.updateBook()
        .then(() => {
          // Sau khi mượn sách thành công, chuyển hướng tới trang sách
          this.$router.push("/books");
        })
        .catch((error) => {
          console.error("Lỗi khi mượn sách:", error);
          // Xử lý lỗi nếu cần
        });
    },
  },
};
</script>



<style scoped>
.container {
  width: 60%;
  height: auto;
  text-align: center;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 30px;
}

.add-new {
  text-align: center;
  color: #d0011b;
  margin-bottom: 20px;
  font-size: 28px;
}

.form-item {
  text-align: left;
  padding: 15px 0;
}

.label {
  font-weight: bold;
  color: #333333;
  font-size: 16px;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  font-size: 14px;
  color: #333333;
  transition: border-color 0.3s ease-in-out;
}

.input:focus {
  border-color: #d0011b;
  outline: none;
  box-shadow: 0 0 5px rgba(208, 1, 27, 0.3);
}

.btn-primary {
  margin-top: 20px;
  background-color: #d0011b;
  border: 1px solid #d0011b;
  color: #ffffff;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
}

.btn-primary:hover {
  background-color: #a00016;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(208, 1, 27, 0.3);
}

.btn-primary:active {
  background-color: #8a0013;
  transform: translateY(0);
  box-shadow: none;
}

@media (max-width: 768px) {
  .container {
    width: 90%;
  }

  .add-new {
    font-size: 28px;
  }
}
</style>
