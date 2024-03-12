<script lang="ts" setup>
import type { CurrencyCode, CurrencyData } from '~/composables/useCurrencyData'
import type { EnumCurrencyKey } from '~/apis/types'

interface Props {
  modelValue: EnumCurrencyKey
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const activeCurrency = ref<CurrencyData | null>()
const currentNetwork = ref('')
const { bool: showWallet, setBool: setShowWalletBool } = useBoolean(true)
const { bool: loadFirst, setFalse: setLoadFirstFalse } = useBoolean(true)
// const { getRate } = useExchangeRate()
const {
  // renderFinanceCurrencyList,
  currentCurrency,
  renderCurrencyList,
  getVirtualCurrencyContractType,
} = useCurrencyData()
const { brandBaseDetail, runAsyncBrandBaseDetail } = useBrandBaseDetail()
const {
  data: depositCurrency,
  runAsync: runAsyncDepositCurrency,
} = useRequest(ApiFinanceDepositCurrency, {
  onSuccess(data) {
    // const list = renderFinanceCurrencyList.value(data)
    // activeCurrency.value = list.find(item => item.type === props.modelValue) ?? list[0]
    // emit('update:modelValue', activeCurrency.value.type)
    // currentNetwork.value = getVirtualCurrencyContractType(activeCurrency.value.type)[0].value
    //     emit('update:modelValue', activeCurrency.value?.type)
    // currentNetwork.value = getVirtualCurrencyContractType(activeCurrency.value?.type as EnumCurrencyKey)[0].value
    if (!data?.find(item => item.currency_name === currentCurrency.value)) {
      const currentItem = renderCurrencyList.value.find(item => item.type === currentCurrency.value) as CurrencyData
      const { cur, type, balance } = currentItem
      depositCurrency.value?.unshift({
        currency_id: cur,
        currency_name: type,
        balance,
      })
    }
    activeCurrency.value = renderCurrencyList.value.find(item => item.type === (props.modelValue ?? currentCurrency.value)) as CurrencyData
    const { type, cur } = activeCurrency.value
    getBaseDetail(cur)
    emit('update:modelValue', type)
    currentNetwork.value = getVirtualCurrencyContractType(type)[0].value
  },
})

const isVirCurrency = computed(() => {
  if (activeCurrency.value)
    return application.isVirtualCurrency(activeCurrency.value.type)

  return false
})
const getMinDeposit = computed(() => {
  return Number(brandBaseDetail.value?.min_access.min_deposit ?? 0)
  // Number(getRate('USDT', props.modelValue ?? 'USDT', 8)?.targetNum) * Number(brandBaseDetail.value?.min_access.min_deposit ?? 0)
})

function changeCurrency(item: CurrencyData, network: string, isHand: boolean) {
  if (activeCurrency.value?.cur !== item.cur) {
    activeCurrency.value = item
    getBaseDetail(item.cur)
  }
  currentNetwork.value = network
  emit('update:modelValue', item.type)
  if (isHand)
    setLoadFirstFalse()
}
function handleShow(val: boolean) {
  setShowWalletBool(val)
}
function getBaseDetail(cur: CurrencyCode) {
  runAsyncBrandBaseDetail({ tag: 'base', cur })
}

await application.allSettled(
  [runAsyncDepositCurrency()],
)
</script>

<template>
  <div class="app-wallet-deposit">
    <AppSelectCurrency
      v-show="showWallet"
      class="mb-16"
      :type="4"
      :active-type="modelValue"
      :active-currency-list="depositCurrency"
      :show-balance="false"
      :network="isVirCurrency"
      placeholder="search"
      @change="changeCurrency"
    />
    <template v-if="activeCurrency">
      <template v-if="loadFirst">
        <AppVirtualDeposit
          v-if="isVirCurrency"
          :active-currency="activeCurrency"
          :current-network="currentNetwork"
          :min-deposit="getMinDeposit"
          @show="handleShow"
        />
        <AppFiatDeposit
          v-else
          :active-currency="activeCurrency"
          :min-deposit="getMinDeposit"
          @show="handleShow"
        />
      </template>
      <template v-else>
        <Suspense timeout="0">
          <AppVirtualDeposit
            v-if="isVirCurrency"
            :active-currency="activeCurrency"
            :current-network="currentNetwork"
            :min-deposit="getMinDeposit"
            @show="handleShow"
          />
          <AppFiatDeposit
            v-else
            :active-currency="activeCurrency"
            :min-deposit="getMinDeposit"
            @show="handleShow"
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

<style lang="scss" scoped>

</style>
