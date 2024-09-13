<template>
    <MForm
        isAction
        :title="getTitle"
        @close="handleClickIconCloseForm"
        @keydown="handleKeyShortForm"
        controlClass="employee-popup-control"
    >
        <template #form-control>
            <div class="row-1">
                <MTextfield
                    @keydown.shift.tab.prevent="$event.preventDefault()"
                    ref="EmployeeCode"
                    class="employee-input-code"
                    :label="Resource.form.label.employee.employeeCode"
                    required
                    v-model="employee.EmployeeCode"
                    :schema="schema.employeeCode"
                    v-model:errors="errors.EmployeeCode"
                    :tabindex="1"
                ></MTextfield>
                <MTextfield
                    class="employee-input-name"
                    :label="Resource.form.label.fullName"
                    v-model="employee.FullName"
                    required
                    ref="FullName"
                    :schema="schema.fullName"
                    v-model:errors="errors.FullName"
                    :tabindex="2"
                    isUpperEachSpace
                ></MTextfield>
                <MDatePicker
                    :label="Resource.form.label.dateOfBirth"
                    class="employee-input-birth"
                    v-model="employee.DateOfBirth"
                    ref="DateOfBirth"
                    v-model:errors="errors.DateOfBirth"
                    :schema="schema.dateOfBirth"
                    :tabindex="5"
                ></MDatePicker>
                <MRadioGroup
                    :label="Resource.form.label.gender"
                    class="employee-input-gender"
                    name="gender"
                    ref="Gender"
                    v-model="employee.Gender"
                    :radioOptions="radioOptions"
                    defaultValue="0"
                    :tabindex="6"
                ></MRadioGroup>
            </div>
            <div class="row-2">
                <MCombobox
                    class="employee-input-department"
                    :label="this.Resource.form.label.employee.department"
                    v-model="employee.DepartmentId"
                    ref="Department"
                    required
                    :schema="schema.department"
                    v-model:errors="errors.Department"
                    :tabindex="3"
                    :resources="resourcesDepartment.options"
                    v-model:text="employee.DepartmentName"
                    :inValidMessage="Resource.validateErrorMessage.department"
                />
                <MTextfield
                    class="employee-input-identity-number"
                    :label="this.Resource.form.label.identityNumber"
                    :title="this.Resource.tooltip.identityNumber"
                    v-model="employee.IdentityNumber"
                    v-model:errors="errors.IdentityNumber"
                    :schema="schema.identityNumber"
                    ref="IdentityNumber"
                    :tabindex="9"
                ></MTextfield>
                <MDatePicker
                    ref="IdentityDate"
                    :label="this.Resource.form.label.identityDate"
                    class="employee-input-identity-date"
                    v-model="employee.IdentityDate"
                    v-model:errors="errors.IdentityDate"
                    :schema="schema.identityDate"
                    :tabindex="10"
                ></MDatePicker>
            </div>
            <div class="row-3">
                <MCombobox
                    class="employee-input-position"
                    :label="Resource.form.label.employee.position"
                    v-model="employee.PositionId"
                    ref="Position"
                    v-model:errors="errors.Position"
                    :tabindex="4"
                    :resources="resourcesPosition.options"
                    v-model:text="employee.PositionName"
                    :inValidMessage="Resource.validateErrorMessage.position"
                />
                <MTextfield
                    class="employee-input-identity-place"
                    :label="Resource.form.label.identityPlace"
                    v-model="employee.IdentityPlace"
                    v-model:errors="errors.IdentityPlace"
                    :schema="schema.identityPlace"
                    :tabindex="11"
                    ref="IdentityPlace"
                    isUpper
                />
            </div>
            <div class="row-4">
                <MTextfield
                    ref="Address"
                    class="employee-input-address"
                    :label="this.Resource.form.label.address"
                    v-model="employee.Address"
                    v-model:errors="errors.Address"
                    :schema="schema.address"
                    :tabindex="12"
                />
            </div>
            <div class="row-5">
                <MTextfield
                    class="employee-input-phone"
                    :label="Resource.form.label.phoneNumber"
                    v-model="employee.PhoneNumber"
                    v-model:errors="errors.PhoneNumber"
                    :schema="schema.phoneNumber"
                    ref="PhoneNumber"
                    :tabindex="13"
                />
                <MTextfield
                    class="employee-input-landline-telephone"
                    :label="Resource.form.label.landlineTelephone"
                    v-model="employee.LandlineTelephone"
                    :schema="schema.landlineTelephone"
                    v-model:errors="errors.LandlineTelephone"
                    ref="LandlineTelephone"
                    :tabindex="14"
                />
                <MTextfield
                    class="employee-input-email"
                    :label="Resource.form.label.email"
                    v-model="employee.Email"
                    v-model:errors="errors.Email"
                    ref="Email"
                    :schema="schema.email"
                    :tabindex="15"
                />
            </div>
            <div class="row-6">
                <MTextfield
                    class="employee-input-bank-account"
                    :label="this.Resource.form.label.bankAccount"
                    v-model="employee.BankAccount"
                    v-model:errors="errors.BankAccount"
                    :schema="schema.bankAccount"
                    :tabindex="16"
                />
                <MTextfield
                    class="employee-input-bank-name"
                    :label="this.Resource.form.label.bankName"
                    v-model="employee.BankName"
                    v-model:errors="errors.BankName"
                    :schema="schema.bankName"
                    :tabindex="17"
                />
                <MTextfield
                    class="employee-input-bank-branch"
                    :label="this.Resource.form.label.bankBranch"
                    v-model="employee.BankBranch"
                    v-model:errors="errors.BankBranch"
                    :schema="schema.bankBranch"
                    :tabindex="18"
                />
            </div>
        </template>
        <template #form-action-left>
            <MButton
                :text="this.Resource.button.cancel"
                class="m-secondary-button"
                @clickBtn="cancelForm"
                :tabindex="19"
            ></MButton>
        </template>
        <template #form-action-right>
            <Tooltip title="Ctrl + Shift + S">
                <div>
                    <MButton
                        @keydown.tab.exact.prevent="
                            this.$refs.EmployeeCode.focus()
                        "
                        :text="this.Resource.button.saveAndAddForm"
                        class="m-primary-button"
                        @clickBtn="saveAndAddData"
                        :tabindex="21"
                    ></MButton>
                </div>
            </Tooltip>
            <Tooltip title="Ctrl + S">
                <div>
                    <MButton
                        :text="this.Resource.button.saveForm"
                        class="m-secondary-button"
                        @clickBtn="saveData"
                        :tabindex="20"
                    ></MButton>
                </div>
            </Tooltip>
        </template>
    </MForm>
