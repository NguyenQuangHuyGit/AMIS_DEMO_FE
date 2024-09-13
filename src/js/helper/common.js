import Enum from "../enum/enum";

const Common = {
    /**
     * Hàm lấy mã ngôn ngữ hiện tại và chuyển đổi sang Culture tương ứng
     * Author: QuangHuy (11/03/2024)
     */
    convertEnumLangFromLocalToCulture() {
        const langCode = +window.localStorage.getItem("langCode");
        switch (langCode) {
            case Enum.langCode.VN:
                return "vi-VN";
            case Enum.langCode.EN:
                return "en-US";
            default:
                return "vi-VN";
        }
    },

    getResourceString(resource, entity, key) {
        if (resource[key]) {
            return resource[key];
        } else {
            return resource[entity][key];
        }
    },
};

export default Common;
