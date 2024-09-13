<template>
    <div class="main-top">
        <div class="main-top-title">
            <p>{{ Resource.page.employee.title }}</p>
        </div>
        <div class="main-top-action">
            <MButton
                :text="this.Resource.button.add"
                class="m-wc-button"
                @clickBtn="showFormAdd"
                isComboBtn
                @clickDropdown="handleToggleAddMenuContext"
            >
                <template #context-menu>
                    <MContextMenu
                        v-if="isShowAddContext"
                        class="btn-add-context"
                        @clickOutside="handleToggleAddMenuContext"
                        :resources="addBtnContextMenu"
                        ref="addBtnMenu"
                    />
                </template>
            </MButton>
        </div>
    </div>
    <div class="main-body-container">
        <div class="main-body">
            <div class="table-toolbar">
                <div class="table-toolbar-left">
                    <MTextfield
                        class="textfield-search-employee"
                        withAction
                        :placeholder="Resource.textfield.placeholder.search"
                        @beginAction="handleFillterEmployee"
                        v-model="fillterValue"
                        ref="search"
                    />
                    <p v-if="selectedSet.size > 0" class="total-checked">
                        {{ this.Resource.page.selectedRecord }}
                        <strong>{{ selectedSet.size || "" }}</strong>
                    </p>
                    <MButton
                        class="m-secondary-button btn-cancel"
                        :text="this.Resource.button.cancelSelect"
                        v-show="selectedSet.size > 0"
                        @clickBtn="handleCancelSelect"
                    ></MButton>
                    <MButton
                        v-if="selectedSet.size > 1"
                        class="m-wc-button btn-delete"
                        :text="this.Resource.button.deleteAll"
                        @clickBtn="handleDeleteAllSelected"
                    ></MButton>
                </div>
                <div class="table-toolbar-right">
                    <Tooltip
                        :title="Resource.tooltip.refreshBtn"
                        placement="top"
                        :mouseEnterDelay="0.7"
                    >
                        <div>
                            <MButton
                                class="m-icon-button btn-refresh"
                                @clickBtn="reloadData"
                            ></MButton>
                        </div>
                    </Tooltip>
                    <div class="btn-export-container">
                        <Tooltip
                            :title="Resource.tooltip.importExBtn"
                            :mouseEnterDelay="0.7"
                            placement="top"
                        >
                            <div>
                                <MButton
                                    class="m-icon-button btn-export"
                                    :class="[
                                        isShowExportContext ? 'active' : '',
                                    ]"
                                    @clickBtn="handleToggleExportMenuContext"
                                ></MButton>
                            </div>
                        </Tooltip>
                        <MContextMenu
                            v-if="isShowExportContext"
                            class="btn-export-context"
                            :resources="exportBtnContextMenu"
                            @clickOutside="handleToggleExportMenuContext"
                            ref="exportBtnMenu"
                        />
                    </div>
                    <Tooltip
                        :title="Resource.tooltip.filterBtn"
                        placement="top"
                        :mouseEnterDelay="0.7"
                    >
                        <div>
                            <MButton
                                class="m-icon-button btn-filter"
                                :class="[filterList.length > 0 ? 'active' : '']"
                                @clickBtn="handleToogleFilterMenu"
                            ></MButton>
                        </div>
                    </Tooltip>
                    <div class="menu-col">
                        <Tooltip
                            :title="Resource.tooltip.settingColumn"
                            :mouseEnterDelay="0.7"
                            :overlayInnerStyle="{ 'max-width': '100px' }"
                            placement="top"
                        >
                            <div>
                                <MButton
                                    class="m-icon-button btn-setting-column"
                                    :class="[
                                        isShowColumnMenu
                                            ? 'active-setting-column'
                                            : '',
                                    ]"
                                    @clickBtn="handleClickSettingCoumnBtn"
                                ></MButton>
                            </div>
                        </Tooltip>
                        <ColumnMenu
                            v-clickOutsideVer2="
                                () => (isShowColumnMenu = false)
                            "
                            v-if="isShowColumnMenu"
                            v-model:columnResources="columns"
                            v-model:iShow="isShowColumnMenu"
                            ref="settingColumnMenu"
                            :defaultCol="columnsDefault"
                            entity="employee"
                        />
                    </div>
                </div>
            </div>
            <div
                class="list-filter"
                v-if="filterList.length > 0"
                :key="filterList"
            >
                <FilterItem
                    v-for="(data, index) in filterList"
                    :key="index"
                    :field="data.Field"
                    :type="data.Type"
                    :value="convertTypeFilterToResource(data.Value)"
                    :keyFilter="data.Key"
                    entity="employee"
                    @close="handleCloseFilterItem(data.Field)"
                />
                <!-- <div
                    class="btn-clear-all-filter"
                    v-if="filterList.length > 1"
                    @click="handleClearAllFilter"
                >
                    <p>{{ Resource.button.deleteAll }}</p>
                </div> -->
            </div>
            <div class="table-container">
                <MTable
                    v-model:columns="columns"
                    entity="employee"
                    keyRecord="EmployeeId"
                    checkbox
                    actions
                    v-model:selectedSet="selectedSet"
                    :records="records"
                    :sortData="sortData"
                    :filterData="filterData"
                    v-model:isCheckAll="isCheckAll"
                    @editRecord="handleEditRecord"
                    @deleteRecord="handleDeleteRecord"
                    @copyRecord="handleCopyRecord"
                    @stopUsingRecord="handleStopUsingRecord"
                    @changeSortState="handleChangeSortState"
                    @changeFilter="handleChangeFilterState"
                >
                    <template #DateOfBirth="{ record }">
                        {{ formatValue.formatDate(record.DateOfBirth).result }}
                    </template>
                    <template #Gender="{ record }">
                        {{ formatValue.formatGender(record.Gender, Resource) }}
                    </template>
                </MTable>
                <p
                    v-if="records && isLoadRecord && records.length === 0"
                    class="notification-no-record"
                >
                    {{ Resource.page.noRecordNotify }}
                </p>
            </div>
            <div class="table-footer">
                <div class="table-total-record">
                    <p>
                        {{ this.Resource.page.total }}:
                        <span>{{ totalRecord }}</span>
                    </p>
                </div>
                <div class="table-pagination">
                    <MDropdownList
                        class="m-row-label m-dropdown-page"
                        :label="this.Resource.page.pageSize"
                        :dropdownOptions="dropdownOptions"
                        reverse
                        v-model:selectedValue="selectedPageOption"
                        ref="dropdownPage"
                        @selectOptionDropDown="handleSelectPageNumber"
                        :autoResize="false"
                    />
                    <div class="page-info" v-if="records">
                        <p>
                            <strong>{{ currentRecord }}</strong> -
                            <strong>{{
                                currentRecord + records.length - 1
                            }}</strong>
                            {{ Resource.page.record }}
                        </p>
                    </div>
                    <div class="pagination-action">
                        <Tooltip
                            :title="
                                hasPrevPage ? Resource.tooltip.prevPage : ''
                            "
                            :mouseEnterDelay="0.7"
                            placement="top"
                        >
                            <component
                                :is="!hasPrevPage ? 'span' : 'RouterLink'"
                                :class="{ 'disable-link': !hasPrevPage }"
                                class="btn-page-prev"
                                :to="{
                                    name: 'employee',
                                    query: {
                                        pageSize: selectedPageOption,
                                        pageNumber: pageNumber - 1,
                                        fillterString: fillterValue,
                                    },
                                }"
                            />
                        </Tooltip>

                        <Tooltip
                            :title="
                                hasNextPage ? Resource.tooltip.nextPage : ''
                            "
                            :mouseEnterDelay="0.7"
                            placement="top"
                        >
                            <component
                                :is="!hasNextPage ? 'span' : 'RouterLink'"
                                :class="{ 'disable-link': !hasNextPage }"
                                class="btn-page-next"
                                :to="{
                                    name: 'employee',
                                    query: {
                                        pageSize: selectedPageOption,
                                        pageNumber: pageNumber + 1,
                                        fillterString: fillterValue,
                                    },
                                }"
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
        <FilterMenu
            :resources="columns"
            v-model:data="filterData"
            entity="employee"
            v-if="isShowFilterMenu"
            v-model:isShow="isShowFilterMenu"
        />
    </div>
    <EmployeeForm
        ref="employeeForm"
        v-if="form.isShowForm"
        v-model:isShowForm="form.isShowForm"
        v-model:formMode="form.formMode"
        :employeeEntity="form.employee"
    ></EmployeeForm>
    <ConfigForm
        v-if="configForm.isShow"
        v-model:isShow="configForm.isShow"
        @commit="handleCommitConfigForm"
    />
