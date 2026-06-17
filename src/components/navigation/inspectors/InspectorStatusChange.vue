<script lang="ts" setup>
import { useInspectorsStore } from '@/stores/inspectorsStore'

const props = defineProps<{
    inspectorId: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'update-status', newStatus: string): void
}>()

const store = useInspectorsStore()

const changeStatus = (newStatus: 'Проверка анкеты' | 'Одобрен' | 'Отклонен') => {
    store.updateInspector(props.inspectorId, { inspectorState: newStatus })
    emit('update-status', newStatus)
    emit('close')
}
</script>

<template>
    <div class="status-dropdown__wrapper" ref="dropdown">
        <div class="status-dropdown__inner">
            <button class="status-dropdown__button" @click="changeStatus('Одобрен')">Одобрен</button>
            <button class="status-dropdown__button" @click="changeStatus('Отклонен')">Отклонен</button>
            <button class="status-dropdown__button" @click="changeStatus('Проверка анкеты')">Проверка анкеты</button>
        </div>
    </div>
</template>

<style lang="scss">
.status-dropdown__wrapper {
    position: absolute;
    z-index: 4000;
    right: 12px;
    background-color: var(--primary-contast-text);
    box-shadow: var(--box-shadow);
    padding: 4px 0;
    min-width: 146px;
}

.status-dropdown__inner {
    display: flex;
    flex-direction: column;
}

.status-dropdown__button {
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