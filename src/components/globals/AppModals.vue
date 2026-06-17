<script lang="ts" setup>

const props = defineProps<{
    title?: string,
    showClose?: boolean,
    footerAlign?: 'left' | 'right',
    overlayVariant?: 'dark-transparent' | 'light',
    largeSize?: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

</script>

<template>
     <div class="app-modal__overlay" :class="{ 'app-modal__overlay--light': overlayVariant === 'light',
     'app-modal__overlay--dark-transparent': overlayVariant !== 'light', 'app-modal__overlay--large': largeSize }">
        <div class="app-modal" :class="{'app-modal--large' : largeSize}">

            <div v-if="title" class="app-modal__header">
                <h3 class="app-modal__title">{{ title }}</h3>
                <button v-if="showClose" class="app-modal__close" @click="emit('close')">
                    <AppIcons name="close" />
                </button>
            </div>

            <div class="app-modal__content">
                <slot name="content"></slot>
            </div>

            <div class="app-modal__footer" :class="`app-modal__footer--${footerAlign || 'right'}`">
                <slot name="footer"></slot>
            </div>

            <div v-if="$slots['under-footer']" class="app-modal__under-footer">
                <slot name="under-footer"></slot>
            </div>
        </div>

        <div v-if="$slots['below']" class="app-modal__below">
            <slot name="below"></slot>
        </div>
    </div>
</template>

<style lang="scss">
.app-modal__overlay {
    position: fixed;
    z-index: 1200;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    box-sizing: border-box;

    &--dark-transparent {
        background: rgba(0, 0, 0, 0.5);
    }
    &--light {
        background: var(--other-gray);
    }

    &--large {
        padding: 64px 0;
        overflow-y: scroll;
    }
}

.app-modal {
    background: var(--primary-contast-text);
    border-radius: 12px;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    margin: auto; 

    &--large {
        max-width: 788px;
    }
}

.app-modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 12px 18px 24px;
    border-bottom: 1px solid var(--divider);
}

.app-modal__title {
    font-size: 20px;
    font-weight: 500;
    color: var(--text-primary);
}

.app-modal__close {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: var(--text-secondary);
    fill-opacity: 0.6;

    &:hover { 
        color: var(--text-primary); 
    }
}

.app-modal__content {
    padding: 32px 24px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.app-modal__footer {
    padding: 12px 24px;
    display: flex;
    gap: 12px;

    &--left { 
        justify-content: flex-start; 
    }

    &--right { 
        justify-content: flex-end; 
    }
}

.app-modal__under-footer {
    margin: 0 24px 24px;
}

.app-modal__below {
    margin-top: 16px;
    width: 100%;
    max-width: 400px;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 14px;
}
</style>