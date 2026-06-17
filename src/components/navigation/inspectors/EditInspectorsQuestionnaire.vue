<script lang="ts" setup>
import { computed } from 'vue'
import AppComponent from '@/components/globals/AppComponent.vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@/composables/useLocalStorage'
import AppIcons from '@/components/globals/AppIcons.vue'
import AppTextRedactor from '@/components/globals/AppTextRedactor.vue'
import { useQuestionnaireStorage } from '@/composables/useQuestionnaireStorage'

const companyStore = useLocalStorage()
const router = useRouter()

const link = 'https://taipro.ru/companyname=' + companyStore.company.value.name + '&i…'

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
  }
}
const textStore = useQuestionnaireStorage()
const { fields, toggleField } = useQuestionnaireStorage()

const openInNewTab = () => {
  const routeUrl = router.resolve('/inspectors/questionnaire/preview')
  window.open(routeUrl.href, '_blank')
}
</script>
<template>
    <AppComponent label="Редактирование анкеты" title-icon="go-back" @header-click="router.push('/inspectors')">
        <template #content>
            <section class="questionnaire__buttons">
                <div class="questionnaire__link">
                    <span class="questionnaire__link--text">{{ link }}</span>
                    <AppButton variant="text-gray" @click="copyToClipboard(link)">Копировать ссылку</AppButton>
                </div>

                <div class="questionnaire__right-buttons">
                    <AppButton variant="text-gray" class="questionnaire__right-buttons--item" @click="openInNewTab">Предпросмотр</AppButton>
                    <AppButton variant="bordered" class="questionnaire__right-buttons--item">Отмена</AppButton>
                    <AppButton variant="green" class="questionnaire__right-buttons--item">Сохранить</AppButton>
                </div>
            </section>

            <section>
                <h2 class="questionnaire--h">Шапка анкеты</h2>
                <AppTextRedactor v-model="textStore.html.value"/>
            </section>

            <section>
                <h2 class="questionnaire--h">Поля для заполнения</h2>
                <div class="questionnaire__checkboxes">
                    <p class="questionnaire__checkboxes--line">
                        <AppIcons name="checkbox" class="questionnaire__checkboxes--default" />
                        <span>Фамилия</span>
                    </p>
                    <p class="questionnaire__checkboxes--line">
                        <AppIcons name="checkbox" class="questionnaire__checkboxes--default" />
                        <span>Имя</span>
                    </p>
                    <p class="questionnaire__checkboxes--line">
                        <button class="questionnaire__checkboxes--button" @click="toggleField('city')">
                            <AppIcons :name="fields.city ? 'checkbox' : 'empty-checkbox'" :class="fields.city ? 'questionnaire__checkboxes--checked' : ''"/>
                            <span>Город</span>
                        </button>
                    </p>
                    <p class="questionnaire__checkboxes--line">
                        <button class="questionnaire__checkboxes--button" @click="toggleField('address')">
                            <AppIcons :name="fields.address ? 'checkbox' : 'empty-checkbox'" :class="fields.address ? 'questionnaire__checkboxes--checked' : ''"/>
                            <span>Адрес проживания</span>
                        </button>
                    </p>
                    <p class="questionnaire__checkboxes--line">
                        <button class="questionnaire__checkboxes--button" @click="toggleField('birthDate')">
                            <AppIcons :name="fields.birthDate ? 'checkbox' : 'empty-checkbox'" :class="fields.birthDate ? 'questionnaire__checkboxes--checked' : ''"/>
                            <span>Дата рождения</span>
                        </button>
                    </p>
                    <p class="questionnaire__checkboxes--line">
                        <button class="questionnaire__checkboxes--button" @click="toggleField('phoneNumber')">
                            <AppIcons :name="fields.phoneNumber ? 'checkbox' : 'empty-checkbox'" :class="fields.phoneNumber ? 'questionnaire__checkboxes--checked' : ''"/>
                            <span>Телефон</span>
                        </button>
                    </p>
                    <p class="questionnaire__checkboxes--line">
                        <AppIcons name="checkbox" class="questionnaire__checkboxes--default" />
                        <span>E-mail</span>
                    </p>
                    <p class="questionnaire__checkboxes--line">
                        <button class="questionnaire__checkboxes--button" @click="toggleField('vk')">
                            <AppIcons :name="fields.vk ? 'checkbox' : 'empty-checkbox'" :class="fields.vk ? 'questionnaire__checkboxes--checked' : ''"/>
                            <span>Вконтакте</span>
                        </button>
                    </p>
                </div>
            </section>
        </template>
    </AppComponent>
</template>

<style lang="scss">
.questionnaire {
    &--h {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 20px;
    }
}

.questionnaire__buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
}

.questionnaire__right-buttons {
    display: flex;
    align-items: center;

    &--item + &--item {
        margin-left: 12px;
    }

    &--item:first-child {
        margin-right: 11px;
    }
}

.questionnaire__link {
    display: flex;
    align-items: center;
    border: 1px solid var(--border-gray);
    border-radius: 8px;
    padding: 11px 16px;

    &--text {
        color: var(--primary-main);
        font-size: 14px;
        text-overflow: ellipsis;
        max-width: 318px;
        width: 100%;
        margin-right: 26px;
    }
}

.questionnaire__checkboxes {
    box-sizing: border-box;
    max-width: 708px;
    width: 100%;
    padding: 32px 0 32px 28px;
    border: 1px solid var(--border-gray);
    border-radius: 16px;

    &--line {
        display: flex;
        align-items: center;

        & span {
            margin-left: 8px;
            font-size: 16px;
        }
    }

    &--button {
        border: none;
        background-color: transparent;
        padding: 0;
        margin: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    &--default {
        fill: #141a18;
        opacity: 0.2;
    }

    &--checked {
        fill: var(--primary-main);
    }
}
</style>