<template>
    <div class="m-filter-menu">
        <div class="m-filter-menu-title">
            <p>{{ Resource.menuFilter.title }}</p>
            <Tooltip
                :title="Resource.tooltip.closeBtn"
                placement="top"
                :mouseEnterDelay="0.7"
            >
                <div class="close-icon" @click="$emit('update:isShow', false)">
                    <span></span>
                </div>
            </Tooltip>
        </div>
        <MTextfield
            withAction
            :placeholder="Resource.textfield.placeholder.searchOnly"
            class="m-filter-menu-search"
        />
        <div class="m-filter-menu-body">
            <div
                class="m-filter-item"
                v-for="(item, index) in columnFilter"
                :key="index"
            >
                <div class="m-filter-item-container">
                    <input
                        type="checkbox"
                        v-model="activeFilterField[item.columnField]"
                    />
                    <p>
                        {{
                            common.getResourceString(
                                Resource.table,
                                entity,
                                item.columnField
                            )
                        }}
                    </p>
                </div>
                <div
                    class="m-filter-item-control"
                    v-if="activeFilterField[item.columnField]"
                >
                    <MDropdownList
                        :key="dataFilter[item.columnField].Value"
                        class="m-filter-item-option"
                        :dropdownOptions="dropdownOptions[item.filter]"
                        :autoResize="false"
                        :defaultSelect="Resource.textfield.defaultString"
                        v-model:selectedValue="
                            dataFilter[item.columnField].Value
                        "
                    />
                    <MTextfield
                        v-if="
                            item.filter === this.Enum.filterType.text ||
                            item.filter === this.Enum.filterType.number
                        "
                        :placeholder="Resource.textfield.placeholder.filter"
                        v-model="dataFilter[item.columnField].Key"
                    />
                    <MDatePicker
                        isContainer
                        v-if="item.filter === this.Enum.filterType.date"
                        v-model="dataFilter[item.columnField].Key"
                    />
                </div>
            </div>
        </div>
        <div class="m-filter-menu-footer">
            <MButton
                class="m-primary-button"
                :text="Resource.button.apply"
                @clickBtn="handleClickApplyAllFilter"
            ></MButton>
            <MButton
                class="m-secondary-button"
                :text="Resource.button.cancelFilter"
                @clickBtn="handleClickCancelAllFilter"
            ></MButton>
        </div>
    </div>
</template>

<script>
export default {
    name: "FilterMenu",
    props: {
        resources: Array,
        entity: String,
        isShow: Boolean,
        data: Object,
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
            columnFilter: null,
            activeFilterField: {},
            dataFilter: null,
        };
    },

    /**
     * Hàm xử lý khi component được tạo
     * Author: QuangHuy (13/07/2024)
     */
    created() {
        try {
            this.columnFilter = null;
            this.dataFilter = {};
            if (this.resources) {
                this.columnFilter = this.resources.filter((col) => {
                    if (col.filter !== null && col.filter !== undefined) {
                        this.activeFilterField[col.columnField] = false;
                        this.dataFilter[col.columnField] = {
                            Type: col.filter,
                            Value: null,
                            Key: null,
                        };
                        return true;
                    }
                    return false;
                });
            }
            if (this.data) {
                for (let key in this.data) {
                    if (this.data[key]) {
                        this.activeFilterField[key] = true;
                    }
                }
                this.dataFilter = Object.assign(this.dataFilter, this.data);
            }
        } catch (error) {
            console.log(error);
        }
    },

    methods: {
        handleClickCancelAllFilter() {
            try {
                // this.dataFilter = {};
                this.$emit("update:data", null);
                for (let column of this.columnFilter) {
                    let key = column.columnField;
                    this.activeFilterField[key] = false;
                }
            } catch (error) {
                console.log(error);
            }
        },

        handleClickApplyAllFilter() {
            try {
                if (this.dataFilter) {
                    const enableDataFilter = {};
                    for (let key in this.dataFilter) {
                        if (this.activeFilterField[key]) {
                            if (
                                this.dataFilter[key].Type ===
                                this.Enum.filterType.text
                            ) {
                                if (this.dataFilter[key].Value !== null) {
                                    enableDataFilter[key] =
                                        this.dataFilter[key];
                                }
                            } else {
                                if (
                                    this.dataFilter[key].Value !== null &&
                                    this.dataFilter[key].Key
                                ) {
                                    enableDataFilter[key] =
                                        this.dataFilter[key];
                                }
                            }
                        }
                    }
                    this.$emit("update:data", enableDataFilter);
                }
            } catch (error) {
                console.log(error);
            }
        },
    },

    watch: {
        data: {
            /**
             * Hàm xử lý khi dữ liệu lọc thay đổi từ ngoài
             * @param {*} newData: dữ liệu lọc
             * Author: QuangHuy (13/07/2024)
             */
            handler(newData) {
                try {
                    if (
                        newData &&
                        JSON.stringify(newData) !==
                            JSON.stringify(this.dataFilter)
                    ) {
                        for (let column of this.columnFilter) {
                            let key = column.columnField;
                            if (Object.hasOwn(newData, key)) {
                                this.activeFilterField[key] = true;
                                this.dataFilter[key] = { ...newData[key] };
                            } else {
                                this.activeFilterField[key] = false;
                            }
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            deep: true,
        },
    },
};
</script>

<style src="./css/filter-menu.css" scoped></style>
