<script setup lang="ts">
const { t } = useI18n()
const { push } = useLocalRouter()
const { VITE_SITE_NAME, VITE_OFFICIAL_NAME } = getEnv()

const path = ref('/casino/group/original-game')
const list = [
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
const limboObj = {
  img: `/png/site/${VITE_SITE_NAME}/mini/limbo.png`,
  name: 'Limbo',
  game_id: 'limbo',
  count: getCount(),
}
if (import.meta.env.MODE !== 'production')
  list.unshift(limboObj)

function getCount() {
  return Math.ceil(Math.random() * 1000).toFixed()
}

function startGame(id: string) {
  push(`/casino/original-game/?id=${id}`)
}
</script>

<template>
  <AppSlider
    icon="chess-original-game" :data="list" :title="t('casino_origin_game', { site: VITE_OFFICIAL_NAME })"
    :path="path" :show-view-all="false"
  >
    <template #item="{ item }">
      <BaseAspectRatio ratio="100/134.1463414634" @click="startGame(item.game_id)">
        <div class="overflow-hidden rounded-[8px]">
          <BaseImage :url="item.img" />
        </div>
      </BaseAspectRatio>
      <span class="count">
        <span class="dot blinking-dash2" />&nbsp;&nbsp;
        <span class="num">{{ application.formatNumber(item.count) }}</span>
        &nbsp;{{ t('in_play') }}
      </span>
    </template>
  </AppSlider>
</template>

<style lang="scss" scoped>
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
