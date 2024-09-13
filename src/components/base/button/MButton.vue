<template>
    <button
        @keydown="$attrs.onKeydown"
        v-if="!isComboBtn"
        :class="$attrs.class"
        class="m-button"
        @click="$emit('clickBtn')"
        @mousedown="$emit('mouseDown')"
        @mouseup="$emit('mouseUp')"
        :tabindex="tabindex"
        ref="button"
    >
        <span></span>
        {{ text }}
        <slot name="context-menu"></slot>
    </button>
    <!-- Combo Button -->
    <div v-else class="m-combo-button-container" :tabindex="tabindex">
        <button
            @keydown="$attrs.onKeydown"
            :class="$attrs.class"
            class="m-button m-combo-button"
            @click="$emit('clickBtn')"
            @mousedown="$emit('mouseDown')"
            @mouseup="$emit('mouseUp')"
            ref="button"
        >
            <span></span>
            {{ text }}
        </button>
        <div class="m-combo-button-dropdown" @click="$emit('clickDropdown')">
            <span></span>
            <slot name="context-menu"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "MButton",
    inheritAttrs: false,
    emits: ["clickBtn", "mouseDown", "mouseUp", "clickDropdown"],
    props: {
        text: String,
        tabindex: Number,
        isComboBtn: {
            type: Boolean,
            default: false,
        },
        isNotify: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        focus() {
            this.$refs.button.focus();
        },
    },
};
</script>

<style scoped>
@import url(./button.css);
</style>
