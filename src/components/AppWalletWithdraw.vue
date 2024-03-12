<script lang="ts" setup>
import type { CurrencyCode, CurrencyData } from '~/composables/useCurrencyData'
import type { EnumCurrencyKey } from '~/apis/types'

interface Props {
  modelValue: EnumCurrencyKey
}

const props = defineProps<Props>()
const emit = defineEmits(['toHolder', 'update:modelValue'])
const { userInfo } = storeToRefs(useAppStore())
const activeCurrency = ref<CurrencyData | null>()
const currentNetwork = ref('')
const { bool: loadFirst, setFalse: setLoadFirstFalse } = useBoolean(true)
const { brandBaseDetail, runAsyncBrandBaseDetail } = useBrandBaseDetail()
const {
  currentCurrency,
  renderCurrencyList,
  getVirtualCurrencyContractType,
} = useCurrencyData()
const {
  data: withdrawBalance,
  run: runWithdrawBalance,
  // loading: loadingWithdrawBalance,
} = useRequest(ApiFinanceWithdrawBalance)
const {
  data: withdrawCurrency,
  runAsync: runAsyncWithdrawCurrency,
} = useRequest(ApiFinanceWithdrawCurrency, {
  onSuccess(data) {
    // const list = renderFinanceCurrencyList.value(data)
    // activeCurrency.value = list.find(item => item.type === props.modelValue) ?? list[0]
    // emit('update:modelValue', activeCurrency.value.type)
    // currentNetwork.value = getVirtualCurrencyContractType(activeCurrency.value.type)[0].value
    if (!data?.find(item => item.currency_name === currentCurrency.value)) {
      const currentItem = renderCurrencyList.value.find(item => item.type === currentCurrency.value) as CurrencyData
      const { cur, type, balance } = currentItem
      withdrawCurrency.value?.unshift({
        currency_id: cur,
        currency_name: type,
        balance,
      })
    }
    activeCurrency.value = renderCurrencyList.value.find(item => item.type === (props.modelValue ?? currentCurrency.value)) as CurrencyData
    const { type, cur } = activeCurrency.value
    getBaseDetail(cur)
    getWithdrawBalance()
    emit('update:modelValue', type)
    const network = getVirtualCurrencyContractType(type)
    currentNetwork.value = network ? network[0]?.value : ''
  },
})

const isVirCurrency = computed(() => {
  if (activeCurrency.value)
    return application.isVirtualCurrency(activeCurrency.value.type)

  return false
})
const getMinWithdraw = computed(() => {
  return Number(brandBaseDetail.value?.min_access.min_withdraw ?? 0)
  // Number(getRate('USDT', props.modelValue ?? 'USDT', 8)?.targetNum) * Number(brandBaseDetail.value?.min_access.min_withdraw ?? 0)
})

function changeCurrency(item: CurrencyData, network: string, isHand: boolean) {
  if (activeCurrency.value?.cur !== item.cur) {
    activeCurrency.value = item
    getBaseDetail(item.cur)
    getWithdrawBalance()
  }
  currentNetwork.value = network
  emit('update:modelValue', item.type)
  if (isHand)
    setLoadFirstFalse()
}
function getWithdrawBalance() {
  activeCurrency.value && runWithdrawBalance({
    currency_id: activeCurrency.value.cur,
  })
}
function handleReBalance() {
  setTimeout(() => {
    activeCurrency.value && getWithdrawBalance()
  }, 5000)
  runAsyncWithdrawCurrency()
}
function getBaseDetail(cur: CurrencyCode) {
  runAsyncBrandBaseDetail({ tag: 'base', cur })
}

watch(() => [userInfo.value.balanceData], () => {
  handleReBalance()
})

await application.allSettled(
  [runAsyncWithdrawCurrency()],
)
</script>

<template>
  <div class="app-wallet-withdraw">
    <AppSelectCurrency
      class="mb-16"
      :type="4"
      :active-currency-list="withdrawCurrency"
      :active-type="modelValue"
      :show-balance="true"
      :network="isVirCurrency"
      placeholder="search"
      @change="changeCurrency"
    />
    <template v-if="activeCurrency">
      <template v-if="loadFirst">
        <AppWithdraw
          v-if="isVirCurrency"
          :able-balance="withdrawBalance"
          :active-currency="activeCurrency"
          :current-network="currentNetwork"
          :min-withdraw="getMinWithdraw"
          @to-holder="emit('toHolder')"
        />
        <AppFiatWithdrawal
          v-else
          :able-balance="withdrawBalance"
          :active-currency="activeCurrency"
          :min-withdraw="Number(toFixed(getMinWithdraw, 2))"
          @to-holder="emit('toHolder')"
        />
      </template>
      <template v-else>
        <Suspense timeout="0">
          <AppWithdraw
            v-if="isVirCurrency"
            :able-balance="withdrawBalance"
            :active-currency="activeCurrency"
            :current-network="currentNetwork"
            :min-withdraw="getMinWithdraw"
            @to-holder="emit('toHolder')"
          />
          <AppFiatWithdrawal
            v-else
            :able-balance="withdrawBalance"
            :active-currency="activeCurrency"
            :min-withdraw="Number(toFixed(getMinWithdraw, 2))"
            @to-holder="emit('toHolder')"
          />
          <template #fallback>
            <div class="center dialog-loading-height">
              <BaseLoading />
            </div>
          </template>
        </Suspense>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
