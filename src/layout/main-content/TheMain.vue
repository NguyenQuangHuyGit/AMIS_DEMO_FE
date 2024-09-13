<template>
    <main>
        <RouterView name="protected" />
    </main>
</template>

<script>
import { RouterView } from "vue-router";
export default {
    name: "TheMain",
    components: { RouterView },
};
</script>

<style src="./main-content.css"></style>
