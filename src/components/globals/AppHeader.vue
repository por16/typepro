<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const emit = defineEmits<{
    (e: 'profile-toggler'): void
}>()

const route = useRoute()
const userStore = useUserStore()

const pageTitle = computed(() => {
    return route.meta?.title || 'Текущая страница'
})
</script>

<template>
    <div class="header">
        <h2 class="header--title">{{ pageTitle }}</h2>
        <button class="user" @click="$emit('profile-toggler')">
            <div class="user--info">
                <p>{{ userStore.user?.email }}</p>
                <p class="text--light-gray">{{ userStore.user?.role}}</p>
            </div>
            <AppIcons name="profile-toggler" />
        </button>
    </div>
</template>

<style lang="scss">
.header {
    width: 100%;
    box-sizing: border-box;
    padding: 14px 24px 13px;
    border-bottom: 1px solid var(--divider);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &--title {
        font-size: 20px;
        font-weight: 500;
    }
}

.user {
    display: flex;
    gap: 4px;
    cursor: pointer;
    background-color: transparent;
    border: none;

    &--info {
        text-align: right;
    }
}
</style>