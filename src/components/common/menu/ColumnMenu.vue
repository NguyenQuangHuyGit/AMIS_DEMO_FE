<template>
    <div
        class="menu-setting-column"
        ref="container"
        @click="$event.stopPropagation()"
    >
        <div class="menu-header">
            <p class="menu-title">{{ Resource.menuColumn.title }}</p>
            <MTextfield withAction placeholder="Tìm kiếm" />
        </div>
        <div class="menu-body" ref="body" :key="columns">
            <div
                class="menu-item"
                ref="items"
                v-for="(column, index) in columns"
                :class="[column.isPin ? 'pin-col' : '']"
                :key="index"
                :style="{ top: index * offsetItem + 'px' }"
            >
                <input
                    type="checkbox"
                    v-model="column.isShow"
                    @change="handleChangeState(index)"
                />
                <p class="column-name">
                    {{
                        common.getResourceString(
                            Resource.table,
                            entity,
                            column.columnField
                        )
                    }}
                </p>
                <div class="menu-item-icon">
                    <Tooltip
                        :title="Resource.tooltip.pinColumn"
                        placement="top"
                        :mouseEnterDelay="0.7"
                        :getPopupContainer="() => $refs.container"
                        :mouseLeaveDelay="0"
                        ><div
                            class="icon-pin"
                            :class="[column.isPin ? 'active-pin' : '']"
                            @click="handleChangePinState(index)"
                        >
                            <span></span></div
                    ></Tooltip>
                    <Tooltip
                        :title="Resource.tooltip.dragColumn"
                        :mouseEnterDelay="0.7"
                        :overlayStyle="{
                            visibility: dragDropData.isDraging
                                ? 'hidden'
                                : 'visible',
                        }"
                        placement="top"
                        :getPopupContainer="() => $refs.container"
                        :mouseLeaveDelay="0"
                    >
                        <div
                            class="icon-move"
                            @mousedown="handleDragAndDrop(index)"
                        >
                            <span></span>
                        </div>
                    </Tooltip>
                </div>
            </div>
            <div
                class="menu-item-temp"
                :style="{ top: columns.length * offsetItem + 'px' }"
            ></div>
        </div>
        <div class="menu-footer">
            <MButton
                class="m-primary-button"
                :text="Resource.button.save"
                @clickBtn="handleSaveColumnSetting"
            />
            <MButton
                class="m-secondary-button"
                :text="Resource.button.getDefault"
                @clickBtn="handleGetDefautlColumn"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "ColumnMenu",
    inject: [
        "showDialog",
        "addToast",
        "closeDialog",
        "setLoading",
        "handleResponseError",
    ],
    props: {
        columnResources: {
            type: Array,
        },
        defaultCol: {
            type: Array,
        },
        entity: String,
        iShow: Boolean,
    },

    data() {
        return {
            offsetItem: 48,
            maxOffset: null,
            maxPinCol: 3,
            pinColumn: null,
            columns: null,
            dragDropData: {
                initIndex: null,
                isDraging: false,
                index: null,
                offset: null,
                initOffset: null,
                increaseOffset: null,
            },
            filterData: null,
            isShowItemTemp: false,
        };
    },

    /**
     * Hàm chạy khi component được tạo
     * Author: QuangHuy (08/04/2024)
     */
    created() {
        this.columns = null;
        this.columns = JSON.parse(JSON.stringify(this.columnResources));
        this.pinColumn = this.columns.filter((col) => {
            if (col.isPin) {
                return col;
            }
        });
        this.maxOffset = (this.columns.length - 1) * this.offsetItem;
    },

    methods: {
        handleChangeState(index) {
            if (!this.columns[index].isShow) {
                this.columns[index].isPin = false;
                const indexOfColPin = this.pinColumn.indexOf(
                    this.columns[index]
                );
                if (index < this.pinColumn.length - 1) {
                    this.handelWhenUnPinItem(index);
                }
                this.pinColumn.splice(indexOfColPin, 1);
            }
        },

        /**
         * Hàm xử lý thao tác kéo thả
         * @param {*} index: chỉ mục của phần tử đang thao tác
         * Author: QuangHuy (08/04/2024)
         */
        handleDragAndDrop(index) {
            this.dragDropData.initIndex = index;
            this.dragDropData.index = index;
            this.dragDropData.isDraging = true;
            this.dragDropData.offset = event.clientY;
            this.dragDropData.initOffset = this.offsetItem * index;
            this.dragDropData.increaseOffset = 0;
            this.$refs.items[index].classList.add("drag-item");
            document.addEventListener("mousemove", this.startDraging);
            document.addEventListener("mouseup", this.stopDraging);
        },

        /**
         * Hàm thực thi khi bắt đầu kéo phần tử
         * Author: QuangHuy (08/04/2024)
         */
        startDraging() {
            try {
                if (
                    this.dragDropData.isDraging &&
                    this.$refs.items[this.dragDropData.initIndex]
                ) {
                    this.$refs.body.classList.add("is-darging");
                    // Tính toán độ lệch để cập nhật top của phân tử đang kéo
                    let space = event.clientY - this.dragDropData.offset;
                    this.dragDropData.initOffset += space;
                    this.dragDropData.increaseOffset += space;

                    // Kiểm tra xem phần tử đang được kéo có ở trên cùng không
                    if (
                        this.dragDropData.initOffset >= 0 &&
                        this.dragDropData.initOffset <= this.maxOffset
                    ) {
                        // Cập nhật top của phần tử đang được kéo
                        this.$refs.items[
                            this.dragDropData.initIndex
                        ].style.top = this.dragDropData.initOffset + "px";
                    }

                    this.dragDropData.offset = event.clientY;

                    // Cập nhật vị trí của phần tử vừa lướt qua
                    if (
                        // Trường hợp kéo xuống
                        this.dragDropData.increaseOffset >= this.offsetItem &&
                        this.$refs.items[this.dragDropData.index + 1]
                    ) {
                        this.dragDropData.increaseOffset = 0;
                        let currentIndex = this.dragDropData.index;
                        if (currentIndex >= this.dragDropData.initIndex) {
                            // Nếu con trỏ index đang ở lớn hơn hoặc bằng index ban đầu
                            if (
                                !this.handleWhenItemDragIsPined(
                                    currentIndex + 1
                                )
                            ) {
                                this.stopDraging();
                                this.addToast(
                                    this.Enum.toast.warning,
                                    this.Resource.toast.dragPinWarnning
                                );
                                return;
                            }
                            // Cập nhật css top
                            this.$refs.items[currentIndex + 1].style.top =
                                currentIndex * this.offsetItem + "px";
                            // Cập nhật vị trí của con trỏ
                            this.dragDropData.index = currentIndex + 1;
                            // Cập nhật lại index trong mảng
                            this.columns[currentIndex + 1].index = currentIndex;
                        } else {
                            // Nếu con trỏ index đang ở nhỏ hơn index ban đầu
                            if (!this.handleWhenItemDragIsPined(currentIndex)) {
                                this.stopDraging();
                                this.addToast(
                                    this.Enum.toast.warning,
                                    this.Resource.toast.dragPinWarnning
                                );
                                return;
                            }
                            // Cập nhật css top
                            this.$refs.items[currentIndex].style.top =
                                currentIndex * this.offsetItem + "px";
                            // Cập nhật vị trí của con trỏ
                            this.dragDropData.index = currentIndex + 1;
                            // Cập nhật lại index trong mảng
                            this.columns[currentIndex].index = currentIndex;
                        }
                    } else if (
                        // Trường hợp kéo lên
                        this.dragDropData.increaseOffset <= -this.offsetItem &&
                        this.$refs.items[this.dragDropData.index - 1]
                    ) {
                        this.dragDropData.increaseOffset = 0;
                        let currentIndex = this.dragDropData.index;
                        if (currentIndex > this.dragDropData.initIndex) {
                            // Nếu con trỏ index đang ở lớn hơn index ban đầu
                            if (!this.handleWhenItemDragIsPined(currentIndex)) {
                                this.stopDraging();
                                this.addToast(
                                    this.Enum.toast.warning,
                                    this.Resource.toast.dragPinWarnning
                                );
                                return;
                            }
                            // Cập nhật css top
                            this.$refs.items[currentIndex].style.top =
                                currentIndex * this.offsetItem + "px";
                            // Cập nhật vị trí của con trỏ
                            this.dragDropData.index = currentIndex - 1;
                            // Cập nhật lại index trong mảng
                            this.columns[currentIndex].index = currentIndex;
                        } else {
                            // Nếu con trỏ index đang ở nhỏ hơn hoặc bằng index ban đầu
                            if (
                                !this.handleWhenItemDragIsPined(
                                    currentIndex - 1
                                )
                            ) {
                                this.stopDraging();
                                this.addToast(
                                    this.Enum.toast.warning,
                                    this.Resource.toast.dragPinWarnning
                                );
                                return;
                            }
                            // Cập nhật css top
                            this.$refs.items[currentIndex - 1].style.top =
                                currentIndex * this.offsetItem + "px";
                            // Cập nhật vị trí của con trỏ
                            this.dragDropData.index = currentIndex - 1;
                            // Cập nhật lại index trong mảng
                            this.columns[currentIndex - 1].index = currentIndex;
                        }
                    }
                    // Scroll tới phần tử đang kéo
                    this.$refs.items[
                        this.dragDropData.initIndex
                    ].scrollIntoView({
                        behavior: "instant",
                        block: "nearest",
                    });
                }
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm thực hiện việc dừng thao tác kéo thả
         * Author: QuangHuy (08/04/2024)
         */
        stopDraging() {
            try {
                this.$refs.body.classList.remove("is-darging");
                // Cập nhật lại dữ liệu keo thả
                this.dragDropData.isDraging = false;
                this.$refs.items[this.dragDropData.initIndex].classList.remove(
                    "drag-item"
                );

                // Lấy chỉ mục cuối cùng khi thả
                const resultIndex = this.dragDropData.index;

                // Cập nhận vị trí
                this.$refs.items[this.dragDropData.initIndex].style.top =
                    resultIndex * this.offsetItem + "px";

                // Nếu vị trí đã thay đổi thì cập nhật lại index các phần tử trong mảng
                if (resultIndex !== this.dragDropData.initIndex) {
                    this.columns[this.dragDropData.initIndex].index =
                        resultIndex;
                    this.sortColumnListByIndex(this.columns);
                }
                document.removeEventListener("mousemove", this.startDraging);
                document.removeEventListener("mouseup", this.stopDraging);
            } catch (error) {
                console.error(error);
            }
        },

        handleWhenItemDragIsPined(index) {
            const currentIndex = this.dragDropData.initIndex;
            if (this.columns[currentIndex].isPin) {
                if (this.columns[index].isPin) {
                    return true;
                }
                return false;
            }
            return true;
        },

        /**
         * Hàm thực thi sắp xếp mảng theo chỉ mục Index
         * @param {*} array: Mảng sắp xếp
         * Author: QuangHuy (08/04/2024)
         */
        sortColumnListByIndex(array) {
            array.sort((a, b) => {
                if (a.index < b.index) {
                    return -1;
                } else if (a.index > b.index) {
                    return 1;
                }
                return 0;
            });
        },

        /**
         * Hàm lấy lại danh sách cột mặc định
         * Author: QuangHuy (08/04/2024)
         */
        handleGetDefautlColumn() {
            try {
                const filter = {};
                this.columns.forEach((col) => {
                    if (col.filter) {
                        filter[col.columnField] = col.filter;
                    }
                });
                this.columns = JSON.parse(JSON.stringify(this.defaultCol));
                this.columns = this.columns.map((col) => {
                    if (Object.hasOwn(filter, col.columnField)) {
                        col.filter = filter[col.columnField];
                    }
                    return col;
                });
                this.pinColumn = this.columns.filter((col) => {
                    if (col.isPin) {
                        return col;
                    }
                });
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm thực hiện việc lưu cài đặt cột
         * Author: QuangHuy (08/04/2024)
         */
        handleSaveColumnSetting() {
            try {
                window.localStorage.setItem(
                    "columns",
                    JSON.stringify(this.columns)
                );
                this.$emit(
                    "update:columnResources",
                    JSON.parse(JSON.stringify(this.columns))
                );
                this.addToast(
                    this.Enum.toast.success,
                    this.Resource.toast.saveColumnSuccess
                );
                this.$emit("update:iShow", false);
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * Hàm thay đổi trạng thái ghim của 1 cột
         * Author: QuangHuy (08/04/2024)
         */
        handleChangePinState(index) {
            try {
                if (!this.columns[index].isPin) {
                    if (this.pinColumn.length === this.maxPinCol) {
                        this.addToast(
                            this.Enum.toast.warning,
                            this.Resource.toast.maxPinColumnWarn
                        );
                        return;
                    } else {
                        const tempCol = this.columns[index];
                        this.columns[index].isPin = true;
                        this.columns[index].isShow = true;
                        this.handleWhenPinStateIsValid(index);
                        this.pinColumn.push(tempCol);
                    }
                } else {
                    const indexOfColPin = this.pinColumn.indexOf(
                        this.columns[index]
                    );
                    this.columns[index].isPin = false;
                    if (index < this.pinColumn.length - 1) {
                        this.handelWhenUnPinItem(index);
                    }
                    this.pinColumn.splice(indexOfColPin, 1);
                }
            } catch (error) {
                console.error(error);
            }
        },

        handelWhenUnPinItem(index) {
            const lastIndex = this.pinColumn.length - 1;
            this.columns[index].index = lastIndex;
            this.$refs.items[index].style.top =
                lastIndex * this.offsetItem + "px";
            for (let i = lastIndex; i > index; i--) {
                this.$refs.items[i].style.top = i - 1 * this.offsetItem + "px";
                this.columns[i].index = i - 1;
            }
            this.sortColumnListByIndex(this.columns);
        },

        handleWhenPinStateIsValid(index) {
            if (index === this.pinColumn.length) {
                return;
            } else {
                const lastIndex = this.pinColumn.length;
                this.columns[index].index = lastIndex;
                this.$refs.items[index].style.top =
                    lastIndex * this.offsetItem + "px";
                for (let i = index - 1; i >= lastIndex; i--) {
                    this.$refs.items[i].style.top =
                        i + 1 * this.offsetItem + "px";
                    this.columns[i].index = i + 1;
                }
                this.sortColumnListByIndex(this.columns);
            }
        },
    },
};
</script>

<style scoped>
@import url(./column-menu.css);
</style>
