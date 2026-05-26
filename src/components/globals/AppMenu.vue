<script lang="ts" setup>
const emit = defineEmits<{
    (e: 'feedback'): void

}>()
</script>

<template>
    <div class="menu">
        <router-link to="/checks">
            <AppIcons name="logo"/>
        </router-link>
        <nav class="menu__navigation">
            <router-link to="/checks" class="menu__navigation--item">
                <AppIcons name="checks" class="menu__navigation--icon" />
                <span>Проверки</span>
            </router-link>
            <router-link to="/templates" class="menu__navigation--item">
                <AppIcons name="task-templates" class="menu__navigation--icon" />
                <span>Шаблоны задач</span>
            </router-link>
            <router-link to="/inspectors" class="menu__navigation--item">
                <AppIcons name="inspectors" class="menu__navigation--icon" />
                <span>Проверяющие</span>
            </router-link>
            <router-link to="/employees" class="menu__navigation--item">
                <AppIcons name="employees" class="menu__navigation--icon" />
                <span>Сотрудники</span>
            </router-link>
            <router-link to="/statistics" class="menu__navigation--item">
                <AppIcons name="statistics" class="menu__navigation--icon" />
                <span>Статистика</span>
            </router-link>
        </nav>
        <AppButton variant="bordered" icon-name="feedback" icon-position="left" class="menu__feedback-button" @click="$emit('feedback')">Обратная связь</AppButton>
    </div>
</template>

<style lang="scss">
.menu {
    background-color: var(--other-gray);
    width: 100%;
    max-width: 230px;
    box-sizing: border-box;
    border-right: 1px solid var(--divider);
    padding: 16px 12px 28px;
    display: flex;
    flex-direction: column;
}

.menu__navigation {
    margin-top: 28px;
    display: flex;
    flex-direction: column;

    &--item {
        display: flex;
        align-items: center;
        padding: 10px 12px;
        color: var(--text-secondary);
        font-size: 14px;

        &.router-link-active {
            background-color: var(--divider);
            color: var(--text-primary);
            border-radius: 6px;
            
            .menu__navigation--icon {
                fill-opacity: 1;
                color: var(--primary-main);
            }
        }
    }

    &--icon {
        fill-opacity: 0.4;
        padding-right: 12px;
    }

}

.menu__navigation--item + .menu__navigation--item {
    margin-top: 8px;
}

.menu__feedback-button {
    margin: auto 0 0 12px;
    align-self: flex-start;
}
</style>