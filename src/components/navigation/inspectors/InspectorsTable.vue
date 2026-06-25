<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useInspectorsStore } from '@/stores/inspectorsStore'
import AppStatus from '@/components/globals/AppStatus.vue'
import AppPaginationButton from '@/components/globals/AppPaginationButton.vue'
import AppInput from '@/components/globals/AppInput.vue'
import AppDropdown from '@/components/globals/AppDropdown.vue'

const props = defineProps<{
    cityFilter?: string
    surnameFilter?: string
}>()

const emit = defineEmits<{
    (e: 'on-inspector-click', inspector: string): void
}>()

const inspectorsStore = useInspectorsStore()

const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedPerPage = ref('10 /стр.')

const filteredInspectors = computed(() => {
    let result = inspectorsStore.inspectors

    if (props.surnameFilter && props.surnameFilter.trim()) {
        const query = props.surnameFilter.trim().toLowerCase()
        result = result.filter(inspector => inspector.surname.toLowerCase().includes(query))
    }

    if (props.cityFilter && props.cityFilter.trim()) {
        const query = props.cityFilter.trim().toLowerCase()
        result = result.filter(inspector => inspector.city.toLowerCase().includes(query))
    }

    return [...result].reverse()
})

const filteredCount = computed(() => filteredInspectors.value.length)

const totalPagesNumber = computed(() => {
    return Math.ceil(filteredCount.value / itemsPerPage.value)
})

const paginatedInspectors = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredInspectors.value.slice(start, start + itemsPerPage.value)
})

const displayedRange = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value + 1
    const end = Math.min(start + itemsPerPage.value - 1, filteredCount.value)
    return `${start}-${end}`
})

const resetPage = () => {
    currentPage.value = 1
}

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

watch(() => [props.surnameFilter, props.cityFilter], () => {
    resetPage()
})

const sortBySurnameUp = ref(false)
const sortByCityUp = ref(false)
const sortByPhoneUp = ref(false)
const sortByEmailUp = ref(false)
const sortByLastCheckUp = ref(false)
const sortByStateUp = ref(false)

const sortParam = ref('')

const setSortBySurname = () => {
    if(sortParam.value !== 'surname') {
        sortParam.value = 'surname'
        sortBySurnameUp.value = false
        sortByCityUp.value = false
        sortByPhoneUp.value = false
        sortByEmailUp.value = false
        sortByLastCheckUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortBySurnameUp.value = !sortBySurnameUp.value
    }
}

const setSortByCity = () => {
    if(sortParam.value !== 'city') {
        sortParam.value = 'city'
        sortBySurnameUp.value = false
        sortByCityUp.value = false
        sortByPhoneUp.value = false
        sortByEmailUp.value = false
        sortByLastCheckUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortByCityUp.value = !sortByCityUp.value
    }
}

const setSortByPhone = () => {
    if(sortParam.value !== 'phone') {
        sortParam.value = 'phone'
        sortBySurnameUp.value = false
        sortByCityUp.value = false
        sortByPhoneUp.value = false
        sortByEmailUp.value = false
        sortByLastCheckUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortByPhoneUp.value = !sortByPhoneUp.value
    }
}

const setSortByEmail = () => {
    if(sortParam.value !== 'email') {
        sortParam.value = 'email'
        sortBySurnameUp.value = false
        sortByCityUp.value = false
        sortByPhoneUp.value = false
        sortByEmailUp.value = false
        sortByLastCheckUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortByEmailUp.value = !sortByEmailUp.value
    }
}

const setSortByLastCheck = () => {
    if(sortParam.value !== 'lastcheck') {
        sortParam.value = 'lastcheck'
        sortBySurnameUp.value = false
        sortByCityUp.value = false
        sortByPhoneUp.value = false
        sortByEmailUp.value = false
        sortByLastCheckUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortByLastCheckUp.value = !sortByLastCheckUp.value
    }
}

