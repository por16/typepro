<script lang="ts" setup>
import { ref, computed } from 'vue'
import AppAutocomplete from '@/components/globals/AppAutocomplete.vue'
import { useFormValidation } from '@/composables/useFormValidation'
import { useInspectorsStore } from '@/stores/inspectorsStore' 

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

const isFormValid = computed(() => {
    return data.surname !== '' &&
    data.name !== '' &&
    city.value !== '' &&
    data.email !== '' &&
    (r$ as any).email?.$errors.length === 0 &&
    (r$ as any).name?.$errors.length === 0 &&
    (r$ as any).surname?.$errors.length === 0 
})

const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, '0')
const day = String(today.getDate()).padStart(2, '0')
const dateString = `${day}.${month}.${year}`

const inspectorsStore = useInspectorsStore()

const addNewInspector = () => {
    inspectorsStore.addInspector({
        surname: data.surname,
        name: data.name,
        inspectorState: 'Проверка анкеты',
        city: city.value,
        email: data.email,
        registrationDate: dateString
    })
    emit('close')
}
</script>

<template>
    <AppModals title="Новый проверяющий" :showClose="true" footerAlign="right" @close="$emit('close')">
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
            <AppInput type="input" label="E-mail" placeholder="Введите E-mail" v-model="data.email">
                <template #errors>
                    <p v-for="error of (r$ as any).email?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>
        </template>

        <template #footer>
            <AppButton variant="bordered" @click="$emit('close')">Отмена</AppButton>
            <AppButton variant="green" :disabled="!isFormValid" @click="addNewInspector">Добавить проверяющего</AppButton>
        </template>
    </AppModals>
</template>