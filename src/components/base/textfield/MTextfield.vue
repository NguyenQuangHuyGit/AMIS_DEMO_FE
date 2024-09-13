<template>
    <div class="m-textfield" :class="$attrs.class" @keydown="$attrs.onKeydown">
        <Tooltip :title="$attrs.title" placement="top" v-if="label">
            <label
                v-if="label"
                class="m-textfield-label"
                :class="{ required: required }"
                ref="labelField"
                >{{ label }}<span v-if="required"> *</span></label
            >
        </Tooltip>

        <div v-if="withAction" class="m-textfield-wac">
            <input
                :type="type"
                :placeholder="$attrs.placeholder"
                :name="$attrs.name"
                v-model="value"
                :tabindex="tabindex"
                @blur="handleBlurInput"
                @focus="handleFocus"
                @input="handleInput"
                @keydown="handleKeyPress"
                ref="input"
            />
            <div class="m-textfield-icon" @click="handleAction">
                <span></span>
            </div>
        </div>
        <input
            v-else
            class="m-textfield-input"
            :type="type"
            :name="$attrs.name"
            :placeholder="$attrs.placeholder"
            :class="textAlign"
            v-model="value"
            :tabindex="tabindex"
            @blur="handleBlurInput"
            @focus="handleFocus"
            @input="handleInput"
            ref="input"
        />
        <p v-if="errors" class="error-message">{{ errors[0] }}</p>
    </div>
</template>

<script>
export default {
    name: "MTextfield",
    inheritAttrs: false,
    props: {
        type: {
            type: String,
            default: "text",
        },
        label: String,
        required: Boolean,
        withAction: Boolean, // có bảo gồm action như search...
        schema: Object, // luật dùng validate trường đó
        errors: Array,
        modelValue: [Number, String],
        textStyle: {
            type: String,
            default: "left",
        },
        regex: String,
        digitOnly: Boolean,
        tabindex: Number,
        isUpper: Boolean,
        isUpperEachSpace: Boolean,
    },
    data() {
        return {
            textAlign: `text-${this.textStyle}`,
        };
    },
    computed: {
        value: {
            get() {
                if (this.isUpper && this.modelValue) {
                    return (
                        this.modelValue.charAt(0).toUpperCase() +
                        this.modelValue.slice(1)
                    );
                } else if (this.isUpperEachSpace && this.modelValue) {
                    return this.modelValue
                        .toString()
                        .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
                }
                return this.modelValue || "";
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
    methods: {
        /**
         * Hàm xử lý khi nhấn phim trong ô input
         * @param {*} e: event
         * Author: QuangHuy (22/01/2024)
         */
        handleKeyPress(e) {
            switch (e.code) {
                case "Enter":
                    this.$emit("beginAction");
                    break;
                case "Escape":
                    this.$refs.input.blur();
                    break;
                default:
                    break;
            }
        },
        /**
         * Hàm thực hiện khi click vào icon của textfield
         * Author: QuangHuy (15/01/2024)
         */
        handleAction() {
            this.$emit("beginAction");
            this.$refs.input.focus();
        },

        /**
         * Hàm xử lý khi blur ra khỏi ô Input
         * Author: QuangHuy (07/12/2023)
         */
        handleBlurInput() {
            this.validate();
            this.$emit("blurInput");
        },

        /**
         * Hàm validate dữ liệu của input
         * Author: QuangHuy (07/12/2023)
         */
        validate() {
            try {
                if (this.schema) {
                    if (this.withAction) {
                        return;
                    }
                    if (this.value !== null && this.value !== undefined) {
                        // Truyền key: camelCase
                        this.validateVer2.schema = this.schema;
                        this.validateVer2.resource = this.Resource;
                        let { newErr, newVal } = this.validateVer2.validate(
                            this.value
                        );
                        if (newVal) {
                            this.value = newVal;
                        }
                        this.$emit("update:errors", newErr);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },

        /**
         * Hàm xử lý khi bắt đầu nhập Input
         * Author: QuangHuy (07/12/2023)
         */
        handleInput() {
            this.$emit("update:errors", null);
        },

        /**
         * Hàm xử lý focus vào Input
         * Author: QuangHuy (07/12/2023)
         */
        handleFocus() {
            this.$emit("focusInput");
            this.$refs.input.setSelectionRange(0, this.value.length);
        },

        /**
         * Hàm focus vào input
         * Author: QuangHuy (07/12/2023)
         */
        focus() {
            this.$refs.input.focus();
        },
    },
    watch: {
        /**
         * Hàm theo dỏi giá trị thay đổi cuarvalue input để validate
         * Author: QuangHuy (07/12/2023)
         */
        value() {
            if (this.digitOnly) {
                this.value = this.value.toString().replace(/[^0-9]/g, "");
            }
            if (this.regex) {
                this.value = this.value
                    .toString()
                    .replace(/[^0-9]/g, "")
                    .replace(new RegExp(this.regex, "g"), ".");
            }
        },
    },
};
</script>

<style src="./textfield.css" scoped></style>
