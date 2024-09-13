<template>
    <div class="m-dialog" :class="typeDialog">
        <div class="m-dialog-overlay">
            <div
                class="m-dialog-container"
                @keydown.esc.prevent="close"
                ref="dialog"
            >
                <div
                    class="icon-close"
                    @click="close"
                    v-tooltip="{
                        content: this.Resource.tooltip.closeBtn,
                        delay: 700,
                    }"
                >
                    <span></span>
                </div>
                <p class="m-dialog-title">{{ title }}</p>
                <div class="m-dialog-description">
                    <span></span>
                    <ul v-if="type === 'input-error'">
                        <component
                            :is="errors.length === 1 ? 'p' : 'li'"
                            v-for="(error, index) in errors"
                            :key="index"
                        >
                            {{ error }}
                        </component>
                    </ul>
                    <p v-else v-html="description"></p>
                </div>
                <div class="m-dialog-action">
                    <div class="m-dialog-action-left">
                        <MButton
                            v-if="!type.includes('error') && isNoBtn"
                            :text="Resource.button.cancel"
                            class="m-secondary-button"
                            @clickBtn="clickSecondaryButton"
                            :tabindex="102"
                        ></MButton>
                    </div>
                    <div class="m-dialog-action-right">
                        <MButton
                            @keydown.tab.exact.prevent="
                                this.$refs.primary.focus()
                            "
                            v-if="!type.includes('error') && !isNoBtn"
                            :text="Resource.button.cancel"
                            class="m-secondary-button"
                            :tabindex="103"
                            @clickBtn="clickSecondaryButton"
                        ></MButton>
                        <MButton
                            @keydown.shift.tab.prevent="$event.preventDefault()"
                            v-if="!type.includes('error')"
                            :text="Resource.button.yes"
                            class="m-primary-button"
                            ref="primary"
                            :tabindex="100"
                            @clickBtn="clickPrimaryButton"
                        ></MButton>
                        <MButton
                            @keydown.shift.tab.prevent="$event.preventDefault()"
                            v-else
                            :text="getPrimaryText(this.Resource.button.ok)"
                            class="m-primary-button"
                            ref="primary"
                            :tabindex="100"
                            @clickBtn="clickPrimaryButton"
                        ></MButton>
                        <MButton
                            @keydown.tab.exact.prevent="
                                this.$refs.primary.focus()
                            "
                            v-if="isNoBtn"
                            :text="Resource.button.no"
                            :tabindex="103"
                            class="m-secondary-button"
                            @clickBtn="clickNoButton"
                        ></MButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MButton from "@/components/base/button/MButton.vue";
export default {
    name: "MDialog",
    components: { MButton },
    props: {
        type: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        errors: {
            type: Array,
        },
        isNoBtn: {
            type: Boolean,
            default: false,
        },
        isShow: {
            type: Boolean,
            default: false,
        },
        newPrimaryText: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            typeDialog: `dialog-${this.type}`,
        };
    },
    mounted() {
        this.$refs.primary.focus();
    },
    methods: {
        /**
         * Hàm lấy text hiện thị của button chính nếu có tùy chỉnh riêng
         * Author: QuangHuy (07/12/2023)
         */
        getPrimaryText(text) {
            if (this.newPrimaryText) {
                return this.newPrimaryText;
            }
            return text;
        },

        /**
         * Hàm đóng Dialog
         * Author: QuangHuy (07/12/2023)
         */
        close() {
            this.$emit("closeDialog");
            this.$emit("update:isShow", false);
        },

        /**
         * Hàm xử lý khi click nút chính của Dialog
         * Author: QuangHuy (07/12/2023)
         */
        clickPrimaryButton() {
            this.$emit("clickPrimaryButton");
        },

        /**
         * Hàm xử lý khi click nút phụ của Dialog
         * Author: QuangHuy (07/12/2023)
         */
        clickSecondaryButton() {
            this.$emit("update:isShow", false);
            this.$emit("clickSecondaryButton");
        },

        /**
         * Hàm xử lý khi click nút không của Dialog
         * Author: QuangHuy (07/12/2023)
         */
        clickNoButton() {
            this.$emit("clickNoButton");
        },
    },
};
</script>

<style src="./dialog.css"></style>
