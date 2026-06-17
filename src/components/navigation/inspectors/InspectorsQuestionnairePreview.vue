<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import AppModals from '@/components/globals/AppModals.vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useQuestionnaireStorage } from '@/composables/useQuestionnaireStorage'
import { useFormValidation } from '@/composables/useFormValidation'
import AppAutocomplete from '@/components/globals/AppAutocomplete.vue'
import AppCalendar from '@/components/globals/AppCalendar.vue'

const companyStore = useLocalStorage()
const { html, fields } = useQuestionnaireStorage()

const { data, r$ } = useFormValidation(
  { surname: '', name: '', email: '', phone: '', vk: '', birthDate: '' },
  {
    surname: { type: 'text', required: true, maxLength: 32 },
    name: { type: 'text', required: true, maxLength: 32 },
    email: { type: 'email', required: true, maxLength: 32 },
    phone: { type: 'text',required: true, isNumber: true, maxLength: 11, minLength: 11 },
    vk: { type: 'text', required: true, domain: true, vklink: true },
    birthDate: { type: 'text', required: true }
  }
)

const city = ref('')
const address = ref('')

const isCityValid = computed(() => {
    let valid = true
    if(fields.value.city) {
        valid = city.value !== '' ? true : false
    }
    return valid
})

const isAddressValid = computed(() => {
    let valid = true
    if(fields.value.address) {
        valid = address.value !== '' ? true : false
    }
    return valid
})

const isBirthDateValid = computed(() => {
    if (!fields.value.birthDate) return true
    return selectedDate.value !== ''
})

const isPhoneValid = computed(() => {
    let valid = true
    if(fields.value.phoneNumber) {
        valid = data.phone !== '' ? true : false
    }
    if((r$ as any).phone?.$errors.length === 0) { valid = true }
    return valid
})

const isVKValid = computed(() => {
    let valid = true
    if(fields.value.vk) {
        valid = data.vk !== '' ? true : false
    }
    if((r$ as any).vk?.$errors.length === 0) { valid = true }
    return valid
})

const selectedDate = ref('')
const isCalendarOpen = ref(false)
const calendarWrapper = ref<HTMLElement | null>(null)

