<script setup lang='ts'>
import { GAMES_LIST, usePlinko } from 'feie-ui'

interface Props {
  game: string
  clientSeed: string
  serverSeed: string
  nonce: number
  gameData?: {
    [k: string]: any
  }
}

const props = defineProps<Props>()
const emit = defineEmits([
  'update:game',
  'update:clientSeed',
  'update:serverSeed',
  'update:nonce',
])

const { t } = useI18n()
const closeDialog = inject('closeDialog', () => { })
const { push } = useLocalRouter()

const _game = ref(props.game)
const plinkoParams = ref({
  clientSeed: props.clientSeed,
  serverSeed: props.serverSeed,
  nonce: props.nonce,
  level: props.gameData?.risk ?? 'low',
  line: props.gameData?.row ? +props.gameData?.row : 16,
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
const { plinkoResult, plinkoMulNum } = usePlinko(plinkoParams)
const hasResult = computed(() => plinkoMulNum.value !== 0)

function changeNoncePlinko(type: 'up' | 'down') {
  if (type === 'up')
    plinkoParams.value.nonce += 1

  else if (type === 'down' && plinkoParams.value.nonce > 0)
    plinkoParams.value.nonce -= 1
}
function onGameSelect(v: string) {
  emit('update:game', v)
}
function onClientSeedInput(v: string) {
  emit('update:clientSeed', v)
}
function onServerSeedInput(v: string) {
  emit('update:serverSeed', v)
}
function onNonceInput(v: number) {
  emit('update:nonce', +v)
}
// 查看计算细目
function checkFairnessesCalcButton() {
  push(`/provably-fair/calculation?game=${_game.value}`)
  closeDialog()
}
</script>

<template>
  <div>
    <!-- top -->
    <div class="flex flex-col gap-16 p-16">
      <div
        class="border-tg-secondary text-lfet min-h-200 flex flex-col items-center justify-center border-2 rounded-[8px] border-dotted p-16"
      >
        <!-- no result -->
        <div v-show="!hasResult" class="flex flex-col items-center">
          <span class="text-tg-text-grey-light text-[14px] leading-[1.5]">
            {{ t('plinko_fairnesses_verifyText1') }}
          </span>
          <BaseIcon class="plinko-icon-loading mt-16 block" name="chess-plinko" />
        </div>
        <!-- result -->
        <ResultPlinko
          v-if="hasResult" :key="`${plinkoResult}-${plinkoMulNum}-${plinkoParams.line}`" class="mx-auto" :index="plinkoResult"
          :result="(+plinkoMulNum).toFixed(1).toString()"
          :row="plinkoParams.line.toString()"
        />
      </div>
    </div>

    <div class="bg-tg-secondary-dark flex flex-col gap-16 p-16">
      <div class="flex flex-col">
        <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
          {{ t('plinko_verifyTexts_game') }}
        </span>
        <BaseSelect
          v-model="_game" :options="GAMES_LIST" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        " @select="onGameSelect"
        />
      </div>
      <div class="flex flex-col">
        <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
          {{ t('plinko_verifyTexts_clientSeed') }}
        </span>
        <BaseInput
          v-model="plinkoParams.clientSeed" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        "
          @input="onClientSeedInput"
        />
      </div>
      <div class="flex flex-col">
        <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
          {{ t('plinko_verifyTexts_serverSeed') }}
        </span>
        <BaseInput
          v-model="plinkoParams.serverSeed" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        "
          @input="onServerSeedInput"
        />
      </div>
      <div class="flex flex-col">
        <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
          {{ t('plinko_verifyTexts_nonce') }}
        </span>
        <div class="flex">
          <BaseInput
            v-model.number="plinkoParams.nonce" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        "
            type="number" @input="onNonceInput"
          >
            <template #right>
              <div class="relative flex">
                <div
                  class="bg-tg-secondary active:bg-tg-secondary-dark group-hover:bg-tg-text-grey-hover flex items-center px-20 py-15"
                  style="--tg-icon-color:var(--tg-text-white)"
                  @click="changeNoncePlinko('down')"
                >
                  <BaseIcon name="uni-arrow-down" />
                </div>
                <div
                  class="bg-tg-secondary active:bg-tg-secondary-dark group-hover:bg-tg-text-grey-hover flex items-center px-20 py-15"
                  style="--tg-icon-color:var(--tg-text-white)"
                  @click="changeNoncePlinko('up')"
                >
                  <BaseIcon name="uni-arrow-up-small2" />
                </div>
                <div class="bg-tg-primary absolute left-53 top-11 h-22 w-2" />
              </div>
            </template>
          </BaseInput>
        </div>
      </div>
      <div class="flex flex-col">
        <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
          {{ t('plinko_risk') }}
        </span>
        <BaseSelect
          v-model="plinkoParams.level" :options="levelList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
        />
      </div>
      <div class="flex flex-col">
        <span class="text-tg-text-lightgrey inline-block pb-4 text-[14px] font-semibold leading-[1]">
          {{ t('plinko_rows') }}
        </span>
        <BaseSelect
          v-model="plinkoParams.line" :options="rowList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
        />
      </div>
      <div class="flex justify-center">
        <BaseButton type="text" size="none" @click="checkFairnessesCalcButton">
          <span>{{ t('plinko_fairnesses_calcButton') }}</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.group-hover\:bg-tg-text-grey-hover:hover:not(:active) {
  background-color: var(--tg-text-grey);
}
</style>
