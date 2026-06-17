<script lang="ts" setup>
const props = defineProps<{
    state: 'Проверка анкеты' | 'Одобрен' | 'Отклонен' | 'Назначена' | 'Проверка отчета' | 'Исполнена' | 'Отказ'
}>()
</script>

<template>
    <div class="app-state"
    :class="{ 
        'app-state--onchecking': props.state === 'Проверка анкеты' || props.state === 'Проверка отчета',
        'app-state--approved': props.state === 'Одобрен' || props.state === 'Исполнена',
        'app-state--rejected': props.state === 'Отклонен' || props.state === 'Отказ',
        'app-state--appointed': props.state === 'Назначена'
     }">
        {{ props.state }}
    </div>
</template>

<style lang="scss">
.app-state {
    display: inline-block;
    font-size: 12px;
    line-height: 150%;
    padding: 0 6px 1px 6px;
    border: 1px solid currentColor;
    border-radius: 5px;
}

.app-state--onchecking {
    color: var(--orange-state-color);
    background-color: var(--orange-state-background-color);
}

.app-state--approved {
    color: var(--green-state-color);
    background-color: var(--green-state-background-color);
}

.app-state--rejected {
    color: var(--crimson-state-color);
    background-color: var(--crimson-state-background-color);
}

.app-state--appointed {
    color: var(--blue-state-color);
    background-color: var(--blue-state-background-color);
}
</style>