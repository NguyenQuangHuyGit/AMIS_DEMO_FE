<template>
    <div class="login-overlay">
        <div class="login-container">
            <div class="login-logo"></div>
            <div class="login-controller">
                <form action="" @submit.prevent>
                    <MTextfield
                        ref="UserName"
                        :label="Resource.form.label.userName"
                        class="login-input-username"
                        v-model="userInfo.UserName"
                        v-model:errors="errors.UserName"
                        @keydown.enter.exact.prevent="handleClickLoginBtn"
                    />
                    <MTextfield
                        ref="Password"
                        :label="Resource.form.label.password"
                        class="login-input-password"
                        type="password"
                        v-model="userInfo.Password"
                        v-model:errors="errors.Password"
                        @keydown.enter.exact.prevent="handleClickLoginBtn"
                    />
                    <p class="login-fail-message" v-if="isLoginFail">
                        {{ Resource.validateErrorMessage.loginFail }}
                    </p>
                    <p
                        class="login-forgot-password"
                        @click="handleClickInCompleteFeature"
                    >
                        {{ Resource.button.forgotPass }}
                    </p>
                    <MButton
                        :text="Resource.button.login"
                        class="m-primary-button login-button"
                        @clickBtn="handleClickLoginBtn"
                    />
                    <div class="login-divide">
                        <div></div>
                        <p>{{ Resource.button.otherLoginMethod }}</p>
                        <div></div>
                    </div>
                    <div class="login-other-method">
                        <div
                            class="login-google"
                            @click="handleClickInCompleteFeature"
                        ></div>
                        <div
                            class="login-apple"
                            @click="handleClickInCompleteFeature"
                        ></div>
                        <div
                            class="login-microsoft"
                            @click="handleClickInCompleteFeature"
                        ></div>
                    </div>
                </form>
            </div>
            <p class="copyright-product">Copyright © 2012 - 2024 MISA JSC</p>
        </div>
        <div class="lang-container">
            <MButton
                :class="langFlag"
                class="lang-button m-wc-button"
                :text="Resource.standFor"
                @clickBtn="handleToggleContextMenuLang"
            />
            <MContextMenu
                v-if="isShowContextLang"
                class="contextLangMenu"
                @clickOutside="handleToggleContextMenuLang"
                :resources="contextLangResources"
            />
        </div>
    </div>
</template>

