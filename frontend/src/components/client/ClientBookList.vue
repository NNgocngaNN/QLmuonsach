<template>
  <div class="container">
    <div class="row">
      <div
        v-for="book in books"
        :key="book._id"
        class="col-md-3 col-sm-6 mb-4"  
        @click="goToBookDetail(book._id)"
      >
        <div class="book-item">
          <img :src="'/api/uploads/' + book.thumbnail" alt="Book Image" class="img-fluid" />
          <div class="book-details">
            <p class="ellipsis">{{ book.bookTitle }}</p>
            <p class="author">{{ book.author }}</p>
            <p class="price">{{ formatPrice(book.price) }} VND</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    books: Array,
  },
  methods: {
    goToBookDetail(bookId) {
      this.$router.push({ name: 'book.detail', params: { id: bookId } });
    },
    formatPrice(price) {
      return price.toLocaleString(); // Format the price
    }
  },
};
</script>

<style scoped>
.book-item {
  padding: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 2px solid #fff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.502);
}

.book-item:hover {
  border: 2px solid #f5f5f5;
  box-shadow: 0 0 6px rgba(155, 155, 155, 0.5);
}

.book-item img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.book-details {
  text-align: left;
}

.author {
  color: #666;
}

.price {
  color: #d0011b;
  margin-top: 15px;
  font-weight: bold;
}

.ellipsis {
  margin: 0;
}

.ellipsis {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
