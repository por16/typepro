<script lang="ts" setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import citiesData from '@/assets/data/russia-cities.json'

type AutocompleteType = 'city' | 'address'

interface CityItem {
  region: string
  city: string
}

const props = defineProps<{
    type: AutocompleteType
    label?: string
    placeholder?: string
    modelValue?: string,
    cityFilter?: string,
    disabled?: boolean,
    customCityArray?: string[]
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'select', value: string): void
}>()

const inputValue = ref(props.modelValue || '')
const isDropdownOpen = ref(false)
const suggestions = ref<string[]>([])

let debounceTimer: number | null = null

const filterCities = (query: string): string[] => {
  if (!query.trim()) return []
  const lowerQuery = query.toLowerCase()
  if (props.customCityArray && props.customCityArray.length) {
    return props.customCityArray
      .filter(city => city.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
  }
  const citiesList = citiesData as CityItem[]
  return citiesList
    .filter(item => item.city.toLowerCase().includes(lowerQuery))
    .slice(0, 5)
    .map(item => `${item.city}, ${item.region}`)
}

const fetchAddresses = async (query: string) => {
  if (!query.trim() || query.length < 2) return []
  const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
  const token = '853d3f919960d9218898ff87a59a556f0b0b7a29'
  const body: any = {
    query,
    from_bound: { value: "street" },
    to_bound: { value: "flat" }
  }
  if (props.cityFilter && props.cityFilter.trim()) {
    body.locations = [{ city: props.cityFilter.trim() }]
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return (data.suggestions || []).map((item: any) => item.value).slice(0, 10)
  } catch (error) {
    return []
  }
}

const updateSuggestions = async () => {
  const query = inputValue.value
  if (props.type === 'city') {
    suggestions.value = filterCities(query)
  } else {
    let results = await fetchAddresses(query)
    suggestions.value = results.map((address: string) => {
      const firstComma = address.indexOf(',')
      if (firstComma === -1) return address.trim()
      const secondComma = address.indexOf(',', firstComma + 1)
      const between = address.slice(firstComma + 1, secondComma)
      if (between.includes('г ')) {
        return address.slice(secondComma + 1).trim()
      } else {
        return address.slice(firstComma + 1).trim()
      }
    }).slice(0, 5)
  }
  isDropdownOpen.value = suggestions.value.length > 0
}


const onInput = (value: string) => {
  if (props.disabled) return
  inputValue.value = value
  emit('update:modelValue', value)
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    updateSuggestions()
  }, 150)
}

const focusInput = () => {
  const input = document.querySelector('.app-autocomplete .app-input__field') as HTMLInputElement | null
  if (input) {
    input.focus()
  }
}

const onSelectOption = (selected: string) => {
  if (props.disabled) return
  if (props.type === 'city') {
    const parts = selected.split(',')
    const cityName = parts[0]?.trim() || selected
    inputValue.value = cityName
    emit('update:modelValue', cityName)
    emit('select', cityName)
  } else {
    inputValue.value = selected
    emit('update:modelValue', selected)
    emit('select', selected)
  }
  isDropdownOpen.value = false
  suggestions.value = []
}

const closeDropdown = () => {
  if (props.disabled) return
  isDropdownOpen.value = false
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== inputValue.value) {
      inputValue.value = newVal || ''
    }
  }
)

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
    <div class="app-autocomplete">
      <div class="app-autocomplete__input-wrapper">
        <AppInput
        type="input"
        :label="label"
        :placeholder="placeholder"
        :model-value="inputValue"
        :disabled="disabled"
        @update:model-value="onInput"
        class="app-autocomplete__input">
          <template #icon>
            <button class="invisible-button app-autocomplete__icon" @click="focusInput"><AppIcons
            v-if="type === 'city'"
            name="expand-more"
            /></button>
          </template>
        </AppInput>
    </div>
    <div class="app-autocomplete__dropdown-wrapper">
      <AppDropdown
        :options="suggestions"
        :model-value="inputValue"
        :is-opened="isDropdownOpen && !disabled"
        type="autocomplete"
        @close="closeDropdown"
        @update:model-value="onSelectOption" />
    </div>
  </div>
</template>

<style lang="scss">
.app-autocomplete {
  position: relative;
  width: 100%;
}

.app-autocomplete__input {
  position: relative;
}

.app-autocomplete__icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.app-autocomplete__dropdown-wrapper {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 3000;
}
</style>