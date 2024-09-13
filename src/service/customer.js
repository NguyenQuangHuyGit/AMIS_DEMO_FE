import axios from "axios";
class CustomerService {
    host = "https://cukcuk.manhnv.net/api/v1";

    /**
     * Hàm gọi API lấy danh sách tất cả khách hàng
     * @returns Phản hồi của axios
     * Author: Quang Huy (30/11/2023)
     */
    async getAll() {
        const response = await axios.get(`${this.host}/Customers`);
        return response.data;
    }

    /**
     * Hàm lấy thông tin 1 khách hàng theo id
     * @param {*} id: id của khách hàng
     * @returns Phản hồi của axios
     * Author: Quang Huy (17/12/2023)
     */
    async getById(id) {
        const response = await axios.get(`${this.host}/Customers/${id}`);
        return response.data;
    }

    /**
     * Hàm gọi API lấy mã khách hàng mới
     * @param {*} callback: hàm được gọi sau khi lấy được dữ liệu
     * @returns Phản hồi của axios
     * Author: Quang Huy (30/11/2023)
     */
    async getNewCode() {
        const response = await axios.get(
            `${this.host}/Customers/NewCustomerCode`
        );
        return response.data;
    }

    /**
     * Gọi Api thêm 1 bản ghi khách hàng mới
     * @param {*} data: dữ liệu khách hàng
     * @returns Phản hồi của axios
     * Author: Quang Huy (6/12/2023)
     */
    async create(data) {
        const response = await axios.post(`${this.host}/Customers`, data);
        return response;
    }

    /**
     * Gọi Api sửa 1 bản ghi khách hàng
     * @param {*} data: dữ liệu khách hàng
     * @param {*} id: id của khách hàng
     * @returns Phản hồi của axios
     * Author: Quang Huy (18/12/2023)
     */
    async update(data, id) {
        const response = await axios.put(`${this.host}/Customers/${id}`, data);
        return response;
    }

    /**
     * Gọi Api xóa 1 bản ghi khách hàng
     * @param {*} id: id của khách hàng
     * @returns Phản hồi của axios
     * Author: Quang Huy (18/12/2023)
     */
    async delete(id) {
        const response = await axios.delete(`${this.host}/Customers/${id}`);
        return response;
    }
}

export default new CustomerService();
