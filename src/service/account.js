import BaseService from "./baseservice";
import instance from "../js/axios/customaxios.js";
import axios from "axios";
import Common from "@/js/helper/common.js";
class AccountService extends BaseService {
    /**
     * Hàm khởi tạo
     * @param {*} controllerName: Tên controller
     * Author: Quang Huy (25/02/2024)
     */
    constructor(controllerName) {
        super(controllerName);
    }

    /**
     * Hàm lấy thông tin User hiện tại
     * Author: Quang Huy (27/02/2024)
     */
    async getCurrentUser() {
        const response = await instance.get(
            `${this.host}/${this.controllerName}`
        );
        return response.data;
    }

    /**
     * Hàm gọi Api người dùng thực hiện đăng nhập
     * @param {*} userInfo: Thông tin đăng nhập
     * Author: Quang Huy (26/02/2024)
     */
    async login(data) {
        const response = await axios.post(
            `${this.host}/${this.controllerName}/Login`,
            data,
            {
                withCredentials: true,
                headers: {
                    "Accept-Language":
                        Common.convertEnumLangFromLocalToCulture(),
                },
            }
        );
        return response.data;
    }

    /**
     * Hàm gọi API lấy access token mới
     * @param {*} data: dữ liệu user
     * @returns
     * Author: Quang Huy (27/02/2024)
     */
    async refreshToken() {
        const response = await instance.post(
            `${this.host}/${this.controllerName}/RefreshToken`
        );
        return response;
    }

    /**
     * Hàm gọi API thu hồi quyền đăng nhập
     * Author: Quang Huy (27/02/2024)
     */
    async logout() {
        const response = await instance.post(
            `${this.host}/${this.controllerName}/Revoke`
        );
        return response;
    }
}

export default new AccountService("Accounts");