const setSortByState = () => {
    if(sortParam.value !== 'state') {
        sortParam.value = 'state'
        sortBySurnameUp.value = false
        sortByCityUp.value = false
        sortByPhoneUp.value = false
        sortByEmailUp.value = false
        sortByLastCheckUp.value = false
        sortByStateUp.value = false
    }
    else {
        sortByStateUp.value = !sortByStateUp.value
    }
}

const sortedInspectors = computed(() => {
    if(sortParam.value === '') {
        return paginatedInspectors.value
    }
    switch(sortParam.value) {
        case 'surname' : {
            const sorted = [...paginatedInspectors.value].sort((i1, i2) => (i1.surname.toLocaleLowerCase() >= i2.surname.toLocaleLowerCase()) ? 1: -1)
            return sortBySurnameUp.value ? sorted.reverse() : sorted
        }

        case 'city' : {
            const sorted = [...paginatedInspectors.value].sort((i1, i2) => (i1.city.toLocaleLowerCase() >= i2.city.toLocaleLowerCase()) ? 1: -1)
            return sortByCityUp.value ? sorted.reverse() : sorted
        }

        case 'phone' : {
            const sorted = [...paginatedInspectors.value].sort((i1, i2) => {
                const a = i1.phonenumber ?? ''
                const b = i2.phonenumber ?? ''
                const aEmpty = !a
                const bEmpty = !b
                if (aEmpty && bEmpty) return 0
                if (aEmpty) return sortByPhoneUp.value ? -1 : 1
                if (bEmpty) return sortByPhoneUp.value ? 1 : -1

                if (sortByPhoneUp.value) {
                    return a >= b ? -1 : 1
                } else {
                    return a >= b ? 1 : -1
                }
            })
            return sorted
        }

        case 'email' : {
            const sorted = [...paginatedInspectors.value].sort((i1, i2) => (i1.email.toLocaleLowerCase() >= i2.email.toLocaleLowerCase()) ? 1: -1)
            return sortByEmailUp.value ? sorted.reverse() : sorted
        }

        case 'lastcheck' : {
            const sorted = [...paginatedInspectors.value].sort((i1, i2) => {
                const a = i1.birthday ?? ''
                const b = i2. birthday ?? ''
                const aEmpty = !a
                const bEmpty = !b
                if (aEmpty && bEmpty) return 0
                if (aEmpty) return sortByLastCheckUp.value ? -1 : 1
                if (bEmpty) return sortByLastCheckUp.value ? 1 : -1

                const aTime = new Date(a).getTime()
                const bTime = new Date(b).getTime()
                
                if (sortByLastCheckUp.value) {
                    return aTime - bTime
                } else {
                    return bTime - aTime
                }
            })
            return sorted
        }

        case 'state' : {
            const order = ['Проверка анкеты', 'Одобрен', 'Отклонен']
            const sorted = [...paginatedInspectors.value].sort((i1, i2) => {
                return order.indexOf(i1.inspectorState) - order.indexOf(i2.inspectorState)
            })
            return sortByStateUp.value ? sorted.reverse() : sorted
        }
    }
})
</script>

