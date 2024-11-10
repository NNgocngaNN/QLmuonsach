<template>
  <button v-show="isVisible" class="back-to-top" @click="scrollToTop">
    <i class="fas fa-arrow-up"></i>
  </button>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    checkScroll() {
      this.isVisible = window.scrollY > 155;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.checkScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.checkScroll);
  },
};
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  background-color: #d0011b; /* Màu nền đỏ */
  color: white; /* Màu icon trắng */
  border: none;
  border-radius: 50%; /* Tạo dạng tròn */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s;
}
.back-to-top:hover {
  background-color: #a80016; /* Màu nền khi hover */
}
</style>