const displayDate = computed({
  get: () => {
    if (!selectedDate.value) return ''
    const parts = selectedDate.value.split('-')
    if (parts.length !== 3) return ''
    const year = parts[0]
    const month = parts[1]
    const day = parts[2]
    if (!year || !month || !day) return ''
    return `${day}.${month}.${year.slice(-2)}`
  },
  set: (value) => {
    if (!value) {
      selectedDate.value = ''
      return
    }
    const [day, month, shortYear] = value.split('.')
    if (day && month && shortYear) {
      const fullYear = `20${shortYear}`
      selectedDate.value = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }
})
const toggleCalendar = () => {
    isCalendarOpen.value = !isCalendarOpen.value
}

const closeCalendar = () => {
    isCalendarOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
    if (calendarWrapper.value && !calendarWrapper.value.contains(event.target as Node | null)) {
        closeCalendar()
    }
}

const isFormValid = computed(() => {
    return data.surname !== '' &&
    data.name !== '' &&
    data.email !== '' &&
    (r$ as any).email?.$errors.length === 0 &&
    (r$ as any).name?.$errors.length === 0 &&
    (r$ as any).surname?.$errors.length === 0 &&
    isCityValid && isAddressValid && isBirthDateValid && isPhoneValid && isVKValid

})

watch(city, () => {
    address.value = ''
})

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <AppModals overlay-variant="light" large-size footer-align="left">
        <template #content>
            <section class="questionnaire-preview__content">
                <img v-if="companyStore.company.value.logo" :src="companyStore.company.value.logo" alt="Логотип компании">

                <div v-html="html"></div>

                <section class="questionnaire-preview__inputs">
                    <AppInput type="input" label="Фамилия" placeholder="Введите вашу фамилию" 
                    v-model="data.surname" class="questionnaire-preview__inputs--element">
                        <template #errors>
                            <p v-for="error of (r$ as any).surname?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                        </template>
                    </AppInput>

                    <AppInput type="input" label="Имя" placeholder="Введите ваше имя" 
                    v-model="data.name" class="questionnaire-preview__inputs--element">
                        <template #errors>
                            <p v-for="error of (r$ as any).name?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                        </template>
                    </AppInput>

                    <AppAutocomplete type="city" v-if="fields.city" v-model="city"
                    label="Город" placeholder="Выберите город" class="questionnaire-preview__inputs--element" />

                    <AppAutocomplete v-if="fields.address" type="address" label="Адрес" :city-filter="city" v-model="address"
                    placeholder="Введите ваш адрес" class="questionnaire-preview__inputs--element" />

                    <div ref="calendarWrapper" class="questionnaire-preview__inputs--element">
                    <AppInput v-if="fields.birthDate" type="calendar" label="Дата рождения" placeholder="ДД.ММ.ГГ" v-model="displayDate"
                    class="questionnaire-preview__inputs--short" @click="toggleCalendar">
                        <template #dropdown>
                            <AppCalendar v-if="isCalendarOpen" v-model="selectedDate" @close="isCalendarOpen = false" />
                        </template>
                    </AppInput>
                    </div>

                    <AppInput v-if="fields.phoneNumber" type="input" label="Телефон" placeholder="Введите ваш номер телефона" 
                    v-model="data.phone" class="questionnaire-preview__inputs--element">
                        <template #errors>
                            <p v-for="error of (r$ as any).phone?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                        </template>
                    </AppInput>

                    <AppInput type="input" label="E-mail" placeholder="Введите ваш E-mail" 
                    v-model="data.email" class="questionnaire-preview__inputs--element">
                        <template #errors>
                            <p v-for="error of (r$ as any).email?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                        </template>
                    </AppInput>

                    <AppInput v-if="fields.vk" type="input" label="ВКонтакте" placeholder="Введите вашу ссылку на профиль ВКонтакте" 
                    v-model="data.vk" class="questionnaire-preview__inputs--element">
                        <template #errors>
                            <p v-for="error of (r$ as any).vk?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                        </template>
                    </AppInput>
                </section>
            </section>
        </template>

        <template #footer>
            <AppButton variant="green" class="questionnaire-preview__footer" :disabled="!isFormValid">Отправить анкету</AppButton>
        </template>

        <template #under-footer>
            <p class="questionnaire-preview__under-footer">
                <span>Нажимая на кнопку, вы соглашаетесь с </span>
                <span class="questionnaire-preview__under-footer--gray">Политикой обработки персональных данных</span>
            </p>
        </template>

        <template #below class="questionnaire-preview__below">
            <div class="questionnaire-preview__below">
                <AppIcons name="logo-gray"/>
                <p>Конструктор тайных проверок</p>
            </div>
        </template>
    </AppModals>
</template>

<style lang="scss">
.questionnaire-preview__content {
    margin: 16px;

    strong {
        font-weight: 600;
    }

    i, em {
        font-style: italic;
    }

    u {
        text-decoration: underline;
    }

    s {
        text-decoration: line-through;
    }

    mark {
        background-color: rgba(20, 184, 144, 0.5);
    }

    p {
        margin-top: 10px;
    }
}

.questionnaire-preview__inputs {
    border: 1px solid var(--border-gray);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 32px 271px 32px 28px;
    margin-top: 32px;

    &--element + &--element {
        margin-top: 20px;
    }

    &--short {
        max-width: 168px;
    }
}

.questionnaire-preview__footer {
    margin: 0 0 20px 16px;
}

.questionnaire-preview__under-footer {
    font-size: 12px;
    margin: 0 0 24px 16px;

    &--gray {
        color: var(--text-secondary);
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
}

.questionnaire-preview__below {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;

    & p {
        color: var(--text-secondary);
        opacity: 0.8;
        margin-top: 16px;
    }
}
</style>