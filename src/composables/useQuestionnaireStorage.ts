import { ref } from 'vue'

export interface QuestionnaireFields {
  city: boolean
  address: boolean
  birthDate: boolean
  phoneNumber: boolean
  vk: boolean
}

function loadStoredData() {
  const stored = localStorage.getItem('questionnaire_data')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
    }
  }
  return null
}

export function useQuestionnaireStorage() {
  const stored = loadStoredData()
  const html = ref<string>(stored?.html ?? '<p></p>')

  const fields = ref<QuestionnaireFields>(stored?.fields ?? {
    city: false,
    address: false,
    birthDate: false,
    phoneNumber: false,
    vk: false,
  })

  const persist = () => {
    localStorage.setItem('questionnaire_data', JSON.stringify({
      html: html.value,
      fields: fields.value,
    }))
  }

  const setHtml = (newHtml: string) => {
    html.value = newHtml
    persist()
  }

  const toggleField = (fieldName: keyof QuestionnaireFields) => {
    fields.value[fieldName] = !fields.value[fieldName]
    persist()
  }

  return {
    html,
    fields, 
    setHtml,
    toggleField
  }
}