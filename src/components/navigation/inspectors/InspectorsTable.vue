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
</script>

<template>
    <table class="inspectors-table">
        <tr class="inspectors-table__header">
            <td class="inspectors-table__header--name">Фамилия Имя</td>
            <td class="inspectors-table__header--city">Город</td>
            <td class="inspectors-table__header--phone">Телефон</td>
            <td class="inspectors-table__header--email">E-mail</td>
            <td class="inspectors-table__header--lastcheck">Последняя проверка</td>
            <td class="inspectors-table__header--status">Статус проверяющего</td>
        </tr>
        <tr v-for="inspector in paginatedInspectors" :key="inspector.id" class="inspectors-table__row">
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