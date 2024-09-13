<template>
    <table class="m-table" ref="table" @keydown="handleKeyShortTable">
        <thead>
            <tr>
                <th v-if="checkbox" class="checkbox" ref="checkboxHeaders">
                    <input
                        type="checkbox"
                        :checked="isCheckAll"
                        @click="handleSelectAll"
                    />
                </th>
                <th
                    v-for="(column, index) in filterColumn"
                    :key="index"
                    ref="columns"
                    :style="{
                        width: column.width ? column.width + 'px' : '',
                    }"
                    :class="[
                        column.columnAlign
                            ? `align-${column.columnAlign}`
                            : `align-left`,
                        column.isPin ? 'pin-col' : '',
                    ]"
                >
                    <div
                        class="m-table-header-content"
                        @click="handleChangeSortState(index)"
                    >
                        <div class="header-text">
                            <p>
                                {{
                                    common.getResourceString(
                                        Resource.table,
                                        entity,
                                        column.columnField
                                    )
                                }}
                            </p>
                            <div
                                v-if="
                                    checkSortStateOfColumn(column.columnField)
                                "
                                class="sort-icon"
                                :class="[
                                    sortData.type === Enum.sortType.down
                                        ? 'down'
                                        : 'up',
                                ]"
                            >
                                <span></span>
                            </div>
                        </div>
                        <Tooltip
                            :title="Resource.tooltip.filterBtn"
                            placement="top"
                        >
                            <div
                                v-if="filterPopups[column.columnField]"
                                class="filter"
                                @click="handleClickFilter(column.columnField)"
                                :class="[
                                    filterPopups[column.columnField].Value
                                        ? 'focus'
                                        : '',
                                    filterPopups[column.columnField].isShow
                                        ? 'active'
                                        : '',
                                ]"
                            >
                                <span></span>
                                <div
                                    v-if="
                                        filterPopups[column.columnField].isShow
                                    "
                                    v-clickOutsideVer2="
                                        () =>
                                            handleClickOutsideFilterPopup(
                                                column.columnField
                                            )
                                    "
                                >
                                    <Teleport to="body">
                                        <FilterPopup
                                            v-if="
                                                filterPopups[column.columnField]
                                                    .isShow
                                            "
                                            v-model:isOpen="
                                                filterPopups[column.columnField]
                                                    .isShow
                                            "
                                            :left="
                                                filterPopups[column.columnField]
                                                    .left
                                            "
                                            :top="
                                                filterPopups[column.columnField]
                                                    .top
                                            "
                                            :typeFilter="column.filter"
                                            v-model="
                                                filterPopups[column.columnField]
                                                    .Value
                                            "
                                            v-model:value="
                                                filterPopups[column.columnField]
                                                    .Key
                                            "
                                            @changeState="
                                                $emit('changeFilter', [
                                                    column.columnField,
                                                    column.filter,
                                                    filterPopups[
                                                        column.columnField
                                                    ].Value,
                                                    filterPopups[
                                                        column.columnField
                                                    ].Key,
                                                ])
                                            "
                                        />
                                    </Teleport>
                                </div>
                            </div>
                        </Tooltip>
                    </div>
                    <div
                        class="resize"
                        @click.prevent="$event.stopPropagation()"
                        @mousedown.prevent="resizeHandle(index)"
                    ></div>
                </th>
                <th class="align-center action-column" v-if="notice">
                    {{ Resource.table.Status }}
                </th>
            </tr>
        </thead>
        <tbody v-if="records" @mouseleave="handleGetCurrentHoverRecord(null)">
            <tr
                v-for="record in records"
                :key="record[keyRecord]"
                ref="records"
                :class="[isActiveActionMenu ? 'disable-row' : '']"
                @click="handleClickRow(record[keyRecord])"
                @mouseenter="handleGetCurrentHoverRecord(record[keyRecord])"
            >
                <td v-if="checkbox" class="checkbox">
                    <input
                        type="checkbox"
                        ref="checkboxs"
                        v-model="selected"
                        :value="record[keyRecord]"
                        @change="handleSelectCheckbox"
                    />
                </td>
                <td
                    v-for="(column, indexCol) in filterColumn"
                    :key="indexCol"
                    :class="[
                        column.columnAlign
                            ? `align-${column.columnAlign}`
                            : `align-left`,
                        column.isPin ? 'pin-col' : '',
                    ]"
                >
                    <slot :name="column.columnField" :record="record">
                        {{ record[column.columnField] }}
                    </slot>
                </td>
                <td v-if="notice" class="action-column notice">
                    <slot name="noticeField" :record="record"></slot>
                </td>
                <div
                    v-if="actions"
                    class="action-column"
                    :class="[
                        actionMenuContext[record[keyRecord]]
                            ? 'active-action-more'
                            : '',
                    ]"
                >
                    <div class="action-container">
                        <Tooltip
                            :mouseEnterDelay="0.5"
                            :title="Resource.tooltip.export"
                            :mouseLeaveDelay="0"
                        >
                            <div class="action-export"><span></span></div>
                        </Tooltip>
                        <Tooltip
                            :mouseEnterDelay="0.5"
                            :title="Resource.tooltip.editBtn"
                            :mouseLeaveDelay="0"
                        >
                            <div
                                class="action-edit"
                                @click.stop="
                                    $emit('editRecord', record[keyRecord])
                                "
                            >
                                <span></span>
                            </div>
                        </Tooltip>
                        <div>
                            <Tooltip
                                :mouseEnterDelay="0.5"
                                :title="Resource.tooltip.optionBtn"
                                :mouseLeaveDelay="0"
                                :overlayStyle="{
                                    visibility: actionMenuContext[
                                        record[keyRecord]
                                    ]
                                        ? 'hidden'
                                        : 'visible',
                                }"
                            >
                                <div
                                    class="action-more"
                                    @click.stop="
                                        handleToggleActionMenuContext(
                                            record[keyRecord]
                                        )
                                    "
                                >
                                    <span></span>
                                </div>
                            </Tooltip>
                            <MContextMenu
                                v-if="actionMenuContext[record[keyRecord]]"
                                class="action-context"
                                :class="[isReverse ? 'reverse' : '']"
                                :resources="contextMenuResources"
                                :data="record"
                                @clickOutside="
                                    handleToggleActionMenuContext(
                                        record[keyRecord]
                                    )
                                "
                            />
                        </div>
                    </div>
                </div>
            </tr>
        </tbody>
    </table>
