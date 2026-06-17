<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import NewInspector from './NewInspector.vue'
import InspectorsTable from './InspectorsTable.vue'
import { useInspectorsStore } from '@/stores/inspectorsStore.ts'
import AppButton from '@/components/globals/AppButton.vue'
import AppInput from '@/components/globals/AppInput.vue'
import AppAutocomplete from '@/components/globals/AppAutocomplete.vue'
import { useRouter } from 'vue-router'

const inspectorsStore = useInspectorsStore()
const onButtonClick = ref(false)
const selectedInspectorId = ref<string | null>(null)

const citiesList = computed(() => inspectorsStore.getAllCitiesArray())

const surnameFilter = ref('') 
const cityFilter = ref('')

onMounted(() => {
    inspectorsStore.loadFromStorage()
})

const router = useRouter()

const handleInspectorClick = (id: string) => {
    router.push({ name: 'inspector-info', params: { id } })
}
</script>

<template>
    <AppComponent
    v-if="inspectorsStore.inspectorsCount === 0"
    iconName="zero-inspectors"
    textFirstLine="Добавьте или пригласите"
    textSecondLine="проверяющих"
    :buttonNeeded="true"
    buttonText="Добавить проверяющего"
    :stringButtonNeeded="true"
    stringButtonText="Пригласить с помощью анкеты"
    @button-click="onButtonClick = true" />
    <NewInspector v-if="onButtonClick" @close="onButtonClick = false" />

    <AppComponent
    v-if="inspectorsStore.inspectorsCount !== 0">
        <template #content>
            <div class="inspectors-adding-buttons">
                <AppButton variant="green" icon-name="add" icon-position="left" @click="onButtonClick = true">Добавить проверяющего</AppButton>
                <AppButton variant="orange" @click="router.push('/inspectors/questionnaire/edit')">
                    <span>Приглашайте проверяющих с помощью </span>
                    <span class="text-underlined">анкеты</span>
                </AppButton>
            </div>

            <div class="inspectors-filters">
                <AppInput type="input" placeholder="Поиск по фамилии" class="inspectors-filters--element"
                icon-name="search" v-model="surnameFilter"></AppInput>
                <AppAutocomplete type="city" placeholder="Выберите город" v-model="cityFilter"
                :custom-city-array="citiesList" class="inspectors-filters--element"/>
            </div>

            <InspectorsTable :surname-filter="surnameFilter" :city-filter="cityFilter" @on-inspector-click="handleInspectorClick"/>
        </template>
    </AppComponent>
</template>

<style lang="scss">
.inspectors-adding-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.inspectors-filters {
    display: flex;
    margin-bottom: 20px;

    &--element {
        max-width: 346px;
        width: 100%;
    }

    &--element + &--element {
        margin-left: 16px;
    }
}
</style>