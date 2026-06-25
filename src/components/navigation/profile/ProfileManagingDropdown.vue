<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
    (e: 'close'): void
}>() 

const userStore = useUserStore()
const router = useRouter()

const logout = () => {
    userStore.resetUser()
    router.push('/login')
}
</script>

<template>
    <div class="profile-dropdown__wrapper" ref="dropdown">
        <div class="profile-dropdown__inner">
            <button class="profile-dropdown__button" @click="$router.push('/profile')">
                <AppIcons name="profile" />
                <span class="profile-dropdown__button--text">Профиль</span>
            </button>
            <button class="profile-dropdown__button" @click="logout">
                <AppIcons name="logout" />
                <span class="profile-dropdown__button--text">Выйти</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss">
.profile-dropdown__wrapper {
    position: absolute;
    z-index: 5000;
    top: 130%;
    transform: translateY(-50%);
    right: 50px;
    padding: 4px 0;
    min-width: 146px;
    background-color: var(--primary-contast-text);
    box-shadow: var(--box-shadow);
}

.profile-dropdown__inner {
    display: flex;
    flex-direction: column;
}

.profile-dropdown__button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    padding: 5px 12px;
    color: var(--text-secondary);

    &:hover {
        background-color: var(--other-gray);
    }

    &--text {
        padding-left: 12px;
        font-size: 14px;
        line-height: 18px;
    }
}
</style>