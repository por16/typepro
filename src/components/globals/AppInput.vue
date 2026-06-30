<script lang="ts" setup>
import { ref } from 'vue'
import type { IconName } from './AppIcons.vue'
import AppIcons from './AppIcons.vue'

export type InputVariant = 'input' | 'textarea' | 'select' | 'password' | 'calendar' | 'editing' | 'email' | 'file'

const props = defineProps<{
    type: InputVariant,
    modelValue?: string,
    label?: string,
    placeholder: string,
    disabled?: boolean,
    required?: boolean,
    iconName?: IconName,
    invisibleSelect?: boolean,
    squareShape?: boolean,
    autocomplete?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'open-select'): void
  (e: 'toggle-select'): void
  (e: 'click'): void
  (e: 'blur'): void
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

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            emit('update:modelValue', result)
        }
        reader.readAsDataURL(file)
    }
}
</script>

<template>
    <div class="app-input" :class="{ 'app-input--editing': type === 'editing' }">
        <span v-if="type !== 'editing'" class="app-input__label">{{ label }}</span>
        <div class="app-input__wrapper" :class="{ 'has-icon': type === 'select', 'has-right-icon': iconName }">
            <input
            v-if="type === 'input' || type === 'editing'"
            :value="modelValue"
            @input="onInput"
            @blur="$emit('blur')"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            class="app-input__field"
            :class="{ 
                'app-input__field--if-icon': props.iconName,
                'app-input__field--select-icon': props.autocomplete
            }" />
            <AppIcons :name="iconName" v-if="iconName" class="app-input__icon--left"/>

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
            class="app-input__field app-input__field--select app-input__field--select-icon"
            :class="{
                'app-input__field--invisible-select' : props.invisibleSelect,
                'app-input__field--square-shape' : props.squareShape
            }"
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
            class="app-input__field app-input__field--right-icon"
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
            readonly
            @click.stop="$emit('click')"
            @blur="$emit('blur')" />
            <AppIcons v-if="type === 'calendar' && !modelValue" name="calendar" class="app-input__icon" @click="$emit('click')"/>
            <button v-if="type === 'calendar' && modelValue" class="app-input__button--clear"
            @click.stop="$emit('update:modelValue', '')">
                <AppIcons name="close" :width="20" :height="20"/>
            </button>

            <label v-if="type === 'file'" for="file" class="app-input__file--label">Загрузить</label>
            <input
            v-if="type === 'file'"
            type="file"
            accept=".jpg, .jpeg, .png, .svg"
            id="file"
            class="app-input__file--input"
            @change="handleFileChange" />

            <slot name="dropdown"/>
            <slot name="icon" />
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
        padding: 11px 14px 11px 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        background-color: transparent;
        border: 1px solid var(--border-gray);
        border-radius: 8px;
        box-sizing: border-box;
        position: relative;
        z-index: 1000;

        &::placeholder {
            color: var(--text-secondary);
        }

        &--select {
            &:hover {
                cursor: pointer;
            }
        }

        &--invisible-select {
            border: none;
            padding: 0;
        }

        &--right-icon {
            padding-right: 40px;
        }

        &--select-icon {
            padding-right: 28px;
        }

        &--if-icon {
            padding-left: 38px;
        }

        &--square-shape {
            border-radius: 0;
            height: 35px;
            border: none;
        }
    }

    &.has-icon .app-input__field {
        padding-right: 40px;
    }

    &.has-right-icon .app-input__field {
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
        z-index: 1001;
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

.app-input__button--clear {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: var(--text-secondary);
    z-index: 1001;

    &:hover {
        opacity: 0.5;
    }
}

.app-input__field:disabled {
    background-color: var(--other-gray);
}

.app-input__icon--left {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);

}

.app-input__file {

    &--label {
        width: 409px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
        background-color: transparent;
        color: var(--text-secondary);
        border: 1px solid var(--border-gray);

        &:hover {
            background-color:rgba(250, 250, 250, 1);
        }
    }
    
    &--input {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
}
</style>