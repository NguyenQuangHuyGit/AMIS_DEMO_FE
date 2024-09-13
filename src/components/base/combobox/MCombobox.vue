<template>
    <div class="m-combobox">
        <label class="m-combobox-label" :class="{ required: required }"
            >{{ label }}<span v-if="required"> *</span>
        </label>
        <div class="m-combobox-container" :title="title">
            <div
                class="m-combobox-textfield"
                :class="[isValid ? '' : 'not-exist']"
            >
                <input
                    type="text"
                    :placeholder="$attrs.placeholder"
                    @input="handleInput"
                    v-model="value"
                    ref="input"
                    @keydown="handleKeyDown"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    :tabindex="tabindex"
                />
                <div class="m-combobox-icon" @mousedown="toggleOptionMenu">
                    <span></span>
                </div>
            </div>
            <p v-if="errors" class="error-message">{{ errors[0] }}</p>
            <div
                class="m-combobox-option"
                v-if="isShow"
                v-clickOutside="handleClickOutside"
                title=""
                v-hoverIndex="handleSelectIndex"
                :key="resoureData"
            >
                <div class="m-combobox-option-container">
                    <div
                        class="m-combobox-value"
                        v-for="(option, index) in resoureData"
                        ref="listOptions"
                        :key="option.value"
                        :value="option.value"
                        :class="[
                            option.value.toString() === modelValue?.toString()
                                ? 'selected-option'
                                : '',
                            hoverIndex === index ? 'value-hover' : '',
                        ]"
                        @click="handleSelectOption"
                    >
                        {{ option.text }}
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FormatValue from "@/js/helper/format.js";
export default {
    name: "MCombobox",
    components: {},
    // inheritAttrs: false,
    props: {
        selectedText: String,
        label: String,
        resources: {
            type: Array,
        },
        modelValue: String,
        tabindex: Number,
        required: Boolean,
        errors: Array,
        schema: Object,
        text: String,
        inValidMessage: String,
    },

    computed: {
        value: {
            get() {
                return this.text || "";
            },
            set(value) {
                this.$emit("update:text", value);
            },
        },
    },

    data() {
        return {
            isShow: false,
            isValid: true,
            resoureData: [],
            title: "",
            selectedOptionValue: "",
            hoverIndex: 0,
            isBlur: true,
        };
    },

    methods: {
        /**
         * Hàm focus vào ô input
         * Author: QuangHuy (15/01/2024)
         */
        focus() {
            this.$refs.input.focus();
        },
        /**
         * Hàm xử lý khi ô input bắt đầu được nhập
         * Author: QuangHuy (08/12/2023)
         */
        handleInput() {
            if (!this.isShow) {
                this.isShow = true;
                this.handleScrollToView();
            }
            this.$emit("update:modelValue", "");
            this.fillterresources();
            this.hoverIndex = 0;
            this.$emit("update:errors", null);
        },

        /**
         * Hàm xử lý khi ô input được focus
         * Author: QuangHuy (08/12/2023)
         */
        handleFocus() {
            this.$refs.input.setSelectionRange(0, this.value.length);
        },

        /**
         * Hàm xử lý bỏ dấu và đưa chuỗi về chữ thường
         * @param {*} text: chuỗi cần xử lý
         * @returns Chuỗi đã được xử lý
         * Author: QuangHuy (08/12/2023)
         */
        formatString(text) {
            let formatText = FormatValue.removeAccents(text.toLowerCase());
            return formatText;
        },

        /**
         * Hàm lọc bộ dữ liệu theo value
         * Author: QuangHuy (07/12/2023)
         */
        fillterresources() {
            try {
                // lọc resources theo value hiện tại
                if (this.resources) {
                    this.resoureData = Array.from(this.resources).filter(
                        (word) => {
                            return this.formatString(word.text).includes(
                                this.formatString(this.value)
                            );
                        }
                    );
                }
                // Nếu không có giá trị phù hợp thì ẩn option menu
                if (this.resoureData.length === 0) {
                    this.isShow = false;
                }
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm ẩn hiện menu option Combobox
         * Author: QuangHuy (07/12/2023)
         */
        toggleOptionMenu() {
            this.isBlur = false;
            if (this.resources) {
                this.$refs.input.focus();
                this.isShow = !this.isShow;
                this.resoureData = [...this.resources];
            }
        },

        /**
         * Hàm xử lý ẩn option khi click ra ngoài
         * Author: QuangHuy (08/12/2023)
         */
        handleClickOutside() {
            this.isShow = false;
        },

        /**
         * Hàm validate dữ liệu của input mặc định
         * Author: QuangHuy (07/12/2023)
         */
        validate() {
            try {
                if (this.isShow || !this.schema) {
                    return;
                }
                // Truyền key: camelCase
                this.validateVer2.schema = this.schema;
                this.validateVer2.resource = this.Resource;
                let { newErr } = this.validateVer2.validate(this.value);
                if (newErr === undefined) {
                    this.$emit("update:errors", null);
                } else {
                    this.$emit("update:errors", newErr);
                }
            } catch (error) {
                console.log(error);
            }
        },

        /**
         * Hàm kiểm tra xem giá trị có tồn tại trong database không
         * Author: QuangHuy (08/12/2023)
         */
        validateInput() {
            try {
                if (this.value.trim() === "") {
                    this.isValid = true;
                    return;
                }
                if (this.resources) {
                    this.isValid = this.resources.find((option) => {
                        return option.text === this.value.trim();
                    });
                }
                if (!this.isValid && this.inValidMessage) {
                    this.$emit("update:errors", [this.inValidMessage]);
                }
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm xử lý sự kiện khi blur input
         * Author: QuangHuy (02/01/2024)
         */
        handleBlur(e) {
            if (!this.isBlur) {
                e.target.focus();
            } else {
                this.validate();
                this.validateInput();
            }
            this.isBlur = true;
        },

        /**
         * Hàm xử lý khi chọn một giá trị option
         * @param {*} e: event
         * Author: QuangHuy (08/12/2023)
         */
        handleSelectOption(e) {
            try {
                let newVal = e.target.getAttribute("value");
                if (!newVal) {
                    newVal = e.target.parentElement.getAttribute("value");
                    this.value = e.target.parentElement.innerText;
                } else {
                    this.value = e.target.innerText;
                }
                this.isValid = true;
                this.$refs.input.focus();
                this.updateValue(newVal);
                this.$emit("update:errors", null);
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm cập nhập value được chọn mới cho Combobox
         * @param {*} newValue: giá trị value mới của combobox
         * Author: QuangHuy (10/12/2023)
         */
        updateValue(newValue) {
            if (this.isValid) {
                this.selectedOptionValue = newValue;
            }
            this.isShow = false;
            this.resoureData = [...this.resources];
        },

        /**
         * Hàm xử lý khi nhấn phím mũi tên lên xuống
         * @param {*} jump: bước nhảy
         * Author: QuangHuy (10/12/2023)
         */
        moveOptionWithArrow(jump) {
            try {
                let isFirstMount = false;
                if (!this.isShow) {
                    isFirstMount = true;
                    this.isShow = true;
                }
                if (this.resoureData.length === 0) {
                    this.resoureData = [...this.resources];
                }
                if (
                    this.hoverIndex === 0 &&
                    isFirstMount &&
                    this.hoverIndex + jump > 0
                ) {
                    this.handleScrollToView();
                    return;
                }
                if (this.hoverIndex + jump < 0) {
                    this.hoverIndex = this.resoureData.length - 1;
                } else if (this.hoverIndex + jump === this.resoureData.length) {
                    this.hoverIndex = 0;
                } else {
                    this.hoverIndex += jump;
                }
                this.handleScrollToView();
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm xử lý scroll đến phần tử giá trị đang được chọn khi mở Combobox option
         * Author: QuangHuy (10/12/2023)
         */
        handleScrollToView() {
            try {
                if (this.$refs.listOptions) {
                    this.$refs.listOptions[this.hoverIndex]?.scrollIntoView({
                        block: "nearest",
                        behavior: "smooth",
                    });
                }
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm xử lý khi nhấn ENTER
         * Author: QuangHuy (10/12/2023)
         */
        handleChooseByEnter() {
            try {
                if (!this.isShow && this.resoureData.length !== 0) {
                    return;
                }
                let newValue = this.resoureData[this.hoverIndex].value;
                this.value = this.resoureData[this.hoverIndex].text;
                this.isValid = true;
                this.$refs.input.focus();
                this.$emit("update:errors", null);
                this.updateValue(newValue);
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm xử lý khi nhấn TAB
         * Author: QuangHuy (10/12/2023)
         */
        handlePressTab() {
            this.validateInput();
            this.isShow = false;
        },

        /**
         * Hàm xử lý sự kiện dùng các phím mũi tên trên Combobox
         * @param {*} e: event
         * Author: QuangHuy (08/12/2023)
         */
        handleKeyDown(e) {
            switch (e.code) {
                case "ArrowDown":
                    e.preventDefault();
                    this.moveOptionWithArrow(1);
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    this.moveOptionWithArrow(-1);
                    break;
                case "Enter":
                    this.handleChooseByEnter();
                    break;
                case "Tab":
                    this.handlePressTab();
                    break;
            }
        },

        /**
         * Hàm xử lý scroll dến phần tử đang được focus bởi bàn phím
         * Author: QuangHuy (08/12/2023)
         */
        handleSelectIndex() {
            try {
                this.resoureData.forEach((item, index) => {
                    if (this.modelValue === item.value) {
                        this.hoverIndex = index;
                    }
                });
                setTimeout(() => {
                    if (this.$refs.listOptions[this.hoverIndex]) {
                        this.$refs.listOptions[this.hoverIndex].scrollIntoView({
                            block: "nearest",
                            behavior: "instant",
                        });
                    }
                }, 1);
            } catch (error) {
                console.error(error);
            }
        },
    },
    watch: {
        /**
         * Hàm cập nhật title mỗi khi isValid thay đổi
         * @param {*} newValue: giá trị mới thay đổi của isValid
         * Author: QuangHuy (08/12/2023)
         */
        isValid(newValue) {
            if (newValue) {
                this.title = "";
            } else {
                this.title = this.Resource.tooltip.inValidComboboxValue;
            }
        },

        /**
         * Hàm theo dõi thay đổi của isShow => update hoverIndex
         * @param {*} newValue: giá trị mới của isShow
         * Author: QuangHuy (10/12/2023)
         */
        // isShow(newValue) {
        //     if (!newValue) {
        //         this.hoverIndex = 0;
        //     }
        // },

        selectedOptionValue(newVal) {
            this.$emit("update:modelValue", newVal);
        },
    },
};
</script>

<style src="./combobox.css" scoped></style>
