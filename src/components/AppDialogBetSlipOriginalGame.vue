<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'

interface Props {
  data: {
    id: string
    game: string
  }
}
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useLocalRouter()
const isPlinko = computed(() => props.data.game === GAMES_LIST_ENUM.PLINKO)
const isDice = computed(() => props.data.game === GAMES_LIST_ENUM.DICE)

const {
  data: detailData,
  loading,
} = useRequest(() => ApiOriginalGameDetail(props.data.id), { manual: false })

// 前往游戏
function openCasinoGame() {
  closeDialog()
  push(`/casino/original-game/?id=${props.data.game.toLowerCase()}`)
}
</script>

<template>
  <div v-if="loading" class="h-249 w-full">
    <AppLoading />
  </div>

  <div v-else class="flex flex-col items-center leading-[1.5]">
    <!-- 上部分 -->
    <div class="w-full flex flex-col items-center p-16 pt-0">
      <BaseButton type="text" size="none" @click="openCasinoGame">
        <div class="text-tg-text-white h-24 flex items-center text-[16px] font-semibold capitalize">
          {{ data.game }}
        </div>
      </BaseButton>
      <div class="text-tg-text-white mb-16 h-24 flex items-center gap-8 text-[16px] font-semibold">
        <span>ID {{ formatWithSubstring(detailData?.order_id ?? '') }}</span>
        <AppTooltip
          :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']"
          @click="application.copy(detailData?.order_id ?? '')"
        >
          <template #content>
            <BaseButton type="text" size="none">
              <BaseIcon name="uni-doc" />
            </BaseButton>
          </template>
        </AppTooltip>
      </div>
      <div class="text-tg-text-lightgrey text-center text-[14px] font-semibold">
        <span class="mb-4 inline-block h-21">{{ t('investor') }}：{{ detailData?.username }}</span><br>
        <span class="inline-block h-21 font-normal">{{ t('on') }} {{ timeToCustomizeFormat(detailData?.created_at ?? 0) }}</span>
      </div>
    </div>
    <!-- logo分割线 -->
    <div class="mb-16 mt-12 w-full flex items-center gap-5 px-16">
      <div class="bg-tg-secondary h-3 grow" />
      <BaseLogo class="h-35" />
      <div class="bg-tg-secondary h-3 grow" />
    </div>

    <!-- Plinko -->
    <AppMiniGamePartPlinkoGameResult v-if="isPlinko && detailData" :data="detailData" />
    <!-- Dice -->
    <AppMiniGamePartDiceGameResult v-else-if="isDice" :data="detailData" />
  </div>
</template>

<style lang='scss' scoped></style>
