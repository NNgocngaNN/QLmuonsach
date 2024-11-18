<template>
  <div>
    <AppHeader />
    <div class="container mt-3 mb-3">
      <div class="add-new"><b>Thêm sách mới</b></div>
      <div class="form">
        <form @submit.prevent="add" action="" enctype="multipart/form-data" method="post">
          <div class="form-item">
            <label class="label" for="bookTitle">Tên sách:</label><br />
            <input class="input" type="text" id="bookTitle" v-model="formData.bookTitle" />
          </div>

          <div class="form-item">
            <label class="label" for="price">Giá:</label><br />
            <input class="input" type="number" id="price" v-model="formData.price" />
          </div>

          <div class="form-item">
            <label class="label" for="quantity">Số lượng:</label><br />
            <input class="input" type="number" id="quantity" v-model="formData.quantity" />
          </div>

          <div class="form-item">
            <label class="label" for="author">Tác giả:</label><br />
            <input class="input" type="text" id="author" v-model="formData.author" />
          </div>

          <div class="form-item">
            <label class="label" for="publisherName">Tên nhà xuất bản:</label><br />
            <input class="input" type="text" id="publisherName" v-model="formData.publisherName" />
          </div>

          <div class="form-item">
            <label class="label" for="publishYear">Năm xuất bản:</label><br />
            <input class="input" type="text" id="publishYear" v-model="formData.publishYear" />
          </div>

          <div class="form-item">
            <label class="label" for="image">Hình ảnh:</label><br />
            <input type="file" id="image" @change="handleImageUpload" />
          </div>


          <button type="submit" class="btn btn-primary">Tạo</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import BookService from "@/services/admin/book.service";

export default {
  components: {
  },
  data() {
    return {
      formData: {
        id_publisher: "",
        bookTitle: "",
        price: 0,
        quantity: 0,
        thumbnail: null,
        publishYear: "",
        author: "",

      },
    };
  },

  computed: {},

  methods: {

    handleImageUpload(event) {
      const file = event.target.files[0];
      this.formData.thumbnail = file; // Lưu hình ảnh vào formData
    },
    async add() {
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
        formData.append("thumbnail", this.formData.thumbnail);
        const response = await BookService.create(this.formData);
        console.log(response);
        toast.success("Added successfully!", {
          autoClose: 1200,
        });

        setTimeout(() => {
          this.$router.push({ name: "book" });
        }, 800);
      } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Error!";
        toast.error(errorMessage, { autoClose: 3000 });
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 500px;
  height: auto;
  text-align: center;
  padding: 20px;
  background-color: #ffffff; /* Màu nền trắng giúp làm nổi bật */
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
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
  border: 1px solid #d9d9d9;
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
