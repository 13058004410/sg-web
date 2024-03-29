<script setup lang='ts'>
import type { CurrencyData } from '~/composables/useCurrencyData'
import type { IAvailableBalance } from '~/apis/types'
import AppMemberNotificationsMessage from '~/components/AppMemberNotificationsMessage.vue'

interface Props {
  /** 货币对象 */
  activeCurrency: CurrencyData
  ableBalance?: IAvailableBalance
  minWithdraw: number
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['toHolder'])

const amountRef = ref()
const passwordRef = ref()
const payPassword = ref('')
const { t } = useI18n()
const { openNotify } = useNotify()
/** '1' 银行卡， '2' pix 除了巴西其他国家都是银行卡 */
const currentType = computed<'1' | '2'>(() =>
  props.activeCurrency.cur === '702' ? '2' : '1',
)
const { bool: showMaxAmount, setBool: setMaxAmount } = useBoolean(false)
const {
  value: selectBank,
  errorMessage: selectBankError,
  validate: selectBankValidate,
  resetField: selectBankReset,
} = useField<string>('selectBank', (value) => {
  if (!value)
    return currentType.value === '1' ? t('choose_draw_bank') : t('pls_select_pix')
  return ''
})
const getMaxAmount = computed(() =>
  toFixed(Number(props.ableBalance?.withdraw_balance ?? 0), 2),
)
const {
  value: amount,
  errorMessage: amountError,
  validate: amountValidate,
  setValue: setAmount,
  resetField: amountReset,
} = useField<string>('amount', (value) => {
  if (!value) {
    return t('input_amount')
  }
  else if (Number(value) === 0) {
    return `${t('validate_amount')}0`
  }
  else if (Number(value) < props.minWithdraw) {
    return `${t('min_amount_is')}${toFixed(props.minWithdraw, 2)}`
    // return t('validate_deposit_amount_pos')
  }
  else if (value && Number(value) > Number(props.ableBalance?.withdraw_balance)) {
    setAmount(getMaxAmount.value)
    setMaxAmount(true)
  }
  // return t('validate_deposit_amount_max')
  return ''
})

const {
  runAsync: runAsyncWithdrawMethodList,
  data: withdrawMethodList,

} = useRequest(ApiFinanceWithdrawMethodList)
const {
  runAsync: runAsyncWithdrawBankcard,
  data: withdrawBankcardList,
} = useRequest(ApiFinanceWithdrawBankcard, {
  onSuccess(data) {
    const temp = data.d.find(i => i.is_default === 1 && i.state !== 2)?.bank_account
    if (temp)
      selectBank.value = temp
    else
      selectBankReset()
  },
})
const {
  run: runWithdraw,
} = useRequest(ApiFinanceWithdraw, {
  onSuccess(data, params) {
    openNotify({
      type: 'wallet',
      title: t('withdraw_in_process'),
      message: () => h(AppMemberNotificationsMessage, { amount: params[0].amount, currencyType: props.activeCurrency.type, lastWord: t('withdraw_in_process_now') }),
    })
    setDefaultBankVal()
    amountReset()
    setMaxAmount(false)
    passwordRef.value.resetPassword()
  },
})

const bindBanks = computed(() => {
  if (withdrawBankcardList.value && withdrawBankcardList.value.d) {
    return withdrawBankcardList.value.d.map((item) => {
      // if (item.is_default === 1)
      //   selectBank.value = item.bank_account
      return {
        label: item.bank_name,
        value: item.bank_account,
        icon: 'fiat-bank',
        name: item.open_name,
        fullName: `${item.bank_name} ${item.bank_account}`,
        id: item.id,
        state: item.state,
        disabled: item.state === 2,
      }
    })
  }
  return []
})
const defaultBank = computed(() =>
  bindBanks.value.find(a => a.value === selectBank.value)?.fullName ?? '',
)
const bankcardId = computed(() =>
  bindBanks.value.find(a => a.value === selectBank.value)?.id ?? '',
)
// const getMaxAmount = computed(() =>
//   toFixed(Number(props.ableBalance?.withdraw_balance ?? 0)),
// )
// const getUsRate = computed(() => {
//   const str: CurrencyCode = props.activeCurrency.cur
//   if (str === '706')
//     return Number(amount.value).toFixed(2)
//   return str
//     ? (Number(exchangeRateData.value?.rates[str]['706']) * Number(amount.value ?? 0)).toFixed(2)
//     : 0.00
// })

function maxNumber() {
  setMaxAmount(false)
  setAmount(getMaxAmount.value)
}
function setDefaultBankVal() {
  const temp = withdrawBankcardList.value?.d.find(i => i.is_default === 1 && i.state !== 2)?.bank_account
  if (temp)
    selectBank.value = temp
  else
    selectBankReset()
}
async function withDrawSubmit() {
  if (amountRef.value)
    amountRef.value.setTouchTrue()
  await selectBankValidate()
  await amountValidate()
  passwordRef.value.setTouchTrue()
  await passwordRef.value.validatePassword()
  if (!selectBankError.value && !amountError.value && !passwordRef.value.errPassword) {
    runWithdraw({
      currency_id: Number(props.activeCurrency.cur),
      // method_id: currentWithdrawMethod.value,
      method_id: withdrawMethodList.value ? withdrawMethodList.value[0].id : '',
      amount: amount.value,
      pay_password: payPassword.value,
      bankcard_id: bankcardId.value,
      auth_type: Number(passwordRef.value.authType),
      auth_code: payPassword.value,
    })
  }
}
function formatAmount() {
  setAmount(toFixed(Number(amount.value ?? 0), 2))
}

