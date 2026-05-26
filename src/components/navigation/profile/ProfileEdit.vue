<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useRouter } from 'vue-router'
import { useFormValidation } from '@/composables/useFormValidation'
import ChangePassword from './ChangePassword.vue'

const userStore = useUserStore()
const companyStore = useLocalStorage()
const router = useRouter()

const { data, r$ } = useFormValidation(
  { phoneNumber: '', surname: '', name: '', companyName: '', activities: '', siteLink: '', VKGroupLink: '' },
  {
    phoneNumber: { type: 'text', isNumber: true, maxLength: 11, minLength: 11 },
    surname: { type: 'text', maxLength: 32 },
    name: { type: 'text', maxLength: 32 },
    companyName: { type: 'text', maxLength: 32 },
    activities: { type: 'text' },
    siteLink: { type: 'text', domain: true },
    VKGroupLink: { type: 'text', domain: true, vklink: true }
  }
)

const saveChanges = () => {
    const currentUser = userStore.user
    const currentCompany = companyStore.company.value

    if (currentUser) {
        userStore.setUser({
        email: currentUser.email,
        role: currentUser.role,
        password: currentUser.password,
        name: data.name !== '' ? data.name : currentUser.name,
        surname: data.surname!== '' ? data.surname : currentUser.surname,
        phoneNumber: data.phoneNumber !== '' ? data.phoneNumber : currentUser.phoneNumber
    })
    }

    companyStore.setCompany({
        name: data.companyName !== '' ? data.companyName : currentCompany.name,
        logo: currentCompany.logo,
        activities: data.activities !== '' ? data.activities : currentCompany.activities,
        siteLink: data.siteLink !== '' ? data.siteLink : currentCompany.siteLink,
        VKGroupLink: data.VKGroupLink !== '' ? data.VKGroupLink : currentCompany.VKGroupLink
    })

    router.push('/profile')
}

const onPasswordChange = ref(false)

const noMistakes = computed(() => {
    return (r$ as any).name?.$errors.length === 0 &&
    (r$ as any).surname?.$errors.length === 0 &&
    (r$ as any).phoneNumber?.$errors.length === 0 &&
    (r$ as any).companyName?.$errors.length === 0 &&
    (r$ as any).activities?.$errors.length === 0 &&
    (r$ as any).siteLink?.$errors.length === 0 &&
    (r$ as any).VKGroupLink?.$errors.length === 0
})
</script>

<template>
    <AppComponent>
        <template #content>
            <div class="app-profile">
                <div class="app-profile__info">
                    <div class="app-profile__info-block">
                        <p class="app-profile__info-block--label">Контактное лицо</p>
                        <div class="app-profile__info-tabel">
                            <AppInput type="input" label="E-mail" :placeholder="userStore.user?.email"
                            :disabled="true" class="app-profile__info-line--left app-profile__info-line--edit" />

                            <AppInput type="input" label="Имя" :placeholder="userStore.user?.name || 'Введите имя'" 
                            class="app-profile__info-line--left app-profile__info-line--edit" v-model="data.name">
                                <template #errors>
                                    <p v-for="error of (r$ as any).name?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                                </template>
                            </AppInput>

                            <AppInput type="input" label="Фамилия" :placeholder="userStore.user?.surname || 'Введите фамилию'" 
                            class="app-profile__info-line--left app-profile__info-line--edit" v-model="data.surname">
                                <template #errors>
                                    <p v-for="error of (r$ as any).surname?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                                </template>
                            </AppInput>

                            <AppInput type="input" label="Телефон" 
                            :placeholder="userStore.user?.phoneNumber || 'Введите номер телефона'" 
                            class="app-profile__info-line--left app-profile__info-line--edit" v-model="data.phoneNumber">
                                <template #errors>
                                    <p v-for="error of (r$ as any).phoneNumber?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                                </template>
                            </AppInput>
                        </div>
                    </div>

                    <div class="app-profile__info-block">
                        <p class="app-profile__info-block--label">Информация о компании</p>
                        <div class="app-profile__info-tabel">
                            <AppInput type="input" label="Название"
                            :placeholder="companyStore.company.value.name || 'Введите название компании'" 
                            class="app-profile__info-line--left app-profile__info-line--edit" v-model="data.companyName">
                                <template #errors>
                                    <p v-for="error of (r$ as any).companyName?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                                </template>
                            </AppInput>
                            
                            <div class="app-profile__info-line--edit">
                                <p class="app-profile__logo-label">Логотип</p>
                                <AppButton variant="bordered" :long="true">Загрузить</AppButton>
                            </div>

                            <AppInput type="input" label="Краткое описание деятельности" 
                            :placeholder="companyStore.company.value.activities || 'Введите краткое описание деятельности'" 
                            class="app-profile__info-line--left app-profile__info-line--edit" v-model="data.activities">
                                <template #errors>
                                    <p v-for="error of (r$ as any).activities?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                                </template>
                            </AppInput>

                            <AppInput type="input" label="Ссылка на сайт" 
                            :placeholder="companyStore.company.value.siteLink || 'Добавьте ссылку на сайт'" 
                            class="app-profile__info-line--left app-profile__info-line--edit" v-model="data.siteLink">
                                <template #errors>
                                    <p v-for="error of (r$ as any).siteLink?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                                </template>
                            </AppInput>

                            <AppInput type="input" label="Ссылка на группу VK" 
                            :placeholder="companyStore.company.value.VKGroupLink || 'Добавьте ссылку на группу VK'" 
                            class="app-profile__info-line--left app-profile__info-line--edit" v-model="data.VKGroupLink">
                                <template #errors>
                                    <p v-for="error of (r$ as any).VKGroupLink?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                                </template>
                            </AppInput>
                        </div>
                    </div>
                </div>

                <div class="app-profile__buttons">
                    <AppButton variant="text-gray" class="app-profile__button" @click="onPasswordChange = true">Сменить пароль</AppButton>
                    <AppButton variant="bordered" class="app-profile__button" @click="$router.push('/profile')">Отмена</AppButton>
                    <AppButton variant="green" class="app-profile__button" @click="saveChanges" :disabled="!noMistakes">Сохранить</AppButton>
                </div>
            </div>
        </template>
    </AppComponent>
    <ChangePassword v-if="onPasswordChange" @close="onPasswordChange = false"/>
</template>

<style lang="scss">
.app-profile__button + .app-profile__button {
    margin-left: 12px;   
}

.app-profile__info-line--edit {
    margin-bottom: 20px;
}

.app-profile__logo-label {
    font-size: 12px;
    margin-bottom: 8px;
}

.app-profile__button:first-child {
    margin-right: 16px;
}
</style>