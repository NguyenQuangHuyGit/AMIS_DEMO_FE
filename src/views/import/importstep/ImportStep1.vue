<template>
    <p class="import-notice">
        {{ Resource.import.main.first.notice }}
    </p>
    <div class="import-field">
        <input
            type="text"
            readonly
            class="file-name"
            disabled
            :value="fileName"
        />
        <input
            type="file"
            id="file-input"
            hidden
            @change="handleSelectFile"
            accept=".xlsx"
        />
        <label for="file-input" class="btn-file-input">{{
            Resource.import.main.first.labelForInput
        }}</label>
    </div>
    <p>
        {{ Resource.import.main.first.example }}
        <span class="example-load" @click="handleClickDownLoadExample">{{
            Resource.import.main.first.downloadHere
        }}</span>
    </p>
</template>

<script>
import EmployeeService from "@/service/employee.js";
import NProgress from "nprogress";
export default {
    name: "TheImportStep1",
    components: {},
    inject: [
        "addToast",
        "showDialog",
        "closeDialog",
        "setLoading",
        "switchLang",
        "handleResponseErrorImport",
    ],
    props: {
        modelValue: File,
        validateData: Array,
        keyImport: String,
    },

    data() {
        return {
            fileName: "",
            fileImport: null,
        };
    },

    created() {
        if (this.modelValue) {
            this.fileImport = this.modelValue;
            this.fileName = this.modelValue.name;
        }
    },

    methods: {
        /**
         * Hàm xử lý sự kiện chọn File
         * @param {*} e: sự kiên
         * Author: QuangHuy (18/01/2024)
         */
        handleSelectFile(e) {
            try {
                const { files } = e.target;
                if (files && files[0]) {
                    this.fileName = files[0].name;
                    this.fileImport = files[0];
                    this.$emit("update:modelValue", files[0]);
                }
            } catch (error) {
                this.handleResponseErrorImport(error);
            }
        },

        /**
         * Hàm xử khi click lấy file excel mẫu
         * Author: QuangHuy (22/01/2024)
         */
        async handleClickDownLoadExample() {
            try {
                this.addToast(
                    this.Enum.toast.info,
                    this.Resource.toast.downloadBegin
                );
                NProgress.start();
                await EmployeeService.getExampleFileExcel();
                NProgress.done();
            } catch (error) {
                NProgress.done();
                this.handleResponseErrorImport(error);
            }
        },
    },
};
</script>

<style src="../import.css" scoped></style>