</template>

<script>
import FilterPopup from "@/components/common/filter/FilterPopup.vue";
export default {
    name: "MTable",
    components: { FilterPopup },
    data() {
        return {
            selected: new Set(),
            offsetWidth: [45],
            resizeData: {
                onResize: false,
                resizeIndex: 0,
                resizeOffset: 0,
                resizeWidth: 0,
            },
            contextMenuResources: [
                {
                    text: this.Resource.menuContext.copy,
                    func: (data) =>
                        this.handleSelectContextItem("copyRecord", data),
                },
                {
                    text: this.Resource.menuContext.delete,
                    func: (data) =>
                        this.handleSelectContextItem("deleteRecord", data),
                },
                {
                    text: this.Resource.menuContext.stopUsing,
                    func: (data) =>
                        this.handleSelectContextItem("stopUsingRecord", data),
                },
            ],
            isClickRow: true,
            isReverse: false,
            filterColumn: null,
            filterPopups: {},
            actionMenuContext: {},
            isActiveActionMenu: false,
            currentFocusRecord: null,
        };
    },
    props: {
        columns: {
            type: Object,
            required: true,
        },
        records: {
            type: Array,
            required: true,
        },
        checkbox: {
            type: Boolean,
            default: false,
        },
        keyRecord: {
            type: String,
            default: "id",
        },
        selectedSet: {
            type: Set,
        },
        isCheckAll: {
            type: Boolean,
        },
        actions: {
            type: Boolean,
        },
        sortData: Object,
        notice: Boolean,
        entity: String,
        filterData: Object,
    },

    created() {
        this.selected = this.selectedSet;
        this.filterColumn = this.columns.filter((col) => {
            if (col.isShow) {
                if (col.filter !== null && col.filter !== undefined) {
                    this.filterPopups[col.columnField] = { isShow: false };
                    if (
                        this.filterData &&
                        Object.hasOwn(this.filterData, col.columnField)
                    ) {
                        this.filterPopups[col.columnField] = Object.assign(
                            this.filterPopups[col.columnField],
                            this.filterData[col.columnField]
                        );
                    }
                }
                return col;
            }
        });
    },

    /**
     * Hàm thực hiện trước khi component được update
     * Author: QuangHuy (12/04/2024)
     */
    beforeUpdate() {
        this.filterColumn = this.columns.filter((col) => {
            if (col.isShow) {
                return col;
            }
        });
    },

    /**
     * Hàm thực hiện khi component đã được update
     * Author: QuangHuy (12/04/2024)
     */
    updated() {
        try {
            this.offsetWidth = [45];
            if (this.records && this.records.length > 0) {
                let lastIndex = null;
                this.filterColumn.forEach((col, index) => {
                    if (
                        this.$refs.columns[index].classList.contains("last-col")
                    ) {
                        this.$refs.columns[index].classList.remove("last-col");
                        for (let i = 0; i < this.records.length; i++) {
                            this.$refs.records[i].children[
                                index + 1
                            ].classList.remove("last-col");
                        }
                    }
                    if (col.isPin) {
                        lastIndex = index;
                        const offset = this.$refs.columns[index].offsetWidth;
                        const last = this.offsetWidth.at(-1);
                        this.$refs.columns[index].style.left = last + "px";
                        for (let i = 0; i < this.records.length; i++) {
                            this.$refs.records[i].children[
                                index + 1
                            ].style.left = last + "px";
                        }
                        this.offsetWidth.push(last + offset);
                        if (!col.width) {
                            col.width = offset;
                        }
                    } else {
                        this.$refs.columns[index].style.left = "unset";
                    }
                });
                this.offsetWidth = [45];
                if (lastIndex !== null) {
                    this.$refs.table.classList.remove("no-pin-col");
                    this.$refs.columns[lastIndex].classList.add("last-col");
                    for (let i = 0; i < this.records.length; i++) {
                        this.$refs.records[i].children[
                            lastIndex + 1
                        ].classList.add("last-col");
                    }
                } else {
                    this.$refs.table.classList.add("no-pin-col");
                }
            }
        } catch (error) {
            console.error(error);
        }
    },

    mounted() {
        document.addEventListener("keydown", this.handleKeyShortTable);
    },

    unmounted() {
        document.removeEventListener("keydown", this.handleKeyShortTable);
    },

    methods: {
        handleKeyShortTable(e) {
            if (this.currentFocusRecord !== null && !this.isActiveActionMenu) {
                const keyCode = e.keyCode;
                switch (keyCode) {
                    case 68:
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            const data = this.records.find(
                                (r) =>
                                    r[this.keyRecord] ===
                                    this.currentFocusRecord
                            );
                            if (data) {
                                this.$emit("deleteRecord", data);
                            }
                        }
                        break;
                    case 67:
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            const data = this.records.find(
                                (r) =>
                                    r[this.keyRecord] ===
                                    this.currentFocusRecord
                            );
                            if (data) {
                                this.$emit("copyRecord", data);
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        },

        handleGetCurrentHoverRecord(key) {
            this.currentFocusRecord = key;
        },

        handleToggleActionMenuContext(key) {
            if (Object.hasOwn(this.actionMenuContext, key)) {
                this.actionMenuContext[key] = !this.actionMenuContext[key];
                if (this.actionMenuContext[key]) {
                    this.isActiveActionMenu = true;
                    let top = 0;
                    if (event.target.children.length === 0) {
                        top =
                            event.target.parentElement.getBoundingClientRect()
                                .y;
                    } else {
                        top = event.target.getBoundingClientRect().y;
                    }
                    if (window.innerHeight - top >= 250) {
                        this.isReverse = false;
                    } else {
                        this.isReverse = true;
                    }
                } else {
                    this.isActiveActionMenu = false;
                    this.isReverse = false;
                }
            }
        },

        /**
         * Hàm kiểm tra trạng thái sắp xếp của 1 cột
         * @param {*} field: tên trường muốn kiểm tra
         * Author: QuangHuy (18/04/2024)
         */
        checkSortStateOfColumn(field) {
            try {
                if (this.sortData && Object.hasOwn(this.sortData, "field")) {
                    const type = this.sortData.type || this.Enum.sortType.none;
                    if (field !== this.sortData.field) {
                        return false;
                    }
                    if (
                        type > this.Enum.sortType.none &&
                        type <= this.Enum.sortType.up
                    ) {
                        return true;
                    }
                    return false;
                }
                return false;
            } catch (error) {
                console.log(error);
                return false;
            }
        },

        /**
         * Hàm thay đổi trạng thái sắp xếp của 1 cột
         * @param {*} index: chỉ mục của cột muốn thay đổi
         * Author: QuangHuy (18/04/2024)
         */
        handleChangeSortState(index) {
            try {
                this.isActiveActionMenu = false;
                this.isReverse = false;
                if (!this.resizeData.onResize) {
                    const field = this.filterColumn[index].columnField;
                    let type = this.Enum.sortType.none;
                    if (
                        this.sortData &&
                        Object.hasOwn(this.sortData, "field") &&
                        this.sortData.field === field
                    ) {
                        let count =
                            this.sortData.type || this.Enum.sortType.none;
                        type = (count + 1) % 3;
                    } else {
                        type = this.Enum.sortType.down;
                    }
                    this.$emit("changeSortState", [field, type]);
                }
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm xử lý khi click ra ngoài hộp thoại Filter
         * @param {*} index: chỉ mục của filter
         * Author: QuangHuy (04/04/2024)
         */
        handleClickOutsideFilterPopup(field) {
            try {
                if (Object.hasOwn(this.filterPopups, field)) {
                    this.filterPopups[field].isShow = false;
                }
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm xử lý khi click và biểu tượng filter
         * @param {*} index: chỉ mục của filter
         * Author: QuangHuy (04/04/2024)
         */
        handleClickFilter(field) {
            try {
                event.stopPropagation();
                if (Object.hasOwn(this.filterPopups, field)) {
                    if (!this.filterPopups[field].isShow) {
                        let target = null;
                        if (event.target.children.length === 0) {
                            target = event.target.getBoundingClientRect();
                        } else {
                            target =
                                event.target.children[0].getBoundingClientRect();
                        }
                        const left = target.x + target.width / 2;
                        const top = target.y + target.height + 12;
                        this.filterPopups[field].left = left;
                        this.filterPopups[field].top = top;
                        this.filterPopups[field].isShow = true;
                    } else {
                        this.filterPopups[field].isShow = false;
                    }
                    // Phải đóng các popup còn lại vì đã ngăn nổi bọt sự kiện ở trên nên ko kích hoạt khi clickOutside được
                    for (const fieldCol in this.filterPopups) {
                        if (fieldCol !== field) {
                            this.filterPopups[fieldCol].isShow = false;
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm xử lý khi chọn item trong ContextMenu
         * Author: QuangHuy (14/01/2024)
         */
        handleSelectContextItem(emitEvent, data) {
            this.$emit(emitEvent, data);
        },

        /**
         * Hàm xử lý khi click 1 dòng trong bảng
         * Author: QuangHuy (14/01/2024)
         */
        handleClickRow(keyRecord) {
            try {
                if (this.isClickRow && !this.isActiveActionMenu) {
                    if (this.selected.has(keyRecord)) {
                        this.selected.delete(keyRecord);
                    } else {
                        this.selected.add(keyRecord);
                    }
                    this.$emit("update:selectedSet", this.selected);
                    let isCheckAll = this.records.every((item) => {
                        return this.selected.has(item[this.keyRecord]);
                    });
                    this.$emit("update:isCheckAll", isCheckAll);
                } else {
                    this.isClickRow = true;
                }
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm xử lý khi click vào ô checkbox
         * Author: QuangHuy(14/01/2024)
         */
        handleSelectCheckbox() {
            this.isClickRow = false;
        },

        /**
         * Hàm xử lý nhấn chuột để thay đổi kích thước cột
         * @param {*} index: index của cột người dùng đang muốn thay đổi kích cỡ
         * Author: QuangHuy (02/01/2024)
         */
        resizeHandle(index) {
            try {
                // Đặt trạng thái resize
                this.resizeData.onResize = true;
                // Lấy index của cột đang được kéo
                this.resizeData.resizeIndex = index;
                // Lấy vị trí bắt đầu của con trỏ
                this.resizeData.resizeOffset = event.clientX;
                // Lấy giá trị width hiện tại của cột
                this.resizeData.resizeWidth =
                    this.$refs.columns[index].offsetWidth;
                // Cập nhật style cursor của header làm động tác kéo mượt hơn
                this.$refs.columns.forEach((column) => {
                    column.style.cursor = "col-resize";
                });
                for (let i = index + 1; i < 3; i++) {
                    if (this.filterColumn[i].isPin) {
                        this.$refs.columns[i].classList.add("disable-pin");
                    }
                }
                for (let i = 0; i < this.records.length; i++) {
                    for (let j = index + 1; j < 3; j++) {
                        if (this.filterColumn[j].isPin) {
                            this.$refs.records[i].children[j + 1].classList.add(
                                "disable-pin"
                            );
                        }
                    }
                }
                // Thêm sự kiện cần vào DOM
                document.addEventListener("mousemove", this.startResize);
                document.addEventListener("mouseup", this.stopResize);
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm xử khi bắt đầu kéo chuột thao tác resize
         * Author: QuangHuy (02/01/2024)
         */
        startResize() {
            try {
                // Kiểm tra trạng thái resize
                if (this.resizeData.onResize) {
                    // Thêm class xác định bảng đang trong trạng thái tùy chỉnh độ rộng cột
                    this.$refs.table.classList.add("on-resize");
                    // Tính toán độ chệnh lệch khi kéo
                    let space = event.clientX - this.resizeData.resizeOffset;
                    // Cập nhật độ dài mới
                    this.resizeData.resizeWidth += space;
                    // Gán độ dài mới cho cột
                    this.$refs.columns[
                        this.resizeData.resizeIndex
                    ].style.width = `${this.resizeData.resizeWidth}px`;
                    this.$refs.columns[
                        this.resizeData.resizeIndex
                    ].classList.add("on-resize");
                }
                // Đặt lại vị trí bắt đầu
                this.resizeData.resizeOffset = event.clientX;
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm xử khi người dùng thả chuột
         * Author: QuangHuy (02/01/2024)
         */
        stopResize() {
            try {
                const index = this.resizeData.resizeIndex;
                for (let i = index + 1; i < 3; i++) {
                    if (this.filterColumn[i].isPin) {
                        this.$refs.columns[i].classList.remove("disable-pin");
                    }
                }
                for (let i = 0; i < this.records.length; i++) {
                    for (let j = index + 1; j < 3; j++) {
                        if (this.filterColumn[j].isPin) {
                            this.$refs.records[i].children[
                                j + 1
                            ].classList.remove("disable-pin");
                        }
                    }
                }
                // Đặt lại trạng thái resize
                this.resizeData.onResize = false;
                // Đặt lại style của header column
                this.$refs.columns.forEach((column) => {
                    column.style.removeProperty("cursor");
                });
                this.$refs.table.classList.remove("on-resize");
                this.$refs.columns[index].classList.remove("on-resize");
                this.filterColumn[index].width = this.resizeData.resizeWidth;
                // Xóa các event của DOM đã dùng
                document.removeEventListener("mousemove", this.startResize);
                document.removeEventListener("mouseup", this.stopResize);
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm xử lý khi chọn checkbox all
         * Author: QuangHuy(05/12/2023)
         */
        handleSelectAll() {
            try {
                this.$emit("update:isCheckAll", !this.isCheckAll);
                this.records.forEach((record) => {
                    if (!this.isCheckAll) {
                        this.selected.add(record[this.keyRecord]);
                    } else {
                        this.selected.delete(record[this.keyRecord]);
                    }
                });
                this.$emit("update:selectedSet", this.selected);
            } catch (error) {
                console.error(error);
            }
        },
    },

    watch: {
        selected(newSet) {
            if (this.records.length > 0) {
                let isCheckAll = this.records.every((item) => {
                    return newSet.has(item[this.keyRecord]);
                });
                this.$emit("update:isCheckAll", isCheckAll);
                this.$emit("update:selectedSet", newSet);
            }
        },

        records: {
            handler(newVal) {
                if (newVal && this.actions) {
                    newVal.forEach((record) => {
                        this.actionMenuContext[record[this.keyRecord]] = false;
                    });
                }
            },
            immediate: true,
        },

        filterData: {
            handler(newObj) {
                if (newObj) {
                    for (let key in this.filterPopups) {
                        if (!Object.hasOwn(newObj, key)) {
                            this.filterPopups[key] = { isShow: false };
                        } else {
                            this.filterPopups[key] = Object.assign(
                                this.filterPopups[key],
                                newObj[key]
                            );
                        }
                    }
                } else {
                    for (let key in this.filterPopups) {
                        this.filterPopups[key] = { isShow: false };
                    }
                }
            },
            deep: true,
        },
    },
};
</script>

<style src="./table.css" scoped></style>
