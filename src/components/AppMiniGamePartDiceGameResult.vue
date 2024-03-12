<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'
import type { IOriginalGameDetail } from '~/apis/types'

interface Props {
  data: IOriginalGameDetail
}

const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })
const { t } = useI18n()
const { push } = useLocalRouter()

const bet_detail = JSON.parse(props.data.bet_detail)
const condition = bet_detail.condition
const target = Number.parseFloat(bet_detail.target)
const result = Number.parseFloat(bet_detail.result)
const payout_multiplier = Number.parseFloat(props.data.payout_multiplier).toString()
const seedInfoData = computed(() => {
  return {
    serverSeed: props.data.server_seed,
    serverSeedHash: props.data.server_seed_hash,
    clientSeed: props.data.client_seed,
    nonce: props.data.nonce,
  }
})

// 前往游戏
function openCasinoGame() {
  closeDialog()
  push(`/casino/original-game/?id=${GAMES_LIST_ENUM.DICE}`)
}
// 下面三个参数 乘数、掷大于、获胜几率
const multiplier: string = bet_detail.payout_multiplier
const roll_over: string = bet_detail.target
const win_chance: string = bet_detail.win_chance
</script>

<template>
  <div class="w-full">
    <div class="w-full flex flex-col gap-16 px-16 pb-16">
      <AppMiniGamePartBaseData
        :bet-amount="data.bet_amount"
        :settle-amount="data.settle_amount"
        :currency-id="data.currency_id"
        :result="payout_multiplier"
      />
      <!-- 🎮 游戏特有数据 🎮 -->
      <div class="w-full flex content-center justify-around">
        <AppOriginalGamePartDiceResultComponent :condition="condition" :target="target" :result="result" />
      </div>
      <!-- 结果展示 -->
      <div class="bg-tg-secondary-grey flex justify-around p-[3%]">
        <div class="max-w-[32%]">
          <p class="text-tg-secondary-light font-bold">
            {{ t('dice_bet_score_pop_up_multiplier') }}
          </p>
          <BaseInput
            v-model="multiplier"
            readonly
          >
            <template #right-icon>
              <BaseIcon name="uni-close" />
            </template>
          </BaseInput>
        </div>
        <div class="max-w-[32%]">
          <p class="text-tg-secondary-light font-bold">
            {{ t('dice_bet_score_pop_up_roll_over') }}
          </p>
          <BaseInput
            v-model="roll_over"
            readonly
          >
            <template #right-icon>
              <BaseIcon name="uni-refresh" />
            </template>
          </BaseInput>
        </div>
        <div class="max-w-[32%]">
          <p class="text-tg-secondary-light font-bold">
            {{ t('dice_bet_score_pop_up_win_chance') }}
          </p>
          <BaseInput
            v-model="win_chance"
            readonly
          >
            <template #right-icon>
              <BaseIcon name="uni-persent" />
            </template>
          </BaseInput>
        </div>
      </div>
      <!-- 前往游戏 -->
      <BaseButton class="mx-auto block capitalize" size="md" @click="openCasinoGame">
        {{ t('go_to', { app_name: 'Dice' }) }}
      </BaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo :game="GAMES_LIST_ENUM.DICE" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>

</style>
