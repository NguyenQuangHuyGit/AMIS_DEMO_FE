<template>
    <header>
        <div class="header-left">
            <span class="header-nav"></span>
            <div class="header-logo"></div>
            <p>{{ Resource.page.header.toUpperCase() }}</p>
        </div>
        <div class="header-right">
            <div class="header-search"></div>
            <div
                class="header-avatar"
                :class="{ isShowMenuAcc: 'menu-active' }"
            >
                <div class="avatar" @click="toggleMenuAccount"></div>
                <TheAccountMenu
                    v-if="isShowMenuAcc"
                    v-clickOutside="closeMenuAccount"
                    v-model:isShowMenuAcc="isShowMenuAcc"
                />
            </div>
        </div>
    </header>
</template>

<script>
import TheAccountMenu from "@/components/header/TheAccountMenu.vue";
export default {
    name: "TheHeader",
    components: { TheAccountMenu },
    data() {
        return {
            isShowMenuAcc: false,
        };
    },
    methods: {
        /**
         * Hàm ẩn hiện menu tài khoản người dùng
         * Author: QuangHuy (12/12/2023)
         */
        toggleMenuAccount() {
            this.isShowMenuAcc = !this.isShowMenuAcc;
        },

        /**
         * Hàm ẩn menu tài khoản người dùng
         * Author: QuangHuy (12/12/2023)
         */
        closeMenuAccount() {
            this.isShowMenuAcc = false;
        },
    },
};
</script>

<style src="./header.css"></style>
