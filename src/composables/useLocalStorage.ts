import { ref, watch } from 'vue'

interface Company {
  name: string
  logo: string
  activities: string
  siteLink: string
  VKGroupLink: string
}

export function useLocalStorage() {
  const company = ref<Company>({
    name: '',
    logo: '',
    activities: '',
    siteLink: '',
    VKGroupLink: ''
  })

  const stored = localStorage.getItem('company')
  if (stored) {
    company.value = JSON.parse(stored)
  }

  watch(company, (newVal) => {
    if (newVal.name || newVal.logo || newVal.activities || newVal.siteLink || newVal.VKGroupLink) {
      localStorage.setItem('company', JSON.stringify(newVal))
    } else {
      localStorage.removeItem('company')
    }
  }, { deep: true })

  const setCompany = (data: Company) => {
    company.value = { ...data }
  }

  const resetCompany = () => {
    company.value = {
      name: '',
      logo: '',
      activities: '',
      siteLink: '',
      VKGroupLink: ''
    }
  }

  return {
    company,
    setCompany,
    resetCompany
  }
}

export function useTaskTypes() {
  const types = ref<string[]>([])

  const stored = localStorage.getItem('taskTypes')
  if (stored) {
    try {
      types.value = JSON.parse(stored)
    } catch (e) {
      types.value = ['Объект', 'Доставка']
    }
  } else {
    types.value = ['Объект', 'Доставка']
  }

  watch(types, (newVal) => {
    localStorage.setItem('taskTypes', JSON.stringify(newVal))
  }, { deep: true })

  const addType = (newType: string) => {
    if (!types.value.includes(newType)) {
      types.value.push(newType)
    }
  }

  const removeType = (typeToRemove: string) => {
    types.value = types.value.filter(t => t !== typeToRemove)
  }

  const loadTypes = () => {
    const stored = localStorage.getItem('taskTypes')
    if (stored) {
      try {
        types.value = JSON.parse(stored)
      } catch (e) {
      }
    } else {
      types.value = ['Объект', 'Доставка']
    }
  }

  const saveTypes = () => {
    localStorage.setItem('taskTypes', JSON.stringify(types.value))
  }

  return {
    types,
    addType,
    removeType,
    loadTypes,
    saveTypes
  }
}