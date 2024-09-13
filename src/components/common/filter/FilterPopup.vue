<template>
    <div
        :style="{ top: top + 'px', left: left - 300 / 2 + 'px' }"
        class="filter-container"
        @mousedown="$event.stopPropagation()"
    >
        <p class="m-filter-title">{{ Resource.form.title.filter }}</p>
        <div class="m-filter-control">
            <MDropdownList
                :dropdownOptions="dropdownOptions[typeFilter]"
                :autoResize="false"
                :defaultSelect="Resource.textfield.defaultString"
                v-model:selectedValue="selectedOptionDropDown"
            />
            <MTextfield
                v-if="
                    typeFilter === this.Enum.filterType.text ||
                    typeFilter === this.Enum.filterType.number
                "
                :placeholder="Resource.textfield.placeholder.filter"
                v-model="filterValue"
            />
            <MDatePicker
                isContainer
                v-if="typeFilter === this.Enum.filterType.date"
                v-model="filterValue"
            />
        </div>
        <div class="m-filter-action">
            <MButton
                :text="Resource.button.apply"
                class="m-primary-button"
                @clickBtn="handleClickApplyFilter"
            />
            <MButton
                :text="Resource.button.cancelFilter"
                class="m-secondary-button"
                @clickBtn="handleClickCancelFilter"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "FilterPopup",
    components: {},
    props: {
        typeFilter: {
            type: Number,
            default: null,
        },
        modelValue: {
            type: [Number, String],
            default: null,
        },
        isOpen: {
            type: Boolean,
            default: false,
        },
        value: {
            type: String,
            default: null,
        },
        top: {
            type: [String, Number],
            default: "-9999",
        },
        left: {
            type: [String, Number],
            default: "-9999",
        },
    },

    data() {
        return {
            dropdownOptions: {
                [this.Enum.filterType.text]: [
                    {
                        value: this.Enum.detailFilterType.startWith,
                        text: this.Resource.dropDropOption.startWith,
                    },
                    {
                        value: this.Enum.detailFilterType.contain,
                        text: this.Resource.dropDropOption.contain,
                    },
                    {
                        value: this.Enum.detailFilterType.equal,
                        text: this.Resource.dropDropOption.equal,
                    },
                ],
                [this.Enum.filterType.number]: [
                    {
                        value: this.Enum.detailFilterType.small,
                        text: this.Resource.dropDropOption.small,
                    },
                    {
                        value: this.Enum.detailFilterType.equal,
                        text: this.Resource.dropDropOption.equal,
                    },
                    {
                        value: this.Enum.detailFilterType.high,
                        text: this.Resource.dropDropOption.high,
                    },
                ],
                [this.Enum.filterType.date]: [
                    {
                        value: this.Enum.detailFilterType.small,
                        text: this.Resource.dropDropOption.small,
                    },
                    {
                        value: this.Enum.detailFilterType.equal,
                        text: this.Resource.dropDropOption.equal,
                    },
                    {
                        value: this.Enum.detailFilterType.high,
                        text: this.Resource.dropDropOption.high,
                    },
                ],
            },
            selectedOptionDropDown: null,
            filterValue: null,
        };
    },

    /**
     * Hàm thực hiện khi component được tạo
     * Author: QuangHuy (12/04/2024)
     */
    created() {
        if (this.modelValue !== null && this.modelValue !== undefined) {
            this.selectedOptionDropDown = this.modelValue;
        }
        if (this.typeFilter === this.Enum.filterType.text) {
            this.filterValue = this.value || "";
        } else {
            this.filterValue = this.value;
        }
    },

    methods: {
        /**
         * Hàm xử lý bỏ điều kiện lọc này
         * Author: QuangHuy (12/04/2024)
         */
        handleClickCancelFilter() {
            this.selectedOptionDropDown = null;
            this.$emit("update:modelValue", null);
            this.$emit("update:value", null);
            this.$emit("changeState");
            this.$emit("update:isOpen", false);
        },

        /**
         * Hàm xử lý áp dụng điều kiện
         * Author: QuangHuy (12/04/2024)
         */
        handleClickApplyFilter() {
            if (this.filterValue !== null && this.selectedOptionDropDown) {
                this.$emit("update:modelValue", this.selectedOptionDropDown);
                this.$emit("update:value", this.filterValue);
                this.$emit("changeState");
            } else {
                this.$emit("update:modelValue", null);
                this.$emit("update:value", null);
                this.$emit("changeState");
            }
            this.$emit("update:isOpen", false);
        },
    },
};
</script>

<style src="./css/filter.css"></style>
