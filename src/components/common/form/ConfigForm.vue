<template>
    <div class="m-form-config">
        <MForm :title="Resource.form.config.title" class="config-popup">
            <template #form-control>
                <div class="notification-config">
                    <p>
                        {{ Resource.form.config.actionRequest }}
                    </p>
                    <p>{{ Resource.form.config.notity }}</p>
                </div>
                <div class="checkbox-config">
                    <input type="checkbox" />
                    <label>{{ Resource.form.config.markAsCheckLabel }}</label>
                </div>
            </template>
            <template #form-action-right>
                <MButton
                    :text="Resource.button.yes"
                    class="m-primary-button"
                    @clickBtn="handleCLickYesConfig"
                />
                <MButton
                    :text="Resource.button.no"
                    class="m-secondary-button"
                    @clickBtn="handleCLickNoConfig"
                />
            </template>
        </MForm>
    </div>
</template>

<script>
export default {
    name: "ConfigForm",
    components: {},
    props: {
        isShow: Boolean,
    },
    methods: {
        handleCLickYesConfig() {
            this.$emit("commit", true);
            this.closeForm();
        },

        handleCLickNoConfig() {
            this.$emit("commit", false);
            this.closeForm();
        },

        closeForm() {
            this.$emit("update:isShow", false);
        },
    },
};
</script>

<style src="./configform.css"></style>
