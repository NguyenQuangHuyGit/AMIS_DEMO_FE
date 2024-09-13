<template>
    <div class="m-radio" :class="$attrs.class">
        <label class="m-radio-label">{{ label }}</label>
        <div class="m-radio-group">
            <div
                class="m-radio-item"
                v-for="(option, index) in radioOptions"
                :key="option.value"
            >
                <input
                    :tabindex="tabindex + index"
                    type="radio"
                    :name="$attrs.name"
                    :value="option.value"
                    :checked="
                        option.value.toString() === modelValue?.toString()
                    "
                    @change="handleSelectRadio"
                    @keypress="handleKeyPress"
                />
                <label>{{ option.label }}</label>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MRadioGroup",
    components: {},
    inheritAttrs: false,
    props: {
        radioOptions: {
            type: Array,
            required: true,
        },
        defaultValue: String,
        label: String,
        modelValue: [Number, String],
        tabindex: Number,
    },
    mounted() {
        if (!this.modelValue && this.defaultValue) {
            this.$emit("update:modelValue", parseInt(this.defaultValue));
        }
    },
    data() {
        return {
            checkedValue: null,
        };
    },
    methods: {
        handleSelectRadio(e) {
            this.checkedValue = e.target.value;
            this.$emit("update:modelValue", parseInt(this.checkedValue));
        },

        handleKeyPress(e) {
            if (e.code === "Enter") {
                this.checkedValue = e.target.value;
                this.$emit("update:modelValue", parseInt(this.checkedValue));
            }
        },
    },
};
</script>

<style scoped>
@import url(./radiogroup.css);
</style>
