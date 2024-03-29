<script setup lang='ts'>
interface Props {
  modelValue: string
  currentType: {
    label: string
    value: string
    icon?: string
    promo?: string
    pname?: string
    ptype: number
  }[]
}
const props = withDefaults(defineProps<Props>(), {
})
const emit = defineEmits(['update:modelValue'])

const changeType = function (type: string, i: number) {
  document.querySelectorAll('.scroll-list-item')[i].scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
  })
  emit('update:modelValue', type)
}
</script>

<template>
  <div class="scroll-x withdrawal-deposit-type">
    <div
      v-for="item, i in currentType"
      :key="item.value"
      class="center type-btn scroll-list-item"
      :class="item.value === props.modelValue ? 'active' : '' "
      @click="changeType(item.value, i)"
    >
      <BaseImage
        :url="`payment/deposit/${item.icon ?? 'dft'}.webp`"
        loading="eager"
        width="14px"
        is-network
      />
      <span class="label">{{ item.label }}</span>
      <span v-if="item.ptype === 1002" class="tag">
        <span>{{ $t('present') }}{{ Number(item.promo) }}%</span>
      </span>
      <span
        v-else-if="item.ptype === 1004
          || item.ptype === 1001
          || item.ptype === 1003"
        class="tag"
        :class="{ green: item.ptype === 1004, red: item.ptype === 1003 }"
      >
        <span>{{ item.pname }}</span>
      </span>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.withdrawal-deposit-type{
  width: 100%;
  display: flex;
  gap: 4px;
  background: #0F212E;
  box-shadow: 0px 1px 2px 0px #0000001F;
  padding: 4px 8px;
  .type-btn{
    position: relative;
    height: 32px;
    flex-shrink: 0;
    padding: 0 var(--tg-spacing-8);
    gap: 4px;
    border: var(--tg-border-width-default) solid var(--tg-secondary-main);
    border-radius: var(--tg-radius-default);
    color: var(--tg-text-white);
    cursor: pointer;
    overflow: hidden;
    font-size: var(--tg-font-size-xs);
    &:active{
      transform: scale(.96);
    }
    &:hover{
      opacity: .9;
    }
    &.active{
      background-color: #2F4553;
      box-shadow: 0px 1px 2px 0px #0000001F;
    }
    .tag{
      position: absolute;
      top: 0;
      right: 0;
      background-color: var(--tg-text-warn);
      color: var(--tg-text-white);
      font-size: var(--tg-font-size-xs);
      font-weight: 500;
      border-radius: var(--tg-radius-none) var(--tg-radius-default);
      transform: translate(25%,-25%);
      span{
        display: inline-block;
        transform: scale(0.5) translate(-25%,25%);
      }
    }
    .green{
      background-color: var(--tg-text-green);
    }
    .red{
      background-color: var(--tg-text-error);
    }
  }
}
</style>
