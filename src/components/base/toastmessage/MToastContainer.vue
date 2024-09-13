<template>
    <div class="m-toast-container">
        <MToastmessage
            v-for="toast in toasts"
            :type="toast.type"
            :title="toast.title"
            :key="toast.id"
            :id="toast.id"
            @closeToast="removeToast"
        ></MToastmessage>
    </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import MToastmessage from "./MToastmessage.vue";
export default {
    name: "MToastContainer",
    components: { MToastmessage },
    data() {
        return {
            // Danh sách Toast
            toasts: new Set(),
        };
    },
    methods: {
        /**
         * Hàm thêm 1 Toast
         * @param {*} type: kiểu của Toast message
         * @param {*} title: Tiêu đề
         * Author: QuangHuy (10/12/2023)
         */
        addToast(type, title) {
            let id = uuidv4();
            this.toasts.add({ type, title, id });
        },

        /**
         * Hàm xóa 1 Toast theo id
         * @param {*} id: Uuid của Toast
         * Author: QuangHuy (10/12/2023)
         */
        removeToast(id) {
            try {
                this.toasts.forEach((toast) => {
                    if (toast.id === id) {
                        setTimeout(() => {
                            this.toasts.delete(toast);
                        }, 300);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        },
    },
};
</script>

<style src="./toastmessage.css"></style>
