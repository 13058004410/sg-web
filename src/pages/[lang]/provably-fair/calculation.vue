<script lang="ts" setup>
import { GAMES_LIST, GAMES_LIST_ENUM } from 'feie-ui'

const route = useRoute()
const { t } = useI18n()

const game = ref(route.query.game ? route.query.game.toString() : GAMES_LIST_ENUM.PLINKO)
const isPlinko = computed(() => game.value.toLowerCase() === GAMES_LIST_ENUM.PLINKO)
const isDice = computed(() => game.value.toLowerCase() === GAMES_LIST_ENUM.DICE)
</script>

<template>
  <div class="w-full p-12">
    <div class="mx-auto max-w-600 w-full flex flex-col gap-16">
      <BaseLabel :label="t('game')">
        <BaseSelect v-model="game" :options="GAMES_LIST" small />
      </BaseLabel>

      <AppMiniGamePlinkoCalculationPage v-if="isPlinko" />
      <AppMiniGameDiceCalculationPage v-else-if="isDice" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
