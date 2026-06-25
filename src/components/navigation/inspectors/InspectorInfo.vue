<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useInspectorsStore } from '@/stores/inspectorsStore'
import type { Inspector } from '@/stores/inspectorsStore'
import AppInfoTable from '@/components/globals/AppInfoTable.vue'
import AppStatus from '@/components/globals/AppStatus.vue'
import AppButton from '@/components/globals/AppButton.vue'
import InspectorStatusChange from './InspectorStatusChange.vue'
import InspectorDeletingConfirmation from './InspectorDeletingConfirmation.vue'

const props = defineProps<{
    id: string
}>()

const emit = defineEmits<{
    (e: 'delete'): void
    (e: 'edit'): void
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

const onDelete = ref(false)

const onStatusChange = ref(false)

const handleStatusUpdate = (newStatus: string) => {
    if (inspector.value) {
        inspector.value.inspectorState = newStatus as Inspector['inspectorState']
    }
}

const formatDate = (date: string | undefined) => {
    if (!date) return 'Не указано'
    const parts = date.split('-')
    if (parts.length !== 3) return date
    const [year, month, day] = parts
    return `${day}.${month}.${year}`
}

const dropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node | null)) {
        onStatusChange.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <section class="inspector-info">
    <AppInfoTable :rows="[
        { label: 'Фамилия', value: inspector?.surname },
        { label: 'Имя', value: inspector?.name },
        { key: 'status', label: 'Статус', value: inspector?.inspectorState },
        { label: 'Город', value: inspector?.city || 'Не указано' },
        { label: 'Адрес проживавния', value: inspector?.address || 'Не указано' },
        { key: 'birthday', label: 'Дата рождения', value: inspector?.birthday || 'Не указано' },
        { label: 'Телефон', value: inspector?.phonenumber || 'Не указано' },
        { label: 'E-mail', value: inspector?.email },
        { label: 'Вконтакте', value: inspector?.vkPageLink || 'Не указано' },
        { label: 'Дата регистрации анкеты', value: inspector?.registrationDate },
        { label: 'Заметка', value: inspector?.note || 'Не указано' },
    ]">
        <template #cell-status="{ row }">
            <AppStatus :state="row.value" />
        </template>
        <template #cell-birthday="{ row }">
            {{ formatDate(row.value) }}
        </template>
    </AppInfoTable>

    <div class="inspector-info__buttons">
        <AppButton variant="text-gray" class="inspector-info__buttons--element" @click="onDelete = true">Удалить</AppButton>
        <AppButton variant="bordered" class="inspector-info__buttons--element" @click="$emit('edit')">Редактировать</AppButton>
        <div class="inspector-info__buttons--element" ref="dropdownRef">
            <AppButton variant="green" icon-name="expand-more" icon-position="right" 
            @click="onStatusChange = true">Статус</AppButton>
            <InspectorStatusChange v-if="onStatusChange" :inspector-id="inspector?.id || ''" @close="onStatusChange = false"
            @update-status="handleStatusUpdate" />
        </div>
    </div>
    <InspectorDeletingConfirmation v-if="onDelete" @close="onDelete = false" 
    :inspector-id="inspector?.id || ''" @deleted="$emit('delete')"/>
    </section>
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
</style>