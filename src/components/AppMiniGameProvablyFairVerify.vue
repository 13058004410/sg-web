<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'

interface Props {
  game: string
  gameData?: {
    [k: string]: any
  }
}

const props = defineProps<Props>()

const _game = ref(props.game)
const baseParams = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: 0,
})

const isPlinko = computed(() => _game.value.toLowerCase() === GAMES_LIST_ENUM.PLINKO)
const isDice = computed(() => _game.value.toLowerCase() === GAMES_LIST_ENUM.DICE)
</script>

<template>
  <div class="w-full">
    <!-- Plinko -->
    <AppMiniGamePartPlinkoFairVerify
      v-if="isPlinko"
      v-model:game="_game"
      v-model:clientSeed="baseParams.clientSeed"
      v-model:serverSeed="baseParams.serverSeed"
      v-model:nonce="baseParams.nonce"
      :game-data="gameData"
    />
    <!-- Dice -->
    <AppMiniGamePartDiceFairVerify
      v-else-if="isDice"
      v-model:game="_game"
      v-model:clientSeed="baseParams.clientSeed"
      v-model:serverSeed="baseParams.serverSeed"
      v-model:nonce="baseParams.nonce"
    />
  </div>
</template>

<style lang='scss' scoped>
.group-hover\:bg-tg-text-grey-hover:hover:not(:active) {
  background-color: var(--tg-text-grey);
}
</style>
