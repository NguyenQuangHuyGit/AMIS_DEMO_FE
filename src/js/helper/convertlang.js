import Resource from "@/js/resource/resource.js";
import Enum from "@/js/enum/enum.js";

/**
 * Hàm thay đổi resource language của App
 * @param {*} app: app VueJS
 * @param {*} num: enum LangCode
 * Author: QuangHuy (13/12/2023)
 */
function initLanguageResource(app, num = null) {
    try {
        let langCode = num;
        if (langCode === null) {
            langCode = window.localStorage.getItem("langCode");
        } else {
            window.localStorage.setItem("langCode", langCode);
        }
        switch (langCode * 1) {
            case Enum.langCode.VN:
                app.config.globalProperties.Resource = Resource.VN;
                break;
            case Enum.langCode.EN:
                app.config.globalProperties.Resource = Resource.EN;
                break;
            default:
                app.config.globalProperties.Resource = Resource.VN;
                break;
        }
        return langCode;
    } catch (error) {
        console.error(error);
    }
}

export default initLanguageResource;
