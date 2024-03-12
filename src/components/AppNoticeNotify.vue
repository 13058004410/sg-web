<script lang="ts" setup>
interface Props {
  mode: string
}
const props = withDefaults(defineProps<Props>(), {
  mode: '',
})

const emit = defineEmits(['reState'])

enum EnumPage {tz, znx, gg, pmd, fk }
const pageCurrent = ref(1)
const pageSize = 10
const pageTotal = ref(0)

const { t } = useI18n()
// 存款详情
const { openDepositDetailDialog } = useDialogDepositDetail(t('notification'))
// 通知
// const { openMessageDialog: openNotificationDialog } = useDialogMessage(t('notification'))
// 公告
const { openNoticeDialog } = useDialogNotice()
// 站内信
const { openMessageDialog: openMessageZnxDialog } = useDialogMessage(t('site_message'))
// 跑马灯
const { openMessageDialog: openMessagePmdDialog } = useDialogMessage(t('marquee'))
const { bool: loading, setBool: setLoadingBool } = useBoolean(false)
// 公告&跑马灯列表
const {
  data: noticeList,
  runAsync: runAsyncMemberNoticeList,
  // loading: memberNoticeListLoading,
} = useRequest(ApiMemberNoticeList, {
  onSuccess() {
    pageTotal.value = noticeList.value?.length ?? 0
  },
})
// 站内信列表
const {
  data: stationInfoList,
  runAsync: runAsyncMemberStationInfoList,
  // loading: memberNoticeListLoading,
} = useRequest(ApiMemberStationInfoList, {
  onSuccess() {
    pageTotal.value = stationInfoList.value?.length ?? 0
  },
})
// 通知列表
const {
  data: memberNotifications,
  runAsync: runAsyncMemberNotifications,
} = useRequest(ApiMemberNotifications, {
  onSuccess(data) {
    if (data) {
      data.forEach((item) => {
        item.content = JSON.parse(item.payload)
      })
      memberNotifications.value = data
      pageTotal.value = data.length
    }
  },
})

// 标记已读（ 站内信 ）
const {
  run: runStationInfoDetailUpdateState,
} = useRequest(ApiMemberStationInfoDetailUpdateState, {
  onSuccess(data, params) {
    const item = stationInfoList.value?.find(item => item.id === params[0].id)
    item && (item.state = 1)
    stationInfoList.value = [...(stationInfoList.value ?? [])]
    emit('reState')
  },
})
// 全部已读（ 站内信 ）
const {
  run: runMemberUpdateAllState,
} = useRequest(ApiMemberStationInfoDetailUpdateAllState, {
  onSuccess() {
    stationInfoList.value?.forEach((item) => {
      item.state = 1
    })
    stationInfoList.value = [...(stationInfoList.value ?? [])]
    emit('reState')
  },
})
// 标记已读（ 通知 ）
const {
  run: runNotificationsRead,
} = useRequest(ApiMemberNotificationsRead, {
  onSuccess(data, params) {
    const item = memberNotifications.value?.find(item => item.id === params[0].id)
    item && (item.is_read = 2)
    memberNotifications.value = [...(memberNotifications.value ?? [])]
    emit('reState')
  },
})
// 全部已读（ 通知 ）
const {
  run: runNotificationsReadAll,
} = useRequest(ApiMemberNotificationsReadAll, {
  onSuccess() {
    memberNotifications.value?.forEach((item) => {
      item.is_read = 2
    })
    memberNotifications.value = [...(memberNotifications.value ?? [])]
    emit('reState')
  },
})
// 标记已读（ 公告 ）
const {
  run: runNoticeReadInsert,
} = useRequest(ApiMemberNoticeReadInsert, {
  onSuccess(data, params) {
    const item = noticeList.value?.find(item => item.id === params[0].id)
    item && (item.is_read = 1)
    noticeList.value = [...(noticeList.value ?? [])]
    emit('reState')
  },
})
const getCurrentTotal = computed(() => {
  return Number(mul(pageCurrent.value, pageSize))
})
const isStateAll = computed(() => {
  return props.mode === EnumPage[0] || props.mode === EnumPage[1]
})
const getList: ComputedRef<any[] | undefined> = computed(() => {
  switch (props.mode) {
    case EnumPage[0]: return memberNotifications.value
    case EnumPage[1]: return stationInfoList.value
    case EnumPage[2]:
    case EnumPage[3]: return noticeList.value
    default: return []
  }
})
const getIcon = computed(() => {
  switch (props.mode) {
    case EnumPage[0]: return 'navbar-wallet'
    case EnumPage[1]: return 'uni-notice-znx'
    case EnumPage[2]:return 'uni-notice-gg'
    case EnumPage[3]: return 'uni-notice-pmd'
    default: return ''
  }
})

