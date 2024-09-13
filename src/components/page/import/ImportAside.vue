<template>
    <div class="import-aside-item">
        <p>{{ step }}. {{ text }}</p>
    </div>
</template>

<script>
export default {
    name: "ImportAside",
    components: {},
    props: {
        step: String,
        text: String,
    },
};
</script>

<style scoped>
@import url(./import-aside.css);
</style>
