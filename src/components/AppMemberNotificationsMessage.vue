<script setup lang='ts'>
import type { EnumCurrencyKey } from '~/apis/types'

defineProps<{
  amount: string
  currencyType: EnumCurrencyKey
  lastWord: string
}>()
const languageStore = useLanguageStore()
const { userLanguage } = storeToRefs(languageStore)
const { t } = useI18n()
</script>

<template>
  <div v-if="userLanguage === 'th-TH'" class="flex items-center gap-[4px] leading-[1.5]">
    {{ amount }} <AppCurrencyIcon :currency-type="currencyType" /> {{ t('yours') }}{{ lastWord }}
  </div>
  <div v-else-if=" userLanguage === 'vi-VN' " class="flex items-center gap-[4px] leading-[1.5]">
    {{ amount }} <AppCurrencyIcon :currency-type="currencyType" /> {{ t('yours') }} {{ lastWord }}
  </div>
  <div v-else class="flex items-center gap-[4px] leading-[1.5]">
    {{ t('yours') }} {{ amount }} <AppCurrencyIcon :currency-type="currencyType" /> {{ lastWord }}
  </div>
</template>

<style lang='scss' scoped>

</style>
