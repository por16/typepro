<script lang="ts" setup>
import AppIcons from './AppIcons.vue'

export type ButtonVariant = 'left-arrow' | 'number' | 'rigth-arrow'

const props = defineProps<{
    variant: ButtonVariant,
    number?: number,
    active?: boolean,
    disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
    emit('click', event)
}
</script>

<template>
    <button class="app-pagination__button" :class="{ 'app-pagination__button--active': props.active}" 
    @click="handleClick" :disabled="props.disabled">
        <div v-if="variant === 'left-arrow'"><AppIcons name="left-arrow" /></div>
        <div v-if="variant === 'number'">{{ props.number }}</div>
        <div v-if="variant === 'rigth-arrow'"><AppIcons name="right-arrow" /></div>
    </button>
</template>

<style lang="scss">
.app-pagination__button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-gray);
    border-radius: 2px;

    &:disabled {
        cursor: default;

        &:hover {
            opacity: 1;
            background-color: transparent;
            cursor: default;
        }
    }

    &:hover {
        cursor: pointer;
        background-color: var(--divider);
        opacity: 0.8;
    }

    &--active {
        color: var(--primary-main);
        border: 1px solid var(--primary-main);
    }
}
</style>