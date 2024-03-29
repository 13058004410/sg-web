<script lang="ts" setup>
const { t } = useI18n()
usePageTitle({ prefix: t('menu_title_my_promotion') })

const { isLogin } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const location = useBrowserLocation()
const { data: proData, loading: loadMyData, runAsync: runAsyncGetMyPro } = useRequest(ApiGetMyPro, {
  ready: isLogin,
})

const baseQrRef = ref()
const squareTabList = [
  {
    value: '1',
    label: t('finance_funds_transfer_sort_commission'),
  },
  {
    value: '2',
    label: t('performance'),
  },
  {
    value: '3',
    label: t('sub_bet'),
  },
]
const squareVal = ref('1')

const qrUrl = computed(() => `${location.value.origin}${proData.value?.link_url ?? ''}`)
const getSquareVal = computed(() => {
  return isMobile.value ? squareVal.value : '123'
})
const commission = computed(() => [
  {
    label: t('accu_commission'),
    value: proData.value?.commission?.accumulated ?? '0',
  },
  {
    label: t('received_commission'),
    value: proData.value?.commission?.received ?? '0',
  },
  {
    label: t('last_commission'),
    value: proData.value?.commission?.last_commission ?? '0',
  },
])

const performance = computed(() => [
  {
    label: t('team_num'),
    value: `${proData.value?.performance?.team_num ?? 0} ${t('people')}`,
  },
  {
    label: t('direct_mem'),
    value: `${proData.value?.performance?.direct_num ?? 0} ${t('people')}`,
  },
  {
    label: t('other_mem'),
    value: `${proData.value?.performance?.other_num ?? 0} ${t('people')}`,
  },
  {
    label: t('total_performance'),
    value: `${proData.value?.performance?.performance_amount ?? '0'}`,
  },
  {
    label: t('direct_performance'),
    value: `${proData.value?.performance?.direct_amount ?? '0'}`,
  },
  {
    label: t('other_performance'),
    value: `${proData.value?.performance?.other_amount ?? '0'}`,
  },
])

const bet = computed(() => [
  {
    label: t('total_effect_bets'),
    value: proData.value?.subordinate?.valid_bet_amount ?? '0',
  },
  { label: t('total_bet_order'), value: proData.value?.subordinate?.bet_num ?? '0' },
  {
    label: t('slash_win_lose_total'),
    value: proData.value?.subordinate?.net_amount ?? '0',
  },
])

function downloadQr() {
  baseQrRef.value.downloadClick()
}

if (isLogin.value) {
  await application.allSettled(
    [runAsyncGetMyPro()],
  )
}
</script>

