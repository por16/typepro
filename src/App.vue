<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()
onMounted(() => {
  userStore.loadUser()
})
</script>

<template>
  <router-view />
</template>

<style>
.text--light-gray {
  color: var(--text-secondary);
}

.link {
  cursor: pointer;
}

.below-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
}

.validation-error__message {
  color: rgba(244, 67, 54, 1);
  font-size: 12px;
  padding: 4px 0 0 0;
  margin: 0;
}

.line-break {
  word-break: break-all;
}

.invisible-button {
  cursor: pointer;
  border: none;
  background-color: transparent;
  height: 16px;
  width: 16px;
}

.text-underlined {
  text-decoration: underline;
}

.word-break {
  word-wrap: break-word;
  white-space: normal;
}
</style>
