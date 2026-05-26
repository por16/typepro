<script lang="ts" setup>
import { ref } from 'vue'
import NewTemplate from './NewTemplate.vue';

const onButtonClick = ref(false)
</script>

<template>
    <AppComponent
    iconName="zero-templates"
    textFirstLine="Добавьте свой первый"
    textSecondLine="шаблон задачи"
    :buttonNeeded="true"
    buttonText="Добавить шаблон задачи"
    @button-click="onButtonClick = true" />
    <NewTemplate v-if="onButtonClick" @close="onButtonClick = false"/>
</template>

<style lang="scss"></style>