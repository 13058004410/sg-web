<script setup lang='ts'>
import { useDice } from 'feie-ui'

const { t } = useI18n()

const diceParams = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: 0,
})

function changeNonce(type: 'up' | 'down') {
  if (type === 'up')
    diceParams.value.nonce += 1

  else if (type === 'down' && diceParams.value.nonce > 0)
    diceParams.value.nonce -= 1
}
const {
  diceByteToNumber,
  diceResult,
  diceSeedToByte,
} = useDice(diceParams)

// 是否有结果
const hasResult = computed(() => diceResult.value !== 0)
</script>

<template>
  <!-- Plinko -->
  <BaseLabel :label="$t('client_seed')">
    <BaseInput v-model="diceParams.clientSeed" type="text" msg-after-touched />
  </BaseLabel>
  <BaseLabel :label="$t('server_seed')">
    <BaseInput v-model="diceParams.serverSeed" type="text" msg-after-touched />
  </BaseLabel>
  <BaseLabel :label="$t('present_sign')">
    <BaseInput
      v-model.number="diceParams.nonce" style="
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
    <div v-else class="w-full">
      <AppOriginalGamePartDiceResultComponent :key="diceResult" :result="diceResult" />
    </div>
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
      :key="`${diceParams.clientSeed}-${diceParams.nonce}-${diceParams.serverSeed}`"
      class="w-full flex flex-col gap-16"
    >
      <div class="w-full">
        <h6 class="text-tg-text-lightgrey mb-8 text-[14px] font-semibold leading-[1.5]">
          {{ t('verify_final_result') }}
        </h6>
        <div>
          <span class="text-tg-text-white text-[14px] font-semibold leading-[1.5] font-mono">{{ diceResult }}</span>
        </div>
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-8 text-[14px] font-semibold leading-[1.5]">
          {{ t('verify_social_casino_seeds_toBytes') }}
        </h6>
        <SeedToBytes v-if="diceSeedToByte" :list="diceSeedToByte" />
      </div>
      <div>
        <h6 class="text-tg-text-lightgrey mb-8 text-[14px] font-semibold leading-[1.5]">
          {{ t('verify_bytes_to_number') }}
        </h6>
        <BytesToNumber v-if="diceByteToNumber" :list="diceByteToNumber" />
      </div>
    </div>
  </template>
</template>

<style lang='scss' scoped>

</style>
