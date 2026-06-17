<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRegle } from '@regle/core'
import { required, minLength, maxLength, sameAs, withMessage } from '@regle/rules'
import { useUserStore } from '@/stores/userStore'

const emit = defineEmits<{
    (e: 'close'): void
}>()

const userStore = useUserStore()

const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const { r$ } = useRegle(form, {
  oldPassword: {
    required: withMessage(required, 'Поле обязательно для заполнения'),
    sameAs: withMessage(sameAs(() => userStore.user?.password), 'Поля должны совпадать')
  },
  newPassword: {
    required: withMessage(required, 'Поле обязательно для заполнения'),
    minLength: withMessage(minLength(6), 'Пароль должен содержать минимум 6 символов'),
    maxLength: withMessage(maxLength(30), 'Пароль должен содержать максимум 30 символа')
  },
  confirmPassword: {
    required: withMessage(required, 'Поле обязательно для заполнения'),
    sameAs: withMessage(sameAs(() => form.value.newPassword), 'Поля должны совпадать')
  }
})

const isFormValid = computed(() => {
  return form.value.oldPassword !== '' &&
  form.value.newPassword !== '' &&
  form.value.confirmPassword !== '' &&
  !(r$ as any).oldPassword?.$error &&
  !(r$ as any).newPassword?.$error &&
  !(r$ as any).confirmPassword?.$error
})

const handleSubmit = async () => {
    const currentUser = userStore.user
    await (r$ as any).$validate()
    if (isFormValid.value) {
      if (currentUser) {
        userStore.setUser({
        email: currentUser.email,
        role: currentUser.role,
        password: form.value.newPassword !== '' ? form.value.newPassword : currentUser.password,
        name: currentUser.name,
        surname: currentUser.surname,
        phoneNumber: currentUser.phoneNumber
    })
    }
    emit('close')
  }
}
</script>

<template>
    <AppModals title="Сменить пароль" :showClose="true" footerAlign="right" @close="$emit('close')">
        <template #content>
            <AppInput type="password" label="Старый пароль" placeholder="Введите старый пароль" v-model="r$.$value.oldPassword">
                <template #errors>
                    <p v-for="error of r$.$errors.oldPassword" class="validation-error__message">
                        {{ error }}
                    </p>
                </template>
            </AppInput>

            <AppInput type="password" label="Новый пароль" placeholder="Введите новый пароль" v-model="r$.$value.newPassword">
                <template #errors>
                    <p v-for="error of r$.$errors.newPassword" class="validation-error__message">
                        {{ error }}
                    </p>
                </template>
            </AppInput>

            <AppInput type="password" label="Новый пароль еще раз" placeholder="Введите новый пароль еще раз" v-model="r$.$value.confirmPassword">
                <template #errors>
                    <p v-for="error of r$.$errors.confirmPassword" class="validation-error__message">
                        {{ error }}
                    </p>
                </template>
            </AppInput>
        </template>

        <template #footer>
            <AppButton variant="bordered" @click="$emit('close')">Отмена</AppButton>
            <AppButton variant="green" :disabled="!isFormValid" @click="handleSubmit">Сменить пароль</AppButton>
        </template>
    </AppModals>
</template>