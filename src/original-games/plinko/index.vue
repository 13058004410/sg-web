<script lang="ts" setup>
const { gameUrl, gameProps, showProvablyFair, initVerifyGame } = useMiniGame('plinko')
</script>

<template>
  <div class="relative">
    <WujieVue
      width="100%"
      height="100%"
      name="Plinko"
      :url="gameUrl"
      :props="gameProps"
    />
    <AppDialogMiniGameProvablyFair
      v-if="showProvablyFair"
      :game="initVerifyGame"
      @close="showProvablyFair = false"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
