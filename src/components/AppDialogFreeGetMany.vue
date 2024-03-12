<script setup lang="ts">
const { openInviteFriendHelpDialog } = useDialogInviteFriendHelp()
</script>

<template>
  <div class="flex flex-col items-center gap-16">
    <div class="center gap-4 text-[14px]">
      <AppCurrencyIcon style="--tg-app-currency-icon-size: var(--tg-font-size-md)" currency-type="USDT" />
      <span>快速提取</span>
    </div>
    <div class="text-tg-secondary-light text-[12px] font-600">
      恭喜您好运，你赢了
    </div>
    <div class="center gap-8">
      <BaseIcon class="text-[38px]" name="uni-price-money" />
      <span class="text-[36px] font-600">99 R$</span>
    </div>
    <div class="w-[92%]">
      <div class="text-tg-text-white text-right text-[14px] font-500">
        50.00%
      </div>
      <div>
        <BaseProgress
          width="100%"
          :percent="50"
          :show-info="false"
          :stroke-width="8"
          stroke-color="var(--tg-primary-success)"
          style="--tg-base-progress-inner-bg: #0F212E"
        />
      </div>
    </div>
    <div class="text-tg-secondary-light text-[14px] font-600">
      4 提现至 Pix 仍需
    </div>
    <BaseButton class="btn-receive" bg-style="secondary" size="md" @click="openInviteFriendHelpDialog">
      索取更多现金
    </BaseButton>
  </div>
  <div class="text-tg-secondary-light mt-16 bg-[var(--tg-secondary-dark)] p-24 text-center text-[14px] font-600">
    <BaseButton size="none" type="text">
      免费旋转并赢得真钱
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
</style>
