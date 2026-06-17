<script lang="ts" setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter, useRoute } from 'vue-router'
import { useFormValidation } from '@/composables/useFormValidation'

const { data, r$ } = useFormValidation(
  { email: '', password: ''},
  {
    email: { type: 'email', required: true, maxLength: 32  },
    password: { type: 'password', required: true, minLength: 6, maxLength: 30 }
  }
)

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const isFormValid = computed(() => {
    return data.email !== '' &&
    data.password !== '' &&
    (r$ as any).email?.$errors.length === 0 &&
    (r$ as any).password?.$errors.length === 0
})

const handleAuthorisation = () => {
    if (!isFormValid) return
    const user = {
        email: data.email.trim(),
        role: 'Администратор компании',
        password: data.password.trim(),
        name: '',
        surname: '',
        phoneNumber: ''
    }
    userStore.setUser(user)
    const redirect = route.query.redirect as string
    if (redirect) {
        router.push(redirect)
    } else {
        router.push('/checks')
    }
}

</script>

<template>
    <AppModals title="Авторизация" footerAlign="left" overlayVariant="light">
        <template #content>
            <div class="authorisation__content-container">
                <AppButton variant="vk" iconName="vk" iconPosition="right">Войти с помощью</AppButton>
                <p class="text--light-gray">Или с помощью почты и пароля</p>
            </div>
            <AppInput type="email" label="E-mail" v-model="data.email" placeholder="Введите E-mail">
                <template #errors>
                    <p v-for="error of (r$ as any).email?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>
            <AppInput type="password" label="Пароль" v-model="data.password" placeholder="Введите пароль">
                <template #errors>
                    <p v-for="error of (r$ as any).password?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>
        </template>

        <template #footer>
            <AppButton variant="green" :disabled="!isFormValid" @click="handleAuthorisation">Войти</AppButton>
            <AppButton variant="text-gray" class="authorisation__footer-button" @click="$router.push('/password-recovery')">Забыли пароль?</AppButton>
        </template>

        <template #below>
            <p class="below-container">
                <span class="text--light-gray">У вас нет аккаунта?</span>
                <AppButton variant="text-green" @click="$router.push('/register')">Зарегистрироваться</AppButton>
            </p>
        </template>
    </AppModals>
</template>

<style lang="scss">
.authorisation__content-container {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
}

.authorisation__footer-button {
    margin-left: 14px;
}
</style>