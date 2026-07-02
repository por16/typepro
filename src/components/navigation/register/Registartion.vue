<script lang="ts" setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useFormValidation } from '@/composables/useFormValidation'

const { data, r$ } = useFormValidation(
  { companyName: '', email: '', password: '' },
  {
    companyName: { type: 'text', required: true },
    email: { type: 'email', required: true, maxLength: 32 },
    password: { type: 'password', required: true, minLength: 6, maxLength: 30 }
  }
)

const isFormValid = computed(() => {
    return data.companyName !== '' &&
    data.email !== '' &&
    data.password !== '' &&
    (r$ as any).companyName?.$errors.length === 0 &&
    (r$ as any).email?.$errors.length === 0 &&
    (r$ as any).password?.$errors.length === 0
})

const userStore = useUserStore()
const router = useRouter()
const { setCompany } = useLocalStorage()

const handleRegistration = () => {
    const user = {
        email: data.email.trim(),
        role: 'Администратор компании',
        password: data.password.trim(),
        name: '',
        surname: '',
        phoneNumber: ''
    }
    userStore.setUser(user)

    setCompany({
        name: data.companyName.trim(),
        logo: '',
        activities: '',
        siteLink: '',
        VKGroupLink: ''
    })

    router.push('/checks')
}
</script>

<template>
    <AppModals title="Регистрация компании" footerAlign="left" overlayVariant="light">
        <template #content>
            <div class="registration__content-container">
                <AppButton variant="vk" iconName="vk" iconPosition="right" @click="$router.push('/register/vk')">Зарегистрироваться с помощью</AppButton>
                <span class="text--light-gray">Или с помощью формы</span>
            </div>
            <AppInput type="input" label="Название" v-model="data.companyName" placeholder="Введите название компании">
                <template #errors>
                    <p v-for="error of (r$ as any).companyName?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>

            <AppInput type="input" label="E-mail" v-model="data.email" placeholder="Введите E-mail">
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
            <AppButton variant="green" :disabled="!isFormValid" @click="handleRegistration">Зарегистрироваться</AppButton>
        </template>

        <template #under-footer>
            <p class="registration__under-footer">
                <span>Нажимая на кнопку, вы соглашаетесь с </span>
                <span class="text--light-gray link registration__under-footer--link">Политикой <br>обработки персональных данных</span>
            </p>
        </template>

        <template #below>
            <div class="below-container">
                <span class="text--light-gray">Уже есть аккаунт?</span>
                <AppButton variant="text-green" @click="$router.push('/login')">Войти</AppButton>
            </div>
        </template>
    </AppModals>
</template>

<style lang="scss">
.registration__content-container {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
}

.registration__under-footer {
    font-size: 12px;
    margin-top: 4px;

    &--link:hover {
        text-decoration: underline;
    }
}

.below-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 14px;
}
</style>