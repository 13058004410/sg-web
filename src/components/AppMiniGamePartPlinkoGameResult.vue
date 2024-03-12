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

const plinkoIndex = computed(() => +props.data.result.split(',')[0])
const plinkoResult = computed(() => props.data.result.split(',')[1])
const risk = computed(() => props.data.bet_type.split(',')[1])
const plinkoRisk = computed(() => {
  const obj: { [k: string]: string } = {
    low: t('plinko_level1'),
    middle: t('plinko_level2'),
    high: t('plinko_level3'),
  }
  return obj[risk.value]
})
const plinkoRow = computed(() => props.data.bet_type.split(',')[0])
const seedInfoData = computed(() => {
  return {
    serverSeed: props.data.server_seed,
    serverSeedHash: props.data.server_seed_hash,
    clientSeed: props.data.client_seed,
    nonce: props.data.nonce,
    risk: props.data.bet_type.split(',')[1],
    row: props.data.bet_type.split(',')[0],
  }
})

// 前往游戏
function openCasinoGame() {
  closeDialog()
  push(`/casino/original-game/?id=${GAMES_LIST_ENUM.PLINKO}`)
}
</script>

<template>
  <div class="w-full">
    <div class="w-full flex flex-col gap-16 px-16 pb-16">
      <AppMiniGamePartBaseData
        :bet-amount="data.bet_amount"
        :settle-amount="data.settle_amount"
        :currency-id="data.currency_id"
        :result="plinkoResult"
      />
      <!-- 🎮 游戏特有数据 🎮 -->
      <div class="w-full">
        <ResultPlinko
          class="mx-auto" :index="plinkoIndex"
          :result="(+plinkoResult).toFixed(1).toString()"
          :row="plinkoRow"
        />
        <div class="mt-14 flex flex-col">
          <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
            {{ t('plinko_risk') }}
          </span>
          <BaseInput
            v-model="plinkoRisk" readonly style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        "
          />
        </div>
        <div class="mt-14 flex flex-col">
          <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
            {{ t('plinko_rows') }}
          </span>
          <BaseInput
            v-model="plinkoRow" readonly style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        "
          />
        </div>
      </div>

      <!-- 前往游戏 -->
      <BaseButton class="mx-auto block capitalize" size="md" @click="openCasinoGame">
        {{ t('go_to', { app_name: 'Plinko' }) }}
      </BaseButton>
    </div>
    <!-- 种子信息 -->
    <AppMiniGamePartSeedInfo :game="GAMES_LIST_ENUM.PLINKO" :data="seedInfoData" />
  </div>
</template>

<style lang='scss' scoped>

</style>
