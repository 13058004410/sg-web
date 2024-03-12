<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'

interface Props {
  game: GAMES_LIST_ENUM
  data: {
    [k: string]: any
    serverSeed: string
    serverSeedHash: string
    clientSeed: string
    nonce: number
  }
}
const props = defineProps<Props>()
const { t } = useI18n()
const { push } = useLocalRouter()
const closeDialog = inject('closeDialog', () => { })
const { openDialogOriginalGameProvablyFair } = useDialogOriginalGameProvablyFair()

const isPlinko = computed(() => props.game === GAMES_LIST_ENUM.PLINKO)
/** 种子数据 */
const { bool: showSeedDetail, toggle: toggleShowSeedDetail } = useBoolean(false)
const serverSeed = computed(() => props.data.serverSeed ?? '')
const serverSeedHash = computed(() => props.data.serverSeedHash ?? '')
const clientSeed = computed(() => props.data.clientSeed ?? '')
const nonce = computed(() => props.data.nonce ?? 0)

// 轮换您的种子配对以验证这笔赌注
function changeYourSeed() {
  openDialogOriginalGameProvablyFair({ game: props.game })
  closeDialog()
}

// 验证赌注
function verifyMyBets() {
  if (isPlinko.value) {
    openDialogOriginalGameProvablyFair({
      game: props.game,
      tab: 'verify',
      gameData: {
        clientSeed: props.data.clientSeed,
        serverSeed: props.data.serverSeed,
        nonce: props.data.nonce,
        risk: props.data.risk,
        row: props.data.plinkoRow,
      },
    })
  }
  closeDialog()
}

// 什么是可证明的公平？
function whatIsVerifyFairnesses() {
  push('/provably-fair/overview')
  closeDialog()
}
</script>

<template>
  <div class="bg-tg-secondary-dark w-full flex flex-col rounded-bl-[4px] rounded-br-[4px]">
    <div class="flex flex-col cursor-pointer px-20 py-15">
      <BaseButton
        size="none" type="text" disabled-click-transition style="--tg-base-button-text-default-color:var(--tg-text-white);"
        @click="toggleShowSeedDetail"
      >
        <div class="w-full flex justify-between">
          <span class="leading-[1]">{{ t('provable_fairness') }}</span>
          <div class="flex items-center text-[16px]" :class="[showSeedDetail ? 'rotate-[270deg]' : '']">
            <BaseIcon name="uni-arrow-left" />
          </div>
        </div>
      </BaseButton>
    </div>

    <div v-show="showSeedDetail" class="w-full flex flex-col gap-16 p-16 pt-0">
      <div class="flex flex-col">
        <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
          {{ t('server_seed') }}
        </span>
        <AppCopyLine class="h-40" :msg="serverSeed" :placeholder="t('seed_not_be_revealed_yet')" />
      </div>
      <div class="flex flex-col">
        <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
          {{ t('server_seed_hash') }}
        </span>
        <AppCopyLine class="h-40" :msg="serverSeedHash" />
      </div>
      <div class="xm:grid xm:grid-cols-[7fr,3fr] flex flex-col gap-16">
        <div class="flex flex-col">
          <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
            {{ t('client_seed') }}
          </span>
          <AppCopyLine class="h-40" :msg="clientSeed" />
        </div>
        <div class="flex flex-col">
          <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
            {{ t('present_sign') }}
          </span>
          <AppCopyLine class="h-40" :msg="nonce.toString()" />
        </div>
      </div>

      <div v-if="serverSeed" class="flex flex-col items-center">
        <BaseButton type="text" size="none" @click="verifyMyBets">
          {{ t('verify_my_bets') }}
        </BaseButton>
      </div>
      <div v-else class="flex flex-col items-center">
        <BaseButton type="text" size="none" @click="changeYourSeed">
          {{ t('change_your_seed_pair_to_verify_your_bet') }}
        </BaseButton>
      </div>
      <div class="flex flex-col items-center">
        <BaseButton type="text" size="none" @click="whatIsVerifyFairnesses">
          {{ t('what_is_verify_fairnesses') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
