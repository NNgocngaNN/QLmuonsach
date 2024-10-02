<template>
    <div>
        <hr>
        <div class="p-1">
            <img :src="'/api/uploads' + book.thumbnail" alt="Hinh sach" class="center-image" style="max-width: 100%;" width="150px" height="200px">
        </div>
        <div class="p-1">
            <strong>Giá: </strong>
            {{book.price}} VNĐ
        </div>
        <div class="p-1">
            <strong>Số lượng: </strong>
            {{book.quantity}}
        </div>
        <div class="p-1">
            <strong>Tác giả:</strong>
            {{book.author}}
        </div>
        <div class="p-1">
            <strong>Tên nhà xuất bản: </strong>
            {{book.publisherName}}
        </div>
        <div class="p-1">
            <strong>Năm xuất bản: </strong>
            {{book.publishYear}}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        book: {type: Object, required: true},
    },
};
</script>


<style>
.center-image {
  display: block;
  margin: 0 auto;
}
</style>