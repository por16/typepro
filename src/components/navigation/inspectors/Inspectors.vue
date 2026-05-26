<script lang="ts" setup>
import { ref } from 'vue'
import NewInspector from './NewInspector.vue'

const onButtonClick = ref(false)
</script>

<template>
    <AppComponent
    iconName="zero-inspectors"
    textFirstLine="Добавьте или пригласите"
    textSecondLine="проверяющих"
    :buttonNeeded="true"
    buttonText="Добавить проверяющего"
    :stringButtonNeeded="true"
    stringButtonText="Пригласить с помощью анкеты"
    @button-click="onButtonClick = true" />
    <NewInspector v-if="onButtonClick" @close="onButtonClick = false" />
</template>

<style lang="scss"></style>