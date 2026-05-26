<script lang="ts" setup>
</script>

<template>
    <AppComponent
    iconName="zero-statistics"
    textFirstLine="Нет статистики для показа"
    :tabsNeeded="true" >
        <template #filters-objects>
            <div class="statistics__filters-wrapper">
                <AppInput type="calendar" placeholder="За все время"
                class="statistics__filters-input statistics__filters-input--time"/>
                <AppInput type="select" placeholder="Все типы"
                class="statistics__filters-input statistics__filters-input--objects-types"/>
                <AppInput type="select" placeholder="Все задачи"
                class="statistics__filters-input statistics__filters-input--objects-tasks"/>
            </div>
        </template>

        <template #filters-checks>
            <div class="statistics__filters-wrapper">
                <AppInput type="calendar" placeholder="За все время"
                class="statistics__filters-input statistics__filters-input--time"/>
                <AppInput type="select" placeholder="Все города"
                class="statistics__filters-input statistics__filters-input--checks-cities"/>
                <AppInput type="select" placeholder="Все объекты"
                class="statistics__filters-input statistics__filters-input--checks-objects"/>
            </div>
        </template>
    </AppComponent>
</template>

<style lang="scss">
.statistics__filters-wrapper {
    margin-top: 28px;
    display: flex;
}

.statistics__filters-input + .statistics__filters-input {
    margin-left: 16px;
}

.statistics__filters-input {
    &--time {
        width: 220px;
    }

    &--objects-types {
        width: 165px;
    }

    &--objects-tasks {
        width: 382px;
    }

    &--checks-cities {
        width: 291px;
    }

    &--checks-objects {
        width: 345px;
    }
}
</style>