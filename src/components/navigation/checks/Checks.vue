<script lang="ts" setup>
import { ref } from 'vue'
import NewObject from './NewObject.vue'

const onButtonClick = ref(false)
</script>

<template>
    <AppComponent
    iconName="zero-objects"
    textFirstLine="Добавьте первый объект"
    textSecondLine="для планирования проверок"
    :buttonNeeded="true"
    buttonText="Добавить объект"
    @button-click="onButtonClick = true" />
    <NewObject v-if="onButtonClick" @close="onButtonClick = false"/>
</template>

<style lang="scss"></style>