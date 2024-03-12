<script setup lang='ts'>
import type { CurrencyCode } from '~/composables/useCurrencyData'

interface Props {
  currencyId: CurrencyCode
  betAmount: string
  result: string
  settleAmount: string
}
defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <div class="w-full">
    <div class="bg-tg-secondary-dark xm:flex-row xm:grid xm:grid-cols-3 mb-4 w-full flex flex-col rounded-[4px] p-14">
      <div class="text-tg-text-lightgrey flex flex-col items-center p-7 text-[14px] font-semibold">
        <label class="leading-[1]">{{ t('menu_title_settings_bets') }}</label>
        <span class="text-tg-text-white xm:mt-7 flex items-center justify-end gap-4 text-[14px]">
          <AppAmount
            :amount="application.sliceOrPad(
              scientificToString(betAmount),
              application.getCurrencySuffixLength(getCurrencyConfigByCode(currencyId)?.name),
            )" :currency-type="getCurrencyConfigByCode(currencyId)?.name"
          />
        </span>
      </div>
      <div class="text-tg-text-lightgrey relative flex flex-col items-center p-7 text-[14px] font-semibold">
        <div
          class="bg-tg-secondary-grey xm:block absolute right-[100%] top-[50%] hidden h-[80%] w-2 translate-y-[-50%]"
        />
        <label class="leading-[1]">{{ t('multiple_count') }}</label>
        <span class="text-tg-text-white xm:mt-7 flex items-center justify-end gap-4 text-[14px]">
          {{ result ? `${toFixed(+result)}x` : '-' }}
        </span>
      </div>
      <div class="text-tg-text-lightgrey relative flex flex-col items-center p-7 text-[14px] font-semibold">
        <div
          class="xm:block bg-tg-secondary-grey absolute right-[100%] top-[50%] hidden h-[80%] w-2 translate-y-[-50%]"
        />
        <label class="leading-[1]">{{ t('my_bets_table_click_pop_up_payment_amount') }}</label>
        <span
          class="xm:mt-7 flex items-center justify-end gap-4 text-[14px]"
          :class="{ 'text-tg-text-green': +settleAmount >= 0 }"
        >
          {{
            application.sliceOrPad(
              scientificToString(settleAmount),
              application.getCurrencySuffixLength(getCurrencyConfigByCode(currencyId)?.name),
            )
          }}
          <AppCurrencyIcon :currency-type="getCurrencyConfigByCode(currencyId)?.name" />
        </span>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
