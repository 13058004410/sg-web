<script setup lang='ts'>
import type { ICasinoBetRecordItem } from '~/apis/types'

interface Props {
  isFirst: boolean
}
const props = defineProps<Props>()

const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const { openBetSlipDialog } = useDialogBetSlip()
const { push } = useLocalRouter()

const columns = computed<Column[]> (() => {
  if (isMobile.value) {
    return [
      {
        title: t('game'),
        width: 90,
        dataIndex: 'game_name',
        slot: 'game_name',
        align: 'left',
      },
      {
        title: t('bet_number'),
        width: 90,
        dataIndex: 'bill_no',
        slot: 'bill_no',
        align: 'left',
      },
      {
        title: t('sports_payment_amount'),
        width: 90,
        dataIndex: 'net_amount',
        slot: 'net_amount',
        align: 'right',
      },
    ]
  }
  return [
    {
      title: t('game'),
      width: 90,
      dataIndex: 'game_name',
      slot: 'game_name',
      align: 'left',
    },
    {
      title: t('bet_number'),
      width: 90,
      dataIndex: 'bill_no',
      slot: 'bill_no',
      align: 'left',
    },
    {
      title: t('date'),
      width: 90,
      dataIndex: 'bet_time',
      slot: 'bet_time',
      align: 'center',
    },
    {
      title: t('bet_amount'),
      width: 90,
      dataIndex: 'bet_amount',
      slot: 'bet_amount',
      align: 'right',
    },
    // {
    //   title: t('multiple_count'),
    //   width: 90,
    //   dataIndex: 'x',
    //   slot: 'x',
    //   align: 'center',
    // },
    {
      title: t('sports_payment_amount'),
      width: 90,
      dataIndex: 'net_amount',
      slot: 'net_amount',
      align: 'right',
    },
  ]
})

const {
  list, prev, next, hasMore, page, runAsync, run,
  loading,
} = useList(ApiMemberCasinoRecordList, {}, { page_size: 10 })

function showDetail(data: ICasinoBetRecordItem) {
  openBetSlipDialog({ type: 'casino', data })
}
function openCasinoGame(data: ICasinoBetRecordItem) {
  const { game_code, platform_id, platform_name, game_name } = data

  // 原创游戏
  if (platform_id === '1001')
    return push(`/casino/original-game/?id=${game_name.toLowerCase()}`)

  let vid = +platform_id
  if (EnumCasinoPidToVid[+platform_id])
    vid = EnumCasinoPidToVid[+platform_id]

  push(`/casino/games?name=${game_name}&pn=${platform_name}&vid=${vid}&game_id=${game_code}`)
}

if (props.isFirst)
  await application.allSettled([runAsync({})])
else
  run({})
</script>

<template>
  <div class="casino-my-bets">
    <AppLoading v-if="loading" />
    <template v-else>
      <div v-if="list.length === 0" class="empty">
        <BaseIcon
          style="font-size: var(--tg-empty-icon-size);margin-bottom: 16px;"
          name="empty-1"
        />
        <div class="idiot">
          <span>{{ t('empty_casino_bet') }}</span>
          <BaseButton
            type="text" size="none"
            style="--tg-base-button-text-default-color:var(--tg-text-white)"
            @click="push('/casino')"
          >
            {{ t('start_game_now') }}！
          </BaseButton>
        </div>
      </div>

      <BaseTable v-else :columns="columns" :data-source="list">
        <template #game_name="{ record }">
          <BaseButton size="none" type="text" @click="openCasinoGame(record)">
            <BaseIcon
              v-if="record.game_class === '1'" style="font-size: var(--tg-font-size-base);"
              name="chess-live-casino"
            />
            <BaseIcon v-else style="font-size: var(--tg-font-size-base);" name="chess-slot-machine" />
            <span style="padding-left:  var(--tg-spacing-4);color: var(--tg-text-white);text-transform: capitalize;">{{ record.game_name }}</span>
          </BaseButton>
        </template>
        <template #bill_no="{ record }">
          <BaseButton size="none" type="text" @click="showDetail(record)">
            <div class="bill_no">
              <BaseIcon v-if="!isMobile" style="font-size: var(--tg-font-size-base);" name="tabbar-bet" />
              <span>{{ record.bill_no }}</span>
            </div>
          </BaseButton>
        </template>
        <template #bet_time="{ record: { bet_time } }">
          <div>
            {{ timeToCustomizeFormat(bet_time) }}
          </div>
        </template>
        <template #bet_amount="{ record: { bet_amount, currency_id } }">
          <div class="amount">
            <AppAmount
              :amount="application.sliceOrPad(
                scientificToString(bet_amount),
                application.getCurrencySuffixLength(getCurrencyConfigByCode(currency_id)?.name),
              )"
              :currency-type="getCurrencyConfigByCode(currency_id)?.name"
            />
          </div>
        </template>
        <template #net_amount="{ record: { settle_amount, currency_id } }">
          <div class="amount" :class="{ win: settle_amount > 0 }">
            <AppAmount
              :amount="application.sliceOrPad(
                scientificToString(settle_amount),
                application.getCurrencySuffixLength(getCurrencyConfigByCode(currency_id)?.name),
              )"
              :currency-type="getCurrencyConfigByCode(currency_id)?.name"
            />
          </div>
        </template>
      </BaseTable>
      <div class="btns">
        <BaseButton :disabled="page === 1" type="text" @click="prev">
          {{ t('page_prev') }}
        </BaseButton>
        <BaseButton type="text" :disabled="!hasMore" @click="next">
          {{ t('page_next') }}
        </BaseButton>
      </div>
    </template>
  </div>
</template>

<style lang='scss' scoped>
.casino-my-bets {
  margin-bottom: var(--tg-spacing-52);
}

.btns {
  display: flex;
  justify-content: center;
  --tg-base-button-text-default-color: var(--tg-text-white);
}

.empty {
  width: 100%;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 20px;
  padding: 16px;
  .idiot{
    display: flex;
    flex-direction: column;
    span {
    font-size: var(--tg-font-size-default);
    color: var(--tg-text-lightgrey);
    margin-bottom: 4px;
  }
  }
}

.bill_no {
  display: flex;
  align-items: center;
  gap: var(--tg-spacing-4);

  span {
    display: inline-block;
    max-width: 9ch;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--tg-text-white);
    font-weight: var(--tg-font-weight-semibold);
  }
}

.amount {
  display: flex;
  justify-content: flex-end;

  &.win {
    color: var(--tg-text-green);
  }
}
</style>
