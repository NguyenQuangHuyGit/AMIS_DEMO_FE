<template>
    <div class="container" :key="langCode">
        <RouterView name="public" />
        <Loading v-if="isLoading"></Loading>
        <MDialog
            v-if="dialog.isShow"
            v-model:isShow="dialog.isShow"
            :title="dialog.title"
            :description="dialog.description"
            :type="dialog.type"
            :errors="dialog.errors"
            :isNoBtn="dialog.isNoBtn"
            :newPrimaryText="dialog.newPrimaryText"
            @closeDialog="dialog.clickIconClose"
            @clickPrimaryButton="dialog.clickYesOption"
            @clickSecondaryButton="dialog.clickCancelOption"
            @clickNoButton="dialog.clickNoOption"
        ></MDialog>
        <MToastContainer ref="toast"></MToastContainer>
    </div>
</template>

<script>
import { RouterView } from "vue-router";
import initLanguageResource from "./js/helper/convertlang.js";
// import NProgress from "nprogress";
// import AccountService from "@/service/account.js";
import app from "./main.js";
export default {
    name: "App",
    components: { RouterView },
    data() {
        return {
            // Ngôn ngữ
            langCode: null,
            // Trạng thái load
            isLoading: false,
            // Các thông tin của Dialog
            dialog: {
                isShow: false,
                title: "",
                description: "",
                errors: [],
                type: "",
                isNoBtn: false,
                clickYesOption: null,
                clickCancelOption: null,
                clickIconClose: null,
                clickNoOption: null,
                callback: null,
                newPrimaryText: null,
            },
        };
    },

    created() {
        // Lấy giá trị ban đầu của language code
        this.langCode = +window.localStorage.getItem("langCode");
    },

    methods: {
        /**
         * Hàm thay đổi ngôn ngữ App
         * @param {*} num: enum langCode
         * Author: QuangHuy (13/12/2023)
         */
        switchLang(num) {
            try {
                this.langCode = num;
                window.localStorage.removeItem("column");
                initLanguageResource(app, num);
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm thay đổi trạng thái load của trang
         * @param {*} bool: biến xác định trạng thái loading
         * Author: QuangHuy (13/12/2023)
         */
        setLoading(bool) {
            this.isLoading = bool;
        },

        /**
         * Hàm hiện Dialog
         * @param {*} param0: Các thông tin của 1 dialog
         * Author: QuangHuy (13/12/2023)
         */
        showDialog({
            title,
            description,
            errors,
            type,
            isNoBtn = false,
            clickYesOption,
            clickCancelOption,
            clickIconClose,
            clickNoOption,
            callback,
            newPrimaryText,
        }) {
            this.dialog = {
                ...this.dialog,
                title,
                description,
                errors,
                type,
                isNoBtn,
                clickYesOption,
                clickCancelOption,
                clickIconClose,
                clickNoOption,
                callback,
                newPrimaryText,
                isShow: true,
            };
        },

        /**
         * Hàm đóng Dialog
         * Author: QuangHuy (13/12/2023)
         */
        closeDialog() {
            this.dialog.isShow = false;
        },

        /**
         * Hàm thêm mới 1 Toast Message
         * @param {*} type: Kiểu toast
         * @param {*} title: Tiêu đề của toast
         * Author: QuangHuy (13/12/2023)
         */
        addToast(type, title) {
            this.$refs.toast.addToast(type, title);
        },

        /**
         * Hàm xử lý lỗi API trả về
         * param {error}: Lỗi trả về
         * param {callbacks}: mảng callback có status làm tham số xử lý các trường hợp khác
         * Author: QuangHuy (27/02/2024)
         */
        handleResponseError(error, callback) {
            console.log(error);
            // Hiện thông báo nếu là lỗi phát sinh trong mã nguồn
            if (!error.response || !error.response.status) {
                this.showDialog({
                    title: this.Resource.dialog.title.systemError,
                    description: this.Resource.dialog.description.systemError,
                    type: "system-error",
                    clickYesOption: () => {
                        this.closeDialog();
                    },
                });
            } else {
                // Lấy ra mã trạng thái API trả về
                const status = error.response.status;

                // Set lại trạng thái bảo về route
                // if (status === 419) {
                //     this.$store.commit("changeLoginState", false);
                // }

                // Gọi callback nếu có
                if (typeof callback === "function") {
                    if (callback(status, error)) {
                        return;
                    }
                }

                // Xử lý theo từng trạng thái API trả về tương ứng
                switch (status) {
                    case 419:
                        this.$store.commit("changeLoginState", false);
                        this.$router.push({ name: "login" });
                        break;
                    default:
                        this.showDialog({
                            title: this.Resource.dialog.title.systemError,
                            description:
                                this.Resource.dialog.description.systemError,
                            type: "system-error",
                            clickYesOption: () => {
                                this.closeDialog();
                            },
                        });
                        break;
                }
            }
        },
    },
    watch: {
        "dialog.isShow"(newVal) {
            if (!newVal) {
                if (
                    this.dialog.callback &&
                    typeof this.dialog.callback === "function"
                ) {
                    this.dialog.callback();
                }
            }
        },
    },
    provide() {
        return {
            addToast: this.addToast,
            switchLang: this.switchLang,
            setLoading: this.setLoading,
            showDialog: this.showDialog,
            closeDialog: this.closeDialog,
            handleResponseError: this.handleResponseError,
        };
    },
};
</script>

<style src="./css/main.css"></style>
