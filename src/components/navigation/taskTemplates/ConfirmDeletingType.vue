<script lang="ts" setup>
const props = defineProps<{
    type: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirm'): void
}>()
</script>

<template>
    <AppModals title="Удалить тип проверки" :showClose="true" footerAlign="right" @close="$emit('close')">
        <template #content>
            <p>Вы уверены, что хотите удалить<br>тип проверки «{{props.type}}»?</p>
        </template>

        <template #footer>
            <AppButton variant="bordered" @click="$emit('close')">Отмена</AppButton>
            <AppButton variant="red"  @click="$emit('confirm')">Удалить</AppButton>
        </template>
    </AppModals>
</template>