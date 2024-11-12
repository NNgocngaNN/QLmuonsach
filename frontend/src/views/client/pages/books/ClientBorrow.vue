<template>
    <div>
        <ClientAppHeader />
        <div class="container mt-3">
            <div class="add-new"><b>Mượn Sách</b></div>
            <div class="form">
                <form @submit.prevent="onSubmit">
                    <div class="form-item">
                        <label class="label" for="bookTitle">Tên sách:</label><br />
                        <input class="input" type="text" id="bookTitle" v-model="formData.bookTitle" />
                    </div>

                    <div class="form-item">
                        <label class="label" for="price">Giá:</label><br />
                        <input class="input" type="number" id="price" v-model="formData.price" />
                    </div>

                    <div class="form-item">
                        <label class="label" for="price">Số lượng:</label><br />
                        <input class="input" type="number" id="quantity" v-model="formData.quantity" />
                    </div>

                    <div class="form-item">
                        <label class="label" for="quantity">Ngày mượn:</label><br />
                        <input class="input" type="date" id="borrowDate" v-model="formData.borrowDate" />
                    </div>

                    <div class="form-item">
                        <label class="label" for="quantity">Ngày trả:</label><br />
                        <input class="input" type="date" id="returnDate" v-model="formData.returnDate" />
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
import Cookies from 'js-cookie';

export default {
    components: {
    },
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
        this.retrieve(this.$route.params.id);
    },

    methods: {
        async retrieve(bookId) {
            try {
                const token = Cookies.get('tokenUser');
                this.token = token;
                const book = await BookService.get(bookId);
                console.log(token);
                if (book) {
                    this.formData.bookTitle = book.bookTitle;
                    this.formData.price = book.price;
                    this.formData.id_book = bookId;
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

                const book = await BookService.get(this.formData.id_book); // Lấy thông tin sách từ API
                console.log("book", book)
                if (this.formData.quantity > book.quantity) { // Kiểm tra số lượng sách
                    alert('Số lượng bạn mượn vượt quá số lượng sách còn lại.');
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
                    this.formData,
                );
            } catch (error) {
                console.log(error);
            }
        },

        onSubmit() {
            this.updateBook().then(() => {
                // Sau khi mượn sách thành công, chuyển hướng
                this.$router.push('/books');
            }).catch((error) => {
                console.error('Error while borrowing book:', error);
                // Xử lý lỗi nếu cần
            });
        },
    },
};
</script>

<style scoped>
.container {
    width: 80%;
    width: 60%;
    height: 600px;
    text-align: center;
    /* margin-top: 10px; */
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.add-new {
    font-size: 30px;
    margin-top: 10px;
}

.form-item {
    text-align: left;
    padding: 10px;
}

.label {
    font-weight: bold;
}

.input {
    width: 100%;
    /* height: 40px; */
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.btn-primary{
    margin-top: 20px;
    background-color: #a3a09b;
    border: #a3a09b;
}

.btn-primary:hover{
    background-color: #6f6e6d;
}
</style>