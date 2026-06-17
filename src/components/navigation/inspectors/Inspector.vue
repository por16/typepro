<script lang="ts" setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInspectorsStore } from '@/stores/inspectorsStore'
import type { Inspector } from '@/stores/inspectorsStore'
import AppInfoTable from '@/components/globals/AppInfoTable.vue'
import AppStatus from '@/components/globals/AppStatus.vue'
import AppButton from '@/components/globals/AppButton.vue'
import InspectorStatusChange from './InspectorStatusChange.vue'
import InspectorDeletingConfirmation from './InspectorDeletingConfirmation.vue'
import AppIcons from '@/components/globals/AppIcons.vue'
import AppPaginationButton from '@/components/globals/AppPaginationButton.vue'
import { useFormValidation } from '@/composables/useFormValidation'
import AppCalendar from '@/components/globals/AppCalendar.vue'
import AppInput from '@/components/globals/AppInput.vue'
import AppAutocomplete from '@/components/globals/AppAutocomplete.vue'
import AppDropdown from '@/components/globals/AppDropdown.vue'

const route = useRoute()
const router = useRouter()
const inspectorsStore = useInspectorsStore()
const inspector = ref<Inspector | null>(null)

const loadInspector = () => {
    const id = route.params.id as string
    if (!id) return
    if (inspectorsStore.inspectors.length === 0) {
        inspectorsStore.loadFromStorage()
    }
    const found = inspectorsStore.findById(id)
    inspector.value = found || null
}

watch(inspector, (newVal) => {
    if (newVal) {
        document.title = `${newVal.surname} ${newVal.name}`
    } else {
        document.title = 'Проверяющий не найден'
    }
}, { immediate: true })

onMounted(loadInspector)
watch(() => route.params.id, loadInspector)

const tabs = [
    { key: 'overall-info', label: 'Общая информация' },
    { key: 'checks-history', label: 'История проверок' }
]

const onStatusChange = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node | null)) {
        onStatusChange.value = false
    }

    if (calendarWrapper.value && !calendarWrapper.value.contains(event.target as Node | null)) {
        closeCalendar()
    }
}