watch(() => props.activeCurrency, (newValue) => {
  amountReset()
  setMaxAmount(false)
  passwordRef.value?.resetPassword()
  runAsyncWithdrawBankcard({ currency_id: newValue.cur })
  runAsyncWithdrawMethodList({ currency_id: newValue.cur })
})

await application.allSettled(
  [
    runAsyncWithdrawBankcard({ currency_id: props.activeCurrency.cur }),
    runAsyncWithdrawMethodList({ currency_id: props.activeCurrency.cur }),
  ],
)
</script>

<template>
  <div class="app-fiat-withdrawal">
    <template v-if="withdrawMethodList?.length">
      <!-- 绑定银行卡/三方账户 -->
      <div v-if="!withdrawBankcardList?.d?.length" class="layout-spacing not-payment-msg">
        <div class="msg-warp">
          <BaseIcon style="font-size: var(--tg-font-size-base);" name="uni-warning-color" />
          <div>
            <div style="margin-bottom: var(--tg-spacing-4);">
              {{ t('no_withdraw_information_about_the_currency') }}
            </div>
            <div>{{ t('please_go_card_wallet_bind_withdraw_information') }}</div>
          </div>
        </div>
        <BaseButton bg-style="secondary" size="md" @click="emit('toHolder')">
          {{ t('go_card_wallet') }}
        </BaseButton>
      </div>
      <!-- 出款信息 -->
      <div v-else class="withdrawal-wrap">
        <div class="withdrawal-info">
          <BaseLabel
            :label="currentType === '1' ? t('withdraw_bank') : t('pix_account')"
            must
          >
            <BaseSelect
              v-model="selectBank"
              :options="bindBanks"
              :msg="selectBankError"
              must popper border
              :style="{
                '--tg-base-select-popper-style-padding-y':
                  'var(--tg-spacing-9)',
              }"
              @focus="selectBankError && selectBankReset()"
            >
              <template #label>
                <div style="min-height: 18px;">
                  {{ defaultBank }}
                </div>
              </template>
              <template #option="{ data: { item, parentWidth } }">
                <div :style="{ width: `${parentWidth}px` }">
                  {{ `${item.label} ${item.value}` }}
                </div>
              </template>
            </BaseSelect>
          </BaseLabel>
          <div class="amount">
            <div class="top">
              <span class="label">{{ t('amount') }}
                <span style="color: var(--tg-text-error);">*</span></span>
            </div>
            <BaseInput
              ref="amountRef"
              v-model="amount"
              :msg="amountError"
              type="text"
              msg-after-touched
              @on-right-button="maxNumber"
              @blur="formatAmount"
            >
              <template #right-icon>
                <AppCurrencyIcon :currency-type="activeCurrency?.type" />
              </template>
              <template #right-button>
                <span>{{ t('max') }}</span>
              </template>
            </BaseInput>
            <div v-show="showMaxAmount && ableBalance?.remaining_balance !== '0'" class="amount-max-tip">
              <div>{{ $t('withdrawal_amount') }} {{ getMaxAmount }}</div>
              <div>
                {{ $t('withdrawals_require_turnover') }} {{ toFixed(Number(ableBalance?.remaining_balance ?? 0), 2) }}
              </div>
            </div>
          </div>
          <AppPasswordInput ref="passwordRef" v-model="payPassword" />
          <BaseButton bg-style="secondary" size="md" @click="withDrawSubmit">
            {{ t('confirm_withdrawal') }}
          </BaseButton>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="layout-spacing not-payment-msg">
        <div class="msg-warp">
          <BaseIcon style="font-size: var(--tg-font-size-base);" name="uni-warning-color" />
          <div>
            <div style="margin-bottom: var(--tg-spacing-4);">
              {{ t('currently_withdraw_channel_currency') }}
            </div>
            <div>{{ t('please_again_later_contact_customer_service') }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang='scss' scoped>
.app-fiat-withdrawal{
  .amount {
    display: flex;
    flex-direction: column;

    .top {
      display: flex;
      justify-content: space-between;
      font-weight: var(--tg-font-weight-semibold);
      margin-bottom: var(--tg-spacing-4);

      .us {
        font-size: var(--tg-font-size-xs);
      }
    }
  }
  .withdrawal-wrap{
    display: flex;
    flex-direction: column;
    gap:  var(--tg-spacing-16);
    .withdrawal-info{
      display: flex;
      flex-direction: column;
      gap: var(--tg-spacing-16);
      .popper-label{
        display: flex;
        align-items: center;
        gap: .25rem;
      }
    }
  }
  .amount-max-tip{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: var(--tg-font-size-xs);
    color: var(--tg-text-error-sub);
    padding-top: var(--tg-spacing-8);
    gap: var(--tg-spacing-4);
  }
  .not-payment-msg{
    gap: 16px;
    .msg-warp{
      display: flex;
      width: 100%;
      gap: var(--tg-spacing-4);
      justify-content: center;
      padding: 27px 0;
      border: var(--tg-border-width-sm) dashed var(--tg-secondary-light);
      border-radius: var(--tg-radius-sm);
      background-color: var(--tg-secondary-dark);
      font-size: var(--tg-font-size-default);
    }
  }

}
</style>
