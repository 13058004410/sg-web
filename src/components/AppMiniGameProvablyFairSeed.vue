<script setup lang='ts'>
import { nanoid } from 'nanoid'

const { t } = useI18n()

const { value: newClientSeed, errorMessage: errorNCS } = useField<string>('newClientSeed', (v) => {
  if (!v)
    return t('this_field_is_required')

  return ''
}, { initialValue: nanoid().slice(0, 10) })
const dataObj = ref({
  active_casino_bets: '',
  active_client_seed: '',
  active_server_seed_hash: '',
  next_server_seed_hash: '',
  nonce: 0,
})

const { loading: detailLoading } = useRequest(ApiGameOriginalSeedDetail, {
  manual: false,
  onSuccess(res) {
    dataObj.value = res
  },
})
const { run: runClientSeedUpdate, loading: updateLoading } = useRequest(() => ApiGameOriginalSeedUpdate({ seed: newClientSeed.value }), {
  onSuccess(res) {
    dataObj.value = res
    newClientSeed.value = nanoid().slice(0, 10)
  },
})

function onClientSeedChange() {
  if (errorNCS.value)
    return

  dataObj.value = {
    active_casino_bets: '',
    active_client_seed: '',
    active_server_seed_hash: '',
    next_server_seed_hash: '',
    nonce: 0,
  }
  runClientSeedUpdate()
}
</script>

<template>
  <div class="flex flex-col gap-16 p-16">
    <div class="flex flex-col">
      <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
        {{ t('plinko_fairnesses_text1') }}
      </span>
      <AppCopyLine :loading="detailLoading || updateLoading" class="h-40" :msg="dataObj.active_client_seed" />
    </div>
    <div class="flex flex-col">
      <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
        {{ t('plinko_fairnesses_text2') }}
      </span>
      <AppCopyLine :loading="detailLoading || updateLoading" :msg="dataObj.active_server_seed_hash" />
    </div>
    <div class="flex flex-col">
      <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
        {{ t('plinko_fairnesses_text3') }}
      </span>
      <AppCopyLine :loading="detailLoading || updateLoading" hide-copy :msg="dataObj.nonce.toString()" />
    </div>
  </div>

  <div class="bg-tg-secondary-dark flex flex-col gap-16 p-16">
    <h3 class="text-tg-text-white text-center font-semibold leading-[1.5]">
      {{ t('plinko_fairnesses_text4') }}
    </h3>
    <div class="flex flex-col">
      <span class="text-tg-text-lightgrey mb-4 inline-block text-[14px] font-semibold leading-[1]">
        {{ t('plinko_fairnesses_text5') }}<span class="text-tg-text-error ml-4">*</span>
      </span>
      <div :class="{ 'opacity-50': detailLoading || updateLoading }">
        <BaseInput
          v-model="newClientSeed" :msg="errorNCS"
          style="
              --tg-base-input-right-button-bg:var(--tg-text-green);
              --tg-base-input-right-button-hover-bg:var(--tg-primary-success);
              --tg-base-input-right-button-color:var(--tg-text-black);
              --tg-base-input-right-button-min-width:12ch;
              --tg-base-input-right-button-max-width:100%;"
          @on-right-button="onClientSeedChange"
        >
          <template #right-button>
            {{ t('plinko_fairnesses_button') }}
          </template>
        </BaseInput>
      </div>
    </div>
    <div class="flex flex-col">
      <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
        {{ t('plinko_fairnesses_text6') }}
      </span>
      <AppCopyLine :loading="detailLoading || updateLoading" :msg="dataObj.next_server_seed_hash" />
    </div>
    <span v-if="dataObj.active_casino_bets" class="text-tg-text-lightgrey text-[14px] leading-[1.5]">
      {{ t('plinko_fairnesses_text7') }}
      <span class="text-tg-text-white font-semibold">
        {{ dataObj.active_casino_bets }}
      </span>
    </span>
  </div>
</template>

<style lang='scss' scoped>

</style>