const handleStatusUpdate = (newStatus: string) => {
    if (inspector.value) {
        inspector.value.inspectorState = newStatus as Inspector['inspectorState']
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

const onDelete = ref(false)

const handleDelete = () => {
    router.push('/inspectors')
}

type FakeDataItem = {
    object: string
    city: string
    address: string
    task: string
    type: string
    date: string
    state: "Назначена" | "Проверка отчета" | "Исполнена" | "Отказ" | "Проверка анкеты" | "Одобрен" | "Отклонен"
}

const fakeData: FakeDataItem[] = [
    {object: 'Сойка на Первомайской', city: 'Екатеринбург', address: 'Первомайская, 36', task: 'Проверка качества  кухни', type: 'Ресторан', date: '25.08.2025', state: 'Назначена'},
    {object: 'Мелодия на Восточной', city: 'Пермь', address: 'Восточная, 27', task: 'Проверка качества обслуживания', type: 'Любой', date: '24.08.2025', state: 'Проверка отчета'},
    {object: 'Сойка на Луначарского', city: 'Курган', address: 'Луначарского, 24', task: 'Проверка внешнего вида сотрудников', type: 'Доставка', date: '24.08.2025', state: 'Исполнена'},
    {object: 'Мелодия на Красноармейской', city: 'Челябинск', address: 'Красноармейская, 31', task: 'Общая проверка', type: 'Ресторан', date: '25.08.2025', state: 'Исполнена'},
    {object: 'Сойка на Белинского', city: 'Нижний Тагил', address: 'Белинского, 84', task: 'Проверка качества обслуживания', type: 'Любой', date: '23.08.2025', state: 'Исполнена'},
    {object: 'Мелодия на Гурзуфской', city: 'Пермь', address: 'Гурзуфская, 74', task: 'Проверка качества  кухни', type: 'Доставка', date: '23.08.2025', state: 'Исполнена'},
    {object: 'Сойка на Ленина', city: 'Екатеринбург', address: 'Ленина, 15', task: 'Проверка внешнего вида сотрудников', type: 'Доставка', date: '25.08.2025', state: 'Исполнена'},
    {object: 'Мелодия на Онуфриева', city: 'Екатеринбург', address: 'Онуфриева, 185', task: 'Проверка качества обслуживания', type: 'Ресторан', date: '23.08.2025', state: 'Отказ'},
    {object: 'Мелодия на Шейнкмана', city: 'Челябинск', address: 'Шейнкмана, 19', task: 'Проверка внешнего вида сотрудников', type: 'Любой', date: '25.08.2025', state: 'Исполнена'},
    {object: 'Сойка на Луначарского', city: 'Курган', address: 'Луначарского, 24', task: 'Проверка качества  кухни', type: 'Доставка', date: '23.08.2025', state: 'Исполнена'},
    {object: 'Сойка на Ленина', city: 'Пермь', address: 'Ленина, 15', task: 'Общая проверка', type: 'Ресторан', date: '25.08.2025', state: 'Отказ'},
    {object: 'Сойка на Первомайской', city: 'Екатеринбург', address: 'Первомайская, 36', task: 'Проверка качества  кухни', type: 'Ресторан', date: '25.09.2025', state: 'Назначена'},
    {object: 'Мелодия на Восточной', city: 'Пермь', address: 'Восточная, 27', task: 'Проверка качества обслуживания', type: 'Любой', date: '24.09.2025', state: 'Проверка отчета'},
    {object: 'Сойка на Луначарского', city: 'Курган', address: 'Луначарского, 24', task: 'Проверка внешнего вида сотрудников', type: 'Доставка', date: '24.09.2025', state: 'Исполнена'},
    {object: 'Мелодия на Красноармейской', city: 'Челябинск', address: 'Красноармейская, 31', task: 'Общая проверка', type: 'Ресторан', date: '25.09.2025', state: 'Исполнена'},
    {object: 'Сойка на Белинского', city: 'Нижний Тагил', address: 'Белинского, 84', task: 'Проверка качества обслуживания', type: 'Любой', date: '23.09.2025', state: 'Исполнена'},
    {object: 'Мелодия на Гурзуфской', city: 'Пермь', address: 'Гурзуфская, 74', task: 'Проверка качества  кухни', type: 'Доставка', date: '23.09.2025', state: 'Исполнена'},
    {object: 'Сойка на Ленина', city: 'Екатеринбург', address: 'Ленина, 15', task: 'Проверка внешнего вида сотрудников', type: 'Доставка', date: '25.09.2025', state: 'Исполнена'},
    {object: 'Мелодия на Онуфриева', city: 'Екатеринбург', address: 'Онуфриева, 185', task: 'Проверка качества обслуживания', type: 'Ресторан', date: '23.09.2025', state: 'Отказ'},
    {object: 'Мелодия на Шейнкмана', city: 'Челябинск', address: 'Шейнкмана, 19', task: 'Проверка внешнего вида сотрудников', type: 'Любой', date: '25.09.2025', state: 'Исполнена'},
    {object: 'Сойка на Луначарского', city: 'Курган', address: 'Луначарского, 24', task: 'Проверка качества  кухни', type: 'Доставка', date: '23.09.2025', state: 'Исполнена'},
    {object: 'Сойка на Ленина', city: 'Пермь', address: 'Ленина, 15', task: 'Общая проверка', type: 'Ресторан', date: '25.09.2025', state: 'Отказ'},
]

const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedPerPage = ref('10 /стр.')

const filteredData = computed(() => fakeData)

const filteredCount = computed(() => filteredData.value.length)

const totalPagesNumber = computed(() => {
    return Math.ceil(filteredCount.value / itemsPerPage.value)
})

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredData.value.slice(start, start + itemsPerPage.value)
})

const displayedRange = computed(() => {
    if (filteredCount.value === 0) return '0-0'
    const start = (currentPage.value - 1) * itemsPerPage.value + 1
    const end = Math.min(start + itemsPerPage.value - 1, filteredCount.value)
    return `${start}-${end}`
})

const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPagesNumber.value) {
       currentPage.value = page
    }
}

const isSelectDropdownOpened = ref(false)

const toggleSelectDropdown = () => {
    isSelectDropdownOpened.value = !isSelectDropdownOpened.value
}

const extractNumber = (str: string) => {
    const spaceIndex = str.indexOf(' ')
    return +str.slice(0, spaceIndex)
}

const updateItemsPerPage = (value: string) => {
    selectedPerPage.value = value
    itemsPerPage.value = extractNumber(value)
    currentPage.value = 1
}

const onEdit = ref(false)

const { data, r$ } = useFormValidation(
  { surname: '', name: '', email: '', phone: '', vk: '', birthDate: '' },
  {
    surname: { type: 'text', required: true, maxLength: 32 },
    name: { type: 'text', required: true, maxLength: 32 },
    email: { type: 'email', required: true, maxLength: 32 },
    phone: { type: 'text', isNumber: true, maxLength: 11, minLength: 11 },
    vk: { type: 'text', domain: true, vklink: true },
    birthDate: { type: 'text' }
  }
)

