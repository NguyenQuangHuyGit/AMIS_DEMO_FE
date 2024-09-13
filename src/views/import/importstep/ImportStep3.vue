<template>
    <div class="import-result">
        <p class="import-result-title">
            {{ Resource.import.main.third.title }}
        </p>
        <p class="import-result-download">
            {{ Resource.import.main.third.notificationSuccess }}
            <span @click="handleDownloadResultImport">{{
                Resource.import.main.third.downloadHere
            }}</span>
        </p>
        <ul class="import-result-container">
            <li class="import-result-done">
                {{ Resource.import.main.third.doneResult
                }}<span>{{ doneImport }}</span>
            </li>
            <li class="import-result-false">
                {{ Resource.import.main.third.falseResult
                }}<span>{{ falseImport }}</span>
            </li>
        </ul>
        <p class="notification-error">
            {{ Resource.import.main.second.notificationError }}
            <span @click="handleGetErrorFile">{{
                Resource.import.main.second.downloadHere
            }}</span>
        </p>
    </div>
</template>

<script>
import EmployeeService from "@/service/employee.js";
import NProgress from "nprogress";
export default {
    name: "TheImportStep3",
    components: {},
    inject: [
        "showDialog",
        "addToast",
        "closeDialog",
        "setLoading",
        "handleResponseErrorImport",
    ],
    props: {
        modelValue: File,
        validateData: Array,
        keyImport: String,
    },

    data() {
        return {
            ids: [],
            doneImport: 0,
            falseImport: 0,
        };
    },

    /**
     * Hàm chạy kiểm tra file có hợp lệ không khi component được tạo
     * Author: QuangHuy (21/01/2024)
     */
    async created() {
        if (!this.modelValue || this.validateData.lenght === 0) {
            this.$router.push({
                name: "import-step1",
                params: { step: 1 },
            });
        } else {
            await this.handleImportData();
        }
    },

    methods: {
        /**
         * Hàm xử lý nhập khẩu danh sách nhân viên hợp lệ
         * Author: QuangHuy (28/01/2024)
         */
        async handleImportData() {
            try {
                this.setLoading(true);
                this.ids = await EmployeeService.importEmployees(
                    this.keyImport
                );
                this.doneImport = this.ids.length;
                this.falseImport = this.validateData.length - this.doneImport;
                this.setLoading(false);
            } catch (error) {
                this.setLoading(false);
                this.handleResponseErrorImport(error);
            }
        },

        /**
         * Hàm xử lý click vào link lấy danh sách nhân viên nhập khẩu thành công
         * Author: QuangHuy (28/01/2024)
         */
        async handleDownloadResultImport() {
            try {
                if (this.ids.lenght !== 0) {
                    this.addToast(
                        this.Enum.toast.info,
                        this.Resource.toast.downloadBegin
                    );
                    NProgress.start();
                    await EmployeeService.getSuccessFileImportData(this.ids);
                    NProgress.done();
                }
            } catch (error) {
                NProgress.done();
                this.handleResponseErrorImport(error);
            }
        },

        /**
         * Hàm lấy file Excel chứa dữ liệu bị sai thông tin
         * Author: QuangHuy (28/01/2024)
         */
        async handleGetErrorFile() {
            try {
                let errorData = this.validateData.filter((item) => {
                    return item.Status === false;
                });

                // Nếu không có dòng nào không hợp lệ thì thông báo cho người dùng
                if (errorData.length === 0) {
                    this.showDialog({
                        title: this.Resource.dialog.title.noDataExport,
                        description:
                            this.Resource.dialog.description
                                .noErrorDataDownload,
                        type: "system-error",
                        clickYesOption: () => {
                            this.closeDialog();
                        },
                    });
                    return;
                }

                // Bắt đầu tải
                this.addToast(
                    this.Enum.toast.info,
                    this.Resource.toast.downloadBegin
                );
                NProgress.start();
                await EmployeeService.getErrorFileExcel(Array.from(errorData));
                NProgress.done();
            } catch (error) {
                NProgress.done();
                this.handleResponseErrorImport(error);
            }
        },
    },
};
</script>

<style src="../import.css" scoped></style>
