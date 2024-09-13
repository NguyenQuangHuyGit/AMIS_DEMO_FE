<template>
    <div class="m-date-picker" ref="container">
        <label v-if="label" class="m-textfield-label">{{ label }}</label>
        <ConfigProvider
            :theme="{
                token: {
                    colorPrimary: '#50b83c',
                    fontFamily: 'Roboto',
                },
            }"
        >
            <DatePicker
                ref="input"
                class="m-date-picker-input"
                :locale="resource[lang].locale"
                :getPopupContainer="getContainer"
                v-model:value="value"
                placeholder="dd/mm/yyyy"
                format="DD-MM-YYYY"
                :placement="placement"
                :tabindex="tabindex"
                @change="handleDate"
                @blur="handleBlurInput"
                separator="/"
            />
        </ConfigProvider>
        <p v-if="errors" class="error-message">{{ errors[0] }}</p>
    </div>
</template>

<script>
import { DatePicker, ConfigProvider } from "ant-design-vue";
import viVN from "ant-design-vue/es/date-picker/locale/vi_VN";
import enUS from "ant-design-vue/es/date-picker/locale/en_US";
import dayjs from "dayjs";
import "dayjs/locale/vi";
export default {
    name: "MDatePicker",
    components: { DatePicker, ConfigProvider },
    props: {
        label: String,
        nameField: {
            type: String,
            default: "",
        },
        errors: Array,
        modelValue: [String, Date],
        tabindex: Number,
        schema: Object, // luật dùng validate trường đó
        placement: {
            type: String,
            default: "bottomLeft",
        },
        isContainer: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            resource: {
                VN: {
                    locale: viVN,
                    format: "DD/MM/YYYY",
                },
                EN: {
                    locale: enUS,
                    format: "MM/DD/YYYY",
                },
            },
            lang:
                +window.localStorage.getItem("langCode") ===
                this.Enum.langCode.VN
                    ? "VN"
                    : "EN",
        };
    },

    computed: {
        value: {
            get() {
                if (this.modelValue) {
                    let { resultForForm } = this.formatValue.formatDate(
                        new Date(this.modelValue)
                    );
                    return dayjs(resultForForm, "YYYY-MM-DD");
                } else {
                    return null;
                }
            },
            set(value) {
                if (value) {
                    let { resultForForm } = this.formatValue.formatDate(
                        new Date(value)
                    );
                    this.$emit("update:modelValue", resultForForm);
                } else {
                    this.$emit("update:modelValue", null);
                }
            },
        },
    },
    methods: {
        getContainer() {
            if (this.isContainer) {
                return this.$refs.container;
            } else {
                return document.body;
            }
        },

        /**
         * Hàm xử lý khi chọn giá trị ngày tháng
         * Author: QuangHuy (05/12/2023)
         */
        handleDate() {
            this.$emit("update:errors", null);
            // this.$emit("update:modelValue", this.value);
        },

        /**
         * Hàm focus ô input
         * Author: QuangHuy (05/12/2023)
         */
        focus() {
            this.$refs.input.focus();
        },

        /**
         * Hàm xử lý khi blur ra khỏi ô Input
         * Author: QuangHuy (07/12/2023)
         */
        handleBlurInput() {
            this.validate();
        },

        /**
         * Hàm validate dữ liệu của input
         * Author: QuangHuy (07/12/2023)
         */
        validate() {
            try {
                if (this.schema) {
                    if (this.value !== null && this.value !== undefined) {
                        // Truyền key: camelCase
                        this.validateVer2.schema = this.schema;
                        this.validateVer2.resource = this.Resource;
                        let { newErr } = this.validateVer2.validate(this.value);
                        this.$emit("update:errors", newErr);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>

<style src="./datepicker.css"></style>
