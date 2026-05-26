<template>
  <div class="not-found">
    <h1 class="not-found__element not-found__element--h">404</h1>
    <p class="not-found__element">Страница не найдена</p>
    <router-link to="/" class="not-found__element"><AppButton variant="text-gray">Вернуться на главную</AppButton></router-link>
  </div>
</template>

<style lang="scss">
.not-found {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.not-found__element {
    margin-bottom: 20px;

    &--h {
        color: var(--primary-main);
        font-size: 40px;
        font-weight: 700;
        margin-bottom: 40px;
    }
}
</style>