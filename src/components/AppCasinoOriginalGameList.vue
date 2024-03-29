<script setup lang="ts">
const { t } = useI18n()
const { push } = useLocalRouter()
const { VITE_SITE_NAME, VITE_OFFICIAL_NAME } = getEnv()

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

function originalGamePage() {
  push('/casino/group/original-game')
}
</script>

<template>
  <div class="list-wrap">
    <BaseButton type="text" size="none" @click="originalGamePage">
      <div class="title">
        <BaseIcon name="chess-original-game" />
        <span>{{ t('casino_origin_game', { site: VITE_OFFICIAL_NAME }) }}</span>
      </div>
    </BaseButton>

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
</template>

<style lang="scss" scoped>
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
}
</style>
