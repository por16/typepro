import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Inspector {
    id: string,
    surname: string,
    name: string;
    inspectorState: 'Проверка анкеты' | 'Одобрен' | 'Отклонен',
    city: string,
    address?: string,
    birthday?: string,
    phonenumber?: string,
    email: string,
    vkPageLink?: string,
    registrationDate: string,
    note?: string
}

type InspectorInput = Omit<Inspector, 'id'>
type InspectorUpdate = Partial<InspectorInput>

export const useInspectorsStore = defineStore('inspectors', () => {
    const inspectors = ref<Inspector[]>([])

    const inspectorsCount = computed(() => inspectors.value.length)

    const findById = (id: string) => inspectors.value.find(i => i.id === id)

    function generateId(): string {
        return crypto.randomUUID()
    }

    function persist() {
        localStorage.setItem('inspectors', JSON.stringify(inspectors.value))
    }

    function loadFromStorage() {
        const stored = localStorage.getItem('inspectors')
        if (stored) {
            try {
                inspectors.value = JSON.parse(stored)
            } catch (e) {
            }
        }
    }

    function addInspector(inspectorData: InspectorInput) {
        const newInspector: Inspector = {
            id: generateId(),
            ...inspectorData
        }
        inspectors.value.push(newInspector)
        persist()
    }

    function updateInspector(id: string, updatedData: InspectorUpdate) {
        const index = inspectors.value.findIndex(i => i.id === id)
        if (index !== -1) {
            const { id: _, ...data } = updatedData as any
            inspectors.value[index] = {
                ...inspectors.value[index],
                ...data
            } as Inspector
            persist()
        }
    }

    function removeInspector(id: string) {
        inspectors.value = inspectors.value.filter(i => i.id !== id)
        persist()
    }

    function getAllCitiesArray() {
        const cities = new Set<string>()
        for(const inspector of inspectors.value) {
            if(inspector.city) {
                cities.add(inspector.city)
            }
        }
        return Array.from(cities)
    }

    return {
        inspectors,
        inspectorsCount,
        findById,
        addInspector,
        updateInspector,
        removeInspector,
        loadFromStorage,
        getAllCitiesArray
    }
})