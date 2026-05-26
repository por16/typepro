<script lang="ts" setup>
const props = defineProps<{
    email: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()
</script>

<template>
    <AppModals title="Восстановление пароля" footerAlign="left" overlayVariant="light">
        <template #content>
            <p>
                <span>На почту </span>{{ props.email }}
                <span><br>выслана ссылка для сброса пароля</span>
            </p>
        </template>

        <template #footer>
            <AppButton variant="bordered" @click="$emit('close')">Закрыть</AppButton>
        </template>
    </AppModals>
</template>

<style lang="scss"></style>