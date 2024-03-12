<script setup lang='ts'>
import type { CurrencyData } from '~/composables/useCurrencyData'
import type { IAvailableBalance } from '~/apis/types'
import AppMemberNotificationsMessage from '~/components/AppMemberNotificationsMessage.vue'

interface Props {
  activeCurrency: CurrencyData
  currentNetwork: string
  ableBalance?: IAvailableBalance
  minWithdraw: number
}

const props = defineProps<Props>()
const emit = defineEmits(['toHolder'])

const amountRef = ref()
const { t } = useI18n()
const { openNotify } = useNotify()
const { bool: showMaxAmount, setBool: setMaxAmount } = useBoolean(false)
const {
  value: address,
  errorMessage: addressMsg,
  validate: valiAddress,
  resetField: resetAddress,
} = useField<string>('address', (value) => {
  if (!value)
    // return t('this_field_is_required')
    return t('select_addr')
  return ''
})
const {
  value: memo,
  resetField: resetMemo,
} = useField<string>('address')
const getMaxAmount = computed(() =>
  toFixed(Number(props.ableBalance?.withdraw_balance ?? 0), 8),
)
const {
  value: amount,
  setValue: setAmount,
  errorMessage: amountMsg,
  validate: valiAmount,
  resetField: amountReset,
} = useField<string>('amount', (value) => {
  if (!value) {
    return t('input_amount')
  }
  else if (Number(value) === 0) {
    return t('validate_deposit_amount_zero')
  }
  else if (Number(value) < props.minWithdraw) {
    return `${t('min_amount_is')}${toFixed(props.minWithdraw, 8)}`
    // return t('validate_deposit_amount_pos')
  }
  else if (value && Number(value) > Number(props.ableBalance?.withdraw_balance)) {
    setAmount(getMaxAmount.value)
    setMaxAmount(true)
  }
  return ''
})
const paypwd = ref('')
const passwordRef = ref()
const {
  data: walletList,
  runAsync: runAsyncWalletList,
} = useRequest(ApiFinanceWithdrawWallet, {
  onSuccess(data) {
    const temp = data?.d?.find(i => i.is_default === 1 && i.state !== 2)?.id
    if (temp)
      address.value = temp
  },
})
const {
  runAsync: runAsyncWithdrawMethodList,
  data: withdrawMethodList,
} = useRequest(ApiFinanceWithdrawMethodList)

const defaultAddress = computed(() => {
  return walletList.value?.d?.find(i => i.id === address.value)
})
const {
  runAsync: runAsyncWithdrawCoin,
} = useRequest(ApiFinanceWithdrawCoin, {
  onSuccess(data, params) {
    // openNotify({
    //   type: 'success',
    //   message: t('withdraw_apply_success'),
    // })
    openNotify({
      type: 'wallet',
      title: t('withdraw_in_process'),
      message: () => h(AppMemberNotificationsMessage, { amount: params[0].amount, currencyType: props.activeCurrency.type, lastWord: t('withdraw_in_process_now') }),
    })
    defaultAddress.value?.is_default !== 1 && resetAddress()
    reset()
    passwordRef.value.resetPassword()
  },
})

const addrOptions = computed(() => {
  if (walletList.value && walletList.value.d) {
    return walletList.value.d.map((i) => {
      return {
        label: i.address,
        value: i.id,
        state: i.state,
        disabled: i.state === 2,
      }
    })
  }
  return []
})
function maxNumber() {
  setAmount(getMaxAmount.value)
  setMaxAmount(false)
}
async function handleWithdraw() {
  if (amountRef.value)
    amountRef.value.setTouchTrue()
  await valiAddress()
  await valiAmount()
  passwordRef.value.setTouchTrue()
  await passwordRef.value.validatePassword()
  if (!addressMsg.value && !amountMsg.value && !passwordRef.value.errPassword) {
    runAsyncWithdrawCoin({
      currency_id: Number(props.activeCurrency.cur),
      contract_id: props.currentNetwork,
      amount: amount.value,
      pay_password: paypwd.value,
      wallet_id: address.value,
      auth_type: Number(passwordRef.value.authType),
      auth_code: paypwd.value,
      memo: memo.value || undefined,
    })
  }
}
function reset() {
  amountReset()
  resetMemo()
  setMaxAmount(false)
  setAmount(application.sliceOrPad(0, application.isVirtualCurrency(props.activeCurrency.type) ? 8 : 2), false)
}
function handleBlur() {
  setAmount(toFixed(Number(amount.value ?? 0), 8))
}