function handleLoad() {
  setLoadingBool(true)
  setTimeout(() => {
    pageCurrent.value++
    setLoadingBool(false)
  }, 1200)
}
function openDialogDetail(item: any) {
  switch (props.mode) {
    case EnumPage[0]:
      item.is_read === 1 && runNotificationsRead({ id: item.id })
      return openDepositDetailDialog(item.content)
    case EnumPage[1]:
      item.state === 2 && runStationInfoDetailUpdateState({ id: item.id })
      openMessageZnxDialog(item)
      return
    case EnumPage[2]:
      item.is_read === 2 && runNoticeReadInsert({ id: item.id })
      return openNoticeDialog(item)
    case EnumPage[3]: return openMessagePmdDialog(item)
  }
}
function pageInit() {
  switch (props.mode) {
    case EnumPage[0]: return runAsyncMemberNotifications()
    case EnumPage[1]: return runAsyncMemberStationInfoList()
    case EnumPage[2]: return runAsyncMemberNoticeList({ types: '1', location: 'notification' })
    case EnumPage[3]: return runAsyncMemberNoticeList({ types: '2' })
  }
}
function getTitle(title: string, flag?: boolean) {
  switch (title) {
    case 'withdraw_success': return flag ? t('withdraw_success_received') : t('withdraw_success')
    case 'withdraw_fail': return t('withdraw_fail')
    case 'deposit_success': return flag ? t('deposit_success_received') : t('deposit_success')
    case 'deposit_fail': return t('deposit_fail')
    case 'deposit_in_process': return flag ? t('deposit_in_process_now') : t('deposit_in_process')
    case 'withdraw_in_process': return flag ? t('withdraw_in_process_now') : t('withdraw_in_process')
    default: return false
  }
}
function updateAllState() {
  switch (props.mode) {
    case EnumPage[0]: return runNotificationsReadAll()
    case EnumPage[1]: return runMemberUpdateAllState()
  }
}
function getState(state: number) {
  switch (props.mode) {
    case EnumPage[0]: return state === 1
    case EnumPage[1]: return state === 2
    case EnumPage[2]: return state === 2
  }
}
function getAmount(item: { title: string; content: { finally_amount: string; pay_amount: string } }) {
  const isSuccess = item.title.includes('success')
  return isSuccess ? item.content.finally_amount : (item.content.pay_amount ?? item.content.finally_amount)
}

await application.allSettled(
  [pageInit() as Promise<any>],
)
const languageStore = useLanguageStore()
const { userLanguage } = storeToRefs(languageStore)
</script>

