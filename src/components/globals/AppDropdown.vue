<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'

type DropdownVariant = 'default' | 'autocomplete'

const props = defineProps<{
    type: DropdownVariant,
    options: string[]
    modelValue?: string
    isOpened: boolean,
    showActions?: boolean,
    disableClickOutside?: boolean,
    placement?: 'down' | 'up'
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'close'): void
    (e: 'edit', oldValue: string, newValue: string): void
    (e: 'delete', value: string): void
    (e: 'add', newValue: string): void
}>()

const dropdownRef = ref<HTMLElement | null>(null)
const editingIndex = ref<number | null>(null)
const editingValue = ref('')
const isAdding = ref(false)

const { data, r$ } = useFormValidation(
  { option: ''},
  {
    option: { type: 'text' }
  }
)

const displayedOptions = computed(() => {
  if (props.type === 'autocomplete') {
    return props.options.slice(0, 5)
  }
  return props.options
})

const startEdit = (option: string, index: number) => {
    editingIndex.value = index
    editingValue.value = option
}

const saveEdit = () => {
  if (editingIndex.value !== null && editingValue.value.trim()) {
    const oldValue = props.options[editingIndex.value]
    if(oldValue) {
        emit('edit', oldValue, editingValue.value.trim())
        editingIndex.value = null
        editingValue.value = ''
    }
  }
}

const selectOption = (option: string) => {
  if (editingIndex.value !== null) return
  cancelAdding()
  emit('update:modelValue', option)
  emit('close')
}

const handleDelete = (option: string) => {
  emit('delete', option)
}

const startAdding = () => {
  isAdding.value = true
  data.option = ''
}

const cancelAdding = () => {
  isAdding.value = false
  data.option = ''
}

const confirmAdding = () => {
  if (data.option.trim()) {
    emit('add', data.option.trim())
    cancelAdding()
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (props.disableClickOutside) return
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node | null)) {
    cancelAdding()
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <ul class="app-select" v-if="isOpened" ref="dropdownRef" :class="{ 'app-select--up': placement === 'up' }">
        <li
        v-for="(option, index) in displayedOptions"
        :key="option"
        class="app-select__option"
        :class="{ 'app-select__option--selected': modelValue === option,
                  'app-select__option--editing': editingIndex === index,
                  'app-select__option--autocomplete': type === 'autocomplete'
                }"
        @click="selectOption(option)">

        <div v-if="type === 'default' && editingIndex === index" class="app-select__edit">
            <AppInput
            type="editing"
            :placeholder="`${option}`"
            v-model="editingValue"
            @click.stop />
            <button class="app-select__icon" @click.stop="saveEdit"><AppIcons name="done" /></button>
        </div>

        <template v-else>
            <span class="app-select__option-label">{{ option }}</span>
            <div v-if="type === 'default' && showActions" class="app-select__actions">
                <button class="app-select__icon" @click.stop="startEdit(option, index)">
                    <AppIcons name="edit" />
                </button>
                <button class="app-select__icon" @click.stop="handleDelete(option)">
                    <AppIcons name="delete" />
                </button>
            </div>
        </template>
        </li>

        <li v-if="type === 'default' && showActions">
            <div v-if="isAdding" class="app-select__adding">
                <AppInput
                type="editing"
                placeholder="Введите название"
                v-model="data.option"
                @click.stop>
                    <template #errors>
                        <p v-for="error of (r$ as any).option?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                    </template>
                </AppInput>
                <button class="app-select__icon" @click.stop="confirmAdding"><AppIcons name="done" height="16px" width="16px"/></button>
                <button class="app-select__icon" @click.stop="cancelAdding"><AppIcons name="close" height="16px" width="16px"/></button>
            </div>
            <div v-else class="app-select__add-trigger">
                <button @click.stop="startAdding">
                    <AppIcons name="add" class="app-select__add-icon" />
                    <span>Добавить тип</span>
                </button>
            </div>
        </li>
    </ul>
</template>

<style lang="scss">
.app-select {
    position: absolute;
    z-index: 3000;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 300px;
    background: var(--primary-contast-text);
    box-shadow: var(--box-shadow);
    border-radius: 8px;
    color: var(--text-secondary);
    overflow-y: auto;

    &__option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 11px 12px;
        margin-bottom: 8px;
        line-height: 16px;
        cursor: pointer;
        font-size: 14px;
        line-height: 18px;
        text-overflow: ellipsis;

        &:hover {
            background-color: var(--other-gray);
            color: var(--text-primary);
        }

        &--selected {
            background-color: var(--divider);

        }

        &--editing {
            cursor: default;
            background-color: var(--primary-contast-text);
        }

        &:first-child {
            margin-top: 8px;
        }
    }

    &__option-label {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    &__actions {
        display: none;

        .app-select__option:hover & {
            display: flex;
            gap: 8px;
        }
    }

    &__icon {
        background: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        color: var(--text-primary);
        fill-opacity: 0.5;
    }

    &__edit {
        display: flex;
        align-items: center;
        width: 100%;
    }

    &__adding {
        padding: 9px 12px;
        display: flex;
        align-items: center;
    }

    &__option--autocomplete {
        color: var(--text-primary);
    } 
    
    &--up {
        top: auto;
        bottom: 100%;
    }
}

.app-select__add-trigger {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--text-secondary);
    padding: 7px 0 8px 12px;
    
    button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 7px 0;
        color: inherit;
    }

    &:hover {
        background-color: var(--other-gray);
        border-radius: 8px;
        color: var(--text-primary);
    }
}

.app-select__add-icon {
    width: 16px;
    height: 16px;
}
</style>