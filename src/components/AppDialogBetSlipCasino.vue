<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'
import type { ICasinoBetRecordItem } from '~/apis/types'

interface Props {
  casinoData: ICasinoBetRecordItem
}
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

console.log('🚀 ~ props.casinoData:', props.casinoData)

const { t } = useI18n()
const { push } = useLocalRouter()

const isOriginalGame = computed(() => props.casinoData.platform_id === '1001')
const betTime = computed(() => props.casinoData.bet_time)
const app_name = computed(() => {
  const a = props.casinoData.game_name
  const arr = a.split('')
  arr.splice(0, 1, arr[0].toUpperCase())
  return arr.join('')
})

// 原创游戏列表
const isPlinko = computed(() => app_name.value.toLowerCase() === GAMES_LIST_ENUM.PLINKO)
const isDice = computed(() => app_name.value.toLowerCase() === GAMES_LIST_ENUM.DICE)
// 原创游戏数据
const {
  data: originalGameDetail,
  run: runOriginalGameDetail,
  loading: gameDetailLoading,
} = useRequest(() => ApiOriginalGameDetail(props.casinoData.bill_no))

// 前往游戏
function openCasinoGame() {
  const { game_code, platform_id, platform_name, game_name } = props.casinoData

  // 原创游戏
  if (isOriginalGame.value) {
    closeDialog()
    return push(`/casino/original-game/?id=${game_name.toLowerCase()}`)
  }

  let vid = +platform_id
  if (EnumCasinoPidToVid[+platform_id])
    vid = EnumCasinoPidToVid[+platform_id]

  push(`/casino/games?name=${game_name}&pn=${platform_name}&vid=${vid}&game_id=${game_code}`)
  closeDialog()
}

if (isOriginalGame.value)
  runOriginalGameDetail()
</script>

<template>
  <div v-if="gameDetailLoading" class="h-249 w-full">
    <AppLoading />
  </div>
  <div v-else class="flex flex-col items-center leading-[1.5]">
    <!-- 上部分 -->
    <div class="w-full flex flex-col items-center p-16 pt-0">
      <BaseButton type="text" size="none" @click="openCasinoGame">
        <div class="text-tg-text-white h-24 flex items-center text-[16px] font-semibold capitalize">
          {{ casinoData.game_name }}
        </div>
      </BaseButton>
      <div class="text-tg-text-white mb-16 h-24 flex items-center gap-8 text-[16px] font-semibold">
        <span>ID {{ formatWithSubstring(+casinoData.bill_no) }}</span>
        <AppTooltip
          :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']"
          @click="application.copy(casinoData.bill_no)"
        >
          <template #content>
            <BaseButton type="text" size="none">
              <BaseIcon name="uni-doc" />
            </BaseButton>
          </template>
        </AppTooltip>
      </div>
      <div class="text-tg-text-lightgrey text-center text-[14px] font-semibold">
        <span class="mb-4 inline-block h-21">{{ t('investor') }}：{{ casinoData.username }}</span><br>
        <span class="inline-block h-21 font-normal">{{ t('on') }} {{ timeToCustomizeFormat(betTime) }}</span>
      </div>
    </div>
    <!-- logo分割线 -->
    <div class="mb-16 mt-12 w-full flex items-center gap-5 px-16">
      <div class="bg-tg-secondary h-3 grow" />
      <BaseLogo class="h-35" />
      <div class="bg-tg-secondary h-3 grow" />
    </div>
    <!-- 通用游戏投注结果 -->
    <div v-if="!isOriginalGame" class="w-full flex flex-col gap-16 px-16 pb-16">
      <AppMiniGamePartBaseData
        :bet-amount="casinoData.bet_amount"
        :settle-amount="casinoData.settle_amount ?? casinoData.pay_amount"
        :currency-id="casinoData.currency_id"
        :result="casinoData.factor"
      />
      <!-- 前往游戏 -->
      <BaseButton class="mx-auto block capitalize" size="md" @click="openCasinoGame">
        {{ t('go_to', { app_name }) }}
      </BaseButton>
    </div>

    <!-- 小游戏 -->
    <!-- Plinko -->
    <AppMiniGamePartPlinkoGameResult v-if="isPlinko && originalGameDetail" :data="originalGameDetail" />
    <AppMiniGamePartDiceGameResult v-else-if="isDice && originalGameDetail" :data="originalGameDetail" />
  </div>
</template>

<style lang='scss' scoped></style>
