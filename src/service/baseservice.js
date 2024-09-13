import axios from "../js/axios/customaxios.js";

class BaseService {
    host = "http://localhost:4112/api/v1";
    controllerName = null;

    constructor(controller) {
        this.controllerName = controller;
    }

    /**
     * Hàm gọi API lấy danh sách tất cả nhân viên
     * @returns Phản hồi của axios
     * Author: Quang Huy (06/01/2024)
     */
    async getAll() {
        const response = await axios.get(`${this.host}/${this.controllerName}`);
        return response.data;
    }

    /**
     * Hàm lấy thông tin 1 nhân viên theo id
     * @param {*} id: id của nhân viên
     * @returns Phản hồi của axios
     * Author: Quang Huy (06/01/2024)
     */
    async getById(id) {
        const response = await axios.get(
            `${this.host}/${this.controllerName}/${id}`
        );
        return response.data;
    }

    /**
     * Gọi Api thêm 1 bản ghi nhân viên mới
     * @param {*} data: dữ liệu nhân viên
     * @returns Phản hồi của axios
     * Author: Quang Huy (06/01/2024)
     */
    async create(data) {
        const response = await axios.post(
            `${this.host}/${this.controllerName}`,
            data
        );
        return response;
    }

    /**
     * Gọi Api sửa 1 bản ghi nhân viên
     * @param {*} data: dữ liệu nhân viên
     * @param {*} id: id của nhân viên
     * @returns Phản hồi của axios
     * Author: Quang Huy (06/01/2024)
     */
    async update(data, id) {
        const response = await axios.put(
            `${this.host}/${this.controllerName}/${id}`,
            data
        );
        return response;
    }

    /**
     * Gọi Api xóa 1 bản ghi nhân viên
     * @param {*} id: id của khách hàng
     * @returns Phản hồi của axios
     * Author: Quang Huy (06/01/2024)
     */
    async delete(id) {
        const response = await axios.delete(
            `${this.host}/${this.controllerName}/${id}`
        );
        return response;
    }

    /**
     * Hàm xóa 1 danh sách đối tượng
     * @param {*} ids: Danh sách Id đối tượng
     * @returns: Phản hồi
     * Author: QuangHuy (19/01/2024)
     */
    async deleteMutiple(ids) {
        const response = await axios({
            method: "delete",
            url: `${this.host}/${this.controllerName}`,
            data: ids,
        });
        return response;
    }
}

export default BaseService;