<template>
  <BaseList
    v-if="getList && getList.length > 0"
    :finished="getCurrentTotal >= pageTotal"
    :loading="loading"
    @load="handleLoad"
  >
    <div class="notice-scroll">
      <div v-if="isStateAll" class="contain-top">
        <BaseButton type="text" size="none" @click="updateAllState">
          {{ t('mark_all_read') }}
        </BaseButton>
      </div>
      <div
        v-for="item of getList.slice(0, getCurrentTotal)"
        :key="item.id"
        class="contain-item cursor-pointer"
        @click="openDialogDetail(item)"
      >
        <div class="center item-left">
          <BaseIcon :name="mode === EnumPage[0] ? (item.title.includes('fail') ? 'uni-warning' : getIcon) : getIcon" />
        </div>
        <div class="item-right">
          <div class="right-state">
            <div v-if="mode === EnumPage[2] || mode === EnumPage[0]" class="content-title">
              {{ getTitle(item.title) || item.title[getCurrentLanguageForBackend()] }}
            </div>
            <BaseBadge
              v-if="getState(item.state ?? item.is_read)"
              class="state-text" :max="99999"
              status="success" :text="timeToFromNow(item.start_time ?? item.created_at ?? item.timestamp)"
            />
            <span v-else class="state-text">
              {{ timeToFromNow(item.start_time ?? item.created_at ?? item.timestamp) }}
            </span>
          </div>
          <!-- 通知 -->
          <div v-if="mode === EnumPage[0]" class="content-text">
            <div v-if="userLanguage === 'th-TH'" class="center" style="justify-content: flex-start;gap: 4px;">
              <AppAmount :amount="getAmount(item)" :currency-type="item.content.currency_name" />{{ t('yours') }}{{ getTitle(item.title, true) }}
            </div>
            <div v-else>
              {{ t('yours') }}
              <AppAmount style="display: inline-block" :amount="getAmount(item)" :currency-type="item.content.currency_name" />
              {{ getTitle(item.title, true) }}
            </div>
          </div>
          <!-- 站内信 -->
          <template v-else-if="mode === EnumPage[1]">
            <div class="content-text">
              {{ item.content[getCurrentLanguageForBackend()] }}
            </div>
          </template>
          <!-- 公告 -->
          <div
            v-else-if="mode === EnumPage[2]"
            class="content-text"
            v-html="item.content[getCurrentLanguageForBackend()]"
          />
          <!-- 跑马灯 -->
          <div
            v-else
            class="content-text"
            v-html="item.content[getCurrentLanguageForBackend()]"
          />
        </div>
      </div>
    </div>
  </BaseList>
  <div v-else class="empty-notice">
    <BaseEmpty>
      <template #icon>
        <BaseIcon font-size="62px" name="notice-empty" />
      </template>
      <template #description>
        <div class="empty-text">
          {{ t('empty_notify') }}
        </div>
        <div>{{ t('tip_show_action') }}</div>
      </template>
    </BaseEmpty>
  </div>
</template>

<style lang="scss" scoped>
.notice-scroll {
    display: flex;
    flex-direction: column;
    padding: 12px 16px 0;
    gap: 12px;
    color: var(--tg-secondary-light);

    .contain-top {
        font-size: var(--tg-font-size-default);
        font-weight: 500;
        margin: 4px 0;
        text-align: right;
        span:hover {
          cursor: pointer;
        }
    }
    .state-text{
      color: var(--tg-secondary-light);
      font-size: var(--tg-font-size-xs);
      font-weight: var(--tg-font-weight-normal);
    }
    .contain-item {
        display: flex;
        min-height: 60px;
        width: 100%;
        overflow: hidden;

        .item-left {
            width: 56px;
            min-height: 100%;
            font-size: var(--tg-font-size-lg);
            --tg-icon-color: var(--tg-primary-success);
            background: var(--tg-secondary-grey);
            border-radius:
                var(--tg-radius-default) var(--tg-radius-none) var(--tg-radius-none) var(--tg-radius-default);
        }

        .item-right {
            display: flex;
            flex: 1;
            gap: 6px;
            min-height: 100%;
            padding: 9px 12px;
            font-size: var(--tg-font-size-default);
            flex-direction: column;
            justify-content: space-between;
            background: var(--tg-secondary-main);
            border-radius:
              var(--tg-radius-none) var(--tg-radius-default) var(--tg-radius-default) var(--tg-radius-none);
            .right-state {
              width: 100%;
              display: flex;
              color: var(--tg-text-white);
              font-size: var(--tg-font-size-default);
              font-weight: 500;
              justify-content: space-between;
              align-items: center;
              .state-text{
                flex: 1;
                text-align: right;
              }
            }
            .content-text{
              white-space: normal;
              line-height: 1.43;
            }
            .content-title{
              white-space: break-spaces;
              line-height: 1.43;
            }
        }
    }
}

.empty-notice {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    color: var(--tg-secondary-light);
    font-size: var(--tg-font-size-default);

    .empty-text {
        color: var(--tg-text-white);
        font-weight: var(--tg-font-weight-semibold);
        margin: 36px auto 8px;
    }
}
</style>