<script>
import Enum from "@/js/enum/enum";
import AccountService from "@/service/account.js";
export default {
    name: "TheLogin",
    components: {},
    inject: [
        "addToast",
        "showDialog",
        "closeDialog",
        "setLoading",
        "switchLang",
        "handleResponseError",
    ],
    props: {
        // status: String,
    },

    mounted() {
        this.$refs.UserName.focus();
        document.title = this.Resource.title.login;
        this.langCode = +window.localStorage.getItem("langCode");
        this.switchLangCode(this.langCode);
    },

    data() {
        return {
            // Dữ liệu nút chọn ngôn ngữ
            contextLangResources: [
                {
                    text: this.Resource.lang.VN,
                    func: () => {
                        this.switchLang(this.Enum.langCode.VN);
                        this.switchLangCode(this.Enum.langCode.VN);
                    },
                },
                {
                    text: this.Resource.lang.EN,
                    func: () => {
                        this.switchLang(this.Enum.langCode.EN);
                        this.switchLangCode(this.Enum.langCode.EN);
                    },
                },
            ],
            // Thông tin user
            userInfo: {
                UserName: "",
                Password: "",
            },
            // Object lưu các điều kiện và thông báo ra cho cho người dùng
            schema: {
                userName: {
                    rules: { required: true },
                    name: "userName",
                },
                password: {
                    rules: { required: true },
                    name: "password",
                },
            },
            // Mảng lưu các lỗi của form
            errors: {},
            //Trạng thái đăng nhập
            isLoginFail: false,
            // Giá trị ngôn ngũ đang chọn
            langCode: null,
            // Cờ ngôn ngữ
            langFlag: "VN",

            isShowContextLang: false,
        };
    },
    methods: {
        /**
         * Hàm xử lý khi chọn lại ngôn ngữ
         * @param {*} num: enum ngôn ngữ
         * Author: QuangHuy (26/02/2024)
         */
        switchLangCode(num) {
            switch (num) {
                case Enum.langCode.VN:
                    this.langFlag = "VN";
                    break;
                case Enum.langCode.EN:
                    this.langFlag = "EN";
                    break;
                default:
                    this.langFlag = "VN";
                    break;
            }
        },

        /**
         * Hàm xử lý khi toogle nút chọn ngôn ngữ
         * Author: QuangHuy (22/02/2024)
         */
        handleToggleContextMenuLang() {
            this.isShowContextLang = !this.isShowContextLang;
        },

        /**
         * Hàm xử lý khi nhấn vào nút đăng nhập
         * Author: QuangHuy (26/02/2024)
         */
        handleClickLoginBtn() {
            try {
                this.validate();
                let errorList = this.takeErrorList(this.errors);
                if (errorList.length > 0) {
                    this.isLoginFail = false;
                    // this.showInValidInputDialog(errorList);
                } else {
                    this.handleLogin();
                }
            } catch (error) {
                this.showSystemErrorDialog();
            }
        },

        /**
         * Hàm thực hiện đăng nhập
         * Author: QuangHuy (26/02/2024)
         */
        async handleLogin() {
            try {
                this.setLoading(true);
                const username = await AccountService.login(this.userInfo);
                window.localStorage.setItem("user", username);
                this.$store.commit("changeLoginState", true);
                this.$router.push({ name: "employee" });
            } catch (error) {
                this.$store.commit("changeLoginState", false);
                this.handleResponseError(error, this.handleApiErrorForLogin);
            } finally {
                this.setLoading(false);
            }
        },

        /**
         * Hàm validate dữ liệu trong form
         * Author: QuangHuy (26/02/2024)
         */
        validate() {
            try {
                this.errors = {};
                this.validateVer2.schema = this.schema;
                this.validateVer2.resource = this.Resource;
                this.validateVer2.validateAll(this.userInfo);
                this.errors = { ...this.errors, ...this.validateVer2.errors };
            } catch (error) {
                this.showSystemErrorDialog();
            }
        },

        /**
         * Hàm focus và ô input đầu tiền có lỗi nhập liệu
         * Author: QuangHuy (15/12/2023)
         */
        focusFirstErrorInput(errors) {
            try {
                if (this.$refs[errors[0].ref]) {
                    this.$refs[errors[0].ref].focus();
                }
            } catch (error) {
                this.showSystemErrorDialog();
            }
        },

        /**
         * Hàm xử lý và trả về danh sách các lỗi gắn với ref của các input
         * @param {*} errors: Dánh sách lỗi các trường
         * Author: QuangHuy (26/02/2024)
         */
        takeErrorList(errors) {
            try {
                let errorList = [];
                for (let field in errors) {
                    let error = errors[field];
                    if (error && error.length > 0) {
                        if (Array.isArray(error)) {
                            errorList.push({
                                error: error[0],
                                ref: field,
                            });
                        } else {
                            errorList.push({
                                error: this.Resource.dialog.description.duplidateError(
                                    error
                                ),
                                ref: field,
                            });
                        }
                    }
                }
                return errorList;
            } catch (error) {
                this.showSystemErrorDialog();
            }
        },

        /**
         * Hàm hiện dialog lỗi server, network
         * Author: QuangHuy (11/12/2023)
         */
        showSystemErrorDialog() {
            this.showDialog({
                title: this.Resource.dialog.title.systemError,
                description: this.Resource.dialog.description.systemError,
                type: "system-error",
                clickYesOption: () => {
                    this.closeDialog();
                },
            });
        },

        /**
         * Hàm hiện dialog hiện thị lỗi nhập liệu
         * @param {*} errors: Danh sách lỗi
         * Author: QuangHuy (11/12/2023)
         */
        showInValidInputDialog(errors) {
            try {
                let errorList = errors.map((item) => item.error);
                this.showDialog({
                    title: this.Resource.dialog.title.inputError,
                    errors: errorList,
                    type: "input-error",
                    clickYesOption: () => {
                        this.closeDialog();
                        this.focusFirstErrorInput(errors);
                    },
                    clickIconClose: () => {
                        this.focusFirstErrorInput(errors);
                    },
                });
            } catch (error) {
                this.showSystemErrorDialog();
            }
        },

        /**
         * Hàm xử lý lỗi API trả về
         * param {*} error: lỗi
         * Author: QuangHuy (27/02/2024)
         */
        handleApiErrorForLogin(status) {
            switch (status) {
                case 401:
                    this.isLoginFail = true;
                    return true;
                case 406:
                    this.isLoginFail = false;
                    return true;
                case 400:
                    this.isLoginFail = true;
                    return true;
                default:
                    this.isLoginFail = false;
                    return false;
            }
        },

        /**
         * Hàm xử lý khi nhấn vào các chức năng chưa hoàn thiện
         * Author: QuangHuy (28/02/2024)
         */
        handleClickInCompleteFeature() {
            this.addToast(
                this.Enum.toast.warning,
                this.Resource.toast.funcWarning
            );
        },
    },
};
</script>

<style src="./login.css"></style>
