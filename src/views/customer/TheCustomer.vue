<template>
    <div class="main-top">
        <div class="main-top-title">
            <p>{{ Resource.page.customer.title }}</p>
        </div>
        <div class="main-top-action">
            <MButton
                :text="this.Resource.button.add"
                class="m-wc-button"
                @clickBtn="showFormAdd"
            ></MButton>
        </div>
    </div>
    <div class="main-body">
        <div class="table-toolbar">
            <div class="table-toolbar-left">
                <p>
                    {{ this.Resource.page.selectedRecord }}
                    <strong class="total-checked">{{
                        selectedSet.size
                    }}</strong>
                </p>
                <MButton
                    class="m-secondary-button btn-cancel"
                    :text="this.Resource.button.cancelSelect"
                    v-show="selectedSet.size > 0"
                    @clickBtn="handleCancelSelect"
                ></MButton>
                <MButton
                    class="m-wc-button btn-delete"
                    :text="this.Resource.button.deleteAll"
                    v-show="selectedSet.size > 0"
                    @clickBtn="handleDeleteAllSelected"
                ></MButton>
            </div>
            <div class="table-toolbar-right">
                <MButton
                    class="m-icon-button btn-import"
                    @clickBtn="handelImportExcel"
                    :title="this.Resource.tooltip.importExBtn"
                ></MButton>
                <MButton
                    class="m-icon-button btn-refresh"
                    @clickBtn="reloadData"
                    :title="this.Resource.tooltip.refreshBtn"
                ></MButton>
                <!-- <div class="menu-col">
                    <MButton class="m-icon-button btn-setting-column" />
                    <ColumnMenu />
                </div> -->
            </div>
        </div>
        <div class="table-container">
            <MTable
                :columns="columns"
                keyRecord="CustomerId"
                checkbox
                action
                v-model:selectedSet="selectedSet"
                :records="records"
                v-model:isCheckAll="isCheckAll"
            >
                <template #DateOfBirth="{ record }">
                    {{ formatValue.formatDate(record.DateOfBirth).result }}
                </template>
                <template #Gender="{ record }">
                    {{ formatValue.formatGender(record.Gender, Resource) }}
                </template>
                <template #DebitAmount="{ record }">
                    {{ formatValue.formatDebit(record.DebitAmount) }}
                </template>
            </MTable>
        </div>
        <div class="table-footer">
            <div class="table-total-record">
                <p>
                    {{ this.Resource.page.total }}:
                    <span>{{ this.records.length }}</span>
                </p>
            </div>
            <div class="table-pagination">
                <MDropdownList
                    class="m-row-label m-dropdown-page"
                    :label="this.Resource.page.pageSize"
                    :dropdownOptions="dropdownOptions"
                    reverse
                    v-model:selectedValue="selectedPageOption"
                ></MDropdownList>
                <div class="pagination-action">
                    <span class="btn-page-prev"></span>
                    <span class="btn-page-next"></span>
                </div>
            </div>
        </div>
    </div>
    <CustomerForm
        ref="customerForm"
        v-if="form.isShowForm"
        v-model:isShowForm="form.isShowForm"
        :formMode="form.formMode"
        :customerId="form.customerId"
    ></CustomerForm>
</template>

