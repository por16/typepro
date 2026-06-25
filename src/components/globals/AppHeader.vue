<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const props = defineProps<{
    titleIcon?: string,
    label?: string
}>()

const emit = defineEmits<{
    (e: 'profile-toggler'): void
    (e: 'click'): void
}>()

const route = useRoute()
const userStore = useUserStore()

const pageTitle = computed(() => {
    return props.label || route.meta?.title || 'Текущая страница'
})
</script>

<template>
    <div class="header">
        <div class="header__title">
            <button class="header__title--button" @click="$emit('click')" v-if="titleIcon">
                <AppIcons :name="titleIcon"/>
            </button>
            <h2>{{ pageTitle }}</h2>
        </div>
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
}

.header__title {
    display: flex;
    align-items: center;
    height: 24px;
    font-size: 20px;
    font-weight: 500;

    &--button {
        cursor: pointer;
        background-color: transparent;
        border: none;
        padding: 0;
        margin-right: 12px;
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