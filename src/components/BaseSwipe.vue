<script lang="ts" setup>
import type { BannerItem } from '~/types'

interface Props {
  items: BannerItem[]
}

const props = defineProps<Props>()

const heroContentRef = ref<HTMLElement | null>(null)
const { appContentWidth, isMobile } = storeToRefs(useWindowStore())
const { bool: isShowLeftArrow, setBool: setLeftArrowStatus } = useBoolean(false)
const { bool: isShowRightArrow, setBool: setRightArrowStatus } = useBoolean(true)
const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()
const router = useLocalRouter()

const gridAutoColumns = computed(() => {
  if (appContentWidth.value < 600)
    return 'calc(95.24% - 0.6875rem)'

  else if (appContentWidth.value > 600 && appContentWidth.value < 1020)
    return 'calc(48.78% - 0.6875rem)'
  else
    return 'calc(33.33% - 0.6875rem)'
})

function handleScroll() {
  const target = heroContentRef.value as HTMLElement
  target.scrollLeft <= 0 ? setLeftArrowStatus(false) : setLeftArrowStatus(true)
  target.scrollLeft >= (target.scrollWidth - target.clientWidth - 1) ? setRightArrowStatus(false) : setRightArrowStatus(true)
}

function scrollLeft() {
  const target = heroContentRef.value as HTMLElement
  target.scrollLeft -= target.offsetWidth
}

function scrollRight() {
  const target = heroContentRef.value as HTMLElement
  target.scrollLeft += target.offsetWidth
}

/**
 * 处理跳转自定义链接
 * 1.没带http开头的链接，前端自己将当前域名+语言+自定义链接组合成完整的url
 * 2.带了http开头的链接，不需要组合
 * 3.h5的全部在当前页面打开链接
 * 4.PC组合链接当前页面打开，http开头的新标签打开
 */
function toCustomUrl(url: string) {
  if (router.isExternal(url)) {
    if (isMobile.value) {
      location.href = url
    }
    else {
      setTimeout(() => {
        window.open(url, '_blank')
      }, 0)
    }
  }
  else {
    const _url = `${url.startsWith('/') ? url : (`/${url}`)}`
    router.push(_url)
  }
}

function jumpToUrl(item: { type: number; jumpUrl: string }) {
  /** 跳转类型 1-自定义 2-娱乐城 3-体育 4-优惠活动 5-联盟中心 */
  switch (item.type) {
    case 1:
      toCustomUrl(item.jumpUrl)
      break
    case 2:
      router.push('/casino')
      break
    case 3:
      router.push(`/sports/${getSportsPlatId()}`)
      break
    case 4:
      router.push('/promotions')
      break
    case 5:
      router.push('/affiliate/promotion-tutorial')
      break
  }
}

onMounted(() => {
  handleScroll()
})
</script>

<template>
  <div class="hero-wrapper">
    <div class="grid-heroes">
      <div
        ref="heroContentRef"
        class="scroll-x hide-scrollbar hero-content"
        :style="{
          'grid-auto-columns': gridAutoColumns,
        }"
        @scroll="handleScroll"
      >
        <div
          v-for="item, i in props.items"
          :key="i"
          :style="{
            'background-image': `url(${VITE_CASINO_IMG_CLOUD_URL}/${item.banner_style === 3 ? item.banner_style3_background : item.backgroundUrl})`,
          }"
          class="hero"
          @click="jumpToUrl({
            type: item.type ?? 1,
            jumpUrl: item.imgUrl ?? '',
          })"
        >
          <div class="center wrapper" />
          <template v-if="item.banner_style !== 3">
            <div class="other" :class="[item.align === 'left' ? 'other-left' : 'other-right']">
              <div
                class="banner-content" :class="{
                  'banner-content-left': item.align === 'left',
                  'banner-content-right': item.align === 'right',
                }"
              >
                <div class="name">
                  {{ item.superscript }}
                </div>
                <div class="title">
                  {{ item.title }}
                </div>
                <div class="banner-content-text">
                  {{ item.content }}
                </div>
              </div>
              <div
                class="btn-flex"
              >
                <BaseButton
                  v-if="item.button" type="line"
                  @click.stop="jumpToUrl({
                    type: item.button?.type ?? 1,
                    jumpUrl: item.button?.url ?? '',
                  })"
                >
                  {{ item.button.text }}
                </BaseButton>
              </div>
            </div>
            <div v-if="item.rightImageUrl" class="right-icon" :class="[item.align === 'left' ? 'right-icon-right' : 'right-icon-left']">
              <img
                class="right-img"
                :src="`${VITE_CASINO_IMG_CLOUD_URL}/${item.rightImageUrl}`"
                alt=""
              >
            </div>
          </template>
        </div>
      </div>
      <div
        v-if="isShowLeftArrow"
        class="arrow arrow-left"
        @click="scrollLeft"
      >
        <button class="grid-heroes-button" data-testid="heroes-scroll-left">
          <BaseIcon name="uni-arrow-left" />
        </button>
      </div>
      <div
        v-if="isShowRightArrow"
        class="arrow arrow-right"
        @click="scrollRight"
      >
        <button class="grid-heroes-button" data-testid="heroes-scroll-right">
          <BaseIcon name="uni-arrow-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero-wrapper {
  container-type: inline-size;
  container-name: grid-size;
  --sick-fade-stamp-of-ed-approval: linear-gradient( 90deg, transparent 0, var(--tg-primary-main) 4px, var(--tg-primary-main) calc(100% - 4px), transparent 100% );
  --standard-lockup-shadow-offset: 6px;
}
.grid-heroes {
  width: 100%;
  display: flex;
  position: relative;
  &:hover {
    .arrow {
      opacity: 1!important;
    }
  }
}
.hero-content {
  display: grid;
  grid-auto-flow: column;
  padding-top: 12px;
  padding-bottom: 2px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  width: 100%;
  position: relative;
  -moz-column-gap: 16px;
  column-gap: 16px;
}
.hero {
  scroll-snap-align: start;
  overflow: hidden;
  container-type: inline-size;
  container-name: card-size;
  display: flex;
  flex-direction: column;
  position: relative;
  color: var(--tg-text-white);
  background: var(--tg-secondary-grey);
  border-radius: var(--tg-radius-md);
  cursor: pointer;
  background-size: cover;

  // .wrapper {
  //   width: 100%;
  // }
}