<script>
import CustomerForm from "@/components/page/customer/CustomerForm.vue";
import CustomerService from "@/service/customer.js";
// import ColumnMenu from "@/components/page/customer/ColumnMenu.vue";
export default {
    name: "TheCustomer",
    inject: ["showDialog", "addToast", "closeDialog", "setLoading"],
    components: { CustomerForm },
    data() {
        return {
            // Các cột sử dụng trong table
            columns: [
                {
                    columnName: this.Resource.table.customer.code,
                    columnField: "CustomerCode",
                    columnSize: 1,
                },
                {
                    columnName: this.Resource.table.fullName,
                    columnField: "FullName",
                },
                {
                    columnName: this.Resource.table.gender,
                    columnField: "Gender",
                },
                {
                    columnName: this.Resource.table.dateOfBirth,
                    columnField: "DateOfBirth",
                    columnAlign: "center",
                },
                {
                    columnName: this.Resource.table.email,
                    columnField: "Email",
                },
                {
                    columnName: this.Resource.table.companyName,
                    columnField: "CompanyName",
                },
                {
                    columnName: this.Resource.table.phoneNumber,
                    columnField: "PhoneNumber",
                    columnAlign: "right",
                },
                {
                    columnName: this.Resource.table.debit,
                    columnField: "DebitAmount",
                    columnSize: 1,
                    columnAlign: "right",
                },
            ],
            // Các bản ghi khách hàng lấy được qua API
            records: [],
            // Tập set các ID của bản ghi đang được chọn
            selectedSet: new Set(),
            // Biến lưu trạng thái tất cả các bản ghi có đang được chọn không
            isCheckAll: false,
            // Biến lưu trạng thái của form
            form: {
                isShowForm: false,
                formMode: "",
                customerId: null,
            },
            // Biến lưu trạng thái loading của trang
            isLoading: false,
            // Giá trị các option của Dropdown list
            dropdownOptions: [
                {
                    value: 10,
                    text: "10",
                },
                {
                    value: 20,
                    text: "20",
                },
                {
                    value: 30,
                    text: "30",
                },
            ],
            selectedPageOption: "10",
        };
    },

    /**
     * Hàm chạy khi component được tạo
     * Gọi API để lấy dánh sách khách hàng
     * Author: QuangHuy (05/12/2023)
     */
    mounted() {
        this.loadData();
    },
    methods: {
        /**
         * Hàm xử lý khi nhấn nút bỏ chọn tất cả
         * Author: QuangHuy (05/12/2023)
         */
        handleCancelSelect() {
            this.selectedSet.clear();
            this.isCheckAll = false;
        },

        /**
         * Hàm hiện form thêm mới khách hàng
         * Author: QuangHuy (06/12/2023)
         */
        showFormAdd() {
            this.form.formMode = 0;
            this.form.isShowForm = true;
        },

        /**
         * Hàm hiện form sửa thông tin khách hàng
         * Author: QuangHuy (06/12/2023)
         */
        showFormEdit(id) {
            this.form.formMode = 1;
            this.form.customerId = id;
            this.form.isShowForm = true;
        },

        /**
         * Hàm Load data lấy được qua API
         * Author: QuangHuy(06/12/2023)
         */
        async loadData() {
            try {
                this.setLoading(true);
                let data = await CustomerService.getAll();
                this.records = data;
                this.setLoading(false);
            } catch (error) {
                this.setLoading(false);
                // Hiện dialog thông báo lỗi
                this.showDialog({
                    title: this.Resource.dialog.title.systemError,
                    description: this.Resource.dialog.description.systemError,
                    type: "system-error",
                    clickYesOption: () => {
                        this.closeDialog();
                    },
                });
            }
        },

        /**
         * Hàm tải lại dữ liệu của table
         * Author: QuangHuy(06/12/2023)
         */
        reloadData() {
            this.loadData();
        },

        /**
         * Hàm xử lý mở dialog xác nhận khi nhân xóa tất cả các bản ghi đã chọn
         * Author: QuangHuy (07/12/2023)
         */
        handleDeleteAllSelected() {
            try {
                // Mở dialog
                this.showDialog({
                    title: this.Resource.dialog.title.confirmDelete,
                    description:
                        this.Resource.dialog.description.confirmDeleteAll,
                    type: "confirm-red",
                    // Hàm xử lý khi click nút đồng ý
                    clickYesOption: () => {
                        this.isCheckAll = false;
                        this.selectedSet.clear();
                        this.addToast(
                            this.Enum.toast.success,
                            this.Resource.toast.deleteSuccess(
                                this.Resource.entity.customer
                            )
                        );
                        this.closeDialog();
                    },
                    // Hàm xử lý khi click nút hủy
                    clickNoOption: () => {
                        this.closeDialog();
                    },
                });
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm xử lý khi nhấn nút import file Excel
         * Author: QuangHuy (11/12/2023)
         */
        handelImportExcel() {
            this.addToast(
                this.Enum.toast.warning,
                this.Resource.toast.funcWarning
            );
        },

        /**
         * Hàm xử lý khi click nút sửa thông tin 1 khách hàng
         * Author: QuangHuy (16/12/2023)
         */
        handleEditRecord(id) {
            this.showFormEdit(id);
        },

        /**
         * Hàm xử lý khi click nút xóa thông tin 1 khách hàng
         * @param {*} id: id khách hàng
         * Author: QuangHuy (16/12/2023)
         */
        handleDeleteRecord(record) {
            this.showDialog({
                title: this.Resource.dialog.title.confirmDelete,
                description: this.Resource.dialog.description.confirmDelete(
                    this.Resource.entity.customer,
                    record.CustomerCode
                ),
                type: "confirm-red",
                // Hàm xử lý khi click nút đồng ý
                clickYesOption: () => {
                    this.deleteCustomer(record.CustomerId);
                    this.closeDialog();
                },
            });
        },

        /**
         * Hàm xóa thông tin 1 khách hàng
         * @param {*} id: id khách hàng
         * Author: QuangHuy (18/12/2023)
         */
        async deleteCustomer(id) {
            try {
                this.setLoading(true);
                await CustomerService.delete(id);
                this.loadData();
                this.setLoading(false);
                this.addToast(
                    this.Enum.toast.success,
                    this.Resource.toast.deleteSuccess(
                        this.Resource.entity.customer
                    )
                );
            } catch (error) {
                console.log(error.response);
                this.setLoading(false);
                this.showDialog({
                    title: this.Resource.dialog.title.systemError,
                    description: this.Resource.dialog.description.systemError,
                    type: "system-error",
                    clickYesOption: () => {
                        this.closeDialog();
                    },
                });
            }
        },
    },
};
</script>

<style scoped>
@import url(./customer.css);
</style>
