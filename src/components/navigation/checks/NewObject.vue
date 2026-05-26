<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import AppAutocomplete from '@/components/globals/AppAutocomplete.vue'
import { useFormValidation } from '@/composables/useFormValidation'

const emit = defineEmits<{
    (e: 'close'): void
}>()

const { data, r$ } = useFormValidation(
  { name: ''},
  {
    name: { type: 'text', required: true, maxLength: 32 }
  }
)
const city = ref('')
const address = ref('')

const isFormValid = computed(() => {
    return data.name !== '' &&
    (r$ as any).name?.$errors.length === 0 &&
    city.value !== '' &&
    address.value !== ''
})

watch(city, () => {
    address.value = ''
})
</script>

<template>
    <AppModals title="Новый объект" :showClose="true" footerAlign="right" @close="$emit('close')">
        <template #content>
            <AppInput type="input" label="Название" placeholder="Введите название" v-model="data.name">
                <template #errors>
                    <p v-for="error of (r$ as any).name?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>
            <AppAutocomplete type="city" label="Город" placeholder="Выберите город" v-model="city"/>
            <AppAutocomplete type="address" label="Адрес" placeholder="Введите адрес"
            :city-filter="city" v-model="address" :disabled="city === ''"/>
        </template>

        <template #footer>
            <AppButton variant="bordered" @click="$emit('close')">Отмена</AppButton>
            <AppButton variant="green" :disabled="!isFormValid" @click="$emit('close')">Добавить объект</AppButton>
        </template>
    </AppModals>
</template>