watch(() => props.currentNetwork, () => {
  if (props.currentNetwork) {
    runAsyncWithdrawMethodList({ currency_id: props.activeCurrency.cur, contract_id: props.currentNetwork })
    resetAddress()
    passwordRef.value?.resetPassword()
    runAsyncWalletList({
      contract_type: props.currentNetwork,
      currency_id: props.activeCurrency.cur,
    })
    reset()
  }
})

setAmount('0.00000000')

await application.allSettled(
  [
    runAsyncWithdrawMethodList({ currency_id: props.activeCurrency.cur, contract_id: props.currentNetwork }),
    runAsyncWalletList({
      contract_type: props.currentNetwork,
      currency_id: props.activeCurrency.cur,
    }),
  ],
)
</script>

<template>
  <div>
    <template v-if="withdrawMethodList?.length">
      <!-- 虚拟币提款 -->
      <div v-if="addrOptions.length" class="app-withdraw">
        <BaseLabel
          :label="`${activeCurrency?.type}${t('address')}`"
          :current-currency="activeCurrency?.type"
          must
        >
          <BaseSelect
            v-model="address"
            :options="addrOptions"
            :msg="addressMsg"
            popper small border
            popper-clazz="app-with"
            style="--tg-base-select-popper-style-padding-y: var(--tg-spacing-9)"
            @focus="addressMsg && resetAddress()"
          >
            <template #label>
              <div style="min-height: 18px;">
                {{ defaultAddress?.address }}
              </div>
            </template>
            <template #option="{ data: { item, parentWidth } }">
              <div :style="{ width: `${parentWidth}px` }">
                {{ item.label }}
              </div>
            </template>
          </BaseSelect>
        </BaseLabel>
        <BaseLabel v-if="activeCurrency.type === 'XRP'" :label="t('label')">
          <BaseInput v-model="memo" type="text" />
        </BaseLabel>
        <BaseLabel v-if="activeCurrency.type === 'EOS'" :label="t('memorandum')">
          <BaseInput v-model="memo" type="text" />
        </BaseLabel>
        <div class="amount">
          <div class="top">
            <span class="label">{{ t('amount') }}
              <span style="color: var(--tg-text-error);">*</span></span>
            <!-- <span class="us">US${{ application.numberToLocaleString(Number(getUsRate)) }}</span> -->
          </div>
          <BaseInput
            ref="amountRef"
            v-model="amount"
            type="text"
            :msg="amountMsg"
            msg-after-touched
            @blur="handleBlur"
            @on-right-button="maxNumber"
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
              {{ $t('withdrawals_require_turnover') }} {{ toFixed(Number(ableBalance?.remaining_balance ?? 0), 8) }}
            </div>
          </div>
        </div>
        <AppPasswordInput ref="passwordRef" v-model="paypwd" />
        <BaseButton bg-style="secondary" size="md" @click="handleWithdraw">
          {{ t('confirm_withdrawal') }}
        </BaseButton>
        <!-- <div class="tips">
            <span>{{ t('withdrawal_min_amount') }} 0.00020000</span>
            <AppCurrencyIcon class="currency-icon"
            :currency-type="activeCurrency?.type" />
            <span>。{{ t('withdrawal_fee_tip') }}0.00007000</span>
            <AppCurrencyIcon class="currency-icon"
            :currency-type="activeCurrency?.type" />
            <span>{{ t('withdrawal_as_fee') }}。</span>
          </div> -->
      </div>
      <!-- 虚拟币地址添加 -->
      <template v-else>
        <div class="layout-spacing not-payment-msg">
          <div class="msg-warp">
            <BaseIcon style="font-size: var(--tg-font-size-base);" name="uni-warning-color" class="search-icon" />
            <div>
              <div style="margin-bottom: 4px;">
                {{ t('not_payment_information_currency') }}
              </div>
              <div>{{ t('please_go_package_bind_payment_information') }}</div>
            </div>
          </div>
          <BaseButton bg-style="secondary" size="md" @click="emit('toHolder')">
            {{ t('go_card_pack') }}
          </BaseButton>
        </div>
      </template>
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
.app-withdraw {
  display: flex;
  flex-direction: column;
  gap: var(--tg-spacing-16);
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
  .amount-max-tip{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: var(--tg-font-size-xs);
    color: var(--tg-text-error-sub);
    padding-top: var(--tg-spacing-8);
    gap: var(--tg-spacing-4);
  }

}
  .not-payment-msg{
    gap: 16px;
    .msg-warp{
      display: flex;
      width: 100%;
      gap: 4px;
      justify-content: center;
      padding: 27px 0;
      border: var(--tg-border-width-sm) dashed var(--tg-secondary-light);
      border-radius: var(--tg-radius-sm);
      background-color: var(--tg-secondary-dark);
      font-size: var(--tg-font-size-default);
    }
  }
</style>
