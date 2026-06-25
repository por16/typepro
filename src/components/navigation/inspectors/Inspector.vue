<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInspectorsStore } from '@/stores/inspectorsStore'
import type { Inspector } from '@/stores/inspectorsStore'
import InspectorInfo from './InspectorInfo.vue'
import InspectorEdit from './InspectorEdit.vue'
import InspectorChecksHistory from './InspectorChecksHistory.vue'

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

const handleDelete = () => {
    router.push('/inspectors')
}

const onEdit = ref(false)
</script>

<template>
    <AppComponent :label="inspector ? `${inspector.surname} ${inspector.name}` : 'Проверяющий'" 
    title-icon="go-back" @header-click="router.back()" tabs-needed :tabs="tabs" active-tab="overall-info">
        <template #tab-content="{ activeTab }">

            <InspectorInfo v-if="inspector && activeTab === 'overall-info' && !onEdit" :id="inspector.id" @delete="handleDelete" @edit="onEdit = true"/>

            <InspectorEdit v-if="inspector && activeTab === 'overall-info' && onEdit" :id="inspector.id" @close="onEdit = false"/>

            <InspectorChecksHistory v-if="inspector && activeTab === 'checks-history'" :id="inspector.id"/>
            
        </template>
    </AppComponent>
</template>