const city = ref('')
const address = ref('')
const note = ref('')
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

watch(onEdit, (newVal) => {
    if (newVal && inspector.value) {
        data.surname = inspector.value.surname || ''
        data.name = inspector.value.name || ''
        city.value = inspector.value.city || ''
        address.value = inspector.value.address || ''
        data.email = inspector.value.email || ''
        data.phone = inspector.value.phonenumber || ''
        data.vk = inspector.value.vkPageLink || ''
        data.birthDate = inspector.value.birthday || ''
        note.value = inspector.value.note || ''
    }
})

const saveEdit = () => {
    if (inspector.value) {
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
        onEdit.value = false
    }
}
</script>

<template>
    <AppComponent :label="inspector ? `${inspector.surname} ${inspector.name}` : 'Проверяющий'" 
    title-icon="go-back" @header-click="router.back()" tabs-needed :tabs="tabs" active-tab="overall-info">
        <template #tab-content="{ activeTab }">

            <section v-if="activeTab === 'overall-info' && !onEdit" class="inspector-info">
                <AppInfoTable :rows="[
                    { label: 'Фамилия', value: inspector?.surname },
                    { label: 'Имя', value: inspector?.name },
                    { key: 'status', label: 'Статус', value: inspector?.inspectorState },
                    { label: 'Город', value: inspector?.city || 'Не указано' },
                    { label: 'Адрес проживавния', value: inspector?.address || 'Не указано' },
                    { label: 'Дата рождения', value: inspector?.birthday || 'Не указано' },
                    { label: 'Телефон', value: inspector?.phonenumber || 'Не указано' },
                    { label: 'E-mail', value: inspector?.email },
                    { label: 'Вконтакте', value: inspector?.vkPageLink || 'Не указано' },
                    { label: 'Дата регистрации анкеты', value: inspector?.registrationDate },
                    { label: 'Заметка', value: inspector?.note || 'Не указано' },
                ]">
                <template #cell-status="{ row }">
                    <AppStatus :state="row.value" />
                </template>
                </AppInfoTable>

                <div class="inspector-info__buttons">
                    <AppButton variant="text-gray" class="inspector-info__buttons--element" @click="onDelete = true">Удалить</AppButton>
                    <AppButton variant="bordered" class="inspector-info__buttons--element" @click="onEdit = true">Редактировать</AppButton>
                    <div class="inspector-info__buttons--element" ref="dropdownRef">
                        <AppButton variant="green" icon-name="expand-more" icon-position="right" 
                        @click="onStatusChange = true">Статус</AppButton>
                        <InspectorStatusChange v-if="onStatusChange" :inspector-id="inspector?.id || ''" @close="onStatusChange = false"
                        @update-status="handleStatusUpdate" />
                    </div>
                </div>
                <InspectorDeletingConfirmation v-if="onDelete" @close="onDelete = false" 
                :inspector-id="inspector?.id || ''" @deleted="handleDelete"/>
            </section>

            <section v-if="activeTab === 'overall-info' && onEdit" class="inspetor-edit">
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
                    v-model="city" class="inspetor-edit__wrapper--input" />

                    <AppAutocomplete type="address" label="Адрес проживания" :city-filter="city" v-model="address"
                    placeholder="Введите адрес" class="inspetor-edit__wrapper--input" />

                    <div ref="calendarWrapper" class="inspetor-edit__wrapper--input">
                        <AppInput type="calendar" label="Дата рождения" placeholder="ДД.ММ.ГГ" v-model="displayDate"
                        @click="toggleCalendar">
                            <template #dropdown>
                                <AppCalendar v-if="isCalendarOpen" v-model="selectedDate" @close="isCalendarOpen = false" />
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
                    <AppButton variant="bordered" @click="onEdit = false" class="inspetor-edit__buttons--element">Отмена</AppButton>
                    <AppButton variant="green" @click="saveEdit" class="inspetor-edit__buttons--element">Сохранить</AppButton>
                </div>
            </section>

            <section v-if="activeTab === 'checks-history'">
                <table class="inspector-checks__table">
                    <thead class="inspector-checks__header">
                        <td class="inspector-checks__header--object">
                            <span>Объект</span>
                            <button class="inspectors-checks__button--invisible"  @click=""><AppIcons name="arrow-down" /></button>
                        </td>
                        <td class="inspector-checks__header--city">
                            <span>Город</span>
                            <button class="inspectors-checks__button--invisible" @click=""><AppIcons name="arrow-down" /></button>
                        </td>
                        <td class="inspector-checks__header--address">
                            <span>Адрес</span>
                            <button class="inspectors-checks__button--invisible" @click=""><AppIcons name="arrow-down" /></button>
                        </td>
                        <td class="inspector-checks__header--task">
                            <span>Задача</span>
                            <button class="inspectors-checks__button--invisible" @click=""><AppIcons name="arrow-down" /></button>
                        </td>
                        <td class="inspector-checks__header--type">
                            <span>Тип проверки</span>
                            <button class="inspectors-checks__button--invisible" @click=""><AppIcons name="arrow-down" /></button>
                        </td>
                        <td class="inspector-checks__header--date">
                            <span>Дата проверки</span>
                            <button class="inspectors-checks__button--invisible" @click=""><AppIcons name="arrow-down" /></button>
                        </td>
                        <td class="inspector-checks__header--state">
                            <span>Статус</span>
                            <button class="inspectors-checks__button--invisible" @click=""><AppIcons name="arrow-down" /></button>
                        </td>
                    </thead>

                    <tr v-for="line in paginatedData" :key="line.object" class="inspector-checks__row">
                        <td>{{ line.object }}</td>
                        <td>{{ line.city }}</td>
                        <td>{{ line.address }}</td>
                        <td>{{ line.task }}</td>
                        <td>{{ line.type }}</td>
                        <td>{{ line.date }}</td>
                        <td><AppStatus :state="line.state"/></td>
                    </tr>
                </table>

                <div class="inspector-checks__pagination">
                    <span class="inspector-checks__pagination--displayed">
                        {{ displayedRange }}/{{ filteredCount  }}
                    </span>

                    <div class="inspector-checks__navigation">
                        <AppPaginationButton variant="left-arrow" class="inspector-checks__navigation--button" 
                        @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"/>
                        <AppPaginationButton
                        v-for="page in totalPagesNumber"
                        :key="page"
                        variant="number"
                        :number="page"
                        :active="page === currentPage"
                        class="inspector-checks__navigation--button"
                        @click="goToPage(page)"/>
                        <AppPaginationButton variant="rigth-arrow" class="inspector-checks__navigation--button" 
                        @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPagesNumber"/>
                    </div>

                    <AppInput type="select" placeholder="10 / стр." class="inspector-checks__navigation--select" 
                    @open-select="toggleSelectDropdown" v-model="selectedPerPage" >
                        <template #dropdown>
                            <AppDropdown type="default" :options="['5 /стр.', '10 /стр.', '15 /стр.']" :isOpened="isSelectDropdownOpened" 
                            placement="up" @close="isSelectDropdownOpened = false" @update:model-value="updateItemsPerPage"/>
                        </template>
                    </AppInput>
                </div>
            </section>
        </template>
    </AppComponent>
