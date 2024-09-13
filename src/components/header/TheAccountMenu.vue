<template>
    <div class="account-menu">
        <div class="account-menu-info">
            <div class="avatar"></div>
            <div class="user-info">
                <p class="fullname">Nguyễn Quang Huy</p>
                <p class="username">nguyenquanghuy27042002@gmail.com</p>
            </div>
        </div>
        <div class="account-menu-action">
            <MAccountItem
                :label="this.Resource.menuAcc.changePassword"
                class="action-password"
            />
            <MAccountItem
                :label="this.Resource.menuAcc.settingAccount"
                class="action-user-account"
            />
            <MAccountItem
                :label="this.Resource.menuAcc.settingSecurity"
                class="action-security"
            />
            <MAccountItem
                :label="this.Resource.menuAcc.license"
                class="action-policy"
            />
            <MAccountItem
                :label="this.Resource.menuAcc.introduce"
                class="action-gift"
            />
            <MAccountItem
                class="action-language"
                :class="activeFlag"
                @activeItem="toggleDropdown"
            >
                <MDropdownList
                    v-clickOutside="handleClickOutsideSelectLangItem"
                    :dropdownOptions="dropdownOptions"
                    :label="this.Resource.menuAcc.language"
                    class="m-row-label"
                    ref="dropDownLang"
                    v-model:selectedValue="selectedValue"
                    isParent
                    disableClickOutside
                    @selectOptionDropDown="handleSelected"
                />
            </MAccountItem>
        </div>
        <button class="logout-btn" @click="handleClickLogOut">
            <MAccountItem
                :label="this.Resource.menuAcc.logout"
                class="action-exit"
            ></MAccountItem>
        </button>
    </div>
</template>

<script>
import MAccountItem from "@/components/header/MAccountItem.vue";
import AccountService from "@/service/account.js";
export default {
    name: "TheAccountMenu",
    components: { MAccountItem },
    inject: ["switchLang", "showDialog", "closeDialog", "setLoading"],
    props: {
        isShowMenuAcc: Boolean,
    },
    data() {
        return {
            dropdownOptions: [
                {
                    value: 0,
                    text: this.Resource.lang.VN,
                    flag: "VN",
                },
                {
                    value: 1,
                    text: this.Resource.lang.EN,
                    flaf: "EN",
                },
            ],
            selectedValue: "",
            activeFlag: "",
        };
    },
    beforeMount() {
        this.getLangCode();
    },
    methods: {
        /**
         * Hàm thực hiện khi click ra ngoài hộp chọn ngôn ngữ
         * Author: QuangHuy (11/03/2024)
         */
        handleClickOutsideSelectLangItem() {
            this.$refs.dropDownLang.closeOption();
        },

        /**
         * Hàm ẩn hiện phần chọn ngôn ngữ
         * Author: QuangHuy (13/12/2023)
         */
        toggleDropdown() {
            this.$refs.dropDownLang.toggleOptionListV2();
        },

        /**
         * Hàm xử lý khi chọn ngôn ngữ trong Dropdown list
         * Author: QuangHuy (13/12/2023)
         */
        handleSelected() {
            this.switchLang(this.selectedValue * 1);
        },

        /**
         * Hàm lấy giá giá trị lang code từ localStorage
         * Giá trị mặc định là 0 => VN
         * Author: QuangHuy (13/12/2023)
         */
        getLangCode() {
            let langCode = window.localStorage.getItem("langCode");
            switch (langCode * 1) {
                case this.Enum.langCode.VN:
                    this.selectedValue = this.Enum.langCode.VN.toString();
                    this.flag = "VN";
                    this.activeFlag = "action-language-VN";
                    break;
                case this.Enum.langCode.EN:
                    this.selectedValue = this.Enum.langCode.EN.toString();
                    this.flag = "EN";
                    this.activeFlag = "action-language-EN";
                    break;
                default:
                    this.selectedValue = this.Enum.langCode.VN.toString();
                    this.flag = "VN";
                    this.activeFlag = "action-language-VN";
                    break;
            }
        },

        /**
         * Hàm xử lý khi nhấn nút Logout
         * Author: QuangHuy (27/02/2024)
         */
        handleClickLogOut() {
            this.handleLogout();
            this.$emit("update:isShowMenuAcc", false);
        },

        /**
         * Hàm thực hiện đăng xuất
         * Author: QuangHuy (27/02/2024)
         */
        async handleLogout() {
            try {
                this.setLoading(true);
                await AccountService.logout();
                this.$router.replace({ name: "login" });
            } catch (error) {
                this.$router.replace({ name: "login" });
            } finally {
                this.setLoading(false);
                this.$store.commit("changeLoginState", false);
            }
        },
    },
};
</script>

<style src="./account-menu.css"></style>
