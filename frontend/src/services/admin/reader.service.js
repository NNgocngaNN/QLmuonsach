import createApiClient from "./api.service";

class ReaderService {
  constructor(baseUrl = "/api/admin/reader") {
    this.apiClient = createApiClient(baseUrl);
  }

  // Phương thức lấy tất cả các đọc giả
  async getAll() {
    try {
      const response = await this.apiClient.get("/");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đọc giả:", error);
      throw error; // Ném lỗi để có thể bắt ở nơi gọi
    }
  }
}

export default new ReaderService();
