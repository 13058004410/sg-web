<script setup lang='ts'>
defineProps<{ game: string }>()

const emit = defineEmits(['close'])

const { t } = useI18n()
</script>

<template>
  <div
    class="bg-tg-dialog-mask absolute left-0 top-0 z-[999] h-full w-full flex justify-center overflow-hidden rounded-[8px] p-16"
    @click.self="emit('close')"
  >
    <div
      class="shadow-tg-shadow-inset-dialog bg-tg-primary relative h-fit max-h-full max-w-500 w-full overflow-y-scroll rounded-[8px]"
    >
      <div class="flex justify-between p-16">
        <div class="flex items-center">
          <BaseIcon name="uni-scales" />
          <span class="text-tg-text-white ml-8 font-semibold leading-[1.5]">{{ t('fairness') }}</span>
        </div>
        <BaseButton size="none" type="text" @click="emit('close')">
          <BaseIcon name="uni-close" />
        </BaseButton>
      </div>

      <AppMiniGameProvablyFair :game="game" />
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
