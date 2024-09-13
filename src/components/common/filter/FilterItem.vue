<template>
    <div class="m-filter-item-container" :class="$attrs.class">
        <div class="m-filter-content">
            <div class="m-filter-field">
                <p>
                    {{
                        common.getResourceString(Resource.table, entity, field)
                    }}
                </p>
            </div>
            <div class="m-filter-type">
                <p>{{ value }}</p>
            </div>
            <div class="m-filter-key">
                <p>
                    {{ key }}
                </p>
            </div>
        </div>
        <Tooltip
            :title="Resource.tooltip.deleteBtn"
            :mouseEnterDelay="0.7"
            placement="top"
        >
            <div class="m-filter-close" @click="$emit('close')">
                <span></span>
            </div>
        </Tooltip>
    </div>
</template>

<script>
export default {
    name: "FilterItem",
    data() {
        return {
            key: null,
        };
    },
    props: {
        field: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        type: {
            type: Number,
            required: true,
        },
        keyFilter: {
            type: String,
            required: true,
        },
        entity: String,
    },

    created() {
        if (this.type === this.Enum.filterType.date) {
            this.key = this.formatValue.formatDate(this.keyFilter).result;
        } else {
            this.key = this.keyFilter;
        }
    },
};
</script>

<style src="./css/filter-item.css"></style>
