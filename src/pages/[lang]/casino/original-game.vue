<script setup lang='ts'>
import WujieVue from 'wujie-vue3'
import gsap from 'gsap'
import Limbo from '~/original-games/limbo/index.vue'
import Dice from '~/original-games/dice/index.vue'
import Plinko from '~/original-games/plinko/index.vue'

const { isMobile, appContentWidth } = storeToRefs(useWindowStore())
const { query } = useRoute()
const { bool: gameLoading } = useBoolean(true)
const { bool: showDes } = useBoolean(false)
const { t } = useI18n()
const { bus } = WujieVue

const id = ref(query.id?.toString() ?? '')
const { VITE_OFFICIAL_NAME } = getEnv()

const game = computed(() => {
  switch (id.value) {
    case 'limbo':
      return Limbo
    case 'dice':
      return Dice
    case 'plinko':
      return Plinko
    default:
      return Limbo
  }
})
const name = computed(() => {
  switch (id.value) {
    case 'limbo':
      return 'Limbo'
    case 'dice':
      return 'Dice'
    case 'plinko':
      return 'Plinko'
    default:
      return ''
  }
})

function moveIframe() {
  gameLoading.value = false
  const t = setTimeout(() => {
    gsap.to('.padding-top-transition', {
      paddingTop: 0,
      opacity: 1,
      duration: 0.35,
    }).then(() => {
      showDes.value = true
    })
    clearTimeout(t)
  }, 200)
}

bus.$on('loaded', moveIframe)
</script>

<template>
  <div class="casino-games">
    <AppLoading v-if="gameLoading" full-screen />
    <div
      class="game-wrapper padding-top-transition relative pt-20 opacity-0" :class="{ max: appContentWidth > 930 }"
      :style="{ height: gameLoading ? 0 : 'auto' }"
    >
      <component :is="game" />
    </div>

    <template v-if="showDes">
      <AppDesc is-original-game :name="name" :plat-name="t('casino_origin_game', { site: VITE_OFFICIAL_NAME })" :show-content="false" />
      <div class="margin-auto home-container tg-mt-32">
        <div v-if="!isMobile" class="layout-spacing">
          <AppBetData mode="casino" />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang='scss' scoped>
.casino-games {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  // min-height:  calc(100vh - var(--tg-header-height));

  .game-wrapper {
    width: 100%;
    max-width: 1200px;
    margin-top: 3vw;

    &.max {
      margin-top: var(--tg-spacing-40);
    }
  }
}

.tg-mt-32 {
  margin-top: var(--tg-spacing-32);
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
