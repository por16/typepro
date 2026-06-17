<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppMenu from './AppMenu.vue'
import AppHeader from './AppHeader.vue'
import Feedback from '../navigation/feedback/Feedback.vue'
import FeedbackMessage from '../navigation/feedback/FeedbackMessage.vue'
import ProfileManagingDropdown from '../navigation/profile/ProfileManagingDropdown.vue'

const props = defineProps<{
    titleIcon?: string,
    label?: string,
    iconName?: string,
    textFirstLine?: string,
    textSecondLine?: string,
    buttonNeeded?: boolean,
    buttonText?: string,
    stringButtonNeeded?: boolean,
    stringButtonText?: string,
    tabsNeeded?: boolean,
    tabs?: {key: string, label: string}[]
}>()

const emit = defineEmits<{
    (e: 'button-click'): void
    (e: 'header-click'): void
}>()

const activeKey = ref(props.tabs?.[0]?.key)
const onFeedback = ref(false)

const isFeedbackSent = ref(false)
const handleSending = () => {
    onFeedback.value = false
    isFeedbackSent.value = true
}

const onProfile = ref(false)
const profileToggler = () => {
    console.log('profile toggled', onProfile.value)
    onProfile.value = !onProfile.value
}

const dropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node | null)) {
        onProfile.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div class="app-component">
        <aside class="app-component__sidebar">
            <AppMenu @feedback="onFeedback = true"/>
        </aside>
        <div class="app-component__main">
            <header class="app-component__header" ref="dropdownRef">
                <AppHeader @profile-toggler="profileToggler" :title-icon="titleIcon" @click="$emit('header-click')" :label="label"/>
                <ProfileManagingDropdown v-if="onProfile" />
            </header>
            <main class="app-component__content">
                <slot name="content" />

                <div v-if="tabsNeeded" class="app-component__tabs">
                    <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    class="app-component__tabs--item"
                    :class="{ active: activeKey === tab.key }"
                    @click="activeKey = tab.key"
                    >{{ tab.label }}</button>
                </div>

                <slot name="tab-content" :active-tab="activeKey"/>

                <div class="app-component__zero-state">
                    <AppIcons :name="props.iconName" class="app-component__zero-state--icon" />
                    <p class="app-component__zero-state--text text--light-gray">
                        <span>{{ props.textFirstLine }}</span>
                        <span>{{ props.textSecondLine }}</span>
                    </p>
                    <AppButton variant="green" v-if="props.buttonNeeded" class="app-component__zero-state--button" @click="emit('button-click')">{{ props.buttonText }}</AppButton>
                    <AppButton variant="text-green" v-if="props.stringButtonNeeded">{{ props.stringButtonText }}</AppButton>
                </div>
            </main>
        </div>
    </div>
    <Feedback v-if="onFeedback" @close="onFeedback = false" @send="handleSending"/>
    <FeedbackMessage v-if="isFeedbackSent" @close="isFeedbackSent = false"/>
</template>

<style lang="scss">
.app-component {
    display: flex;
}

.app-component__sidebar {
    width: 100%;
    max-width: 230px;
    min-height: 100vh;
    display: flex;
}

.app-component__main {
    flex: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.app-component__header {
    box-sizing: border-box;
    position: relative;
}

.app-component__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px 24px 0 24px;
}

.app-component__tabs {
    border-bottom: 1px solid var(--border-gray);
    display: flex;
    gap: 32px;
    height: 46px;
    flex-shrink: 0;

    &--item {
        background-color: transparent;
        border: none;
        cursor: pointer;
        margin-bottom: -1px;
        border-bottom: 2px solid transparent;

        &.active {
            border-bottom: 2px solid var(--primary-main);
            color: var(--primary-main);
        }
    }
}

.app-component__zero-state {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &--icon {
        margin-bottom: 8px;
    }

    &--text {
        display: flex;
        flex-direction: column;
        text-align: center;
        font-size: 20px;
        margin-bottom: 28px;
        line-height: 150%;
    }

    &--button {
        margin-bottom: 16px;
    }
}
</style>