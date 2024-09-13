import Enum from "../enum/enum";

const FormatValue = {
    /**
     * Hàm chuẩn hóa về dạng dd/mm/yyyy
     * @param {*} str: biến dạng Date
     * @returns chuỗi đã qua xử lý
     * Author: QuangHuy (07/12/2023)
     */
    formatDate(date) {
        if (!date) {
            return { result: "", resultForForm: null };
        }
        let newDate = new Date(date);
        let day = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();

        if (day < 10) {
            day = `0${day}`;
        }
        if (month < 10) {
            month = `0${month}`;
        }
        let result = `${day}/${month}/${year}`;
        let resultForForm = `${year}-${month}-${day}`;
        return { result, resultForForm };
    },

    /**
     * Hàm chuẩn hóa về dạng VND
     * @param {*} debit: chuỗi tiền tệ
     * @returns chuỗi đã qua xử lý
     * Author: QuangHuy (07/12/2023)
     */
    formatDebit(debit) {
        let debitFormat = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        });
        return debitFormat.format(debit);
    },

    /**
     * Hàm chuẩn hóa chuỗi (Xóa đấu cách thừa trong chuỗi)
     * @param {*} value: giá trị chuỗi
     * @returns Chuỗi đã được chuẩn hóa
     * Author: QuangHuy (15/01/2024)
     */
    formatString(value) {
        let newVal = value.toString().trim();
        return newVal.replace(/\s{2,}/g, " ");
    },

    /**
     * Hàm bỏ dấu tiếng việt
     * @param {*} str: chuỗi
     * @returns chuỗi đã qua xử lý
     * Author: QuangHuy (07/12/2023)
     */
    removeAccents(str) {
        try {
            return str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D");
        } catch (error) {
            return str;
        }
    },

    /**
     * Hàm chuyển chuỗi thường sang PascalCase
     * @param {*} str: chuỗi
     * @returns chuỗi PascalCase
     * Author: QuangHuy (14/12/2023)
     */
    toPascalCase(str) {
        return str
            .match(
                /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
            )
            .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
            .join("");
    },

    /**
     * Hàm fomat chuỗi về dạng camelCase
     * @param {*} str: chuỗi
     * @returns chuỗi camelCase
     * Author: QuangHuy (14/12/2023)
     */
    toCamelCase(str) {
        return str
            .toLowerCase()
            .replace(/^-|[\s_]+(.)?/g, function (match, chr) {
                return chr ? chr.toUpperCase() : "";
            });
    },

    /**
     * Hàm chuyển num sang chuỗi biểu thị giới tính
     * @param {*} num: enum cần chuyển
     * @returns Chuỗi Nam || Nữ || Khác
     * Author: QuangHuy (08/12/2023)
     */
    formatGender(num, resource) {
        if (num === null) {
            return "";
        }
        switch (num) {
            case Enum.gender.male:
                return resource.gender.male;
            case Enum.gender.female:
                return resource.gender.female;
            case Enum.gender.other:
                return resource.gender.other;
            default:
                return resource.gender.other;
        }
    },
};

export default FormatValue;
