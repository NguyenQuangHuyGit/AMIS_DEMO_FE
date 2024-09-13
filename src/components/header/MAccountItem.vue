<template>
    <div class="account-menu-item" @click="$emit('activeItem')">
        <div class="item-icon"><span></span></div>
        <slot>
            <p>{{ label }}</p>
        </slot>
    </div>
</template>

<script>
export default {
    name: "MAccountItem",
    emits: ["activeItem"],
    props: {
        label: String,
    },
};
</script>
