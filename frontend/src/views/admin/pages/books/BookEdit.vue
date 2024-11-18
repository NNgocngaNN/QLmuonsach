<template>
  <div>
    <AppHeader />
    <div class="container mt-3">
      <div class="add-new"><b>Hiệu chỉnh sách</b></div>
      <div class="form">
        <form @submit.prevent="updateBook()">
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
            <label class="label" for="quantity">Số lượng:</label><br />
            <input
              class="input"
              type="number"
              id="quantity"
              v-model="formData.quantity"
            />
          </div>

          <div class="form-item">
            <label class="label" for="author">Tác giả:</label><br />
            <input
              class="input"
              type="text"
              id="author"
              v-model="formData.author"
            />
          </div>

          <div class="form-item">
            <label class="label" for="publisherName">Tên nhà xuất bản:</label
            ><br />
            <input
              class="input"
              type="text"
              id="publisherName"
              v-model="formData.publisherName"
            />
          </div>

          <div class="form-item">
            <label class="label" for="publishYear">Năm xuất bản:</label><br />
            <input
              class="input"
              type="text"
              id="publishYear"
              v-model="formData.publishYear"
            />
          </div>

          <div class="form-item">
            <label class="label" for="thumbnail">Ảnh:</label><br />
            <input type="file" id="thumbnail" @change="handleThumbnailChange" />
          </div>

          <button type="submit" class="btn btn-primary">Update</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import BookService from "@/services/admin/book.service";

export default {
  components: {},
  data() {
    return {
      info: "Image data is being updated",
      imageChanged: false,
      formData: {
        id_publisher: "",
        bookTitle: "",
        price: 0,
        quantity: 0,
        publishYear: "",
        author: "",
        thumbnail: null,
      },
    };
  },
  mounted() {
    this.retrieve(this.$route.params.id);
  },

  methods: {
    handleThumbnailChange(event) {
      const file = event.target.files[0];
      this.formData.thumbnail = file;
      this.imageChanged = true;
    },
    async retrieve(bookId) {
      try {
        const book = await BookService.get(bookId);
        if (book) {
          this.formData.bookTitle = book.bookTitle;
          this.formData.price = book.price;
          this.formData.quantity = book.quantity;
          this.formData.author = book.author;
          this.formData.publishYear = book.publishYear;
          this.formData.publisherName = book.publisherName;
          this.formData.publisherAddress = book.publisherAddress;
        } else {
          console.log("Book not found");
        }

        console.log(book);
      } catch (error) {
        console.log(error);
      }
    },

    async updateBook() {
      try {
        if (
          !this.formData.bookTitle ||
          !this.formData.price ||
          !this.formData.quantity ||
          !this.formData.author
        ) {
          toast.error("Please fill in all required fields.", {
            autoClose: 3000,
          });
          return;
        }

        const formData = new FormData();
        formData.append("bookTitle", this.formData.bookTitle);
        formData.append("price", this.formData.price);
        formData.append("quantity", this.formData.quantity);
        formData.append("publishYear", this.formData.publishYear); // Append the image file
        formData.append("publisherName", this.formData.publisherName);
        formData.append("publisherAddress", this.formData.publisherAddress);
        formData.append("author", this.formData.author);
        if (this.formData.thumbnail) {
          formData.append("thumbnail", this.formData.thumbnail);
        }
        const response = await BookService.update(
          this.$route.params.id,
          this.formData
        );
        console.log(response);
        alert("Book was updated");
        this.$router.push({ name: "book" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 500px;
  text-align: center;
  padding: 20px;
  background-color: #ffffff; /* Nền trắng để làm nổi bật */
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* Đổ bóng nhẹ */
  margin: 30px auto;
}

.add-new {
  text-align: center;
  color: #d0011b;
  margin-bottom: 20px;
  font-size: 28px;
}

.form-item {
  text-align: left;
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
  color: #333333;
  font-size: 16px;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: #333333;
  transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.input:focus {
  border-color: #d0011b;
  outline: none;
  box-shadow: 0 0 5px rgba(208, 1, 27, 0.2); /* Hiệu ứng tập trung */
}

input[type="file"] {
  padding: 10px;
  font-size: 14px;
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
  transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
}

.btn-primary:hover {
  background-color: #a00016;
  transform: translateY(-1px); /* Hiệu ứng nổi nhẹ */
  box-shadow: 0 3px 6px rgba(208, 1, 27, 0.2); /* Tăng đổ bóng khi hover */
}

.btn-primary:active {
  background-color: #8a0013;
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Quay lại đổ bóng nhẹ khi click */
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