</template>

<script>
import { RouterLink } from "vue-router";
import EmployeeForm from "@/components/page/employee/EmployeeForm.vue";
import EmployeeService from "@/service/employee.js";
import ConfigForm from "@/components/common/form/ConfigForm.vue";
import NProgress from "nprogress";
import ColumnMenu from "@/components/common/menu/ColumnMenu.vue";
import FilterItem from "@/components/common/filter/FilterItem.vue";
import FilterMenu from "@/components/common/filter/FilterMenu.vue";
export default {
    name: "TheEmployee",
    inject: [
        "showDialog",
        "addToast",
        "closeDialog",
        "setLoading",
        "handleResponseError",
    ],
    components: {
        EmployeeForm,
        RouterLink,
        ConfigForm,
        ColumnMenu,
        FilterItem,
        FilterMenu,
    },
    props: {
        pageSize: Number,
        pageNumber: Number,
        fillterString: String,
        error: Object,
    },
    data() {
        return {
            // Các cột mặc định sử dụng trong table
            columnsDefault: [
                {
                    index: 0,
                    columnField: "EmployeeCode",
                    isPin: true,
                    isShow: true,
                    width: null,
                    filter: this.Enum.filterType.text,
                },
                {
                    index: 1,
                    columnField: "FullName",
                    isShow: true,
                    isPin: true,
                    width: null,
                    filter: this.Enum.filterType.text,
                },
                {
                    index: 2,
                    columnField: "Gender",
                    isPin: false,
                    isShow: true,
                    width: null,
                },
                {
                    index: 3,
                    columnField: "DateOfBirth",
                    isPin: false,
                    isShow: true,
                    width: null,
                    filter: this.Enum.filterType.date,
                },
                {
                    index: 4,
                    columnField: "IdentityNumber",
                    isPin: false,
                    isShow: true,
                    width: null,
                    filter: this.Enum.filterType.text,
                },
                {
                    index: 5,
                    columnField: "PhoneNumber",
                    isPin: false,
                    isShow: true,
                    width: null,
                },
                {
                    index: 6,
                    columnField: "PositionName",
                    isPin: false,
                    isShow: true,
                    width: null,
                },
                {
                    index: 7,
                    columnField: "DepartmentName",
                    isPin: false,
                    isShow: true,
                    width: null,
                },
                {
                    index: 8,
                    columnField: "BankAccount",
                    isPin: false,
                    isShow: true,
                    width: null,
                },
                {
                    index: 9,
                    columnField: "BankName",
                    isPin: false,
                    isShow: true,
                    width: null,
                },
                {
                    index: 10,
                    columnField: "BankBranch",
                    isPin: false,
                    isShow: true,
                    width: null,
                },
            ],

            // Các cột sử dụng thực tế
            columns: [],

            // Object lưu dữ liệu lọc
            // Lưu key dưới dạng PascalCase để khi gửi kèm API thì key thống nhất với BE
            filterData: null,

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
                employee: null,
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
                {
                    value: 50,
                    text: "50",
                },
                {
                    value: 100,
                    text: "100",
                },
            ],

            // Giá trị số lượng bản ghi trong 1 lần lấy (mặc định)
            selectedPageOption: "10",

            // Giá trị tìm kiếm
            fillterValue: "",

            // Tổng số bản ghi
            totalRecord: 0,

            // Biến lưu trạng thái load dữ liệu lần đầu tiên
            isLoadRecord: false,

            // Biến lưu trang thái ẩn hiện của file config
            configForm: {
                isShow: false,
                result: false,
            },

            // Biến trạng thái của menu tùy chỉnh cột
            isShowColumnMenu: false,

            // Dữ liệu cho context-menu của nút thêm
            addBtnContextMenu: [
                {
                    text: this.Resource.menuContext.importExcel,
                    func: () =>
                        this.$router.push({
                            name: "import",
                            params: { step: 1 },
                        }),
                },
            ],

            // Dữ liệu cho context menu nút xuất khẩu nhân viên ra file Excel
            exportBtnContextMenu: [
                {
                    text: this.Resource.menuContext.exportAllExcel,
                    func: () => this.handleExportAllDataToExcel(),
                },
                {
                    text: this.Resource.menuContext.exportSelectedExcel,
                    func: () => this.handleExportSelectedDataToExcel(),
                },
            ],

            sortData: null,

            backUpRecord: null,

            isShowExportContext: false,

            isShowAddContext: false,

            isShowFilterMenu: false,
        };
    },

    /**
     * Hàm chạy khi component được tạo
     * Gọi API để lấy dánh sách khách hàng
     * Author: QuangHuy (05/12/2023)
     */
    created() {
        if (this.error) {
            this.handleResponseError(this.error, this.handleApiErrorEmployee);
        } else {
            this.sortData = JSON.parse(window.localStorage.getItem("sortData"));
            this.loadData(this.pageSize, this.pageNumber, this.fillterString);
            this.selectedPageOption = this.pageSize.toString() || "10";
            this.fillterValue = this.fillterString || "";
            this.columns = JSON.parse(window.localStorage.getItem("columns"));
            if (!this.columns || this.columns.length === 0) {
                this.columns = JSON.parse(JSON.stringify(this.columnsDefault));
            }
            this.selectedSet = this.$store.getters.getSelectedEmployee;
        }
    },

    /**
     * Hàm chạy khi route được update
     * @param {*} to: route đại chỉ đến
     * Author: QuangHuy (14/01/2023)
     */
    async beforeRouteUpdate(to) {
        let pageSize = parseInt(to.query.pageSize) || 10;
        let pageNumber = parseInt(to.query.pageNumber) || 1;
        let fillterString = to.query.fillterString || "";
        await this.loadData(pageSize, pageNumber, fillterString);
    },

    /**
     * Hàm chạy khi component mount
     * Author: QuangHuy (14/01/2023)
     */
    mounted() {
        this.$refs.dropdownPage.onselectstart = () => false;
        document.title = this.Resource.title.employee;
        document.addEventListener("keydown", this.handleKeyShortEmployee);
    },

    /**
     * Hàm chạy khi component Unmount
     * Author: QuangHuy (06/03/2024)
     */
    unmounted() {
        document.removeEventListener("keydown", this.handleKeyShortEmployee);
    },

    methods: {
        /**
         * Hàm thực hiện ẩn hiện menu quản lý bộ lọc
         * Author: QuangHuy (06/03/2024)
         */
        handleToogleFilterMenu() {
            this.isShowFilterMenu = !this.isShowFilterMenu;
        },

        /**
         * Hàm thực hiện ẩn hiện menu quản lý danh sách cột
         * Author: QuangHuy (06/03/2024)
         */
        handleClickSettingCoumnBtn() {
            this.isShowColumnMenu = !this.isShowColumnMenu;
        },

        /**
         * Hàm thực hiện khi người dùng thay đổi trạng thái lọc theo cột trong bảng
         * @param {field}: trường dữ liệu tương ứng
         * @param {type}: kiểu dữ liệu tương ứng
         * @param {value}: kiểu lọc dữ liệu
         * @param {key}: từ khóa dùng để lọc
         * Author: QuangHuy (06/03/2024)
         */
        handleChangeFilterState([field, type, value, key]) {
            if (this.filterData) {
                if (value !== null) {
                    this.filterData[field] = {
                        Type: type,
                        Value: value,
                        Key: key,
                    };
                } else {
                    delete this.filterData[field];
                }
            } else {
                this.filterData = {
                    [field]: {
                        Type: type,
                        Value: value,
                        Key: key,
                    },
                };
            }
        },

        /**
         * Hàm thực hiện gán các phím nhanh tương ứng
         * @param {*} e : sự kiện khi người dùng nhấn phím
         * Author: QuangHuy (06/03/2024)
         */
        handleKeyShortEmployee(e) {
            const keyCode = e.key;
            switch (keyCode) {
                case "1":
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.showFormAdd();
                    }
                    break;
                case "f":
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.$refs.search.focus();
                    }
                    break;
                default:
                    break;
            }
        },

        /**
         * Hàm thực hiện hiện form config
         * Author: QuangHuy (06/03/2024)
         */
        handleShowFormConfig() {
            this.configForm.isShow = true;
        },

        /**
         * Hàm xử lý ẩn hiện menu-context của nút xuất khẩu nhân viên
         * Author: QuangHuy (27/01/2024)
         */
        handleToggleExportMenuContext() {
            this.isShowExportContext = !this.isShowExportContext;
        },

        /**
         * Hàm xử lý ẩn hiện menu-context của nút thêm mới nhân viên
         * Author: QuangHuy (27/01/2024)
         */
        handleToggleAddMenuContext() {
            this.isShowAddContext = !this.isShowAddContext;
        },

        /**
         * Hàm xử lý nhân bản một bản ghi
         * @param {*} data: dữ liệu muốn nhân bản
         * Author: QuangHuy (22/01/2024)
         */
        async handleCopyRecord(data) {
            let newData = { ...data };
            this.form.formMode = this.Enum.formMode.add;
            this.form.employee = newData;
            this.form.isShowForm = true;
        },

        /**
         * Hàm xử lý khi chọn giá trị độ lớn của trang
         * Reload lại dũ liệu với độ lơn đã chọn và về trang 1
         * @param {*} value: độ lớn của trang
         * Author: QuangHuy (18/01/2024)
         */
        handleSelectPageNumber(value) {
            this.$router.push({
                name: "employee",
                query: {
                    pageSize: value,
                    pageNumber: 1,
                    fillterString: this.fillterValue.trim(),
                },
            });
        },
        
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
            this.form.formMode = this.Enum.formMode.add;
            this.form.isShowForm = true;
        },

        /**
         * Hàm hiện form sửa thông tin khách hàng
         * Author: QuangHuy (06/12/2023)
         */
        async showFormEdit(id) {
            await this.loadEmployeeInfomation(id);
            this.form.formMode = this.Enum.formMode.edit;
            this.form.isShowForm = true;
        },

        /**
         * Hàm tải lấy thông tin của khách hàng và truyền vào form sửa
         * Author: QuangHuy (17/12/2023)
         */
        async loadEmployeeInfomation(id) {
            try {
                const data = await EmployeeService.getById(id);
                this.form.employee = data;
            } catch (error) {
                this.setLoading(false);
                this.handleResponseError(error, this.handleApiErrorEmployee);
            }
        },

        /**
         * Hàm Load data lấy được qua API
         * Author: QuangHuy(06/12/2023)
         */
        async loadData(pageSize, pageNumber, fillterString) {
            try {
                (this.backUpRecord = null), this.setLoading(true);
                let data = await EmployeeService.getFillter(
                    pageSize,
                    pageNumber,
                    fillterString
                );
                this.backUpRecord = [...data.Employees];
                if (this.sortData) {
                    this.records = this.handleSortRecord(
                        [...data.Employees],
                        this.sortData.field,
                        this.sortData.type
                    );
                } else {
                    this.records = [...data.Employees];
                }
                this.totalRecord = data.TotalRecord;
                this.setLoading(false);
            } catch (error) {
                this.setLoading(false);
                this.handleResponseError(error, this.handleApiErrorEmployee);
            }
        },

        /**
         * Hàm tải lại dữ liệu của table
         * Author: QuangHuy(06/12/2023)
         */
        async reloadData() {
            await this.loadData(
                this.selectedPageOption,
                this.pageNumber,
                this.fillterValue
            );
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
                    clickYesOption: async () => {
                        await this.deleteManyEmployee();
                        this.closeDialog();
                        this.reloadData();
                    },
                    // Hàm xử lý khi click nút hủy
                    clickCancelOption: () => {
                        this.closeDialog();
                    },
                });
            } catch (error) {
                this.showSystemErrorDialog();
            }
        },

        /**
         * Hàm xóa nhiều nhân viên theo Id
         * Author: QuangHuy (19/01/2024)
         */
        async deleteManyEmployee() {
            try {
                this.setLoading(true);
                let ids = Array.from(this.selectedSet);
                await EmployeeService.deleteMutiple(ids);
                this.setLoading(false);
                this.isCheckAll = false;
                this.selectedSet.clear();
                this.addToast(
                    this.Enum.toast.success,
                    this.Resource.toast.deleteSuccess(
                        this.Resource.entity.employee
                    )
                );
            } catch (error) {
                this.setLoading(false);
                this.handleResponseError(error, this.handleApiErrorEmployee);
            }
        },

        /**
         * Hàm thực hiện lọc danh sách nhân viên
         * Author: QuangHuy (15/01/2024)
         */
        handleFillterEmployee() {
            this.$router.push({
                name: "employee",
                query: {
                    pageSize: this.selectedPageOption,
                    pageNumber: 1,
                    fillterString: this.fillterValue.trim(),
                },
            });
        },

        /**
         * Hàm xử lý khi nhấn nút export danh sách nhân viên
         * Author: QuangHuy (11/12/2023)
         */
        async handleExportAllDataToExcel() {
            // this.handleShowFormConfig();
            this.isShowExportContext = false;
            this.exportAllData();
        },

        /**
         * Hàm gọi service xuất khẩu tất cả danh sách
         * Author: QuangHuy (11/12/2023)
         */
        async exportAllData() {
            try {
                this.addToast(
                    this.Enum.toast.info,
                    this.Resource.toast.downloadBegin
                );
                NProgress.start();
                await EmployeeService.exportAllEmployeeData();
                NProgress.done();
            } catch (error) {
                NProgress.done();
                this.handleResponseError(error, this.handleApiErrorEmployee);
            }
        },

        /**
         * Hàm xử lý khi nhấn nút export danh sách nhân viên đã chọn
         * Author: QuangHuy (06/03/2024)
         */
        handleExportSelectedDataToExcel() {
            this.isShowExportContext = false;
            if (this.selectedSet.size === 0) {
                this.showDialog({
                    title: this.Resource.dialog.title.noDataExport,
                    description: this.Resource.dialog.description.noDataExport,
                    type: "system-error",
                    clickYesOption: () => {
                        this.closeDialog();
                    },
                });
            } else {
                // this.handleShowFormConfig();
                this.exportSelectedData();
            }
        },

        /**
         * Hàm gọi service xuất khẩu danh sách nhân viên đã chọn
         * Author: QuangHuy (11/12/2023)
         */
        async exportSelectedData() {
            try {
                this.addToast(
                    this.Enum.toast.info,
                    this.Resource.toast.downloadBegin
                );
                NProgress.start();
                await EmployeeService.exportSelectedEmployeeData(
                    Array.from(this.selectedSet)
                );
                NProgress.done();
            } catch (error) {
                NProgress.done();
                this.handleResponseError(error, this.handleApiErrorEmployee);
            }
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
                    this.Resource.entity.employee,
                    record.EmployeeCode
                ),
                type: "confirm-red",
                // Hàm xử lý khi click nút đồng ý
                clickYesOption: () => {
                    this.deleteEmployee(record.EmployeeId);
                    this.closeDialog();
                },
            });
        },

        /**
         * Hàm xóa thông tin 1 khách hàng
         * @param {*} id: id khách hàng
         * Author: QuangHuy (18/12/2023)
         */
        async deleteEmployee(id) {
            try {
                this.setLoading(true);
                await EmployeeService.delete(id);
                this.reloadData();
                this.selectedSet.delete(id);
                this.setLoading(false);
                this.addToast(
                    this.Enum.toast.success,
                    this.Resource.toast.deleteSuccess(
                        this.Resource.entity.employee
                    )
                );
            } catch (error) {
                this.setLoading(false);
                this.handleResponseError(error, this.handleApiErrorEmployee);
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
         * Hàm xử lý lỗi APi trả về
         * @param {*} error: Lỗi truyền vào
         * Author: QuangHuy (18/12/2023)
         */
        handleApiErrorEmployee(status) {
            switch (status) {
                case 401:
                    this.addToast(
                        this.Enum.toast.info,
                        this.Resource.toast.expiredAccessLogin
                    );
                    return true;
                case 419:
                    this.addToast(
                        this.Enum.toast.info,
                        this.Resource.toast.expiredAccessLogin
                    );
                    this.$router.push({ name: "login" });
                    return true;
                default:
                    return false;
            }
        },

        /**
         * Hàm xử lý khi nhấn ngưng sử dụng bản ghi
         * Author: QuangHuy (19/03/2024)
         */
        handleStopUsingRecord() {
            this.addToast(
                this.Enum.toast.warning,
                this.Resource.toast.funcWarning
            );
        },

        /**
         * Hàm chuyển đổi từ Enum của bộ lọc sang chuỗi resource tương ứng
         * @param {*} type: Kiểu filter dạng Enum
         * Author: QuangHuy (04/04/2024)
         */
        convertTypeFilterToResource(type) {
            switch (type * 1) {
                case this.Enum.detailFilterType.startWith:
                    return this.Resource.dropDropOption.startWith.toLowerCase();
                case this.Enum.detailFilterType.contain:
                    return this.Resource.dropDropOption.contain.toLowerCase();
                case this.Enum.detailFilterType.equal:
                    return this.Resource.dropDropOption.equal.toLowerCase();
                case this.Enum.detailFilterType.small:
                    return this.Resource.dropDropOption.small.toLowerCase();
                case this.Enum.detailFilterType.high:
                    return this.Resource.dropDropOption.high.toLowerCase();
                default:
                    return this.Resource.dropDropOption.startWith.toLowerCase();
            }
        },

        /**
         * Hàm xử lý đóng 1 bộ lọc
         * @param {*} index: chỉ mục của filter muốn tắt
         * Author: QuangHuy (12/04/2024)
         */
        handleCloseFilterItem(field) {
            if ((Object.hasOwn(this.filterData), field)) {
                delete this.filterData[field];
            }
        },

        /**
         * Hàm xử lý đóng toàn bộ bộ lọc
         * Author: QuangHuy (12/04/2024)
         */
        handleClearAllFilter() {
            this.filterData = null;
        },

        handleSortRecord(array, field, type) {
            try {
                this.sortData = null;
                switch (type) {
                    case this.Enum.sortType.none:
                        this.sortData = { field, type };
                        return [...this.backUpRecord];
                    case this.Enum.sortType.down:
                        array.sort((a, b) => {
                            const fisrt = this.formatValue.removeAccents(
                                a[field]
                            );
                            const second = this.formatValue.removeAccents(
                                b[field]
                            );
                            if (!a[field] || fisrt < second) {
                                return 1;
                            } else if (!b[field] || fisrt > second) {
                                return -1;
                            }
                            return 0;
                        });
                        this.sortData = { field, type };
                        break;
                    case this.Enum.sortType.up:
                        array.sort((a, b) => {
                            const fisrt = this.formatValue.removeAccents(
                                a[field]
                            );
                            const second = this.formatValue.removeAccents(
                                b[field]
                            );
                            if (!a[field] || fisrt < second) {
                                return -1;
                            } else if (!b[field] || fisrt > second) {
                                return 1;
                            }
                            return 0;
                        });
                        this.sortData = { field, type };
                        break;
                    default:
                        return [...this.backUpRecord];
                }
                return array;
            } catch (error) {
                console.error(error);
                return [...this.backUpRecord];
            }
        },

        handleChangeSortState([field, type]) {
            try {
                this.records = this.handleSortRecord(
                    [...this.records],
                    field,
                    type
                );
                if (this.sortData) {
                    window.localStorage.setItem(
                        "sortData",
                        JSON.stringify(this.sortData)
                    );
                }
            } catch (error) {
                console.error(error);
            }
        },

        handleCancelFIlter() {
            this.filterData = null;
        },
    },

    computed: {
        /**
         * Hàm tính toán có trang trước hay không
         * return: True => có || False => không
         * Author: QuangHuy (22/01/2024)
         */
        hasPrevPage() {
            if (this.pageNumber - 1 === 0) {
                return false;
            }
            return true;
        },

        /**
         * Hàm tính toán có trang sau hay không
         * return: True => có || False => không
         * Author: QuangHuy (22/01/2024)
         */
        hasNextPage() {
            let temp = Math.ceil(this.totalRecord / this.pageSize);
            if (this.pageNumber === temp || this.totalRecord === 0) {
                return false;
            }
            return true;
        },

        /**
         * Hàm tính toán bản ghi hiện tại
         * return: Số thứ tự của bản ghi hiện tại
         * Author: QuangHuy (22/01/2024)
         */
        currentRecord() {
            var temp = (this.pageNumber - 1) * this.pageSize;
            return temp + 1;
        },

        filterList() {
            const filterList = [];
            if (this.filterData) {
                for (let key in this.filterData) {
                    filterList.push({
                        Field: key,
                        Type: this.filterData[key].Type,
                        Value: this.filterData[key].Value,
                        Key: this.filterData[key].Key,
                    });
                }
            }
            return filterList;
        },
    },

    watch: {
        records(newVal) {
            if (newVal) {
                if (newVal.length > 0) {
                    this.isCheckAll = newVal.every((item) => {
                        return this.selectedSet.has(item.EmployeeId);
                    });
                } else {
                    this.isCheckAll = false;
                }
                if (!this.isLoadRecord) {
                    this.isLoadRecord = true;
                }
            }
        },

        "form.isShowForm"(newVal) {
            if (!newVal) {
                this.form.employee = null;
            }
        },

        selectedSet(newVal) {
            this.$store.commit("updateSeletedEmployeeSet", newVal);
        },
    },

    provide() {
        return {
            reloadData: this.reloadData,
        };
    },
};
</script>

<style src="./employee.css"></style>
