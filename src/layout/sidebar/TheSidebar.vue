<template>
    <aside :class="[!isExpand ? 'sidebar-short' : '']">
        <div class="sidebar-top">
            <RouterLink
                :to="{ name: 'general' }"
                class="sidebar-item sidebar-dashboard"
            >
                <div class="sidebar-icon"><span></span></div>
                <div class="sidebar-title">
                    {{ this.Resource.nav.dashboard }}
                </div>
            </RouterLink>
            <!-- <RouterLink to="/" class="sidebar-item sidebar-report">
                <div class="sidebar-icon"><span></span></div>
                <div class="sidebar-title">
                    {{ this.Resource.nav.analys }}
                </div>
            </RouterLink> -->
            <!-- <RouterLink
                :to="{ name: 'customer' }"
                class="sidebar-item sidebar-customer"
            >
                <div class="sidebar-icon"><span></span></div>
                <div class="sidebar-title">
                    {{ this.Resource.nav.customer }}
                </div>
            </RouterLink> -->
            <RouterLink
                :to="{ name: 'employee' }"
                class="sidebar-item sidebar-employee"
            >
                <div class="sidebar-icon"><span></span></div>
                <div class="sidebar-title">
                    {{ this.Resource.nav.employee }}
                </div>
            </RouterLink>
            <RouterLink
                :to="{ name: 'setting' }"
                class="sidebar-item sidebar-setting"
            >
                <div class="sidebar-icon"><span></span></div>
                <div class="sidebar-title">
                    {{ this.Resource.nav.setting }}
                </div>
            </RouterLink>
        </div>
        <div class="sidebar-bottom">
            <div class="sidebar-item sidebar-compact" @click="toggleSidebar">
                <div class="sidebar-icon"><span></span></div>
                <div class="sidebar-title">
                    {{ this.Resource.nav.shortNav }}
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
import { RouterLink } from "vue-router";
export default {
    name: "TheSidebar",
    components: { RouterLink },
    data() {
        return {
            isExpand: true,
        };
    },

    /**
     * Lấy trạng thái của sidebar khi load trang
     * Author: QuangHuy (15/12/2023)
     */
    beforeMount() {
        let expand = window.localStorage.getItem("isExpandNav");
        if (expand === null) {
            this.isExpand = 1;
        } else {
            this.isExpand = +expand;
        }
    },
    methods: {
        /**
         * Hàm mở rộng, thu gọn Sidebar
         * Author: QuangHuy (05/12/2023)
         */
        toggleSidebar: function () {
            if (this.isExpand) {
                this.isExpand = false;
                window.localStorage.setItem("isExpandNav", 0);
            } else {
                this.isExpand = true;
                window.localStorage.setItem("isExpandNav", 1);
            }
        },
    },
};
</script>

<style src="./sidebar.css" scoped></style>
