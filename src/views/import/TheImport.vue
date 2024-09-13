<template>
    <div class="import-container">
        <p class="import-title">{{ stepInfo[stepValue] }}</p>
        <div class="import-layout">
            <div class="import-aside" :key="stepValue">
                <ImportAside
                    step="1"
                    :text="Resource.import.aside.first"
                    :class="{ 'active-step': stepValue === 1 }"
                />
                <ImportAside
                    step="2"
                    :text="Resource.import.aside.second"
                    :class="{ 'active-step': stepValue === 2 }"
                    v-model:data="validateData"
                />
                <ImportAside
                    step="3"
                    :text="Resource.import.aside.third"
                    :class="{ 'active-step': stepValue === 3 }"
                />
            </div>
            <div class="import-main">
                <RouterView
                    v-model="fileImport"
                    v-model:validateData="validateData"
                    v-model:keyImport="keyImport"
                />
            </div>
        </div>
        <div class="import-footer">
            <div class="import-footer-left">
                <MButton
                    :text="Resource.button.help"
                    class="m-secondary-button"
                />
            </div>
            <div class="import-footer-right" v-if="stepValue === 3">
                <MButton
                    :text="Resource.button.close"
                    class="m-secondary-button"
                    @clickBtn="closeImport"
                />
            </div>
            <div class="import-footer-right" v-else>
                <MButton
                    :text="Resource.button.cancel"
                    class="m-secondary-button"
                    @clickBtn="cancelImport"
                />
                <MButton
                    v-if="stepValue === 1"
                    :text="Resource.button.continue"
                    class="m-secondary-button"
                    @clickBtn="toNextStep"
                />
                <MButton
                    v-else
                    :text="Resource.button.begin"
                    class="m-primary-button"
                    @clickBtn="toNextStep"
                />
                <MButton
                    :disabled="!hasPrevStep"
                    :class="{ 'disable-button': !hasPrevStep }"
                    :text="Resource.button.back"
                    class="m-secondary-button"
                    @clickBtn="toPrevStep"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ImportAside from "@/components/page/import/ImportAside.vue";
