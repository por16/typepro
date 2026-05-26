<script lang="ts" setup>
import { ref, computed } from 'vue'
import PasswordRecoveryMessage from './PasswordRecoveryMessage.vue'
import { useRouter } from 'vue-router'
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

const router = useRouter()
const onRecovery = ref(false)
const handleOnRecoveryClose = () => {
    onRecovery.value = false
    router.push('/login')
}
</script>

<template>
    <AppModals title="Восстановление пароля" footerAlign="left" overlayVariant="light">
        <template #content>
            <AppInput type="input" label="E-mail" v-model="data.email" placeholder="Введите E-mail" >
                <template #errors>
                    <p v-for="error of (r$ as any).email?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>
        </template>

        <template #footer>
            <AppButton variant="green" :disabled="!isFormValid" @click="onRecovery = true">Восстановить</AppButton>
        </template>

        <template #below>
            <AppButton variant="text-green" @click="$router.push('/login')">Вернуться на страницу авторизации</AppButton>
        </template>
    </AppModals>
    <PasswordRecoveryMessage v-if="onRecovery" :email="data.email" @close="handleOnRecoveryClose"/>
</template>

<style lang="scss"></style>