</template>

<script>
import EmployeeService from "@/service/employee.js";
import PositionService from "@/service/position.js";
import DepartmentService from "@/service/department.js";
export default {
    name: "EmployeeForm",
    components: {},
    inject: [
        "addToast",
        "showDialog",
        "closeDialog",
        "setLoading",
        "reloadData",
        "handleResponseError",
    ],
    props: {
        isShowForm: Boolean,
        formMode: Number,
        employeeEntity: Object,
    },
    data() {
        return {
            // Tiêu đề của Form
            // title: this.getTitle(),
            // label và value cho các radio button group
            radioOptions: [
                {
                    value: 0,
                    label: this.Resource.radioButton.male,
                },
                {
                    value: 1,
                    label: this.Resource.radioButton.female,
                },
                {
                    value: 2,
                    label: this.Resource.radioButton.other,
                },
            ],
            // Object lưu value của các trường trong form
            employee: {
                EmployeeCode: null, // Mã khách hàng
                FullName: null, // Họ tên
                DateOfBirth: null, // Ngày sinh
                Gender: null, // Giới tính
                PhoneNumber: null, // Số điện thoại
                Address: null, // Địa chỉ
                IdentityNumber: null, // Căn cước công dân
                LandlineTelephone: null,
                IdentityPlace: null, // Nơi cấp
                IdentityDate: null, // Ngày cấp
                PositionId: null, // Vị trí
                PositionName: "", // Vị trí
                DepartmentId: null, // Đơn vị
                DepartmentName: "", // Đơn vị
                BankAccount: null, // Tài khoản ngân hàng
                BankName: null, // Tên ngân hàng
                BankBranch: null, // Chi nhánh
                Email: null, // Email
            },

            // Object lưu tabindex của từng control
            tabIndex: {
                EmployeeCode: 1, // Mã khách hàng
                FullName: 2, // Họ tên
                Department: 3, // Đơn vị
                Position: 4, // Vị trí
                DateOfBirth: 5, // Ngày sinh
                Gender: 6, // Giới tính
                IdentityNumber: 9, // Căn cước công dân
                IdentityDate: 10, // Ngày cấp
                IdentityPlace: 11, // Nơi cấp
                Address: 12, // Địa chỉ
                PhoneNumber: 13, // Số điện thoại
                LandlineTelephone: 14, // Số điện thoại bàn
                Email: 15, // Email
                BankAccount: 16, // Tài khoản ngân hàng
                BankName: 17, // Tên ngân hàng
                BankBranch: 18, // Chi nhánh
            },

            // Object lưu các điều kiện và thông báo ra cho cho người dùng
            schema: {
                employeeCode: {
                    rules: {
                        required: true,
                        max: 20,
                        code: {
                            prefix: "NV",
                            split: "-",
                            isDigit: true,
                            autoFill: [6, "0"],
                        },
                    },
                    name: "employeeCode",
                    entity: "employee",
                },
                fullName: {
                    rules: {
                        required: true,
                        max: 100,
                    },
                    name: "fullName",
                },
                department: {
                    rules: { required: true },
                    name: "departmentName",
                    entity: "employee",
                },
                email: {
                    rules: { email: true, max: 100 },
                    name: "email",
                    entity: "employee",
                },
                phoneNumber: {
                    rules: { digit: true, max: 15 },
                    name: "phoneNumber",
                },
                landlineTelephone: {
                    rules: { digit: true, max: 15 },
                    name: "landlineTelephone",
                },
                dateOfBirth: {
                    rules: { date: true },
                    name: "dateOfBirth",
                },
                address: {
                    rules: { max: 255 },
                    name: "address",
                },
                identityNumber: {
                    rules: { digit: true, max: 25 },
                    name: "identityNumber",
                },
                identityPlace: {
                    rules: { max: 100 },
                    name: "identityPlace",
                },
                identityDate: {
                    rules: { date: true },
                    name: "identityDate",
                },
                bankAccount: {
                    rules: { max: 20 },
                    name: "bankAccount",
                },
                bankName: {
                    rules: { max: 100 },
                    name: "bankName",
                },
                bankBranch: {
                    rules: { max: 100 },
                    name: "bankBranch",
                },
            },
            // Mảng lưu các lỗi của form
            errors: {},
            // // Dữ liệu của Phòng ban
            resourcesDepartment: {
                options: [],
                text: "",
            },
            // Dữ liệu vị trí / công việc
            resourcesPosition: {
                options: [],
                text: "",
            },
            // Biến lưu trạng thái của dữ liệu trong form đã bị thay đổi hay chưa
            isChangeData: false,
            isLoadForm: true,
            // Biến xác định người dùng có tiếp tục thêm mới không
            isContinueAdd: false,
        };
    },

    /**
     * Hàm thực hiên focus input khi form hiện
     * Author: QuangHuy (07/12/2023)
     */
    mounted() {
        try {
            this.handleFocusInput();
        } catch (error) {
            this.showSystemErrorDialog();
        }
    },

    /**
     * Hàm chạy khi Component vừa được tạo
     * Author: QuangHuy(08/12/2023)
     */
    async created() {
        await this.loadDataIntoForm();
    },

    // /**
    //  * Hàm chạy khi Component được update
    //  * Author: QuangHuy(25/12/2023)
    //  */
    // updated() {
    //     try {
    //         this.$refs.EmployeeCode.focus();
    //         this.isChangeData = false;
    //     } catch (error) {
    //         this.showSystemErrorDialog();
    //     }
    // },

    methods: {
        /**
         * Hàm lấy title của form theo form mode
         * Author: QuangHuy (18/12/2023)
         */
        // getTitle() {
        //     switch (this.formMode) {
        //         case this.Enum.formMode.add:
        //             return this.Resource.form.title.employee.add;
        //         case this.Enum.formMode.edit:
        //             return this.Resource.form.title.employee.edit;
        //         default:
        //             return this.Resource.form.title.employee.add;
        //     }
        // },

        /**
         * Hàm load các dữ liệu cần thiết lên form
         * Author: QuangHuy (20/12/2023)
         */
        async loadDataIntoForm() {
            this.setLoading(true);
            this.isLoadForm = true;
            await this.loadEmployeeInfomation();
            await Promise.all([
                this.loadDepartmentComboBox(),
                this.loadPositionCombobox(),
            ]);
            this.isLoadForm = false;
            this.setLoading(false);
        },

        /**
         * Hàm load dữ liệu lên Phòng ban combobox
         * Author: QuangHuy (24/01/2024)
         */
        async loadDepartmentComboBox() {
            try {
                const data = await DepartmentService.getAll();
                this.resourcesDepartment.options = data.map((item) => {
                    if (item.DepartmentId === this.employee.DepartmentId) {
                        this.employee.DepartmentName = item.DepartmentName;
                    }
                    return {
                        value: item.DepartmentId,
                        text: item.DepartmentName,
                    };
                });
            } catch (error) {
                this.handleResponseError(
                    error,
                    this.handleResponseApiEmployeeForm
                );
            }
        },

        /**
         * Hàm load dữ liệu lên Vị trí combobox
         * Author: QuangHuy (24/01/2024)
         */
        async loadPositionCombobox() {
            try {
                const data = await PositionService.getAll();
                this.resourcesPosition.options = data.map((item) => {
                    if (item.PositionId === this.employee.PositionId) {
                        this.employee.PositionName = item.PositionName;
                    }
                    return {
                        value: item.PositionId,
                        text: item.PositionName,
                    };
                });
            } catch (error) {
                // Hiện dialog thông báo lỗi
                this.handleResponseError(
                    error,
                    this.handleResponseApiEmployeeForm
                );
            }
        },

        /**
         * Hàm xử lý sự kiện nhấn icon Close form
         * Author: QuangHuy (07/12/2023)
         */
        handleClickIconCloseForm() {
            this.handleWhenCloseForm();
        },

        /**
         * Hàm xử lý sự kiện đóng From khi nhấn nút Close
         * Author: QuangHuy (07/12/2023)
         */
        closeForm() {
            this.$emit("update:isShowForm", false);
        },

        /**
         * Hàm xử lý nhấn nút hủy trong form
         * Author: QuangHuy (11/12/2023)
         */
        cancelForm() {
            this.closeForm();
        },

        /**
         * Hàm xử lý và trả về danh sách các lỗi gắn với ref của các input
         * @param {*} errors: Dánh sách lỗi các trường
         * Author: QuangHuy (18/12/2023)
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
                                index: this.tabIndex[field],
                            });
                        } else {
                            errorList.push({
                                error: this.Resource.dialog.description.duplidateError(
                                    error
                                ),
                                ref: field,
                                index: this.tabIndex[field],
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
         * Hàm thực hiện việc thêm và cất thông tin khách hàng
         * Author: QuangHuy (10/12/2023)
         */
        async saveAndAddData() {
            try {
                this.$refs.Department.handleClickOutside();
                this.$refs.Position.handleClickOutside();
                this.isContinueAdd = true;
                this.validate();
                let errorList = this.takeErrorList(this.errors);
                if (errorList.length > 0) {
                    this.showInValidInputDialog(errorList);
                } else {
                    this.isLoadForm = true;
                    if (this.formMode === this.Enum.formMode.edit) {
                        await this.editEmployee();
                    } else {
                        await this.addEmployee();
                    }
                    this.isLoadForm = false;
                }
            } catch (error) {
                this.showSystemErrorDialog();
            }
        },

        /**
         * Hàm xử lý sự kiện nhấn nút Cất trong form
         * Author: QuangHuy (07/12/2023)
         */
        async saveData() {
            try {
                this.isContinueAdd = false;
                this.$refs.Department.handleClickOutside();
                this.$refs.Position.handleClickOutside();
                this.validate();
                let errorList = this.takeErrorList(this.errors);
                if (errorList.length > 0) {
                    this.showInValidInputDialog(errorList);
                } else {
                    if (this.formMode === this.Enum.formMode.edit) {
                        await this.editEmployee();
                    } else {
                        await this.addEmployee();
                    }
                }
            } catch (error) {
                this.showSystemErrorDialog();
            }
        },

        /**
         * Hàm xử lý trước khi thực hiện đóng Form
         * Author: QuangHuy (27/01/2024)
         */
        handleWhenCloseForm() {
            // Kiểm tra xem dữ liệu đã bị thay đổi chưa
            if (!this.isChangeData) {
                this.closeForm();
                return;
            }
            this.$refs.Department.handleClickOutside();
            this.$refs.Position.handleClickOutside();
            this.showDialog({
                title: this.Resource.dialog.title.confirmCancel,
                type: "confirm-blue",
                isNoBtn: true,
                description: this.Resource.dialog.description.confirmCancel,
                callback: this.handleFocusInput,
                clickYesOption: async () => {
                    this.isContinueAdd = false;
                    this.closeDialog();
                    this.validate();
                    let errorList = this.takeErrorList(this.errors);
                    if (errorList.length > 0) {
                        // Delay để không bị lỗi hiện Dialog quá nhanh
                        setTimeout(() => {
                            this.showInValidInputDialog(errorList);
                        }, 100);
                    } else {
                        if (this.formMode === this.Enum.formMode.edit) {
                            await this.editEmployee();
                        } else {
                            await this.addEmployee();
                        }
                    }
                },
                clickNoOption: () => {
                    this.closeForm();
                    this.closeDialog();
                },
            });
        },

        handleFocusInput() {
            if (this.$refs.EmployeeCode) {
                this.$refs.EmployeeCode.focus();
            }
        },

        /**
         * Hàm focus và ô input đầu tiền có lỗi nhập liệu
         * Author: QuangHuy (15/12/2023)
         */
        focusFirstErrorInput(errors) {
            try {
                errors.sort((a, b) => a.index - b.index);
                if (this.$refs[errors[0].ref]) {
                    this.$refs[errors[0].ref].focus();
                }
            } catch (error) {
                this.showSystemErrorDialog();
            }
        },

        /**
         * Hàm hiện dialog hiện thị lỗi nhập liệu
         * @param {*} errors: Danh sách lỗi
         * Author: QuangHuy (11/12/2023)
         */
        showInValidInputDialog(errors, isDuplicate = false) {
            try {
                let errorList = errors.map((item) => item.error);
                this.showDialog({
                    title: this.Resource.dialog.title.inputError,
                    errors: errorList,
                    type: "input-error",
                    newPrimaryText: isDuplicate
                        ? this.Resource.button.getNewCode
                        : null,
                    callback: isDuplicate ? this.handleFocusInput : null,
                    isNoBtn: isDuplicate,
                    clickYesOption: async () => {
                        if (isDuplicate) {
                            this.setLoading(true);
                            await this.loadEmployeeNewCode();
                            this.setLoading(false);
                            this.closeDialog();
                        } else {
                            this.closeDialog();
                            this.focusFirstErrorInput(errors);
                        }
                    },
                    clickIconClose: () => {
                        this.focusFirstErrorInput(errors);
                    },
                    clickNoOption: () => {
                        this.closeDialog();
                        this.focusFirstErrorInput(errors);
                    },
                });
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
                callback: this.handleFocusInput,
                clickYesOption: () => {
                    this.closeDialog();
                },
            });
        },

        /**
         * Hàm validate dữ liệu trong form
         * Author: QuangHuy (07/12/2023)
         */
        validate() {
            try {
                this.errors = {};
                this.validateVer2.schema = this.schema;
                this.validateVer2.resource = this.Resource;
                this.validateVer2.validateAll(this.employee);
                this.errors = { ...this.errors, ...this.validateVer2.errors };
                this.$refs.Department.validateInput();
                this.$refs.Position.validateInput();
            } catch (error) {
                this.showSystemErrorDialog();
            }
        },

        /**
         * Hàm lấy mã khách hàng mới đổ vào trường Mã khách hàng
         * Author: QuangHuy (07/12/2023)
         */
        async loadEmployeeNewCode() {
            try {
                const data = await EmployeeService.getNewCode();
                this.employee.EmployeeCode = data;
            } catch (error) {
                this.setLoading(false);
                this.handleResponseError(
                    error,
                    this.handleResponseApiEmployeeForm
                );
            }
        },

        /**
         * Hàm tải lấy thông tin của khách hàng và truyền vào form sửa
         * Author: QuangHuy (17/12/2023)
         */
        async loadEmployeeInfomation() {
            try {
                this.employee = {
                    ...(this.employeeEntity || null),
                };
                if (this.formMode === this.Enum.formMode.add) {
                    await this.loadEmployeeNewCode();
                }
            } catch (error) {
                this.setLoading(false);
                this.showSystemErrorDialog();
            }
        },

        /**
         * Hàm gọi service thêm khách hàng mới
         * Hiện Dialog thông báo nếu có lỗi
         * Hiện Toast Message nếu thành công
         * Author: QuangHuy (11/12/2023)
         */
        async addEmployee() {
            try {
                this.setLoading(true);
                await EmployeeService.create(this.employee);
                let newCode = await EmployeeService.getNewCode();
                // Làm mới lại dữ liệu nhân viên
                this.employee = {
                    EmployeeCode: newCode,
                    FullName: null,
                    DateOfBirth: null,
                    Gender: 0,
                    PhoneNumber: null,
                    IdentityNumber: null,
                    IdentityPlace: null,
                    IdentityDate: null,
                    PositionId: null,
                    PositionName: "",
                    DepartmentId: null,
                    DepartmentName: "",
                    BankAccount: null,
                    BankName: null,
                    BankBranch: null,
                    Email: null,
                };
                this.setLoading(false);
                this.addToast(
                    this.Enum.toast.success,
                    this.Resource.toast.addSuccess(
                        this.Resource.entity.employee
                    )
                );
                if (!this.isContinueAdd) {
                    this.closeForm();
                } else {
                    this.isChangeData = false;
                }
                this.reloadData();
            } catch (error) {
                this.setLoading(false);
                this.handleResponseError(
                    error,
                    this.handleResponseApiEmployeeForm
                );
            }
        },

        /**
         * Hàm xử lý lỗi API trả về nếu có
         * Author: QuangHuy (24/01/2024)
         */
        handleResponseApiEmployeeForm(status, error) {
            try {
                let errors = null;
                let errorList = null;
                switch (status) {
                    case 419:
                        this.addToast(
                            this.Enum.toast.info,
                            this.Resource.toast.expiredAccessLogin
                        );
                        this.$router.push({ name: "login" });
                        return true;
                    case 400:
                        errors = error.response.data.Errors;
                        for (let field in errors) {
                            if (Array.isArray(errors[field])) {
                                this.errors[field] = errors[field];
                            } else {
                                this.errors[field] = [errors[field]];
                            }
                        }
                        errorList = this.takeErrorList(errors);
                        this.showInValidInputDialog(errorList);
                        return true;
                    case 409:
                        errors = error.response.data.Errors;
                        for (let field in errors) {
                            this.errors[field] = [errors[field]];
                        }
                        errorList = this.takeErrorList(errors);
                        this.showInValidInputDialog(errorList, true);
                        return true;
                    default:
                        return false;
                }
            } catch (error) {
                return false;
            }
        },

        /**
         * Hàm sửa thông tin khách hàng, gọi qua Service
         * Author: QuangHuy (18/12/2023)
         */
        async editEmployee() {
            try {
                this.setLoading(true);
                await EmployeeService.update(
                    this.employee,
                    this.employeeEntity.EmployeeId
                );
                let newCode = await EmployeeService.getNewCode();
                // Làm mới lại dữ liệu nhân viên
                this.employee = {
                    EmployeeCode: newCode,
                    FullName: null,
                    DateOfBirth: null,
                    Gender: 0,
                    PhoneNumber: null,
                    LandlineTelephone: null,
                    IdentityNumber: null,
                    IdentityPlace: null,
                    IdentityDate: null,
                    PositionId: null,
                    PositionName: "",
                    DepartmentId: null,
                    DepartmentName: "",
                    BankAccount: null,
                    BankName: null,
                    BankBranch: null,
                    Email: null,
                };
                this.setLoading(false);
                this.addToast(
                    this.Enum.toast.success,
                    this.Resource.toast.saveSuccess(
                        this.Resource.entity.employee
                    )
                );
                this.reloadData();
                if (!this.isContinueAdd) {
                    this.closeForm();
                } else {
                    this.$emit("update:formMode", this.Enum.formMode.add);
                    this.isChangeData = false;
                }
            } catch (error) {
                this.setLoading(false);
                this.handleResponseError(
                    error,
                    this.handleResponseApiEmployeeForm
                );
            }
        },

        /**
         * Hàm xử lý phím tắt của form nhân viên
         * Author: QuangHuy (20/03/2024)
         */
        handleKeyShortForm(e) {
            const keyCode = e.keyCode;
            switch (keyCode) {
                case 83:
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.saveAndAddData();
                        } else if (!e.shiftKey) {
                            this.saveData();
                        }
                    }
                    break;
                case 27:
                    this.handleWhenCloseForm();
                    break;
                default:
                    break;
            }
        },
    },

    computed: {
        /**
         * Hàm lấy title của form theo form mode
         * Author: QuangHuy (18/12/2023)
         */
        getTitle() {
            switch (this.formMode) {
                case this.Enum.formMode.add:
                    return this.Resource.form.title.employee.add;
                case this.Enum.formMode.edit:
                    return this.Resource.form.title.employee.edit;
                default:
                    return this.Resource.form.title.employee.add;
            }
        },
    },

    watch: {
        employee: {
            handler() {
                if (!this.isChangeData && !this.isLoadForm) {
                    this.isChangeData = true;
                }
            },
            deep: true,
        },
        "employee.DepartmentId"(newVal) {
            if (newVal === "") {
                this.employee.DepartmentId = null;
            }
        },
        "employee.PositionId"(newVal) {
            if (newVal === "") {
                this.employee.PositionId = null;
            }
        },
    },
};
</script>

<style scoped>
@import url(./employee-form.css);
</style>
