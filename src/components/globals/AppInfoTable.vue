<script lang="ts" setup>
defineProps<{
  label?: string,
  rows: Array<{ label: string; value: any; key?: string }>
}>()
const slots = defineSlots()
</script>

<template>
    <div class="app-infotable__wrapper">
        <p v-if="label" class="app-infotable--label">{{ label }}</p>
        <div class="app-infotable">
            <div v-for="(row, index) in rows" :key="index" class="app-infotable-line">
                <span class="app-infotable-line--left text--light-gray" v-html="row.label"></span>
                <slot :name="`cell-${row.key || index}`" :row="row" >
                    <span class="app-infotable-line--right">{{ row.value }}</span>
                </slot>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.app-infotable__wrapper {
    padding: 8px 0 48px 0;
    max-width: 709px;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.app-infotable {
    width: 100%;
    padding: 32px 28px 12px 28px;
    border: 1px solid var(--divider);
    border-radius: 14px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    &--label {
        font-size: 24px;
        font-weight: 500;
        line-height: 150%;
        margin-bottom: 20px;
    }

    &-line {
        display: flex;
        align-content: center;
        padding-bottom: 20px;
        font-size: 16px;
        line-height: 20px;

        &--left {
            display: inline-block;
            min-width: 315px;
            max-width: 409px;
        }

        &--right {
            width: 317px;
            word-wrap: break-word;
            white-space: normal;
        }
    }
}

.app-infotable-line + .app-infotable-line {
    border-top: 1px solid var(--divider);
    padding-top: 20px;
}
</style>