<template>
  <div class="book-details">
    <div class="image-container">
      <img
        class="book-image"
        :src="'/api/uploads/' + book.thumbnail"
        alt="Hình sách"
      />
    </div>
    <div class="content-container">
      <div class="p-1">
        <strong>Tên sách:</strong>
        {{ book.bookTitle }}
      </div>
      <div class="p-1">
        <strong>Giá: </strong>
        {{ book.price.toLocaleString() }} VNĐ
      </div>
      <div class="p-1">
        <strong>Số lượng: </strong>
        {{ book.quantity }}
      </div>
      <div class="p-1">
        <strong>Tác giả:</strong>
        {{ book.author }}
      </div>
      <div class="p-1">
        <strong>Tên nhà xuất bản:</strong>
        {{ book.publisherName }}
      </div>
      <div class="p-1">
        <strong>Năm xuất bản:</strong>
        {{ book.publishYear }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    book: { type: Object, required: true },
  },
};
</script>

<style>
.book-details {
  display: flex;
  align-items: center;
  gap: 20px;
}

.image-container {
  flex-shrink: 0;
  max-width: 250px;
  width: 100%;
}

.book-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>