.hero-content .hero:last-child {
  margin-right:8px !important;
}

.arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 100%;
  top: 0;
  opacity: 0;
  transition: opacity .2s;
  font-size: var(--tg-font-size-xl);
  --tg-icon-color: var(--tg-text-white);
}

.arrow-right {
  left: calc(100% - 8px);
  .grid-heroes-button {
    padding: 12px 32px 0 16px;
    height: 100%;
  }
}

.arrow-left {
  right: calc(100% - 8px);
  .grid-heroes-button {
    padding: 12px 16px 0 32px;
    height: 100%;
  }
}

.other {
  position: absolute;
  top: 0;
  width: 66%;
  height: 100%;
  padding: var(--tg-spacing-button-padding-horizontal-xs);
  --tg-base-button-line-hover-color: rgba(255, 255, 255, 0.1);
  --tg-base-button-min-width: 120px;
  --tg-base-button-max-width: 170px;
  --tg-base-button-line-active-color: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 10;

  &.other-left {
    left: 0;
  }
  &.other-right {
    right: 0;
    // text-align: right;
  }
}

.right-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 46%;
  display: flex;
  align-items: center;

  .right-img {
    width: auto;
    height: 100%;
  }
}

.right-icon-left {
  left: 0;
  justify-content: flex-start;
}
.right-icon-right {
  right: 0;
  justify-content: flex-end;
  padding: 16px;
}

.wrapper {
  height: 12rem;
}

.btn-flex {
  display: flex;
  & > * {
    text-align: left;
  }
}

.banner-content {
  line-height: 1.3;
  height: 0;
  flex: 1;
  max-width: 200px;
  overflow:hidden;
  &.banner-content-left {
    padding-right: 10px;
  }
  &.banner-content-right {
    padding-left: 10px;
  }
}
.banner-content-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  font-size: 14px;
}

.name {
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--tg-secondary-deepdark);
  border-radius: 3px;
  padding: 0 4px;
  font-feature-settings: "tnum";
  white-space: nowrap;
  line-height: 1.5;
  background-color: var(--tg-text-white);
  font-size: 12px;
}

.title {
  color: var(--tg-text-white);
  font-size: 18px;
  line-height: 130%;
  font-weight: var(--tg-font-weight-bold);
  padding: 8px 0 4px 0;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-wrap: break-word;
  word-break: break-all;
  // white-space: nowrap;
}

@container grid-size (width < 50rem) {
    .grid-heroes:after {
      content: "";
      position: absolute;
      top: 0;
      right: calc(16px*-1);
      bottom: 0;
      width: 28px;
      background-image: var(--sick-fade-stamp-of-ed-approval);
      z-index: 10
    }

    .hero-content {
      -moz-column-gap: 8px;
      column-gap: 8px
    }

    .hero-content > .hero:last-of-type {
      margin-right: 4px
    }

    .banner-content-text {
      -webkit-line-clamp: 2;
    }
}

@container card-size (width > 18.875rem) {
    .right-icon {
        width: 54%;
    }
    .right-icon-right {
      padding: 12px;
    }
}

@container card-size (width > 21.5rem) {
    .wrapper{
        height: 14rem;
    }

    .right-icon {
      width: 56%;
    }

    .other {
      width: 62%;
      padding: var(--tg-spacing-button-padding-horizontal-sm);
    }
    .right-icon-right {
      padding: 16px;
    }
}

@container card-size (width > 24.5rem) {

    .right-icon {
      width: 50%;
    }
}

@container card-size (width > 28rem) {

  .right-icon {
    width: 48%;
  }
}
</style>
