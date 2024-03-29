<script lang="ts" setup>
const { t } = useI18n()
const {
  list,
  page,
  page_size,
  loading,
  total,
  runAsync,
  prev,
  next,
  resetPage,
} = useList(ApiAgencyCommissionRecords,
  {}, { page_size: 10, isWatchPageOrPageSize: false })
const date = ref([])
const platformId = ref('')
const {
  data: recordsClass,
  runAsync: getRecordsClass,
} = useRequest(ApiAgencyCommissionRecordsClass, {
  onSuccess() {
    const params = computed(() => {
      return {
        start_time: date.value[0],
        end_time: date.value[1],
        page_size: page_size.value,
        page: page.value,
        cash_type: platformId.value,
      }
    })
    useListSearch(params, runAsync, resetPage)
  },
})
const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const columns = reactive<Column[]>([
  {
    title: t('label_type'),
    dataIndex: 'cash_type_name',
    slot: 'cash_type_name',
    align: 'center',
  },
  {
    title: t('amount'),
    dataIndex: 'amount',
    isAmount: true,
    align: 'center',
  },
  {
    title: t('time'),
    dataIndex: 'apply_at',
    slot: 'apply_at',
    align: 'center',
  },
  {
    title: t('order_id'),
    dataIndex: 'bill_no',
    slot: 'bill_no',
    align: 'center',
  },
])

const getOptions = computed(() => {
  return [{
    label: t('label_all_type'),
    value: '',
  }].concat(recordsClass.value?.map((item) => {
    return {
      label: item.CashTypeName,
      value: item.CashType,
    }
  }) ?? [])
})
const getPaginationData = computed(() => {
  return {
    pageSize: page_size.value,
    page: page.value,
    total: total.value,
  }
})

await application.allSettled(
  [
    getRecordsClass(),
  ],
)
</script>

<template>
  <div class="app-agent-commission-record">
    <div class="grid-box">
      <div class="column-item">
        <span>{{ $t('time') }}</span>
        <BaseDatePicker
          v-model="date"
          :min="startTime"
          :max="endTime"
        />
      </div>
      <div class="column-item">
        <span>{{ $t('label_type') }}</span>
        <BaseSelect
          v-model.lazy="platformId"
          :options="getOptions"
        />
      </div>
    </div>
    <BaseTable
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :skeleton-row="4"
      is-amount-popper
    >
      <template #apply_at="{ record }">
        {{ `${timeToDateFormat(record.apply_at)} ${timeToCustomizeFormat(record.apply_at, 'HH:mm:ss')}` }}
      </template>
      <template #bill_no="{ record }">
        <div class="center" style="gap: 4px">
          <span>{{ record.bill_no }}</span>
          <AppTooltip :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']">
            <template #content>
              <BaseButton size="none" type="text" @click="application.copy(record.bill_no)">
                <BaseIcon name="uni-doc" />
              </BaseButton>
            </template>
          </AppTooltip>
        </div>
      </template>
    </BaseTable>
    <AppStack
      v-if="total > 10"
      :pagination-data="getPaginationData"
      @previous="prev"
      @next="next"
    />
  </div>
</template>

<style lang="scss" scoped>
.to-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.app-agent-commission-record {
  padding: 0 var(--tg-spacing-16) var(--tg-spacing-16);
  --tg-base-date-picker-width: auto;
  --tg-base-date-picker-bother: none;
  --tg-base-date-picker-font-size: var(--tg-font-size-xs);
  --tg-base-date-picker-padding: var(--tg-spacing-10) var(--tg-spacing-12);
  --tg-base-date-picker-font-weight: 500;
  --tg-base-select-border: none;
  --tg-base-select-box-shadow: none;
  --tg-base-select-style-padding-y: var(--tg-spacing-10);
  --tg-base-date-picker-color: var(--tg-text-white);
  --tg-base-select-popper-font-weight: var(--tg-font-weight-normal);
  --tg-table-margin-top-empty: 0;
  .grid-box{
    max-width: 375px;
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: var(--tg-spacing-10);
    .column-item{
      display: flex;
      flex-direction: column;
      gap: var(--tg-spacing-4);
      color: var(--tg-secondary-light);
    }
  }
}
</style>
