const ValidateHelper = {
    /**
     * Hàm thực hiện validate dữ liệu truyền vào
     * @param {*} rules: các luật được sử dụng để validate
     * @param {*} messages: các thông báo lỗi tương ứng với các lỗi
     * @param {*} value: giá trị cần được validate
     * @returns Danh sách các lỗi nếu có
     */
    validate(rules, messages, value) {
        try {
            let errors = [];
            if (Array.isArray(rules)) {
                rules.forEach((rule) => {
                    if (Object.hasOwn(this, rule)) {
                        let error = this[rule](value, messages[rule]);
                        if (error) {
                            errors.push(error);
                        }
                    }
                });
            } else {
                let error = this[rules](value, messages[rules]);
                if (error) {
                    errors.push(error);
                }
            }
            return errors;
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * Hàm kiểm tra dữ liệu có để trống không
     * @param {*} value: dữ liệu của trường
     * @param {*} message: thông báo lỗi
     * @returns
     */
    required(value, message) {
        let error = "";
        if (value === "" || value === null || value === undefined) {
            error = message;
        }
        return error;
    },
};

export default ValidateHelper;
