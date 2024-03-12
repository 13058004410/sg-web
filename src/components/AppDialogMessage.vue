<script setup lang='ts'>
interface Props {
  data: {
    [t: string]: any
    title: string
    content: {
      [t: string]: string
    } | string
  }
}
const props = defineProps<Props>()

const dataHtml = computed(() => {
  if (typeof props.data.content === 'string')
    return props.data.content
  else
    return props.data.content[getCurrentLanguageForBackend()]
})
</script>

<template>
  <div class="dialog-message">
    <!-- <div class="title">
      {{ data.title }}
    </div> -->
    <div
      class="text"
      v-html="dataHtml"
    />
  </div>
</template>

<style lang='scss' scoped>
.dialog-message {
  padding: 0 var(--tg-spacing-16) var(--tg-spacing-16);

  .title {
    font-size: var(--tg-font-size-lg);
    font-weight: var(--tg-font-weight-semibold);
    color: var(--tg-text-white);
    text-align: center;
    margin-bottom: var(--tg-spacing-16);
  }

  .text {
    font-size: var(--tg-font-size-default);
    color: var(--tg-text-lightgrey);
    line-height: 1.5;
  }
}
</style>
