<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore';

const emit = defineEmits<{
    (e: 'close'): void
}>()

const userStore = useUserStore()
</script>

<template>
    <AppModals title="Спасибо!" :showClose="true" footerAlign="right" @close="$emit('close')">
        <template #content>
            <p>
                <span>Мы ответим на вашу почту </span>
                {{ userStore.user?.email }}
                <span> в ближайшее время</span>
            </p>
        </template>

        <template #footer>
            <AppButton variant="bordered" @click="$emit('close')">Закрыть</AppButton>
        </template>
    </AppModals>
</template>