<template>
    <table class="inspectors-table">
        <tr class="inspectors-table__header">
            <td class="inspectors-table__header--name">
                <span>Фамилия Имя</span>
                <button class="inspectors-table__header--button" @click="setSortBySurname">
                    <AppIcons :name="sortBySurnameUp ? 'arrow-up' : 'arrow-down'" />
                </button>
            </td>
            <td class="inspectors-table__header--city">
                <span>Город</span>
                <button class="inspectors-table__header--button" @click="setSortByCity">
                    <AppIcons :name="sortByCityUp ? 'arrow-up' : 'arrow-down'" />
                </button>
            </td>
            <td class="inspectors-table__header--phone">
                <span>Телефон</span>
                <button class="inspectors-table__header--button" @click="setSortByPhone">
                    <AppIcons :name="sortByPhoneUp ? 'arrow-up' : 'arrow-down'" />
                </button>
            </td>
            <td class="inspectors-table__header--email">
                <span>E-mail</span>
                <button class="inspectors-table__header--button" @click="setSortByEmail">
                    <AppIcons :name="sortByEmailUp ? 'arrow-up' : 'arrow-down'" />
                </button>
            </td>
            <td class="inspectors-table__header--lastcheck">
                <span>Последняя проверка</span>
                <button class="inspectors-table__header--button" @click="setSortByLastCheck">
                    <AppIcons :name="sortByLastCheckUp ? 'arrow-up' : 'arrow-down'" />
                </button>
            </td>
            <td class="inspectors-table__header--status">
                <span>Статус проверяющего</span>
                <button class="inspectors-table__header--button" @click="setSortByState">
                    <AppIcons :name="sortByStateUp ? 'arrow-up' : 'arrow-down'" />
                </button>
            </td>
        </tr>
        <tr v-for="inspector in sortedInspectors" :key="inspector.id" class="inspectors-table__row">
            <td><button class="inspectors-table__button--invisible" @click="$emit('on-inspector-click', inspector.id)">
                {{ inspector.surname }} {{ inspector.name }}
            </button></td>
            <td>{{ inspector.city || '' }}</td>
            <td>{{ inspector.phonenumber || '' }}</td>
            <td>{{ inspector.email }}</td>
            <td>{{ '' }}</td>
            <td><AppStatus :state="inspector.inspectorState" /></td>
        </tr>
    </table>

    <div class="inspectors__pagination">
        <span class="inspectors__pagination--displayed">
            {{ displayedRange }}/{{ filteredInspectors.length }}
        </span>

        <div class="inspectors__navigation">
            <AppPaginationButton variant="left-arrow" class="inspectors__navigation--button" 
            @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"/>
            <AppPaginationButton
            v-for="page in totalPagesNumber"
            :key="page"
            variant="number"
            :number="page"
            :active="page === currentPage"
            class="inspectors__navigation--button"
            @click="goToPage(page)"/>
            <AppPaginationButton variant="rigth-arrow" class="inspectors__navigation--button" 
            @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPagesNumber"/>
        </div>

        <AppInput type="select" placeholder="10 / стр." class="inspectors__navigation--select" 
        @open-select="toggleSelectDropdown" v-model="selectedPerPage" >
            <template #dropdown>
                <AppDropdown type="default" :options="['5 /стр.', '10 /стр.', '15 /стр.']" :isOpened="isSelectDropdownOpened" 
                placement="up" @close="isSelectDropdownOpened = false" @update:model-value="updateItemsPerPage"/>
            </template>
        </AppInput>
    </div>
</template>

<style lang="scss">
.inspectors-table {
    margin-bottom: 24px;
}

.inspectors-table__header {
    background-color: var(--table-header-color);

    &--name {
        min-width: 181px;
    }

    &--city {
        min-width: 152px;
    }

    &--phone {
        min-width: 148px;
    }

    &--email {
        min-width: 218px;
    }

    &--lastcheck {
        min-width: 180px;
    }

    &--status {
        min-width: 191px;
    }

    &--button {
        cursor: pointer;
        background-color: transparent;
        border: none;
        padding: 0;
        margin: 0 0 0 8px;
        transform: translateY(4px);

        &:hover {
            opacity: 0.8;
        }
    }
}

.inspectors-table__header td{
    padding: 28px 0;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;

    &:first-child {
        padding-left: 16px;
    }
}

.inspectors-table__row {
    border-bottom: 1px solid var(--divider);
    font-size: 14px;

    & td {
        padding: 16.5px 0;

        &:first-child {
            padding-left: 16px;
        }
    }
}

.inspectors-table__button--invisible {
    background-color: transparent;
    cursor: pointer;
    border: none;
    padding: 0;
}

.inspectors__pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    &--displayed {
        color: var(--text-secondary);
    }
}

.inspectors__navigation {
    display: flex;
    flex-direction: row;

    &--select {
        max-width: 107px;
    }
}

.inspectors__navigation--button + .inspectors__navigation--button {
    margin-left: 8px;
}
</style>