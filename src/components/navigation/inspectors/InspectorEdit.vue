<script lang="ts" setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { useInspectorsStore } from '@/stores/inspectorsStore'
import type { Inspector } from '@/stores/inspectorsStore'
import { useFormValidation } from '@/composables/useFormValidation'
import AppCalendar from '@/components/globals/AppCalendar.vue'
import AppAutocomplete from '@/components/globals/AppAutocomplete.vue'

const props = defineProps<{
    id: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const inspectorsStore = useInspectorsStore()
const inspector = ref<Inspector | null>(null)

const loadInspector = () => {
    const id = props.id
    if (!id) return
    if (inspectorsStore.inspectors.length === 0) {
        inspectorsStore.loadFromStorage()
    }
    const found = inspectorsStore.findById(id)
    inspector.value = found || null
}

onMounted(loadInspector)

const { data, r$ } = useFormValidation(
  { surname: '', name: '', email: '', phone: '', vk: '', birthDate: '' },
  {
    surname: { type: 'text', required: true, maxLength: 32 },
    name: { type: 'text', required: true, maxLength: 32 },
    email: { type: 'email', required: true, maxLength: 32 },
    phone: { type: 'text', isNumber: true, maxLength: 11, minLength: 11 },
    vk: { type: 'text', vklink: true },
    birthDate: { type: 'text' }
  }
)

const city = ref('')
const address = ref('')
const note = ref('')
const selectedDate = ref('')
const isCalendarOpen = ref(false)

const displayDate = computed({
  get: () => {
    if (!selectedDate.value) return ''
    const parts = selectedDate.value.split('-')
    if (parts.length !== 3) return ''
    const year = parts[0]
    const month = parts[1]
    const day = parts[2]
    if (!year || !month || !day) return ''
    return `${day}.${month}.${year}`
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

watch(inspector, (newVal) => {
    if (newVal) {
        data.surname = newVal.surname || ''
        data.name = newVal.name || ''
        city.value = newVal.city || ''
        address.value = newVal.address || ''
        data.email = newVal.email || ''
        data.phone = newVal.phonenumber || ''
        data.vk = newVal.vkPageLink || ''
        data.birthDate = newVal.birthday || ''
        selectedDate.value = newVal.birthday || ''
        note.value = newVal.note || ''
    }
}, { immediate: true })


watch(selectedDate, (newVal) => {
    data.birthDate = newVal
})

const isFormValid = computed(() => {
    return (r$ as any).surname?.$errors.length === 0 && data.surname !== '' &&
    (r$ as any).name?.$errors.length === 0 && data.name !== '' &&
    (r$ as any).email?.$errors.length === 0 && data.email !== '' &&
    city.value !== '' && (r$ as any).birthDate?.$errors.length === 0 &&
    (r$ as any).phone?.$errors.length === 0 &&
    (r$ as any).vk?.$errors.length === 0
})

const saveEdit = () => {
    if (inspector.value && isFormValid) {
        inspectorsStore.updateInspector(inspector.value.id, {
            surname: data.surname,
            name: data.name,
            city: city.value,
            address: address.value,
            email: data.email,
            phonenumber: data.phone,
            vkPageLink: data.vk,
            birthday: data.birthDate,
            note: note.value
        })
        inspector.value.surname = data.surname
        inspector.value.name = data.name
        inspector.value.city = city.value
        inspector.value.address = address.value
        inspector.value.email = data.email
        inspector.value.phonenumber = data.phone
        inspector.value.vkPageLink = data.vk
        inspector.value.birthday = data.birthDate
        inspector.value.note = note.value
        emit('close')
    }
}

const previousCity = ref('')

watch(city, (newCity) => {
    if (previousCity.value && previousCity.value !== newCity) {
        address.value = ''
    }
    previousCity.value = newCity
}, { immediate: true })

let closeTimer: number | null = null

const onBlur = () => {
    if (closeTimer) clearTimeout(closeTimer)
    closeTimer = setTimeout(() => {
        closeCalendar()
    }, 150)
}

const onCalendarMouseDown = () => {
    if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
    }
}
</script>

<template>
    <section class="inspetor-edit">
        <div class="inspetor-edit__wrapper">
            <AppInput type="input" label="Фамилия" placeholder="Введите фамилию" 
            v-model="data.surname" class="inspetor-edit__wrapper--input">
                <template #errors>
                    <p v-for="error of (r$ as any).surname?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>

            <AppInput type="input" label="Имя" placeholder="Введите имя" 
            v-model="data.name" class="inspetor-edit__wrapper--input">
                <template #errors>
                    <p v-for="error of (r$ as any).name?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>

            <AppAutocomplete type="city" label="Город" placeholder="Выберите город" 
            v-model="city" class="inspetor-edit__wrapper--input"/>

            <AppAutocomplete type="address" label="Адрес проживания" :city-filter="city" v-model="address"
            placeholder="Введите адрес" class="inspetor-edit__wrapper--input" />

            <div class="inspetor-edit__wrapper--input">
                <AppInput type="calendar" label="Дата рождения" placeholder="ДД.ММ.ГГ" v-model="displayDate"
                @click="toggleCalendar" @blur="onBlur">
                    <template #dropdown>
                        <AppCalendar v-if="isCalendarOpen" v-model="selectedDate" 
                        @close="isCalendarOpen = false" @mousedown="onCalendarMouseDown" />
                    </template>
                </AppInput>
            </div>

            <AppInput type="input" label="Телефон" placeholder="Введите номер телефона" 
            v-model="data.phone" class="inspetor-edit__wrapper--input">
                <template #errors>
                    <p v-for="error of (r$ as any).phone?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>

            <AppInput type="input" label="E-mail" placeholder="Введите E-mail" 
            v-model="data.email" class="inspetor-edit__wrapper--input">
                <template #errors>
                    <p v-for="error of (r$ as any).email?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>

            <AppInput type="input" label="ВКонтакте" placeholder="Введите ссылку на страницу ВКонтакте" 
            v-model="data.vk" class="inspetor-edit__wrapper--input">
                <template #errors>
                    <p v-for="error of (r$ as any).vk?.$errors" :key='error' class="validation-error__message">{{ error }}</p>
                </template>
            </AppInput>

            <AppInput type="input" label="Дата регистрации анкеты" placeholder=" " 
            :model-value="inspector?.registrationDate ?? ''" class="inspetor-edit__wrapper--input" disabled />

            <AppInput type="textarea" label="Заметка" placeholder="Необязательный комментарий" 
            v-model="note" class="inspetor-edit__wrapper--input"></AppInput>
        </div>

        <div class="inspetor-edit__buttons">
            <AppButton variant="bordered" @click="$emit('close')" class="inspetor-edit__buttons--element">Отмена</AppButton>
            <AppButton variant="green" @click="saveEdit" class="inspetor-edit__buttons--element" :disabled="!isFormValid">Сохранить</AppButton>
        </div>
    </section>
</template>

<style lang="scss">
.inspetor-edit {
    display: flex;
    justify-content: space-between;
    margin-top: 28px;
    align-items: flex-start;
}

.inspetor-edit__wrapper {
    max-width: 708px;
    width: 100%;
    padding: 32px 28px;
    border: 1px solid var(--border-gray);
    border-radius: 14px;
}

.inspetor-edit__wrapper--input {
    max-width: 409px;
}

.inspetor-edit__wrapper--input + .inspetor-edit__wrapper--input {
    margin-top: 20px;
}

.inspetor-edit__buttons {
    display: flex;

    &--element + &--element {
        margin-left: 12px;
    }
}
</style>