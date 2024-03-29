<script setup lang='ts'>
import type { IMemberBalanceLockerUpdate } from '~/apis/types'
import type { CurrencyData } from '~/composables/useCurrencyData'

// const closeDialog = inject('closeDialog', () => {})

const { t } = useI18n()
const appStore = useAppStore()
const { openNotify } = useNotify()
// const { exchangeRateData } = storeToRefs(appStore)
// const router = useLocalRouter()
// const { push } = useLocalRouter()

const activeCurrency = ref<any>()
const activeTab = ref('deposit')
const tabOptions = [
  { label: t('deposit'), value: 'deposit' },
  { label: t('menu_title_settings_withdrawals'), value: 'withdraw' },
]
const amountRef = ref()
const password = ref('')
const passwordRef = ref()

// 获取利率
const { data: interestConfig, runAsync: runAsyncInterestConfig } = useRequest(ApiMemberInterestGetConfig)
// 获取安全验证配置
// const { isOpenVerify, isSetAuth } = useBrandBaseDetail()
const { getComponent } = useUserVerify()
const {
  value: amount,
  errorMessage: errAmount,
  resetField: resetAmount,
  validate: validateAmount,
  setValue: setAmount,
} = useField<string>('amount', (value) => {
  if (!value)
    return t('min_amount_0')
  else if (Number(value) <= 0)
    return t('min_amount_0')
  else if (activeCurrency.value && Number(value) > Number(activeCurrency.value?.balance))
    maxNumber()
    // return t('validate_deposit_amount_max')
  return ''
})
// const {
//   value: password,
//   resetField: resetPassword,
//   validate: validatePassword,
//   errorMessage: errPassword,
// } = useField<string>('password', (value) => {
//   if (!value)
//     return t('min_len_6')
//   else if (!payPasswordReg.test(value))
//     return `${pwdLabel.value}${t('wrong_format')}` // t('safe_pwd_error')

//   return ''
// })

const isDeposit = computed(() => activeTab.value === 'deposit')
const updateType = computed(() => isDeposit.value ? 1 : 2)
const updateParams = computed<IMemberBalanceLockerUpdate | null>(() => {
  if (activeCurrency.value) {
    return {
      amount: amount.value,
      flag: updateType.value,
      currency_id: Number(activeCurrency.value.cur),
      device: 0,
    }
  }
  return null
})
// 当前币种配置
const vaultFig = computed(() => {
  if (interestConfig.value)
    return interestConfig.value.find(a => a.currency_id.toString() === activeCurrency.value?.cur)
  //     ?.interest_rate ?? 0
  // return 0
})
// const getUsRate = computed(() => {
//   const str: CurrencyCode = activeCurrency.value?.cur
//   if (str === '706')
//     return Number(amount.value).toFixed(2)
//   return str
//     ? (Number(exchangeRateData.value?.rates[str]['706']) * Number(amount.value)).toFixed(2)
//     : 0.00
// })

function renderSvg(text: string) {
  return `<svg aria-hidden="true" style="width:14px;height:14px;margin: 0 5px;">
          <use xlink:href="#icon-coin-${text}"/>
        </svg>`
}
const {
  run: runLockerUpdate,
  loading: lockerUpdateLoading,
} = useRequest(ApiMemberBalanceLockerUpdate, {
  async onSuccess() {
    openNotify({
      title: isDeposit.value
        ? t('finance_other_tab_vault_deposit')
        : t('finance_funds_vault_draw'),
      icon: 'navbar-cart-notify',
      message: isDeposit.value
        ? t('success_deposit',
          {
            amount: updateParams.value?.amount,
            icon: renderSvg(activeCurrency.value.type.toLocaleLowerCase()),
          })
        : t('confirm_draw_vault', {
          amount: updateParams.value?.amount,
          icon: renderSvg(activeCurrency.value.type.toLocaleLowerCase()),
        }),
    })
    reset()
    appStore.getBalanceData()
    appStore.getLockerData()
    passwordRef.value?.resetPassword()
  },
})

