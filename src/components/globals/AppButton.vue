<script lang="ts" setup>
import type { IconName } from './AppIcons.vue'

export type ButtonVariant = 
| 'green'
| 'bordered'
| 'text-green'
| 'text-gray'
| 'red'
| 'vk'
| 'orange'

export type IconPosition = 'left' | 'right'

const props = defineProps<{
    variant: ButtonVariant,
    iconName?: IconName,
    iconPosition?: IconPosition,
    disabled?: boolean,
    long?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
    <button
    :disabled="disabled"
    class="app-button"
    :class="[
        `app-button--${variant}`,
        { 'app-button--icon-left': iconName && iconPosition === 'left' },
        { 'app-button--icon-right': iconName && iconPosition === 'right' },
        { 'app-button--long': long }
    ]"
    @click="handleClick"
    >
        <AppIcons
        v-if="iconName && iconPosition === 'left'"
        :name="iconName"
        width="16"
        height="16"
        class="app-button__icon"
        />
        <span class="base-button__text">
            <slot />
        </span>
        <AppIcons
        v-if="iconName && iconPosition === 'right'"
        :name="iconName"
        width="16"
        height="16"
        class="app-button__icon"
        />
    </button>
</template>

<style lang="scss">
.app-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 16px;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }

    &__icon {
        width: 16px;
        height: 16px;
    }

    &--green {
        background-color: var(--primary-main);
        color: var(--primary-contast-text);

        &:hover:not(:disabled) {
            opacity: 0.5;
        }
    }

    &--bordered {
        background-color: transparent;
        color: var(--text-secondary);
        border: 1px solid var(--border-gray);

        &:hover {
            background-color:rgba(250, 250, 250, 1);
        }
    }

    &--text-green {
        background-color: transparent;
        border: none;
        color: var(--primary-main);
        padding: 0 0;

        &:hover {
            text-decoration: underline;
        }
    }

    &--text-gray {
        background-color: transparent;
        border: none;
        color: var(--text-secondary);
        padding: 0 0;

        &:hover {
            text-decoration: underline;
        }
    }

    &--red {
        background-color: rgba(244, 67, 54, 1);
        color: var(--primary-contast-text);

        &:hover {
            opacity: 0.5;
        }
    }

    &--vk {
        background-color: transparent;
        border: 1px solid rgba(0, 119, 255, 1);
        color: rgba(0, 119, 255, 1);

        &:hover {
            background-color:rgba(250, 250, 250, 1);
        }
    }

    &--long {
        width: 100%;
        max-width: 409px;
    }

    &--orange {
        background-color: var(--warning-color);
        color: var(--warning-dark-text-color);

        &:hover {
            opacity: 0.5;
        }
    }
}
</style>