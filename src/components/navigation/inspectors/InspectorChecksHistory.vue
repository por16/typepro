<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useInspectorsStore } from '@/stores/inspectorsStore'
import type { Inspector } from '@/stores/inspectorsStore'
import AppPaginationButton from '@/components/globals/AppPaginationButton.vue'

const props = defineProps<{
    id: string
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

const dataCount = computed(() => fakeData.length)

const totalPagesNumber = computed(() => {
    return Math.ceil(dataCount.value / itemsPerPage.value)
})

const displayedRange = computed(() => {
    if (dataCount.value === 0) return '0-0'
    const start = (currentPage.value - 1) * itemsPerPage.value + 1
    const end = Math.min(start + itemsPerPage.value - 1, dataCount.value)
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

const sortByObjectUp = ref(false)
const sortByCityUp = ref(false)
const sortByAddressUp = ref(false)
const sortByTaskUp = ref(false)
const sortByTypeUp = ref(false)
const sortByDateUp = ref(false)
const sortByStateUp = ref(false)

const sortParam = ref('')

const setSortByObject = () => {
    if(sortParam.value !== 'object') {
        sortParam.value = 'object'
        sortByObjectUp.value = false
        sortByCityUp.value = false
        sortByAddressUp.value = false
        sortByTaskUp.value = false
        sortByTypeUp.value = false
        sortByDateUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortByObjectUp.value = !sortByObjectUp.value
    }
}

const setSortByCity = () => {
    if(sortParam.value !== 'city') {
        sortParam.value = 'city'
        sortByObjectUp.value = false
        sortByCityUp.value = false
        sortByAddressUp.value = false
        sortByTaskUp.value = false
        sortByTypeUp.value = false
        sortByDateUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortByCityUp.value = !sortByCityUp.value
    }
}

const setSortByAddress = () => {
    if(sortParam.value !== 'address') {
        sortParam.value = 'address'
        sortByObjectUp.value = false
        sortByCityUp.value = false
        sortByAddressUp.value = false
        sortByTaskUp.value = false
        sortByTypeUp.value = false
        sortByDateUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortByAddressUp.value = !sortByAddressUp.value
    }
}

const setSortByTask = () => {
    if(sortParam.value !== 'task') {
        sortParam.value = 'task'
        sortByObjectUp.value = false
        sortByCityUp.value = false
        sortByAddressUp.value = false
        sortByTaskUp.value = false
        sortByTypeUp.value = false
        sortByDateUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortByTaskUp.value = !sortByTaskUp.value
    }
}

const setSortByType = () => {
    if(sortParam.value !== 'type') {
        sortParam.value = 'type'
        sortByObjectUp.value = false
        sortByCityUp.value = false
        sortByAddressUp.value = false
        sortByTaskUp.value = false
        sortByTypeUp.value = false
        sortByDateUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortByTypeUp.value = !sortByTypeUp.value
    }
}

const setSortByDate = () => {
    if(sortParam.value !== 'date') {
        sortParam.value = 'date'
        sortByObjectUp.value = false
        sortByCityUp.value = false
        sortByAddressUp.value = false
        sortByTaskUp.value = false
        sortByTypeUp.value = false
        sortByDateUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortByDateUp.value = !sortByDateUp.value
    }
}

const setSortByState = () => {
    if(sortParam.value !== 'state') {
        sortParam.value = 'state'
        sortByObjectUp.value = false
        sortByCityUp.value = false
        sortByAddressUp.value = false
        sortByTaskUp.value = false
        sortByTypeUp.value = false
        sortByDateUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortByStateUp.value = !sortByStateUp.value
    }
}

const sortedData = computed<FakeDataItem[]>(() => {
    if(sortParam.value === '') {
        return fakeData
    }
    switch(sortParam.value) {
        case 'object' : {
            const sorted = [...fakeData].sort((l1, l2) => (l1.object.toLocaleLowerCase() >= l2.object.toLocaleLowerCase()) ? 1: -1)
            return sortByObjectUp.value ? sorted.reverse() : sorted
        }

        case 'city' : {
            const sorted = [...fakeData].sort((l1, l2) => (l1.city.toLocaleLowerCase() >= l2.city.toLocaleLowerCase()) ? 1: -1)
            return sortByCityUp.value ? sorted.reverse() : sorted
        }

        case 'address' : {
            const sorted = [...fakeData].sort((l1, l2) => (l1.address.toLocaleLowerCase() >= l2.address.toLocaleLowerCase()) ? 1: -1)
            return sortByAddressUp.value ? sorted.reverse() : sorted
        }

        case 'task' : {
            const sorted = [...fakeData].sort((l1, l2) => (l1.task.toLocaleLowerCase() >= l2.task.toLocaleLowerCase()) ? 1: -1)
            return sortByTaskUp.value ? sorted.reverse() : sorted
        }

        case 'type' : {
            const order = ['Любой', 'Ресторан', 'Доставка', 'Кейтеринг']
            const sorted = [...fakeData].sort((l1, l2) => {
                return order.indexOf(l1.type) - order.indexOf(l2.type)
            })
            return sortByTypeUp.value ? sorted.reverse() : sorted
        }

        case 'date' : {
            const parseDate = (str: string) => {
                const parts = str.split('.').map(Number)
                if (parts.length !== 3 || parts.some(isNaN)) {
                    return 0
                }
                const [day, month, year] = parts as [number, number, number]
                return new Date(year, month - 1, day).getTime()
            }
            const sorted = [...fakeData].sort((l1, l2) => {
                const aTime = parseDate(l1.date)
                const bTime = parseDate(l2.date)
                return sortByDateUp.value ? aTime - bTime : bTime - aTime
            })
            return sorted
        }

        case 'state' : {
            const order = ['Назначена', 'Проверка отчета', 'Исполнена', 'Отказ']
            const sorted = [...fakeData].sort((l1, l2) => {
                return order.indexOf(l1.state) - order.indexOf(l2.state)
            })
            return sortByStateUp.value ? sorted.reverse() : sorted
        }

        default: {
            return fakeData
        }
    }
})

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return sortedData.value.slice(start, start + itemsPerPage.value)
})
</script>

<template>
    <div class="inspector-checks__table-wrapper">
        <table class="inspector-checks__table">
            <thead class="inspector-checks__header">
                <td class="inspector-checks__header--object">
                    <span>Объект</span>
                    <button class="inspectors-checks__button--invisible"  @click="setSortByObject">
                        <AppIcons :name="sortByObjectUp ? 'arrow-up' : 'arrow-down'" />
                    </button>
                </td>
                <td class="inspector-checks__header--city">
                    <span>Город</span>
                    <button class="inspectors-checks__button--invisible" @click="setSortByCity">
                        <AppIcons :name="sortByCityUp ? 'arrow-up' : 'arrow-down'" />
                    </button>
                </td>
                <td class="inspector-checks__header--address">
                    <span>Адрес</span>
                    <button class="inspectors-checks__button--invisible" @click="setSortByAddress">
                        <AppIcons :name="sortByAddressUp ? 'arrow-up' : 'arrow-down'" />
                    </button>
                </td>
                <td class="inspector-checks__header--task">
                    <span>Задача</span>
                    <button class="inspectors-checks__button--invisible" @click="setSortByTask">
                        <AppIcons :name="sortByTaskUp ? 'arrow-up' : 'arrow-down'" />
                    </button>
                </td>
                <td class="inspector-checks__header--type">
                    <span>Тип проверки</span>
                    <button class="inspectors-checks__button--invisible" @click="setSortByType">
                        <AppIcons :name="sortByTypeUp ? 'arrow-up' : 'arrow-down'" />
                    </button>
                </td>
                <td class="inspector-checks__header--date">
                    <span>Дата проверки</span>
                    <button class="inspectors-checks__button--invisible" @click="setSortByDate">
                        <AppIcons :name="sortByDateUp ? 'arrow-up' : 'arrow-down'" />
                    </button>
                </td>
                <td class="inspector-checks__header--state">
                    <span>Статус</span>
                    <button class="inspectors-checks__button--invisible" @click="setSortByState">
                        <AppIcons :name="sortByStateUp ? 'arrow-up' : 'arrow-down'" />
                    </button>
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
    </div>

    <div class="inspector-checks__pagination">
        <span class="inspector-checks__pagination--displayed">
            {{ displayedRange }}/{{ dataCount  }}
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
</template>

<style lang="scss">
.inspector-checks__table-wrapper {
    width: 100%;
    overflow-x: auto;
    margin: 28px 0 24px 0;
}

.inspector-checks__table {
    min-width: max-content;
    width: 100%;
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
    transform: translateY(4px);

    &:hover {
        opacity: 0.8;
    }
}

.inspector-checks__pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin-bottom: 40px;

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