</template>

<style lang="scss">
.inspector-info {
    margin: 28px 0 0 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.inspector-info__buttons {
    display: flex;
    align-items: center;

    &--element + &--element {
        margin-left: 12px;
    }

    &--element:first-child {
        margin-right: 13px;
    }
}

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

.inspector-checks__table {
    margin: 28px 0 24px 0;
    overflow-x: auto;
}

.inspector-checks__header {
    background-color: var(--table-header-color);

    &--object {
        min-width: 244px;
    }

    &--city {
        min-width: 165px;
    }

    &--address {
        min-width: 210px;
    }

    &--task {
        min-width: 314px;
    }

    &--type {
        min-width: 156px;
    }

    &--date {
        min-width: 156px;
    }

    &--state {
        min-width: 156px;
    }
}

.inspector-checks__header td{
    padding: 28px 0;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;

    span {
        margin-right: 4px;
    }

    &:first-child {
        padding-left: 16px;
    }
}

.inspector-checks__row {
    border-bottom: 1px solid var(--divider);
    font-size: 14px;

    & td {
        padding: 16.5px 0;

        &:first-child {
            padding-left: 16px;
        }
    }
}

.inspectors-checks__button--invisible {
    background-color: transparent;
    cursor: pointer;
    border: none;
    padding: 0;
}

.inspector-checks__pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    &--displayed {
        color: var(--text-secondary);
    }
}

.inspector-checks__navigation {
    display: flex;
    flex-direction: row;

    &--select {
        max-width: 107px;
    }
}

.inspector-checks__navigation--button + .inspector-checks__navigation--button {
    margin-left: 8px;
}
</style>