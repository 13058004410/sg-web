<script lang="ts" setup>
// const { t } = useI18n()
const { openFreeGetManyDialog } = useDialogFreeGetMany()
const { openInviteFriendHelpDialog } = useDialogInviteFriendHelp()

const currentTab = ref('deposit')

const tabList = [
  { label: '报告', value: 'deposit' },
  { label: '我的邀请', value: 'withdraw' },
  { label: '规则', value: 'cardHolder' },
]
</script>

<template>
  <div class="tg-weekly-giveaway">
    <div class="m-auto my-24 max-w-375 w-[100%] flex flex-col gap-12">
      <div class="text-tg-text-white flex items-center gap-4 text-[12px]">
        <AppCurrencyIcon currency-type="USDT" style="--tg-app-currency-icon-size: var(--tg-font-size-md)" />
        <span>4332**********342 刚刚兑现 R$100</span>
      </div>
      <div class="flex flex-col gap-12 rounded-[4px] bg-[#304554] px-10 py-16">
        <div class="text-tg-text-white center gap-8">
          <BaseIcon class="text-[38px]" name="uni-price-money" />
          <span class="text-[32px]">999 $</span>
          <BaseButton bg-style="primary" @click="openFreeGetManyDialog">
            取出
          </BaseButton>
        </div>
        <div>
          <div class="text-tg-text-white text-right text-[14px] font-semibold">
            50.00%
          </div>
          <BaseProgress
            width="100%"
            :percent="50"
            :show-info="false"
            :stroke-width="8"
            stroke-color="var(--tg-primary-success)"
            style="--tg-base-progress-inner-bg: var(--tg-primary-main)"
          />
        </div>
        <div class="text-tg-secondary-light text-center text-[14px] font-semibold">
          您还需要  3  才能提现到Pix
        </div>
      </div>
      <div class="text-tg-secondary-light text-center text-[14px] font-semibold">
        1小时内提取 R$ 100
      </div>
      <AppRoulette />
      <div class="text-center text-[14px] font-semibold">
        <span class="text-tg-secondary-light">2 天后过期</span>
        <span class="text-tg-text-white">&nbsp;04:34:21</span>
      </div>
      <div class="center relative overflow-hidden rounded-[4px]">
        <div class="text-tg-text-white flex-1 bg-[#304554] py-13 text-center text-[14px]">
          邀请好友帮忙提款
        </div>
        <div class="absolute right-0 bg-[#223847]">
          <BaseButton size="none" custom-padding type="text" style="--tg-base-button-padding-x: 18px;--tg-base-button-padding-y:10px" @click="openInviteFriendHelpDialog">
            <BaseIcon class="text-[20px]" name="uni-share" />
          </BaseButton>
        </div>
      </div>
      <BaseTab v-model="currentTab" :list="tabList" full />
      <div>
        <div v-for="i in 7" :key="i" class="center text-tg-secondary-light rounded-[4px] py-20 text-center text-[14px] odd:bg-[#213743]">
          <div class="flex-1">
            5545*****434
          </div>
          <div class="flex-1">
            刚刚收到
          </div>
          <div class="center flex-1">
            <AppAmount
              amount="+183300"
              currency-type="USDT"
            />
          </div>
        </div>
      </div>
      <BaseButton class="btn-receive" bg-style="secondary" size="md">
        {{ $t('transfer_to_wallet') }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<route lang="yaml">
meta:
  layout: home
</route>
