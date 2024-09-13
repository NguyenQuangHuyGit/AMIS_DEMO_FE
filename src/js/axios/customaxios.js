import axios from "axios";
import AccountService from "@/service/account.js";
import Common from "@/js/helper/common.js";
const instance = axios.create({
    withCredentials: true,
});

instance.interceptors.request.use((config) => {
    config.headers["Accept-Language"] =
        Common.convertEnumLangFromLocalToCulture();
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    async function (error) {
        const prevRequest = error.config;
        if (error.response && error.response.status) {
            if (error.response.status === 401) {
                prevRequest.sent = true;
                await AccountService.refreshToken();
                return axios(prevRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
