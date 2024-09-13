import FormatValue from "./format.js";
const validateVer2 = {
    schema: null, // database phụ thuộc để validate
    errors: null, // Đỗi tượng lưu các mảng lỗi của các trường
    resource: null, // Resource App để lấy các thông báo tương ứng
    entity: null,

    /**
     * Hàm validate tất cả các trường cần Validate
     * @param {*} targetObject: Đối tượng lưu giá trị validate
     * Author: QuangHuy (14/12/2023)
     */
    validateAll(targetObject) {
        // Reset lại error khi validate
        this.errors = {};
        try {
            if (this.schema && this.resource) {
                // Lấy danh sách các trường cần Validate
                let fields = Object.keys(this.schema);
                // Lặp qua các trường để rút luật => gọi hàm kiểm tra
                fields.forEach((field) => {
                    // Lấy đối tượng lưu các luật để validate
                    let rulesOfField = this.schema[field].rules;
                    // Nếu là 1 string thì gọi required
                    if (typeof rulesOfField === "string") {
                        this.required(
                            targetObject[FormatValue.toPascalCase(field)],
                            field
                        );
                    } else {
                        // Lặp qua các rule để validate
                        for (let rule in rulesOfField) {
                            if (Object.hasOwn(this, rule)) {
                                this.entity = this.schema[field].entity;
                                this[rule](
                                    rulesOfField[rule],
                                    targetObject[
                                        FormatValue.toPascalCase(
                                            this.schema[field].name
                                        )
                                    ],
                                    field
                                );
                            }
                        }
                    }
                });
            } else {
                console.log("Chưa có resource hoặc schema!");
            }
        } catch (error) {
            console.error(error);
        }
    },

    validate(value) {
        try {
            this.errors = {};
            let newVal = "";
            if (this.schema && this.resource) {
                let rules = this.schema.rules;
                for (let rule in rules) {
                    if (Object.hasOwn(this, rule)) {
                        this.entity = this.schema.entity;
                        const result = this[rule](
                            rules[rule],
                            value,
                            this.schema.name
                        );
                        if (
                            rule === "code" &&
                            Object.hasOwn(rules[rule], "autoFill")
                        ) {
                            if (result) {
                                newVal = result;
                            }
                        }
                    }
                }
                let name = FormatValue.toPascalCase(this.schema.name);
                return { newErr: this.errors[name], newVal };
            }
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * Hàm validate trường bắt buộc nhập
     * @param {*} bool: biến boolean xác định có bắt buộc không
     * @param {*} value: giá trị của trường
     * @param {*} field: tên trường
     * Author: QuangHuy (14/12/2023)
     */
    required(bool = true, value, field) {
        try {
            let label = this.resource.form.label[field];
            if (!label && this.entity) {
                label = this.resource.form.label[this.entity][field];
            }
            let message = this.resource.validateErrorMessage.required(label);
            if (bool) {
                if (
                    value === null ||
                    value == undefined ||
                    value.trim() === ""
                ) {
                    this.updateError(field, message);
                }
            }
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * Hàm kiểm tra tính hợp lệ của email
     * @param {*} bool: biến boolean xác định có kiểm tra không
     * @param {*} value: giá trị của trường
     * @param {*} field: tên trường
     * @returns
     * Author: QuangHuy (14/12/2023)
     */
    email(bool = true, value, field) {
        try {
            let label = this.resource.form.label[field];
            if (!label && this.entity) {
                label = this.resource.form.label[this.entity][field];
            }
            let message = this.resource.validateErrorMessage.email;
            if (bool) {
                if (
                    value === null ||
                    value == undefined ||
                    value.trim() === ""
                ) {
                    return;
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(value)) {
                        return;
                    } else {
                        this.updateError(field, message);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * Hàm kiểm tra tính hợp lệ của ngày tháng
     * @param {*} bool: biến boolean xác định có kiểm tra không
     * @param {*} value: giá trị của trường
     * @param {*} field: tên trường
     * @returns
     * Author: QuangHuy (14/12/2023)
     */
    date(bool = true, value, field) {
        try {
            let label = this.resource.form.label[field];
            if (!label && this.entity) {
                label = this.resource.form.label[this.entity][field];
            }
            let message = this.resource.validateErrorMessage.date(label);
            if (bool) {
                if (!value) {
                    return;
                } else {
                    const date = new Date(value);
                    const today = new Date();
                    if (date <= today) {
                        return;
                    } else {
                        this.updateError(field, message);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * Hàm validate giá trị min của độ dài
     * @param {*} min: ngưỡng nhỏ nhất
     * @param {*} value: giá trị của trường
     * @param {*} field: tên trường
     * Author: QuangHuy (14/12/2023)
     */
    min(min, value, field) {
        try {
            let label = this.resource.form.label[field];
            if (!label && this.entity) {
                label = this.resource.form.label[this.entity][field];
            }
            let message = this.resource.validateErrorMessage.min(label, min);
            if (!value) {
                return;
            }
            if (min > 0) {
                if (value.trim().length < min) {
                    this.updateError(field, message);
                }
            }
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * Hàm validate giá trị max của độ dài
     * @param {*} min: ngưỡng lớn nhất
     * @param {*} value: giá trị của trường
     * @param {*} field: tên trường
     * Author: QuangHuy (14/12/2023)
     */
    max(max, value, field) {
        try {
            let label = this.resource.form.label[field];
            if (!label && this.entity) {
                label = this.resource.form.label[this.entity][field];
            }
            let message = this.resource.validateErrorMessage.max(label, max);
            if (!value) {
                return;
            }
            if (max > 0) {
                if (value.trim().length > max) {
                    this.updateError(field, message);
                }
            }
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * Hàm kiểm tra 1 trường có tất cả ký tự là chữ số không
     * @param {*} bool: biến boolean xác định có kiểm tra không
     * @param {*} value: giá trị của trường
     * @param {*} field: tên trường
     * @returns
     */
    digit(bool, value, field) {
        try {
            let label = this.resource.form.label[field];
            if (!label && this.entity) {
                label = this.resource.form.label[this.entity][field];
            }
            let message = this.resource.validateErrorMessage.digit(label);
            if (bool) {
                if (!value) {
                    return;
                } else {
                    const digitRegex = /^\d+$/;
                    if (digitRegex.test(value.trim())) {
                        return;
                    } else {
                        this.updateError(field, message);
                    }
                }
            }
            return true;
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * Hàm validate tính hợp lệ của một mã code bất kỳ theo option
     * @param {*} options: gồm những chọn lựa để kiểm tra prefix cũng như suffix của một mã code
     * @param {*} value: giá trị của trường
     * @param {*} field: tên trường
     * Author: QuangHuy (20/03/2024)
     */
    code(options, value, field) {
        try {
            let label = this.resource.form.label[field];
            if (!label && this.entity) {
                label = this.resource.form.label[this.entity][field];
            }

            // Nếu giá trị rỗng thì kết thúc hàm
            if (!value.trim()) {
                return;
            }
            value = value.trim();

            // Kiểm tra prefix
            let prefix = null;
            let split = "-";
            let suffixes = null;
            if (options.prefix) {
                prefix = options.prefix.trim();
                split = options.split.trim() || "-";
                const prefixLength = prefix.length + split.length;
                if (!value.startsWith(`${prefix}${split}`, 0)) {
                    let message =
                        this.resource.validateErrorMessage.code.prefix(
                            label,
                            `${prefix}${split}`
                        );
                    this.updateError(field, message);
                    return;
                }
                suffixes = value.substr(prefixLength);
            } else {
                suffixes = value;
            }

            // Kiểm tra suffixes
            const digitRegex = /^\d+$/;
            if (options.isDigit && !digitRegex.test(suffixes)) {
                let message =
                    this.resource.validateErrorMessage.code.suffixes(label);
                this.updateError(field, message);
                return;
            }

            // Tự động điền đầy đủ code nếu thiếu
            if (options.autoFill) {
                const [numberOfCharFill, charFill] = options.autoFill;
                const newSuffix = suffixes.padStart(numberOfCharFill, charFill);
                if (prefix) {
                    return `${prefix}${split}${newSuffix}`;
                }
                return newSuffix;
            }
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * Hàm tự động điền dủ độ rộng của code
     * Author: QuangHuy (20/03/2024)
     */
    autoFillCode(value, [numberOfCharFill, charFill]) {
        const newVal = value.padStart(numberOfCharFill, charFill);
        return newVal;
    },

    /**
     * Hàm cập nhật error khi validate xong
     * @param {*} field: Tên trường
     * @param {*} message: Chuỗi thông báo lỗi
     * Author: QuangHuy (14/12/2023)
     */
    updateError(field, message) {
        try {
            field = FormatValue.toPascalCase(field);
            if (this.errors[field]) {
                this.errors[field] = [...this.errors[field], message];
            } else {
                this.errors[field] = [message];
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export default validateVer2;
