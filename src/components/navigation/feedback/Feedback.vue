<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'send'): void
}>()

const { data, r$ } = useFormValidation(
  { text: ''},
  {
    text: { type: 'text', required: true }
  }
)

const isFormValid = computed(() => {
    return data.text !== '' &&
    (r$ as any).text?.$errors.length === 0 
})

</script>

<template>
    <AppModals title="Есть идея или вопрос?" :showClose="true" footerAlign="right" @close="$emit('close')">
        <template #content>
            <AppInput type="textarea" label="Вопрос или идея" v-model="data.text"
            placeholder="Задайте ваш вопрос или напишите, какой функционал хотели бы добавить или улучшить">
                <template #errors>
                    <p v-for="error of (r$ as any).text?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>
        </template>

        <template #footer>
            <AppButton variant="bordered" @click="$emit('close')">Отмена</AppButton>
            <AppButton variant="green" :disabled="!isFormValid" @click="$emit('send')">Отправить</AppButton>
        </template>
    </AppModals>
</template>