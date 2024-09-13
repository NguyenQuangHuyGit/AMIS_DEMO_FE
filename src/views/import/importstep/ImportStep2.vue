<template>
    <div class="record-status-info">
        <p class="valid-record">
            {{
                `${doneImport}/${data.length} ${Resource.import.main.second.validRow}`
            }}
        </p>
        <p class="invalid-record">
            {{
                `${falseImport}/${data.length} ${Resource.import.main.second.inValidRow}`
            }}
        </p>
    </div>
    <div class="table-container">
        <MTable :columns="columns" :records="data" notice :key="data">
            <template #DateOfBirth="{ record }">
                {{
                    record.DateOfBirth
                        ? formatValue.formatDate(record.DateOfBirth).result
                        : record.DateOfBirthString
                }}
            </template>
            <template #IdentityDate="{ record }">
                {{
                    record.IdentityDate
                        ? formatValue.formatDate(record.IdentityDate).result
                        : record.IdentityDateString
                }}
            </template>
            <template #Gender="{ record }">
                {{ formatValue.formatGender(record.Gender, Resource) }}
            </template>
            <template #noticeField="{ record }">
                <p
                    v-if="record.ErrorList.length === 0"
                    class="import-data-valid"
                >
                    {{ Resource.import.main.second.validStatus }}
                </p>
                <ul v-else class="import-data-error-container">
                    <li
                        v-for="(error, index) in record.ErrorList"
                        :key="index"
                        class="import-data-error"
                    >
                        {{ error }}
                    </li>
                </ul>
            </template>
        </MTable>
    </div>
    <p class="notification-error">
        {{ Resource.import.main.second.notificationError }}
        <span @click="handleGetErrorFile">{{
            Resource.import.main.second.downloadHere
        }}</span>
    </p>
</template>

<script>
import EmployeeService from "@/service/employee.js";
import NProgress from "nprogress";
export default {
    name: "TheImportStep2",
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
            columns: [
                {
                    columnName: this.Resource.table.employee.code,
                    columnField: "EmployeeCode",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.fullName,
                    columnField: "FullName",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.phoneNumber,
                    columnField: "PhoneNumber",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.address,
                    columnField: "Address",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.email,
                    columnField: "Email",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.gender,
                    columnField: "Gender",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.employee.department,
                    columnField: "DepartmentName",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.employee.position,
                    columnField: "PositionName",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.dateOfBirth,
                    columnField: "DateOfBirth",
                    columnAlign: "center",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.identityNumber,
                    columnField: "IdentityNumber",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.identityDate,
                    columnField: "IdentityDate",
                    columnAlign: "center",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.identityPlace,
                    columnField: "IdentityPlace",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.bankAccount,
                    columnField: "BankAccount",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.bankName,
                    columnField: "BankName",
                    isShow: true,
                },
                {
                    columnName: this.Resource.table.bankBranch,
                    columnField: "BankBranch",
                    isShow: true,
                },
            ],
            data: [],
            doneImport: 0,
            falseImport: 0,
        };
    },

    /**
     * Hàm chạy kiểm tra file có hợp lệ không khi component được tạo
     * Author: QuangHuy (21/01/2024)
     */
    async created() {
        if (!this.modelValue) {
            this.$router.push({
                name: "import-step1",
                params: { step: 1 },
            });
        } else {
            await this.loadValidateData();
        }
    },

    methods: {
        /**
         * Hàm lấy dữ liệu đã kiểm tra
         * Author: QuangHuy (28/01/2024)
         */
        async loadValidateData() {
            try {
                this.setLoading(true);
                // Nạp file để chuẩn bị nhập khẩu
                const formData = new FormData();
                formData.append("fileImport", this.modelValue);

                // Gọi Service thực hiện kiểm tra dữ liệu
                const data = await EmployeeService.validateImportData(formData);
                this.data = [...data.ListObject];

                // Cập nhật key Import
                this.$emit("update:keyImport", data.ImportKey);

                // Lọc ra các bản ghi hợp lệ sau khi đã validate
                this.doneImport = Array.from(this.data).filter((item) => {
                    return item.Status === true;
                }).length;
                this.falseImport = this.data.length - this.doneImport;

                // Cập nhật danh sách nhập khẩu
                this.$emit("update:validateData", this.data);
                this.setLoading(false);
            } catch (error) {
                this.setLoading(false);
                this.handleResponseErrorImport(error);
            }
        },

        /**
         * Hàm lấy file Excel chứa dữ liệu bị sai thông tin
         * Author: QuangHuy (28/01/2024)
         */
        async handleGetErrorFile() {
            try {
                // Lấy danh sách các dòng có lỗi
                let errorData = this.data.filter((item) => {
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

                // Tiến hành tải file
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
