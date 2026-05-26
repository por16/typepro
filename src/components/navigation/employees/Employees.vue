<script lang="ts" setup>
import { ref } from 'vue'
import NewEmployee from './NewEmployee.vue';

const onButtonClick = ref(false)
</script>

<template>
    <AppComponent
    iconName="zero-employees"
    textFirstLine="Добавьте своего первого"
    textSecondLine="сотрудника"
    :buttonNeeded="true"
    buttonText="Добавить сотрудника"
    @button-click="onButtonClick = true" />
    <NewEmployee v-if="onButtonClick" @close="onButtonClick = false" />
</template>

<style lang="scss"></style>