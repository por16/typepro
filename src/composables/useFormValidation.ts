import { reactive } from 'vue'
import { useRegle } from '@regle/core'
import { required, minLength, email as emailRule, withMessage, maxLength, numeric, url, startsWith } from '@regle/rules'

type FieldType = 'text' | 'email' | 'password'

interface FieldConfig {
  type: FieldType
  required?: boolean
  minLength?: number
  maxLength?: number
  isNumber?: boolean
  domain?: boolean
  vklink?: boolean
}

export function useFormValidation<T extends Record<string, any>>(initialData: T, fieldsConfig: Record<keyof T, FieldConfig>) {
  const data = reactive(initialData)

  const rules: Record<string, any> = {}
  for (const fieldName in fieldsConfig) {
    const config = fieldsConfig[fieldName]
    const fieldRules: Record<string, any> = {}
    if (config.required) {
      fieldRules.required = withMessage(required, 'Поле обязательно для заполнения')
    }
    if (config.type === 'email') {
      fieldRules.email = withMessage(emailRule, 'Введите корректный email')
    }
    if (config.type === 'password' && config.minLength) {
      fieldRules.minLength = withMessage(minLength(config.minLength), `Пароль должен содержать минимум ${config.minLength} символов`)
    }
    if (config.minLength) {
      fieldRules.minLength = withMessage(minLength(config.minLength), `Пароль должен содержать минимум ${config.minLength} символов`)
    }
    if (config.maxLength) {
      fieldRules.maxLength = withMessage(maxLength(config.maxLength), `Максимум ${config.maxLength} символов`)
    }
    if (config.isNumber) {
      fieldRules.isNumber = withMessage(numeric, 'Допустимы только цифры')
      fieldRules.startsWith = withMessage(startsWith('8'), `Поле должно начинаться с 8`)
    }
    if (config.domain) {
      fieldRules.domain = withMessage(url, 'Введите корректную ссылку')
    }
    if (config.vklink) {
      fieldRules.startsWith = withMessage(startsWith('https://vk.ru/'), `Поле должно начинаться с "https://vk.ru/"`)
    }
    
    rules[fieldName] = fieldRules
  }

  const { r$ } = useRegle(data, rules)

  return { data, r$ }
}