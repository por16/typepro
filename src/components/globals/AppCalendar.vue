<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

const props = defineProps<{
    modelValue?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void 
    (e: 'close'): void
    (e: 'mousedown'): void
}>()

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

if(props.modelValue) {
    const date = new Date(props.modelValue)
    if (!isNaN(date.getTime())) {
        currentYear.value = date.getFullYear()
        currentMonth.value = date.getMonth()
    }
}

const selectedDate = ref<Date | null>(props.modelValue ? new Date(props.modelValue) : null)

watch(() => props.modelValue, (newValue) => {
    if(newValue) {
        const date = new Date(newValue)
        if (!isNaN(date.getTime())) {
            selectedDate.value = date
            currentMonth.value = selectedDate.value.getMonth()
            currentYear.value = selectedDate.value.getFullYear()
        }
    } else {
        selectedDate.value = null
    }
})

const currentYearForOptions = ref(today.getFullYear()) 

const yearOptions = computed(() => {
    const startYear = currentYearForOptions.value - 99
    const endYear = currentYearForOptions.value
    const years = []
    for (let y = startYear; y <= endYear; y++) {
        years.push(y.toString())
    }
    return years.reverse()
})

const updateYear = (yearStr: string) => {
    currentYear.value = Number(yearStr)
}

const isYearDropdownOpen = ref(false)

const toggleYearDropdown = () => {
    isYearDropdownOpen.value = !isYearDropdownOpen.value
}

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const days = computed(() => {
    const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
    const startWeekday = (firstDayOfMonth.getDay() + 6) % 7
    const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()

    const daysArray: { date: number; fullDate: Date; isCurrentMonth: boolean }[] = []

    const prevMonthDays = new Date(currentYear.value, currentMonth.value, 0).getDate()
    for(let i = startWeekday - 1; i >= 0; i--) {
        const date = prevMonthDays - i
        const fullDate = new Date(currentYear.value, currentMonth.value - 1, date)
        daysArray.push({ date, fullDate, isCurrentMonth: false})
    }

    for(let i = 1; i <= daysInMonth; i++) {
        const fullDate = new Date(currentYear.value, currentMonth.value, i)
        daysArray.push({ date: i, fullDate, isCurrentMonth: true })
    }

    const remaining = 42 - daysArray.length
    for(let i = 1; i <= remaining; i++) {
        const fullDate = new Date(currentYear.value, currentMonth.value, i)
        daysArray.push({ date: i, fullDate, isCurrentMonth: false })
    }

    return daysArray
})

const isSelected = (day: { fullDate: Date; isCurrentMonth: boolean }) => {
    if (!day.isCurrentMonth) return false
    if (!selectedDate.value) return false
    return day.fullDate.toDateString() === selectedDate.value.toDateString()
}

const selectDate = (day: { fullDate: Date }) => {
    selectedDate.value = day.fullDate
    const year = day.fullDate.getFullYear()
    const month = String(day.fullDate.getMonth() + 1).padStart(2, '0')
    const dayNum = String(day.fullDate.getDate()).padStart(2, '0')
    emit('update:modelValue', `${year}-${month}-${dayNum}`)
    emit('close')
}

const prevMonth = () => {
    if(currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
    } else {
        currentMonth.value--
    }
}

const nextMonth = () => {
    if(currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
    } else {
        currentMonth.value++
    }
}
</script>

<template>
    <div class="app-calendar" @click.stop>
        <div class="app-calendar__header">
            <button @click="prevMonth">
                <AppIcons name="left-arrow" />
            </button>
            <div class="app-calendar__header--month-year">
                <span>{{ monthNames[currentMonth] }}</span>
                <AppInput type="select" :placeholder="currentYear" class="app-calendar__header--select"
                :model-value="currentYear.toString()" @open-select="toggleYearDropdown" invisible-select>
                    <template #dropdown>
                        <AppDropdown type="default" :options="yearOptions"
                    :isOpened="isYearDropdownOpen" @close="isYearDropdownOpen = false" @update:model-value="updateYear" />
                    </template>
                </AppInput>
            </div>
            <button @click="nextMonth">
                <AppIcons name="right-arrow"/>
            </button>
        </div>

        <div class="app-calendar__weekdays">
            <span v-for="day in weekDays" :key="day">{{ day }}</span>
        </div>

        <div class="app-calendar__days">
            <button
            v-for="(day, idx) in days"
            :key="idx"
            :class="{
               'app-calendar__days--current': day.isCurrentMonth,
               'app-calendar__days--selected': isSelected(day),
               'app-calendar__days--other': !day.isCurrentMonth
            }"
            :disabled="!day.isCurrentMonth"
            @click="selectDate(day)">
                {{ day.date }}
            </button>
        </div>
    </div>
</template>

<style lang="scss">
.app-calendar {
    position: absolute;
    z-index: 4000;
    background-color: var(--primary-contast-text);
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    padding: 12px;
    min-width: 260px;
}

.app-calendar__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    &--month-year {
        display: flex;
        align-items: flex-end;

        span {
            padding-bottom: 0.9px;
            font-size: 14px;
        }
    }

    &--select {
        margin-left: 10px;
        width: 70px;
        display: flex;
        align-items: center;
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
    }
}

.app-calendar__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 12px;
    margin-bottom: 8px;

    span {
        padding: 4px;
    }
}

.app-calendar__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;

    button {
        aspect-ratio: 1 / 1;
        background: none;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;

        &:hover {
            background-color: var(--primary-contast-text);
        }

        &.app-calendar__days--current {
            font-weight: normal;
        }

        &.app-calendar__days--selected {
            background-color: var(--primary-main);
            color: var(--primary-contast-text);
        }

        &.app-calendar__days--other {
            opacity: 0.4;
        }
    }
}
</style>