<template>
  <div class="tg-affiliate-retention" :class="{ 'is-mobile': isMobile }">
    <div class="retention-item">
      <div class="item-title">
        <div class="title-left">
          {{ t('promo_info') }}
        </div>
      </div>
      <div
        class="item-content promotion-msg"
        :class="{ 'is-less-than-sm': isMobile }"
      >
        <div class="promotion-left cursor-pointer" @click="downloadQr">
          <BaseQrcode ref="baseQrRef" :url="qrUrl" :size="92" class="qr-code" />
          <p>{{ t('click_save_qr') }}</p>
        </div>
        <div class="link">
          <p>{{ t('my_link') }}</p>
          <!-- <AppCopyLine :msg="qrUrl" /> -->
          <div class="url-wrap">
            <span style="word-break: break-all;">{{ qrUrl }}</span>
            <AppTooltip
              style="display: inline-block;vertical-align: -6%;margin-left: 4px;"
              :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']"
            >
              <template #content>
                <BaseButton size="none" type="text" @click="application.copy(qrUrl)">
                  <BaseIcon name="uni-doc" />
                </BaseButton>
              </template>
            </AppTooltip>
          </div>
        </div>
        <div class="social-wrap">
          <AppApplicationSharing :share-text="qrUrl" />
        </div>
      </div>
    </div>
    <BaseSquareTab v-if="isMobile" v-model="squareVal" :list="squareTabList" />
    <div v-show="getSquareVal.includes('1')" class="retention-item">
      <div class="item-title">
        <div class="title-left">
          {{ t('finance_funds_transfer_sort_commission') }}
        </div>
      </div>
      <div class="item-content grid-wrap" :class="{ 'is-less-than-sm': isMobile }">
        <div v-for="(item, index) in commission" :key="index">
          <span class="title-label">{{ item.label }} </span>
          <div>
            <BaseSkeleton v-if="loadMyData" height="14px" animated="ani-opacity" />
            <AppAmount v-else :amount="item.value" currency-type="USDT" />
          </div>
        </div>
      </div>
    </div>
    <div v-show="getSquareVal.includes('2')" class="retention-item">
      <div class="item-title">
        <div class="title-left">
          {{ t('performance') }}
        </div>
      </div>
      <div class="item-content grid-wrap" :class="{ 'is-less-than-sm': isMobile }">
        <div v-for="(item, index) in performance" :key="index">
          <span class="title-label">{{ item.label }} </span>
          <div>
            <BaseSkeleton v-if="loadMyData" height="14px" animated="ani-opacity" />
            <template v-else>
              <AppAmount v-if="index > 2" :amount="item.value" currency-type="USDT" />
              <span v-else> {{ item.value }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div v-show="getSquareVal.includes('3')" class="retention-item">
      <div class="item-title">
        <div class="title-left">
          {{ t('sub_bet') }}
        </div>
      </div>
      <div class="item-content grid-wrap" :class="{ 'is-less-than-sm': isMobile }">
        <div v-for="(item, index) in bet" :key="index">
          <span class="title-label">{{ item.label }} </span>
          <div>
            <BaseSkeleton v-if="loadMyData" height="14px" animated="ani-opacity" />
            <span v-else-if="index === 1">{{ item.value }}</span>
            <AppAmount
              v-else :amount="item.value" currency-type="USDT"
              :show-color="index === 2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tg-affiliate-retention {
  font-size: var(--tg-font-size-default);
  // color: var(--tg-text-white);
  --tg-base-square-tab-font-weight: var(--tg-font-weight-normal);
  --tg-base-square-tab-padding-top: 18px;
  --tg-base-square-tab-padding-y: 18px;
  >.retention-item~.retention-item {
    background-color: var(--tg-secondary-grey);
    padding: 0 24px 24px;
    border-radius: var(--tg-radius-default);
    .item-title {
      padding-left: 0;
    }
  }
  >div~div{
    margin-top: var(--tg-spacing-16);
  }
  .item-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--tg-spacing-4) 0 var(--tg-spacing-16);
    border-radius: var(--tg-radius-default)  var(--tg-radius-default) 0 0;
    height: 36px;
    .title-left{
      color: var(--tg-text-white);
      font-weight: var(--tg-font-weight-semibold);
    }
  }
  .promotion-msg{
    width: 100%;
    max-width: 768px;
    display: grid;
    grid-template-columns: 108px auto;
    gap: 16px 10%;
    background-color: var(--tg-secondary-dark);
    border-radius: var(--tg-radius-default);
    padding: var(--tg-spacing-16);
    .promotion-left{
      grid-row-start: span 2;
    }
    &.is-less-than-sm{
      width: 100%;
      gap: 16px 16px;
      justify-items: stretch;
      .promotion-left{
        grid-row-start: auto;
      }
      .social-wrap{
        grid-column-start: span 2;
      }
      .url-wrap{
        flex: 1;
        display: block;
      }
    }
    .link{
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .url-wrap{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: none;
      color: var(--tg-text-white);
      background: var(--tg-secondary-main);
      border: 2px solid var(--tg-secondary-main);
      border-radius: var(--tg-radius-default);
      font-weight: var(--tg-font-weight-semibold);
      transition: all .25s;
      cursor: text;
      font-size: var(--tg-font-size-default);
      padding: var(--tg-spacing-7);
      line-height: 1.4;
      &:hover {
        border-color: var(--tg-text-grey);
      }
    }
    .promotion-left{
      text-align: center;
      .qr-code{
        margin-bottom: var(--tg-spacing-8);
      }
    }
  }
  .grid-wrap{
    width: 100%;
    max-width: 660px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 15px;
    &.is-less-than-sm{
      max-width: 100%;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
    }
    > div{
      width: 100%;
      background-color: var(--tg-secondary-dark);
      padding: var(--tg-spacing-16) var(--tg-spacing-16);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      line-height: 20px;
      flex-direction: column;
      border-radius: 8px;
      gap: 8px;
    }
    .title-label{
      color: #fff;
    }
  }
}
.is-mobile{
  .item-title{
    display: none;
  }
  >.retention-item~.retention-item {
    background: none;
    padding: 0;
  }
}
</style>

<route lang="yaml">
</route>
