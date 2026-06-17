<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import AppModals from '@/components/globals/AppModals.vue'
import { useInspectorsStore } from '@/stores/inspectorsStore'
import type { Inspector } from '@/stores/inspectorsStore'

const props = defineProps<{
    inspectorId: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'deleted'): void
}>()

const store = useInspectorsStore()
const inspector = ref<Inspector | null>(null)

onMounted(() => {
    inspector.value = store.findById(props.inspectorId) || null
})

const confirmDelete = () => {
    if (inspector.value) {
        store.removeInspector(inspector.value.id)
        emit('deleted')
        emit('close')
    }
}
</script>

<template>
    <AppModals title="Удалить проверяющего" show-close footer-align="right">
        <template #content>
            <span>Вы уверены, что хотите удалить проверяющего {{ inspector?.surname }} {{ inspector?.name }} ?</span>
        </template>

        <template #footer>
            <AppButton variant="bordered" @click="$emit('close')">Отмена</AppButton>
            <AppButton variant="red" @click="confirmDelete">Удалить</AppButton>
        </template>
    </AppModals>
</template>