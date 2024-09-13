import instance from "../js/axios/customaxios.js";
import BaseService from "./baseservice.js";
class EmployeeService extends BaseService {
    /**
     * Hàm khởi tạo
     * @param {*} controllerName: Tên controller
     * Author: Quang Huy (12/01/2024)
     */
    constructor(controllerName) {
        super(controllerName);
    }

    /**
     * Hàm lấy danh sách nhân viên theo chuỗi tìm kiếm và phân trang
     * @param {*} pageSize: Số bản ghi trong 1 trang
     * @param {*} pageNumber: Số trang
     * @param {*} fillterString: Chuỗi tìm kiếm
     * @returns Danh sách nhân viên tương ứng
     * Author: Quang Huy (08/01/2024)
     */
    async getFillter(pageSize, pageNumber, fillterString) {
        let api = `${this.host}/${this.controllerName}/Fillter?pageSize=${pageSize}&pageNumber=${pageNumber}`;
        if (fillterString) {
            api = `${api}&fillterString=${fillterString}`;
        }
        const response = await instance.get(api);
        return response.data;
    }

    /**
     * Hàm gọi API lấy mã nhân viên mới
     * @param {*} callback: hàm được gọi sau khi lấy được dữ liệu
     * @returns Phản hồi của axios
     * Author: Quang Huy (06/01/2024)
     */
    async getNewCode() {
        const response = await instance.get(
            `${this.host}/${this.controllerName}/NewEmployeeCode`
        );
        return response.data;
    }

    /**
     * Hàm gửi API nhân file và xử lý dữ liệu nhập khẩu
     * @param {*} file: file Excel muốn nhâp khẩu
     * @returns: Dữ liệu trả về
     * Author: Quang Huy (22/01/2024)
     */
    async validateImportData(file) {
        const response = await instance.post(
            `${this.host}/${this.controllerName}/ValidateExcel`,
            file,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            }
        );
        return response.data;
    }

    /**
     * Hàm lấy file Excel chứa dữ liệu nhân viên sai
     * @param {*} data: dữ liệu nhân viên sai
     * Author: QuangHuy (28/01/2024)
     */
    async getErrorFileExcel(data) {
        const response = await instance({
            method: "post",
            url: `${this.host}/${this.controllerName}/ErrorFile`,
            data: data,
            responseType: "blob",
            withCredentials: true,
        });
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "DanhSachNhanVienBiLoi";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Hàm download file xuất khẩu danh sách Nhân viên
     * @returns Dữ liệu trả về
     * Author: Quang Huy (22/01/2024)
     */
    async exportAllEmployeeData() {
        const response = await instance.get(
            `${this.host}/${this.controllerName}/Export`,
            {
                responseType: "blob",
            }
        );
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        const link = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        link.href = href;
        link.download = "DanhSachNhanVien";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(href);
    }

    /**
     * Hàm download file xuất khẩu danh sách Nhân viên đã chọn
     * params {ids}: danh sách id nhân viên muốn xuất khẩu
     * Author: Quang Huy (06/03/2024)
     */
    async exportSelectedEmployeeData(ids) {
        const response = await instance.post(
            `${this.host}/${this.controllerName}/Export`,
            ids,
            {
                responseType: "blob",
            }
        );
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        const link = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        link.href = href;
        link.download = "DanhSachNhanVien";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(href);
    }

    /**
     * Hàm lấy file Excel mẫu
     * Author: Quang Huy (22/01/2024)
     */
    async getExampleFileExcel() {
        const response = await instance.get(
            `${this.host}/${this.controllerName}/ExampleFile`,
            {
                responseType: "blob",
            }
        );
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        const link = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        link.href = href;
        link.download = "DanhSachNhanVien";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(href);
    }

    /**
     * Hàm nhập khẩu dữ liệu nhân viên đã kiểm tra
     * @param {*} data: dữ liệu nhân viên
     * @returns Dữ liệu nhân viên API trả về
     * Author: Quang Huy (22/01/2024)
     */
    async importEmployees(key) {
        const response = await instance({
            method: "post",
            url: `${this.host}/${this.controllerName}/Import/${key}`,
        });
        return response.data;
    }

    /**
     * Hàm gửi yêu cầu hủy phiên nhập khẩu dữ liệu
     * Author: Quang Huy (03/03/2024)
     */
    async cancelImport(key) {
        const response = await instance({
            method: "delete",
            url: `${this.host}/${this.controllerName}/Import/${key}`,
        });
        return response.data;
    }

    /**
     * Hàm Lấy file chứa các bản ghi nhập khẩu thành công
     * @param {*} data: danh sách Id của bản ghi thành công
     * @returns
     * Author: Quang Huy (22/01/2024)
     */
    async getSuccessFileImportData(data) {
        const response = await instance({
            method: "post",
            url: `${this.host}/${this.controllerName}/ImportSuccess`,
            data: data,
            responseType: "blob",
            withCredentials: true,
        });
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "DanhSachNhanVien";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default new EmployeeService("Employees");
