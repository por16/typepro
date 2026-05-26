<script lang="ts" setup>
import { ref, computed } from 'vue'
import AppAutocomplete from '@/components/globals/AppAutocomplete.vue'
import { useFormValidation } from '@/composables/useFormValidation'

const emit = defineEmits<{
    (e: 'close'): void
}>()

const { data, r$ } = useFormValidation(
  { email: '', surname: '', name: '' },
  {
    email: { type: 'email', required: true, maxLength: 32 },
    surname: { type: 'text', required: true, maxLength: 32 },
    name: { type: 'text', required: true, maxLength: 32 }
  }
)
const city = ref('')
const role = ref('')

const isFormValid = computed(() => {
    return data.surname !== '' &&
    data.name !== '' &&
    city.value !== '' &&
    role.value !== '' &&
    data.email !== '' &&
    (r$ as any).email?.$errors.length === 0 &&
    (r$ as any).name?.$errors.length === 0 &&
    (r$ as any).surname?.$errors.length === 0 
})

const isOpened = ref(false)
const roles = ['Менеджер контроля качества', 'Босс', 'Работяга', 'Пчела-трудяга']
</script>

<template>
    <AppModals title="Новый сотрудник" :showClose="true" footerAlign="right" @close="$emit('close')">
        <template #content>
            <AppInput type="input" label="Фамилия" placeholder="Введите фамилию" v-model="data.surname">
                <template #errors>
                    <p v-for="error of (r$ as any).surname?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>
            <AppInput type="input" label="Имя" placeholder="Введите имя" v-model="data.name">
                <template #errors>
                    <p v-for="error of (r$ as any).name?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>
            <AppAutocomplete type="city" label="Город" placeholder="Введите город" v-model="city"/>
            <AppInput type="select" label="Роль" placeholder="Выберите роль" v-model="role" 
            @open-select="isOpened = true" @toggle-select="isOpened = !isOpened">
                <template #dropdown>
                    <AppDropdown type="default" :options="roles" :isOpened="isOpened" 
                    @close="isOpened = false" @update:modelValue="role = $event"/>
                </template>
            </AppInput>
            <AppInput type="input" label="E-mail" placeholder="Введите E-mail" v-model="data.email">
                <template #errors>
                    <p v-for="error of (r$ as any).email?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>
        </template>

        <template #footer>
            <AppButton variant="bordered" @click="$emit('close')">Отмена</AppButton>
            <AppButton variant="green" :disabled="!isFormValid" @click="$emit('close')">Добавить сотрудника</AppButton>
        </template>
    </AppModals>
</template>