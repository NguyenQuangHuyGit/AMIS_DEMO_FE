<template>
    <div
        class="m-toast-message"
        :class="[typeToast, !isShow ? 'fade-out' : '']"
    >
        <div class="m-toast-icon">
            <span></span>
        </div>
        <div class="m-toast-title">
            <p>{{ title }}</p>
        </div>
        <div
            class="close-icon"
            @click.stop="close"
            @mousedown="$event.stopPropagation()"
        >
            <span></span>
        </div>
    </div>
</template>

<script>
export default {
    name: "MToastmessage",
    components: {},
    props: {
        // Tiêu đề Toast Message
        title: {
            type: String,
            required: true,
        },
        // Loại Toast, icon
        type: {
            type: Number,
        },
        // uuid của Toast
        id: String,
    },

    /**
     * Hàm gán chức năng tự ẩn Toast sau 3s
     * Author: QuangHuy (10/12/2023)
     */
    created() {
        this.autoRemove = setTimeout(() => {
            this.isShow = false;
            this.$emit("closeToast", this.id);
        }, 4000);
    },

    data() {
        return {
            typeToast: this.getType(),
            isShow: true,
            autoRemove: null,
        };
    },

    methods: {
        /**
         * Hàm xủ lý khi click icon đóng Toast
         * Author: QuangHuy (10/12/2023)
         */
        close() {
            if (this.autoRemove) {
                clearTimeout(this.autoRemove);
                this.isShow = false;
                this.$emit("closeToast", this.id);
            }
        },

        /**
         * Hàm xác định kiểu, icon của ToastMessage
         * Auhtor: QuangHuy (15/12/2023)
         */
        getType() {
            switch (this.type) {
                case this.Enum.toast.success:
                    return "toast-success";
                case this.Enum.toast.warning:
                    return "toast-warning";
                case this.Enum.toast.error:
                    return "toast-error";
                case this.Enum.toast.info:
                    return "toast-info";
                default:
                    return "toast-default";
            }
        },
    },
};
</script>

<style src="./toastmessage.css"></style>
