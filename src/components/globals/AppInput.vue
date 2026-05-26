<script lang="ts" setup>
import { ref } from 'vue'

export type InputVariant = 'input' | 'textarea' | 'select' | 'password' | 'calendar' | 'editing' | 'email'

const props = defineProps<{
    type: InputVariant,
    modelValue?: string,
    label?: string,
    placeholder: string,
    disabled?: boolean,
    required?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'open-select'): void
  (e: 'toggle-select'): void
}>()

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement
    emit('update:modelValue', target.value)
}

const onSelectClick = () => {
  if (props.type === 'select') {
    emit('open-select')
  }
}

const isPasswordVisible = ref(false)

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value
}

</script>

<template>
    <div class="app-input" :class="{ 'app-input--editing': type === 'editing' }">
        <span v-if="type !== 'editing'" class="app-input__label">{{ label }}</span>
        <div class="app-input__wrapper" :class="{ 'has-icon': type === 'select' }">
            <input
            v-if="type === 'input' || type === 'editing'"
            :value="modelValue"
            @input="onInput"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            class="app-input__field" />

            <input
            v-if="type === 'email'"
            :value="modelValue"
            @input="onInput"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            class="app-input__field" />

            <textarea
            v-if="type === 'textarea'"
            rows: 4
            :value="modelValue"
            @input="onInput"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            class="app-input__field" />

            <input
            v-if="type === 'select'"
            :value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            class="app-input__field app-input__field--select"
            @click.stop="onSelectClick"
            @mousedown.prevent
            readonly />
            <button v-if="type === 'select'" type="button" class="invisible-button app-input__icon-button" @click.stop="$emit('toggle-select')">
                <AppIcons name="expand-more"/>
            </button>

            <input
            v-if="type === 'password'"
            :value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            :type="isPasswordVisible? 'text' : 'password'"
            class="app-input__field"
            @input="onInput" />
            <button
            v-if="type === 'password'"
            class="app-input__password-toggle"
            :class="{ 'app-input__password-toggle--visible': isPasswordVisible === true }"
            type="button"
            @click.stop.prevent="togglePasswordVisibility"
            @mousedown.stop.prevent>
                <AppIcons name="password-toggler" />
            </button>

            <input
            v-if="type === 'calendar'"
            :value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            class="app-input__field"
            readonly />
            <AppIcons v-if="type === 'calendar'" name="calendar" class="app-input__icon" />

            <slot name="dropdown" />
        </div>
        <slot name="errors" />
    </div>
</template>

<style lang="scss">
.app-input {
    width: 100%;

    &__label {
        display: block;
        margin-bottom: 8px;
        font-size: 12px;
    }

    &__wrapper {
        position: relative;
    }

    &__field {
        width: 100%;
        padding: 11px 14px;
        font-size: 14px;
        background-color: transparent;
        border: 1px solid var(--border-gray);
        border-radius: 8px;
        box-sizing: border-box;

        &::placeholder {
            color: var(--text-secondary);
        }

    }

    &.has-icon .app-input__field {
        padding-right: 40px;
    }

    textarea.app-input__field {
        resize: none;
        padding-bottom: 22px;
        min-height: 86px;
        overflow-y: auto;
    }

    &__icon {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
        background: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    &__icon-button {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
    }

    &__password-toggle {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
        fill-opacity: 0.6;
        background: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;

        &--visible {
            color: var(--text-primary);
        }
    }

    &--editing {
        .app-input__field {
            padding: 4px 8px;
            font-size: 14px;
            background-color: transparent;
            border: 1px solid var(--border-gray);
            border-radius: 4px;
        }
        .app-input__wrapper {
            margin: 0;
        }
    }
}

.app-input__field:disabled {
    background-color: var(--other-gray);
}
</style>