async function handleUpdate() {
  amountRef.value.setTouchTrue()
  if (passwordRef.value)
    passwordRef.value.setTouchTrue()
  await validateAmount()
  if (isDeposit.value) {
    if (!errAmount.value && updateParams.value) {
      if (Number(amount.value) < Number(vaultFig.value?.min_deposit ?? 0)) {
        openNotify({
          title: t('finance_other_tab_vault_deposit'),
          type: 'error',
          message: t('currency_min_deposit_amount', { amount: vaultFig.value?.min_deposit, icon: renderSvg(activeCurrency.value.type.toLocaleLowerCase()) }),
        })
      }
      else {
        runLockerUpdate(updateParams.value)
      }
    }
  }
  else {
    await passwordRef.value.validatePassword()
    if (!errAmount.value && !passwordRef.value.errPassword && updateParams.value)
      runLockerUpdate({ ...updateParams.value, password: password.value, auth_type: +passwordRef.value.authType })
  }
}
function changeCurrency(item: CurrencyData) {
  activeCurrency.value = item
  reset()
}
function maxNumber() {
  setAmount(activeCurrency.value.balance)
}
function reset() {
  resetAmount()
  setAmount(application.sliceOrPad(0, application.isVirtualCurrency(activeCurrency.value.type) ? 8 : 2), false)
}
function handleBlur() {
  setAmount(Number(amount.value).toFixed(application.isVirtualCurrency(activeCurrency.value.type) ? 8 : 2).toString(), true)
}

watch(() => activeTab.value, () => {
  amountRef.value?.setTouchFalse()
})

await application.allSettled([runAsyncInterestConfig()])

onMounted(() => {
  appStore.getLockerData()
})
</script>

<template>
  <div class="app-safe">
    <div class="safe-content">
      <BaseTab v-model="activeTab" :list="tabOptions" />
      <template v-if="getComponent && !isDeposit">
        <component :is="getComponent" :tip-text="$t('finance_funds_vault_draw')" />
      </template>
      <template v-else>
        <div class="center">
          <div class="flex-col-start">
            <span>{{ t('currency') }}</span>
            <AppSelectCurrency
              :type="isDeposit ? 1 : 2"
              @change="changeCurrency"
            />
          </div>
        </div>
        <div class="amount">
          <div class="top">
            <span v-show="isDeposit" class="label">{{ t('vault_pop_up_annual_interest_rate') + t('colon') }} {{ vaultFig?.interest_rate ?? 0 }}%</span>
            <span v-show="!isDeposit" class="label">{{ t('amount') }}</span>
          <!-- <span class="us">US${{ getUsRate }}</span> -->
          </div>
          <BaseInput
            ref="amountRef" v-model="amount"
            type="number"
            :msg="errAmount"
            msg-after-touched
            @blur="handleBlur"
            @on-right-button="maxNumber"
          >
            <template #right-icon>
              <AppCurrencyIcon v-if="activeCurrency" :currency-type="activeCurrency.type" />
            </template>
            <template #right-button>
              <span>{{ t('vault_pop_up_max_button') }}</span>
            </template>
          </BaseInput>
        </div>
        <BaseButton
          v-if="isDeposit"
          bg-style="secondary"
          size="xl"
          :loading="lockerUpdateLoading"
          style="font-size: var(--tg-font-size-base);"
          @click="handleUpdate"
        >
          {{ t('save_to_vault') }}
        </BaseButton>
        <template v-else>
          <AppPasswordInput ref="passwordRef" v-model="password" />
          <BaseButton
            style="font-size: var(--tg-font-size-base);"
            bg-style="secondary"
            size="xl"
            :loading="lockerUpdateLoading"
            @click="handleUpdate"
          >
            {{ t('draw_vault') }}
          </BaseButton>
        </template>
      </template>
    </div>
    <AppAuthWarp show-more />
  </div>
</template>

<style lang='scss' scoped>
.app-safe{
  .safe-content{
    padding: 0 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .flex-col-start{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    color: var(--tg-text-lightgrey);
    font-weight: var(--tg-font-weight-semibold);
    line-height: 21px;
  }
  .amount {
    display: flex;
    flex-direction: column;
    --tg-base-input-style-pad-x: var(--tg-spacing-7);
    .top {
      display: flex;
      justify-content: space-between;
      color: var(--tg-text-lightgrey);
      font-weight: var(--tg-font-weight-semibold);
      margin-bottom: var(--tg-spacing-4);
      .us {
        font-size: var(--tg-font-size-xs);
      }
    }
  }
}
</style>
