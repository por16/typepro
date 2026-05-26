<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'

const { data, r$ } = useFormValidation(
  { email: ''},
  {
    email: { type: 'email', required: true, maxLength: 32 }
  }
)

const isFormValid = computed(() => {
    return data.email !== '' &&
    (r$ as any).email?.$errors.length === 0 
})
</script>

<template>
    <AppModals title="Регистрация компании" footerAlign="left" overlayVariant="light">
        <template #content>
            <p>Чтобы создать аккаунт, нужен ваш E-mail</p>
            <AppInput type="input" label="E-mail" v-model="data.email" placeholder="Введите E-mail">
                <template #errors>
                    <p v-for="error of (r$ as any).email?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>
        </template>

        <template #footer>
            <AppButton variant="green" :disabled="!isFormValid">Зарегистрироваться</AppButton>
        </template>

        <template #below>
            <AppButton variant="text-green" @click="$router.push('/register')">Вернуться на страницу регистрации</AppButton>
        </template>
    </AppModals>
</template>

<style lang="scss"></style>