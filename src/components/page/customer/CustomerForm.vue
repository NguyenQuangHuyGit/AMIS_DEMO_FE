<template>
    <MForm :title="title" class="customer-popup-control" @close="closeForm">
        <template #form-control>
            <div class="row">
                <MTextfield
                    @keydown.shift.tab.prevent="$event.preventDefault()"
                    ref="CustomerCode"
                    class="customer-input-code"
                    :label="Resource.form.label.customer.customerCode"
                    required
                    v-model="customer.CustomerCode"
                    :schema="schema.customerCode"
                    v-model:errors="errors.CustomerCode"
                    :tabindex="1"
                ></MTextfield>
                <MTextfield
                    class="customer-input-name"
                    :label="Resource.form.label.fullName"
                    v-model="customer.FullName"
                    required
                    ref="FullName"
                    :schema="schema.fullName"
                    v-model:errors="errors.FullName"
                    :tabindex="2"
                ></MTextfield>
                <MDatePicker
                    :label="Resource.form.label.dateOfBirth"
                    class="customer-input-birth"
                    v-model="customer.DateOfBirth"
                    ref="DateOfBirth"
                    v-model:errors="errors.DateOfBirth"
                    :tabindex="5"
                ></MDatePicker>
                <MRadioGroup
                    :label="Resource.form.label.gender"
                    class="customer-input-gender"
                    name="gender"
                    ref="Gender"
                    v-model="customer.Gender"
                    :radioOptions="radioOptions"
                    defaultValue="0"
                    :tabindex="6"
                ></MRadioGroup>
            </div>
            <div class="row">
                <MTextfield
                    class="customer-input-phone"
                    :label="this.Resource.form.label.phoneNumber"
                    v-model="customer.PhoneNumber"
                    digitOnly
                    ref="PhoneNumber"
                    :schema="schema.phoneNumber"
                    v-model:errors="errors.PhoneNumber"
                    :tabindex="3"
                ></MTextfield>
                <MTextfield
                    class="customer-input-identify"
                    :label="this.Resource.form.label.identification"
                    :title="this.Resource.tooltip.identification"
                    :tabindex="7"
                ></MTextfield>
                <MDatePicker
                    :label="this.Resource.form.label.dateIndentify"
                    class="customer-input-identify-date"
                    :tabindex="8"
                ></MDatePicker>
            </div>
            <div class="row">
                <MTextfield
                    class="customer-input-email"
                    :label="Resource.form.label.email"
                    name="customer-email"
                    v-model="customer.Email"
                    ref="Email"
                    v-model:errors="errors.Email"
                    :tabindex="4"
                ></MTextfield>
                <MCombobox
                    class="customer-input-group"
                    :label="Resource.form.label.customerGroup"
                    :resources="resources"
                    v-model="customer.CustomerGroup"
                    :tabindex="9"
                />
            </div>
            <div class="row">
                <MTextfield
                    class="customer-input-dept"
                    :label="this.Resource.form.label.debit"
                    v-model="customer.DebitAmount"
                    textStyle="right"
                    ref="DebitAmount"
                    regex="\B(?=(\d{3})+(?!\d))"
                    :tabindex="10"
                ></MTextfield>
            </div>
            <div class="row">
                <MTextfield
                    class="customer-input-company"
                    :label="Resource.form.label.company"
                    :tabindex="11"
                ></MTextfield>
            </div>
            <div class="row">
                <MTextfield
                    class="customer-input-address"
                    :label="this.Resource.form.label.address"
                    v-model="customer.Address"
                    :tabindex="12"
                ></MTextfield>
            </div>
        </template>
        <template #form-action-left>
            <MButton
                :text="this.Resource.button.cancel"
                class="m-secondary-button"
                @clickBtn="cancelForm"
                :tabindex="13"
            ></MButton>
        </template>
        <template #form-action-right>
            <MButton
                @keydown.tab.exact.prevent="$refs.CustomerCode.focus()"
                v-if="formMode === Enum.formMode.add"
                :text="this.Resource.button.saveAndAddForm"
                class="m-primary-button"
                @clickBtn="saveAndAddData"
                :tabindex="15"
            ></MButton>
            <MButton
                :text="this.Resource.button.saveForm"
                :class="[
                    formMode === Enum.formMode.add
                        ? 'm-secondary-button'
                        : 'm-primary-button',
                ]"
                @clickBtn="saveData"
                :tabindex="14"
            ></MButton>
        </template>
    </MForm>
