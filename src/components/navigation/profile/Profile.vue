<script lang="ts" setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useLocalStorage } from '@/composables/useLocalStorage'
import AppInfoTable from '@/components/globals/AppInfoTable.vue'

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
                    <AppInfoTable
                    label="Контактное лицо"
                    :rows="[
                        { label: 'E-mail', value: userStore.user?.email },
                        { label: 'Пароль', value: hidePassword },
                        { label: 'Имя', value: userStore.user?.name || 'Не указано' },
                        { label: 'Фамилия', value: userStore.user?.surname || 'Не указано' },
                        { label: 'Телефон', value: userStore.user?.phoneNumber || 'Не указано' }
                    ]" />
                    <AppInfoTable
                    label="Информация о компании"
                    :rows="[
                        { label: 'Название', value: companyStore.company.value.name || 'Не указано' },
                        { label: 'Логотип', value: companyStore.company.value.logo || 'Нет', key: 'logo' },
                        { label: `Краткое описание <br> деятельности`, value: companyStore.company.value.activities || 'Не указано' },
                        { label: 'Ссылка на сайт', value: companyStore.company.value.siteLink || 'Нет' },
                        { label: 'Ссылка на группу VK', value: companyStore.company.value.VKGroupLink || 'Нет' },
                    ]">
                        <template #cell-logo="{ row }">
                            <img v-if="row.value" :src="row.value" class="app-profile__logo" alt="Логотип компании" />
                            <span v-else>Нет</span>
                        </template>
                    </AppInfoTable>
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