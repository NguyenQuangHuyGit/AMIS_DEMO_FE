<template>
    <div
        class="m-context-menu-container"
        ref="context"
        v-clickOutside="handleClickOutside"
    >
        <div
            class="m-context-menu-item"
            v-for="(item, index) in resources"
            :key="index"
            @click="item.func(data)"
        >
            <span v-if="isIcon"></span>
            <p>{{ item.text }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "MContextMenu",
    components: {},
    props: {
        resources: Array,
        isIcon: {
            type: Boolean,
            default: false,
        },
        data: Object,
    },
    data() {
        return {
            isShow: false,
        };
    },
    methods: {
        handleClickOutside() {
            this.$emit("clickOutside");
            // this.isShow = false;
        },
    },
    watch: {
        isShow(newVal) {
            this.$emit("changeState", newVal);
        },
    },
};
</script>

<style scoped>
@import url(./context-menu.css);
</style>
