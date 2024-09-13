<template>
    <div class="m-popup" @keydown.stop="$attrs.onKeydown">
        <div class="m-popup-overlay">
            <div class="m-popup-container" :class="$attrs.class">
                <div class="m-popup-main">
                    <p class="m-popup-title">{{ title }}</p>
                    <div class="icon-action" v-if="isAction">
                        <Tooltip :title="this.Resource.tooltip.helpBtn">
                            <span class="icon-help"></span>
                        </Tooltip>
                        <Tooltip
                            :title="this.Resource.tooltip.closeBtnWithShortKey"
                        >
                            <span
                                class="icon-close"
                                @click="this.$emit('close')"
                            ></span>
                        </Tooltip>
                    </div>

                    <div class="m-popup-control" :class="controlClass">
                        <slot name="form-control"></slot>
                    </div>
                </div>
                <div class="m-popup-action">
                    <div class="m-popup-action-left">
                        <slot name="form-action-left"></slot>
                    </div>
                    <div class="m-popup-action-right">
                        <slot name="form-action-right"></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MForm",
    components: {},
    props: {
        title: String,
        controlClass: String,
        isAction: {
            type: Boolean,
            default: false,
        },
    },
    inheritAttrs: false,
};
</script>

<style scoped>
@import url(./form.css);
</style>
