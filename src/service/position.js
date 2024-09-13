import BaseService from "./baseservice";
class PositionService extends BaseService {
    /**
     * Hàm khởi tạo
     * @param {*} controllerName: Tên controller
     * Author: Quang Huy (12/01/2024)
     */
    constructor(controllerName) {
        super(controllerName);
    }
}

export default new PositionService("Positions");
