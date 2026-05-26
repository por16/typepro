<script lang="ts" setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useLocalStorage } from '@/composables/useLocalStorage'

const userStore = useUserStore()
const companyStore = useLocalStorage()

const hidePassword = computed(() => {
  const passwordLength = userStore.user?.password.length || 0
  return '•'.repeat(passwordLength)
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
                            <div class="app-profile__info-line">
                                <span class="app-profile__info-line--left text--light-gray">E-mail</span>
                                <span>{{ userStore.user?.email }}</span>
                            </div>
                            <div class="app-profile__info-line">
                                <span class="app-profile__info-line--left text--light-gray">Пароль</span>
                                <span>{{ hidePassword }}</span>
                            </div>
                            <div class="app-profile__info-line">
                                <span class="app-profile__info-line--left text--light-gray">Имя</span>
                                <span>{{ userStore.user?.name || 'Не указано' }}</span>
                            </div>
                            <div class="app-profile__info-line">
                                <span class="app-profile__info-line--left text--light-gray">Фамилия</span>
                                <span>{{ userStore.user?.surname || 'Не указано' }}</span>
                            </div>
                            <div class="app-profile__info-line">
                                <span class="app-profile__info-line--left text--light-gray">Телефон</span>
                                <span>{{ userStore.user?.phoneNumber || 'Не указано' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="app-profile__info-block">
                        <p class="app-profile__info-block--label">Информация о компании</p>
                        <div class="app-profile__info-tabel">
                            <div class="app-profile__info-line">
                                <span class="app-profile__info-line--left text--light-gray">Название</span>
                                <span>{{ companyStore.company.value.name || 'Не указано' }}</span>
                            </div>
                            <div class="app-profile__info-line">
                                <span class="app-profile__info-line--left text--light-gray">Логотип</span>
                                <span>{{ companyStore.company.value.logo || 'Нет' }}</span>
                            </div>
                            <div class="app-profile__info-line">
                                <span class="app-profile__info-line--left text--light-gray">Краткое описание <br>деятельности</span>
                                <span class="line-break">{{ companyStore.company.value.activities || 'Не указано' }}</span>
                            </div>
                            <div class="app-profile__info-line">
                                <span class="app-profile__info-line--left text--light-gray">Ссылка на сайт</span>
                                <span>{{ companyStore.company.value.siteLink || 'Нет' }}</span>
                            </div>
                            <div class="app-profile__info-line">
                                <span class="app-profile__info-line--left text--light-gray">Ссылка на группу VK</span>
                                <span>{{ companyStore.company.value.VKGroupLink || 'Нет' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="app-profile__buttons">
                    <AppButton variant="bordered" @click="$router.push('/profile/edit')">Редактировать</AppButton>
                </div>
            </div>
        </template>
    </AppComponent>
</template>

<style lang="scss">
.app-profile {
    padding: 8px 0 48px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.app-profile__info {
    min-width: 709px;
}

.app-profile__info-block + .app-profile__info-block {
    margin-top: 24px;
}

.app-profile__info-block {
    display: flex;
    flex-direction: column;

    &--label {
        font-size: 24px;
        font-weight: 500;
        line-height: 150%;
        margin-bottom: 20px;
    }
}

.app-profile__info-tabel {
    width: 100%;
    padding: 32px 28px 12px 28px;
    border: 1px solid var(--divider);
    border-radius: 14px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.app-profile__info-line + .app-profile__info-line {
    border-top: 1px solid var(--divider);
    padding-top: 20px;
}

.app-profile__info-line {
    display: flex;
    align-content: center;
    padding-bottom: 20px;
    font-size: 16px;
    line-height: 20px;

    &--left {
        display: inline-block;
        min-width: 315px;
        max-width: 409px;
    }
}

.app-profile__buttons {
    display: flex;
}
</style>