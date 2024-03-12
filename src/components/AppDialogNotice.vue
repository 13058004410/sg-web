<script setup lang='ts'>
interface Props {
  data: {
    [t: string]: any
    title: string
    content: {
      [t: string]: string
    }
  }
}
defineProps<Props>()
</script>

<template>
  <div class="flex flex-col px-12 pb-18">
    <div class="bg-tg-secondary-dark relative w-full rounded-[4px] pt-[78.125%]">
      <div class="scroll-y absolute left-0 top-0 h-full w-full">
        <!-- 文字 -->
        <div v-if="data.pop_up_type === 1" class="text-tg-secondary-light p-[10px] leading-[1.5]" v-html="data.content[getCurrentLanguageForBackend()]" />
        <!-- 图片 -->
        <BaseImage v-if="data.pop_up_type === 2" class="h-full w-full" :url="data.image_url[getCurrentLanguageForBackend()]" is-network />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>
