<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useTaskTypes } from '@/composables/useLocalStorage'
import { useFormValidation } from '@/composables/useFormValidation'
import ConfirmDeletingType from './ConfirmDeletingType.vue'

const emit = defineEmits<{
    (e: 'close'): void
}>()

const { data, r$ } = useFormValidation(
  { name: ''},
  {
    name: { type: 'text', required: true, maxLength: 32 }
  }
)
const taskTypes = useTaskTypes()
const options = taskTypes.types
const isOpened = ref(false)
const selectedType = ref('')

const isFormValid = computed(() => {
    return data.name !== '' &&
    selectedType.value !== '' &&
    (r$ as any).name?.$errors.length === 0
})

const handdleEditting = (oldValue: string, newValue: string) => {
    const index = taskTypes.types.value.indexOf(oldValue)
    if (newValue.trim()) {
        taskTypes.types.value[index] = newValue.trim()

        if (selectedType.value === oldValue) {
            selectedType.value = newValue.trim()
        }

        taskTypes.saveTypes()
    }
}

const handleAdding = (option: string) => {
    if (option.trim()) {
        taskTypes.addType(option.trim())
    }
}

const onDelete = ref(false)
const typeToDelete = ref('')
const isDeleting = ref(false)

const handleDeleteConfirm = (type: string) => {
    typeToDelete.value = type
    isDeleting.value = true
    onDelete.value = true
}

const confirmDelete = () => {
    taskTypes.removeType(typeToDelete.value)
    if (selectedType.value === typeToDelete.value) {
        selectedType.value = ''
    }
    onDelete.value = false
    typeToDelete.value = ''
    setTimeout(() => {
        isDeleting.value = false
    }, 100)
}
</script>

<template>
    <AppModals title="Новый объект" :showClose="true" footerAlign="right" @close="$emit('close')">
        <template #content>
            <AppInput type="select" label="Подходит для типа проверки" placeholder="Выберите тип"
             @open-select="isOpened = true" v-model="selectedType" @toggle-select="isOpened = !isOpened">
                <template #dropdown>
                    <AppDropdown type="default" :disableClickOutside="isDeleting":options="options" :isOpened="isOpened" :showActions="true" 
                    @close="isOpened = false" @update:modelValue="selectedType = $event"
                    @edit="handdleEditting" @delete="handleDeleteConfirm" @add="handleAdding" />
                </template>
            </AppInput>
            <AppInput type="input" label="Название" placeholder="Введите название" v-model="data.name">
                <template #errors>
                    <p v-for="error of (r$ as any).name?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>
        </template>

        <template #footer>
            <AppButton variant="bordered" @click="$emit('close')">Отмена</AppButton>
            <AppButton variant="green" :disabled="!isFormValid" @click="$emit('close')">Добавить</AppButton>
        </template>
    </AppModals>
    <ConfirmDeletingType v-if="onDelete" :type="typeToDelete" @confirm="confirmDelete" 
    @close="() => { onDelete = false; isDeleting = false; }" />
</template>
