import axios from "axios";

class CustomerGroupService {
    /**
     * Hàm gọi API lấy danh sách nhóm khách hàng
     * @returns dữ liệu danh sách các nhóm khách hàng
     * Author: QuangHuy (20/12/2023)
     */
    async getAll() {
        const response = await axios.get(
            "https://cukcuk.manhnv.net/api/v1/CustomerGroups"
        );
        return response.data;
    }
}

export default new CustomerGroupService();