</template>

<script>
import CustomerService from "@/service/customer.js";
import CustomerGroupService from "@/service/customergroup.js";
export default {
    name: "CustomerForm",
    inject: ["addToast", "showDialog", "closeDialog", "setLoading"],
    emits: ["closeForm"],
    data() {
        return {
            title: this.getTitle(),
            // label và value cho các radio button group
            radioOptions: [
                {
                    value: 0,
                    label: this.Resource.radioButton.male,
                    checked: true,
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
            customer: {
                CustomerCode: "", // Mã khách hàng
                FullName: "", // Họ tên
                Email: "",
                DateOfBirth: "",
                Gender: "",
                PhoneNumber: "",
                CompanyName: "",
                Address: "",
                DebitAmount: "",
                CustomerGroup: "",
            },
            // Object lưu các điều kiện và thông báo ra cho cho người dùng
            schema: {
                customerCode: {
                    rules: { required: true },
                    name: "customerCode",
                },
                fullName: {
                    rules: { required: true, max: 255 },
                    name: "fullName",
                },
                phoneNumber: {
                    rules: { max: 11 },
                    name: "phoneNumber",
                },
            },
            // Mảng lưu các lỗi của form
            errors: {},
            resources: [],
        };
    },

    /**
     * Hàm thực hiên focus input khi form hiện
     * Author: QuangHuy (07/12/2023)
     */
    mounted() {
        this.$refs.CustomerCode.focus();
    },

    created() {
        this.loadDataIntoForm();
    },

    props: {
        isShowForm: Boolean,
        formMode: Number,
        customerId: {
            type: String,
            default: null,
        },
    },

    methods: {
        /**
         * Hàm load các dữ liệu cần thiết lên form
         * Author: QuangHuy (20/12/2023)
         */
        loadDataIntoForm() {
            this.setLoading(true);
            this.loadCustomerGroupCombobox();
            if (this.formMode === this.Enum.formMode.add) {
                this.loadCustomerNewCode();
            } else {
                this.loadCustomerInfomation();
            }
            this.setLoading(false);
        },

        /**
         * Hàm lấy title của form theo form mode
         * Author: QuangHuy (18/12/2023)
         */
        getTitle() {
            switch (this.formMode) {
                case this.Enum.formMode.add:
                    return this.Resource.form.title.customer.add;
                case this.Enum.formMode.edit:
                    return this.Resource.form.title.customer.edit;
                default:
                    return this.Resource.form.title.customer.add;
            }
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
            let errorList = [];
            for (let field in errors) {
                let error = errors[field];
                if (error && error.length > 0) {
                    errorList.push({
                        error: error[0],
                        ref: field,
                    });
                }
            }
            return errorList;
        },

        /**
         * Hàm thực hiện việc thêm và cất thông tin khách hàng
         * Author: QuangHuy (10/12/2023)
         */
        saveAndAddData() {
            try {
                this.validate();
                let errorList = this.takeErrorList(this.errors);
                if (errorList.length > 0) {
                    this.showInValidInputDialog(errorList);
                } else {
                    this.showDialog({
                        title: this.Resource.dialog.title.confirmSaveAndAdd,
                        type: "confirm-blue",
                        description:
                            this.Resource.dialog.description.confirmSaveAndAdd(
                                this.Resource.entity.customer
                            ),
                        clickYesOption: () => {
                            this.closeDialog();
                            this.addCustomer();
                        },
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },

        /**
         * Hàm xử lý sự kiện nhấn nút Thêm và Cất trong form
         * Author: QuangHuy (07/12/2023)
         */
        saveData() {
            try {
                this.validate();
                let errorList = this.takeErrorList();
                if (errorList.length > 0) {
                    this.showInValidInputDialog(errorList);
                } else {
                    this.showDialog({
                        title: this.Resource.dialog.title.confirmSave,
                        type: "confirm-blue",
                        description:
                            this.Resource.dialog.description.confirmSave(
                                this.Resource.entity.customer
                            ),
                        clickYesOption: () => {
                            if (this.formMode === this.Enum.formMode.edit) {
                                this.editCustomer();
                            }
                            this.closeDialog();
                        },
                    });
                }
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm focus và ô input đầu tiền có lỗi nhập liệu
         * Author: QuangHuy (15/12/2023)
         */
        focusFirstErrorInput(errors) {
            this.$refs[errors[0].ref].focus();
        },

        /**
         * Hàm hiện dialog hiện thị lỗi nhập liệu
         * @param {*} errors: Danh sách lỗi
         * Author: QuangHuy (11/12/2023)
         */
        showInValidInputDialog(errors) {
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
        },

        /**
         * Hàm hiện dialog lỗi server, network
         * Author: QuangHuy (11/12/2023)
         */
        showNetworkErrorDialog() {
            this.showDialog({
                title: this.Resource.dialog.title.networkError,
                description: this.Resource.dialog.description.networkError,
                type: "network-error",
                clickYesOption: () => {
                    this.closeDialog();
                },
                clickIconClose: () => {},
            });
        },

        validateDebitField() {
            this.customer.DebitAmount =
                this.customer.DebitAmount?.toString().replaceAll(".", "");
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
                this.validateVer2.validateAll(this.customer);
                this.errors = { ...this.errors, ...this.validateVer2.errors };
            } catch (error) {
                console.error(error);
            }
        },

        async loadCustomerGroupCombobox() {
            try {
                const datas = await CustomerGroupService.getAll();
                this.resources = datas.map((data) => {
                    return {
                        value: data.CustomerGroupId,
                        text: data.CustomerGroupName,
                    };
                });
            } catch (error) {
                this.setLoading(false);
                console.log(error.response);
            }
        },

        /**
         * Hàm lấy mã khách hàng mới đổ vào trường Mã khách hàng
         * Author: QuangHuy (07/12/2023)
         */
        async loadCustomerNewCode() {
            try {
                const data = await CustomerService.getNewCode();
                this.customer.CustomerCode = data;
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
         * Hàm tải lấy thông tin của khách hàng và truyền vào form sửa
         * Author: QuangHuy (17/12/2023)
         */
        async loadCustomerInfomation() {
            try {
                const data = await CustomerService.getById(this.customerId);
                this.customer = { ...this.customer, ...data };
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
         * Hàm gọi service thêm khách hàng mới
         * Hiện Dialog thông báo nếu có lỗi
         * Hiện Toast Message nếu thành công
         * Author: QuangHuy (11/12/2023)
         */
        async addCustomer() {
            try {
                this.validateDebitField();
                this.setLoading(true);
                await CustomerService.create(this.customer);
                this.setLoading(false);
                this.closeForm();
                this.addToast(
                    this.Enum.toast.success,
                    this.Resource.toast.addSuccess(
                        this.Resource.entity.customer
                    )
                );
            } catch (error) {
                this.setLoading(false);
                if (error.response.status === 400) {
                    let errors = error.response.data.errors;
                    for (let field in errors) {
                        this.errors[field] = errors[field];
                    }
                    let errorList = this.takeErrorList(errors);
                    this.showInValidInputDialog(errorList);
                } else {
                    this.showNetworkErrorDialog();
                }
            }
        },

        /**
         * Hàm sửa thông tin khách hàng, gọi qua Service
         * Author: QuangHuy (18/12/2023)
         */
        async editCustomer() {
            try {
                this.validateDebitField();
                this.setLoading(true);
                await CustomerService.update(this.customer, this.customerId);
                this.setLoading(false);
                this.closeForm();
                this.addToast(
                    this.Enum.toast.success,
                    this.Resource.toast.saveSuccess(
                        this.Resource.entity.customer
                    )
                );
            } catch (error) {
                this.setLoading(false);
                console.log(error.response);
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
    },
};
</script>

<style scoped>
@import url(./customerform.css);
</style>
