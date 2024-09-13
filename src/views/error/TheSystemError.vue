<template>
    <div class="error-container">
        <h1 class="error-title">{{ Resource.page.systemError.title }}</h1>
        <p class="error-description">
            {{ Resource.page.systemError.description }}
        </p>
        <RouterLink
            class="coming-soon-btn"
            :to="{ name: 'employee', replace: true }"
            >{{ Resource.nav.backGeneral }}</RouterLink
        >
    </div>
</template>

<script>
import { RouterLink } from "vue-router";
export default {
    name: "TheSystemError",
    components: { RouterLink },
    created() {
        document.title = this.Resource.title.systemError;
    },
};
</script>

<style src="./systemerror.css" scoped></style>
