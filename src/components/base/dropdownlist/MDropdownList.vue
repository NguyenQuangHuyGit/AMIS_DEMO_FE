<template>
    <div class="m-dropdown" :class="[reverse ? 'reverse' : 'non-reverse']">
        <label
            class="m-dropdown-label"
            :class="{ required: required }"
            v-if="label"
            >{{ label }}<span v-if="required"> *</span></label
        >
        <div class="m-dropdown-container">
            <div
                class="m-dropdown-textfield"
                @click="toggleOptionList"
                :class="[isOpen ? 'm-dropdown-focus' : '']"
            >
                <input
                    type="text"
                    :placeholder="$attrs.placeholder"
                    readonly
                    v-model="value"
                    ref="input"
                />
                <span
                    class="dropdown-icon"
                    :class="[isOpen ? 'rotate' : '']"
                ></span>
            </div>
            <div
                class="m-dropdown-option"
                v-if="isOpen"
                v-clickOutside="handleClickOutside"
            >
                <div
                    class="m-dropdown-value disabled-option"
                    :class="[selectedOption ? '' : 'selected-option']"
                    v-if="defaultSelect"
                    @click="handleClickDefaultOption"
                >
                    -- {{ defaultSelect }} --<span></span>
                </div>
                <div
                    v-for="option in dropdownOptions"
                    :key="option.value"
                    class="m-dropdown-value"
                    :value="option.value"
                    :class="[
                        option.value.toString() === selectedOption
                            ? 'selected-option'
                            : '',
                    ]"
                    @click="handleSelectValue"
                >
                    {{ option.text }}<span></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MDropdownList",
    props: {
        label: String,
        reverse: Boolean,
        required: Boolean,
        dropdownOptions: Array,
        selectedValue: [String, Number],
        isParent: {
            type: Boolean,
            default: false,
        },
        disableClickOutside: {
            type: Boolean,
            default: false,
        },
        autoResize: {
            type: Boolean,
            default: true,
        },
        defaultSelect: String,
    },

    data() {
        return {
            isOpen: false,
            value: "",
            selectedOption: null,
        };
    },

    mounted() {
        try {
            // Cập nhật độ dài của input theo độ dài của giá trị trong ô input
            if (this.autoResize) {
                this.$refs.input.style.width =
                    (this.$refs.input.value.length + 1) * 6 + "px";
            }
        } catch (error) {
            console.error(error);
        }
    },

    beforeUpdate() {
        try {
            // Cập nhật độ dài của input theo độ dài của giá trị trong ô input
            if (this.autoResize) {
                this.$refs.input.style.width =
                    (this.$refs.input.value.length + 1) * 6 + "px";
            }
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * Hàm gán các giá trị khi component được tạo
     */
    created() {
        try {
            if (this.dropdownOptions && this.selectedValue) {
                // Gán value của option đang chọn
                this.selectedOption = this.selectedValue;
                // Gán text cho input
                let option = this.dropdownOptions.find((option) => {
                    return (
                        option.value.toString() ===
                        this.selectedValue.toString()
                    );
                });
                if (option) {
                    this.value = option.text;
                } else {
                    this.value = this.defaultSelect;
                }
            } else {
                this.value = this.defaultSelect;
            }
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        /**
         * Hàm xử lý khi nhấn lựa chọn mặc định
         * Author: QuangHuy (03/04/2024)
         */
        handleClickDefaultOption() {
            if (!this.selectedOption) {
                this.isOpen = false;
            }
        },

        /**
         * Hàm bật tắt menu dropdown cho parent Component khi cần
         * Author: QuangHuy (13/12/2023)
         */
        toggleOptionListV2() {
            this.isOpen = !this.isOpen;
        },

        /**
         * Hàm bật tắt menu dropdown
         * @param {*} e: event
         * Author: QuangHuy (08/12/2023)
         */
        toggleOptionList() {
            if (this.isParent) {
                return;
            }
            this.isOpen = !this.isOpen;
        },

        /**
         * Hàm xử lý khi chọn giá trị trong menu
         * @param {*} e: event
         * Author: QuangHuy (08/12/2023)
         */
        handleSelectValue: function (e) {
            try {
                if (this.isParent) {
                    e.stopPropagation();
                }
                // Cập nhật giá trị
                if (e.target.getAttribute("value") === null) {
                    // Cập nhật giá trị input
                    this.value = e.target.parentElement.innerText;
                    // Cập nhật modelValue giá trị được chọn
                    this.selectedOption =
                        e.target.parentElement.getAttribute("value");
                } else {
                    // Cập nhật giá trị input
                    this.value = e.target.innerText;
                    // Cập nhật modelValue giá trị được chọn
                    this.selectedOption = e.target.getAttribute("value");
                }
                // Cập nhật trạng thái của dropdown option
                this.isOpen = false;
                // Emit các hàm và cập nhật các giá trị ra ngoài
                this.$emit("update:selectedValue", this.selectedOption);
                this.$emit("selectOptionDropDown", this.selectedOption);
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm đóng danh sách lựa chọn của dropdownlist
         * Author: QuangHuy (11/03/2024)
         */
        closeOption() {
            this.isOpen = false;
        },

        /**
         * Hàm xử lý đóng menu khi click ra ngoài
         * Author: QuangHuy (08/12/2023)
         */
        handleClickOutside() {
            if (!this.disableClickOutside) {
                this.isOpen = false;
            }
        },
    },
};
</script>

<style scoped src="./dropdownlist.css"></style>
