<script setup lang='ts'>
interface ComponentItem {
  cid: string
  platform_id: string
  name: string
  icon: string
  component: any
  value?: string
}

defineOptions({
  name: 'KeepAliveCasino',
})

usePageTitle({ prefix: 'btc_casino_title', suffix: 'casino_game', isT: true })

const router = useLocalRouter()
const route = useRoute()
const routeName = computed(() => route.name?.toString())
const { isLogin } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const casinoStore = useCasinoStore()
const { casinoNav, casinoGameList, currentCasinoNav, firstCasinoNav } = storeToRefs(casinoStore)
const { openRegisterDialog } = useRegisterDialog()

const showAll = computed(() => currentCasinoNav.value === 'all')
const componentList = computed(() => {
  const _c: ComponentItem[] = []
  const _list = casinoNav.value
    ? casinoNav.value
    : [{
        ty: -1,
        cid: '',
        name: '',
        icon: '',
        value: '',
        platform_id: '',
        label: '',
      }]
  _list.forEach((item) => {
    if (item.ty === 1) {
      _c.push({
        cid: item.cid,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        component: defineAsyncComponent(
          () => import('~/components/AppCasinoCateList.vue'),
        ),
      })
    }

    else if (item.ty === 2) {
      _c.push({
        cid: item.cid,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        component: defineAsyncComponent(
          () => import('~/components/AppCasinoGameList.vue'),
        ),
      })
    }
    // TODO:临时写死小游戏入口
    else if (item.ty === 99) {
      _c.push({
        cid: item.cid,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        component: defineAsyncComponent(
          () => import('~/components/AppCasinoOriginalGameList.vue'),
        ),
      })
    }
    else if (item.ty === -1) {
      _c.push({
        cid: item.cid,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        component: defineAsyncComponent(
          () => import('~/components/AppEmptyDiv.vue'),
        ),
      })
    }
  })

  return _c
})

const currentObject = computed<ComponentItem>(() => {
  const _0 = componentList.value.find((item: any) => item.value === currentCasinoNav.value)
  return _0 as ComponentItem
})

// 统一加载tab中的网络icon
function loadIcon() {
  return new Promise((resolve) => {
    let a = 0
    const t = setInterval(() => {
      a++
      if (casinoNav.value && casinoNav.value.length > 0) {
        clearInterval(t)
        const arr = casinoNav.value.map((a) => {
          return application.loadImage(a.icon)
        })
        Promise.allSettled(arr).then((result) => {
          resolve(result)
        })
      }
      else if (a > 300 || !casinoNav.value) {
        clearInterval(t)
        resolve(true)
      }
    }, 50)
  })
}

function setLobby() {
  currentCasinoNav.value = firstCasinoNav.value
}

casinoLobbyBus.on(setLobby)
onBeforeUnmount(() => {
  casinoLobbyBus.off(setLobby)
})

onMounted(() => {
  const parentUid = router.currentRoute.value.query.uid
  if (parentUid && parentUid.length && !isLogin.value)
    openRegisterDialog()
})

await application.allSettled([loadIcon()])
</script>

<template>
  <div class="layout-spacing">
    <AppBanner type="casino" />
    <!-- <AppMarquee /> -->
    <div v-if="!isMobile" class="tg-mt-24">
      <AppGameSearch :key="routeName" game-type="1" />
    </div>
    <div v-show="casinoNav && casinoNav.length > 0" class="tg-mt-24" :class="{ isMobile }">
      <BaseTab
        v-model="currentCasinoNav"
        :list="casinoNav ?? []"
        :center="false" size="large"
      />
    </div>
    <div class="content-wrapper">
      <!-- 大厅 -->
      <div v-show="showAll">
        <AppCasinoOriginalGameSlider />
        <template v-for="item in casinoGameList" :key="item.name">
          <AppProviderSlider
            v-if="item.cid === '5'" :list="item.games"
            :title="item.name" :icon="item.icon"
          />
          <AppSlider
            v-else-if="item.games"
            :icon="item.icon"
            :title="item.name"
            :data="item.games"
            :cid="item.cid"
            :ty="item.ty"
            :pid="item.platform_id"
            :path="item.path"
            use-cloud-img
            :show-man-count="item.cid === '4'"
          />
        </template>
      </div>
      <div v-show="currentObject">
        <KeepAlive>
          <Suspense timeout="0">
            <component
              :is="currentObject.component"
              :cid="currentObject.cid"
              :name="currentObject.name"
              :icon="currentObject.icon"
              :platform-id="currentObject.platform_id"
            />
            <template #fallback>
              <AppLoading full-screen />
            </template>
          </Suspense>
        </KeepAlive>
      </div>
    </div>
  </div>
  <div class="layout-spacing">
    <AppBetData mode="casino" />
  </div>
  <!-- 公司介绍 -->
  <div v-if="!isLogin">
    <AppCasinoIntro has-more />
  </div>
</template>

<style lang='scss' scoped>
.tg-mt-24 {
  margin-top: 24px;
  &.isMobile{
    margin-top: 12px;
  }
}
.list-wrap {
  margin-top: var(--tg-spacing-24);

  .title {
    font-size: var(--tg-font-size-base);
    color: var(--tg-text-white);
    margin-bottom: var(--tg-spacing-12);
    display: flex;
    align-items: center;

    &:hover {
      --tg-icon-color: var(--tg-text-white);
    }

    span {
      font-size: var(--tg-font-size-md);
      font-weight: var(--tg-font-weight-semibold);
      margin-left: var(--tg-spacing-8);
      line-height: 1.5;
    }
  }

  .more {
    margin-top: var(--tg-spacing-24);
    display: flex;
    justify-content: center;
  }
}
</style>

<route lang="yaml">
name: casino-home
meta:
  layout: home
</route>
