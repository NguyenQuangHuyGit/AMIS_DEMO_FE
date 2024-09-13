<template>
    <div class="container-view">
        <Header></Header>
        <div class="layout">
            <Sidebar></Sidebar>
            <Main></Main>
        </div>
    </div>
</template>

<script>
import Main from "@/layout/main-content/TheMain.vue";
import Header from "@/layout/header/TheHeader.vue";
import Sidebar from "@/layout/sidebar/TheSidebar.vue";
export default {
    name: "TheContainer",
    components: { Main, Header, Sidebar },
};
</script>

<style src="./container.css" scoped></style>