import EmployeeService from "@/service/employee.js";
import { RouterView } from "vue-router";
export default {
    name: "TheImport",
    components: { ImportAside, RouterView },
    inject: [
        "showDialog",
        "addToast",
        "closeDialog",
        "setLoading",
        "handleResponseError",
    ],
    props: {
        step: {
            type: String,
            default: "1",
        },
    },
    data() {
        return {
            fileImport: null,
            stepValue: this.step * 1,
            validateData: [],
            keyImport: null,
            keyImportError: null,
            stepInfo: {
                1: this.Resource.import.stepInfo.first,
                2: this.Resource.import.stepInfo.second,
                3: this.Resource.import.stepInfo.third,
            },
        };
    },

    mounted() {
        document.title = this.Resource.title.import;
    },

    /**
     * Hàm lấy tên bước khi component được tạo
     * Author: QuangHuy (21/01/2024)
     */
    async created() {
        try {
            this.setLoading(true);
            let nextStepName = `import-step${this.step}`;
            this.$router.push({
                name: nextStepName,
                params: { step: this.step },
            });
            this.setLoading(false);
        } catch (error) {
            this.setLoading(false);
            this.handleResponseError(error);
        }
    },

    /**
     * Hàm xử lý dữ liệu khi route được update
     * Author: QuangHuy (21/01/2024)
     */
    beforeRouteUpdate(to) {
        if (to.params.step) {
            this.stepValue = to.params.step * 1;
        }
    },

    methods: {
        /**
         * Hàm chuyển đến bước tiếp theo
         * Author: QuangHuy (21/01/2024)
         */
        async toNextStep() {
            let bool = this.validateDataImport();
            if (!bool) {
                return;
            }
            let nextStepName = `import-step${this.stepValue + 1}`;
            this.$router.push({
                name: nextStepName,
                params: { step: this.stepValue + 1 },
            });
        },

        /**
         * Hàm quay về bước trước
         * Author: QuangHuy (21/01/2024)
         */
        toPrevStep() {
            let nextStepName = `import-step${this.stepValue - 1}`;
            this.$router.push({
                name: nextStepName,
                params: { step: this.stepValue - 1 },
            });
        },

        /**
         * Hàm trở về trang nhân viên
         * Author: QuangHuy (21/01/2024)
         */
        closeImport() {
            this.$router.push({
                name: "employee",
            });
        },

        /**
         * Hàm hủy thao tác nhâp khẩu và trở về trang nhân viên
         * Author: QuangHuy (03/03/2024)
         */
        async cancelImport() {
            try {
                this.setLoading(true);
                if (this.keyImport) {
                    await EmployeeService.cancelImport(this.keyImport);
                }
                this.setLoading(false);
                this.$router.push({
                    name: "employee",
                });
            } catch (error) {
                this.setLoading(false);
                this.handleResponseError(error);
            }
        },

        /**
         * Hàm kiểm tra có lỗi của file hay dữ liệu nhập khẩu không
         * @Returns True: không có lỗi || False: Có lỗi
         */
        validateDataImport() {
            // Kiểm tra xem có file hay chưa
            if (!this.fileImport) {
                this.showDialog({
                    title: this.Resource.dialog.title.fileMissing,
                    description: this.Resource.dialog.description.fileMissing,
                    type: "system-error",
                    clickYesOption: () => {
                        this.closeDialog();
                    },
                });
                return false;
            }

            // Kiểm tra xem có bản ghi nào hợp lệ không
            if (this.stepValue === 2) {
                const validData = Array.from(this.validateData).filter(
                    (item) => {
                        return item.Status === true;
                    }
                );
                if (validData.length === 0) {
                    this.showDialog({
                        title: this.Resource.dialog.title.importError,
                        description:
                            this.Resource.dialog.description.noValidData,
                        type: "system-error",
                        clickYesOption: () => {
                            this.closeDialog();
                        },
                    });
                    return false;
                }
            }

            return true;
        },

        /**
         * Hàm xử lý lỗi trả về từ API cho màn hình Import
         * @param {*} error: lỗi bắt được
         * Author: QuangHuy (28/01/2024)
         */
        handleResponseErrorImport(error) {
            // Xử lý lỗi nếu do người dùng thay đổi nột dung file mà chưa cập nhật
            if (error.code && error.code === "ERR_NETWORK") {
                this.showDialog({
                    title: this.Resource.dialog.title.fileError,
                    description:
                        this.Resource.dialog.description.fileChangeError,
                    type: "system-error",
                    clickYesOption: () => {
                        this.closeDialog();
                        this.$router.push({
                            name: "import-step1",
                            params: { step: 1 },
                        });
                    },
                });
                return;
            }

            // Trường hợp API trả về
            this.handleResponseError(error, (status, error) => {
                switch (status) {
                    case 419:
                        this.addToast(
                            this.Enum.toast.info,
                            this.Resource.toast.expiredAccessLogin
                        );
                        this.$router.push({ name: "login" });
                        return true;
                    case 400:
                        this.showDialog({
                            title: this.Resource.dialog.title.fileError,
                            description: error.response.data.UserMessage,
                            type: "system-error",
                            clickYesOption: () => {
                                this.closeDialog();
                            },
                        });
                        this.$router.push({
                            name: "import-step1",
                            params: { step: 1 },
                        });
                        return true;
                    default:
                        this.$router.push({
                            name: "import-step1",
                            params: { step: 1 },
                        });
                        return false;
                }
            });
        },
    },

    computed: {
        /**
         * Hàm kiểm tra có bước tiếp theo không
         * Author: QuangHuy (21/01/2024)
         */
        hasNextStep() {
            if (this.stepValue === 2) {
                return false;
            }
            return true;
        },

        /**
         * Hàm kiểm tra có bước trước đó không
         * Author: QuangHuy (21/01/2024)
         */
        hasPrevStep() {
            if (this.stepValue === 1) {
                return false;
            }
            return true;
        },
    },

    provide() {
        return {
            handleResponseErrorImport: this.handleResponseErrorImport,
        };
    },
};
</script>

<style src="./import.css" scoped></style>
