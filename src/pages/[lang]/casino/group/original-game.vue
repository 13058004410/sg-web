<script setup lang="ts">
const { t } = useI18n()
const { appContentWidth, isMobile } = storeToRefs(useWindowStore())
const { cateProviderData } = storeToRefs(useCasinoStore())
const { VITE_SITE_NAME } = getEnv()
const { push } = useLocalRouter()
const { VITE_OFFICIAL_NAME } = getEnv()

const sortType = ref(EnumCasinoSortType.hot)

const list = [
  // {
  //   img: `/png/site/${VITE_SITE_NAME}/mini/limbo.png`,
  //   name: 'Limbo',
  //   game_id: 'limbo',
  //   count: getCount(),
  // },
  {
    img: `/png/site/${VITE_SITE_NAME}/mini/dice.png`,
    name: 'Dice',
    game_id: 'dice',
    count: getCount(),
  },
  {
    img: `/png/site/${VITE_SITE_NAME}/mini/plinko.png`,
    name: 'Plinko',
    game_id: 'plinko',
    count: getCount(),
  },
]

function getCount() {
  return Math.ceil(Math.random() * 1000).toFixed()
}
function startGame(id: string) {
  push(`/casino/original-game/?id=${id}`)
}

// 虚拟加载数据
function getData() {
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      resolve(t)
      clearTimeout(t)
    }, 1000)
  })
}

await application.allSettled([getData()])
</script>

<template>
  <div>
    <section class="layout-spacing tg-game-type-page">
      <div class="group-banner-wrap" :class="{ 'less-than-700': appContentWidth <= 700 }">
        <div class="group-banner-bg" />
        <div class="banner-wrap">
          <div class="banner">
            <div class="left">
              <h1>
                <span>{{ t('casino_origin_game', { site: VITE_OFFICIAL_NAME }) }}</span>
              </h1>
            </div>
            <div
              class="right center" :style="{
                '--app-sport-image-error-icon-size': '20px',
              }"
            >
              <AppImage
                style="height: 100%;width: auto;"
                url="/png/casino/group-banner-default.png"
                loading="eager"
                err-icon="uni-game-err"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isMobile" class="mt-24">
        <AppGameSearch game-type="1" />
      </div>
      <div class="mt-24">
        <AppGroupFilter
          game-type="provider"
          :sort-type="sortType"
          :platform-options="[]"
        />
      </div>
      <div class="mt-24">
        <AppCardList :list="list">
          <template #default="{ item }">
            <BaseAspectRatio ratio="100/134.1463414634" @click="startGame(item.game_id)">
              <div class="item">
                <BaseImage :url="item.img" />
              </div>
            </BaseAspectRatio>
            <span class="count">
              <span class="dot blinking-dash2" />&nbsp;&nbsp;
              <span class="num">{{ application.formatNumber(item.count) }}</span>
              &nbsp;{{ t('in_play') }}
            </span>
          </template>
        </AppCardList>
      </div>
      <AppProviderSlider
        :icon="cateProviderData?.icon ?? ''"
        :list="cateProviderData?.games ?? []"
        :title="cateProviderData?.name ?? ''"
      />
    </section>
    <AppBetData mode="casino" />
  </div>
</template>

<style lang="scss" scoped>
 .item {
    cursor: pointer;
    border-radius: var(--tg-radius-md);
    overflow: hidden;
    transition: var(--tg-transition);

    &:hover {
      transform: translateY(-7px);
    }
  }

  .count {
    display: flex;
    align-items: center;
    margin-top: var(--tg-spacing-4);
    font-size: var(--tg-font-size-xs);
    color: var(--tg-text-lightgrey);
    font-weight: var(--tg-font-weight-semibold);
    line-height: 1.5;

    .dot {
      width: 6.5px;
      height: 6.5px;
      border-radius: 50%;
      background-color: var(--tg-primary-success);
      margin-left: 2px;
    }

    .num {
      color: var(--tg-text-white);
      font-variant-numeric: tabular-nums;
    }
  }
</style>

<route lang="yaml">
meta:
  layout: home
</route>
