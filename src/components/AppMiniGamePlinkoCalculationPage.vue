<script setup lang='ts'>
import { usePlinko } from 'feie-ui'

const { t } = useI18n()

const plinkoParams = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: 0,
  line: 16,
  level: 'low',
})
const levelList = [
  { value: 'low', label: t('plinko_level1') },
  { value: 'middle', label: t('plinko_level2') },
  { value: 'high', label: t('plinko_level3') },
]
const rowList = [
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
  { value: 13, label: '13' },
  { value: 14, label: '14' },
  { value: 15, label: '15' },
  { value: 16, label: '16' },
]
function changeNonce(type: 'up' | 'down') {
  if (type === 'up')
    plinkoParams.value.nonce += 1

  else if (type === 'down' && plinkoParams.value.nonce > 0)
    plinkoParams.value.nonce -= 1
}
const {
  plinkoPay,
  plinkoResultList,
  plinkoOdds,
  plinkoSeedToByte,
  plinkoByteToNumber,
  plinkoResult,
  plinkoMulNum,
} = usePlinko(plinkoParams)
const prizeIndex = computed(() => {
  if (plinkoPay.value && plinkoPay.value.length > 0) {
    const str = plinkoPay.value.join(' + ')
    return str
  }
  return ''
})

// 是否有结果
const hasResult = computed(() => plinkoMulNum.value !== 0)
</script>

<template>
  <!-- Plinko -->
  <BaseLabel :label="$t('client_seed')">
    <BaseInput v-model="plinkoParams.clientSeed" type="text" msg-after-touched />
  </BaseLabel>
  <BaseLabel :label="$t('server_seed')">
    <BaseInput v-model="plinkoParams.serverSeed" type="text" msg-after-touched />
  </BaseLabel>
  <BaseLabel :label="$t('present_sign')">
    <BaseInput
      v-model.number="plinkoParams.nonce" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        "
    >
      <template #right>
        <div class="relative flex">
          <div
            class="bg-tg-secondary active:bg-tg-secondary-dark group-hover:bg-tg-text-grey-hover flex items-center px-20 py-15"
            style="--tg-icon-color:var(--tg-text-white)" @click="changeNonce('down')"
          >
            <BaseIcon name="uni-arrow-down" />
          </div>
          <div
            class="bg-tg-secondary active:bg-tg-secondary-dark group-hover:bg-tg-text-grey-hover flex items-center px-20 py-15"
            style="--tg-icon-color:var(--tg-text-white)" @click="changeNonce('up')"
          >
            <BaseIcon name="uni-arrow-up-small2" />
          </div>
          <div class="bg-tg-primary absolute left-53 top-11 h-22 w-2" />
        </div>
      </template>
    </BaseInput>
  </BaseLabel>
  <BaseLabel :label="$t('plinko_risk')">
    <BaseSelect
      v-model="plinkoParams.level" :options="levelList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
    />
  </BaseLabel>
  <BaseLabel :label="$t('plinko_rows')">
    <BaseSelect
      v-model="plinkoParams.line" :options="rowList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
    />
  </BaseLabel>

  <!-- 结果 -->
  <div class="border-tg-secondary min-h-200 flex flex-col items-center justify-center gap-16 border-2 rounded-[4px] border-dotted p-16">
    <template v-if="!hasResult">
      <div class="text-[14px] leading-[1.5]">
        {{ $t('more_input_required_verify_results') }}
      </div>
      <div class="ani-roll">
        <BaseIcon style="--tg-icon-color:var(--tg-text-white);" name="uni-dice" />
      </div>
    </template>

    <!-- result -->
    <ResultPlinko
      v-if=" hasResult" :key="`${plinkoResult}-${plinkoMulNum}-${plinkoParams.line}`" class="mx-auto" :index="plinkoResult"
      :result="(+plinkoMulNum).toFixed(1).toString()"
      :row="plinkoParams.line.toString()"
    />
  </div>

  <!-- 计算明细 -->
  <div v-if="!hasResult" class="min-h-200 flex flex-col items-center justify-center gap-16 rounded-[4px] p-16">
    <div class="ani-roll">
      <BaseIcon style="--tg-icon-color:var(--tg-text-white);" name="uni-dice" />
    </div>
  </div>

  <!-- 有数据 -->
  <template v-if="hasResult">
    <div
      :key="`${plinkoParams.clientSeed}-${plinkoParams.level}-${plinkoParams.line}-${plinkoParams.nonce}-${plinkoParams.serverSeed}`"
      class="w-full flex flex-col gap-16"
    >
      <div class="w-full">
        <h6 class="text-tg-text-lightgrey mb-8 text-[14px] font-semibold leading-[1.5]">
          {{ t('verify_final_result') }}
        </h6>
        <div class="max-w-full w-full overflow-x-scroll">
          <span v-if="plinkoPay && plinkoPay.length > 0" class="text-tg-text-white text-[14px] font-semibold leading-[1.5] font-mono">
            {{ t('verify_prize_index') }}{{ prizeIndex }} = {{ plinkoResult }}
          </span>
          <table class="mt-16 w-full">
            <tbody>
              <tr>
                <td
                  v-for="n, i in plinkoResultList" :key="i" :class="{ 'pl-16': i > 0 }"
                  class="text-tg-text-white text-center text-[14px] font-semibold leading-[1.5] font-mono"
                >
                  {{ n }}
                </td>
              </tr>
              <tr>
                <td
                  v-for="n, i in plinkoOdds" :key="i" :class="{ 'pl-16': i > 0 }"
                  class="text-tg-text-white text-center text-[14px] font-semibold leading-[1.5] font-mono"
                >
                  {{ n }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-8 text-[14px] font-semibold leading-[1.5]">
          {{ t('verify_social_casino_seeds_toBytes') }}
        </h6>
        <SeedToBytes v-if="plinkoSeedToByte" :list="plinkoSeedToByte" />
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-8 text-[14px] font-semibold leading-[1.5]">
          {{ t('verify_bytes_to_number') }}
        </h6>
        <BytesToNumber v-if="plinkoByteToNumber" :list="plinkoByteToNumber" />
      </div>
    </div>
  </template>
</template>

<style lang='scss' scoped>

</style>
