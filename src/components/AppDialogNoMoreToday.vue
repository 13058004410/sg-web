<script setup lang='ts'>
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const {
  currentNoticeId,
  noticeList,
  saveCurrentNoticeId,
  removeCurrentNoticeId,
  checkIsNoMore,
  checkHideNoMoreTip,
} = useDialogSiteAnnouncementList()
const { bool: checked } = useBoolean(false)
const { bool: hide } = useBoolean(false)

function onNoMoreTipChecked(v: boolean) {
  if (isLogin.value) {
    ApiMemberNoticeLimitCount({
      types: 2,
      is_check: checked.value ? 1 : 2,
      ids: [noticeList.value.find(a => a.id === currentNoticeId.value)?.id ?? ''],
    })
  }
  if (v)
    return saveCurrentNoticeId()
  removeCurrentNoticeId()
}

watch(currentNoticeId, (a) => {
  checked.value = checkIsNoMore(a)
  hide.value = checkHideNoMoreTip(a)
})

onMounted(() => {
  checked.value = checkIsNoMore(currentNoticeId.value)
  hide.value = checkHideNoMoreTip(currentNoticeId.value)
})
</script>

<template>
  <div v-show="!hide" class="flex items-center">
    <BaseCheckBox
      v-model="checked"
      style="--tg-base-checkbox-label-color:var(--tg-text-white);"
      @check="onNoMoreTipChecked"
    >
      {{ t('dont_tip_today') }}
    </BaseCheckBox>
  </div>
</template>

<style lang='scss' scoped>

</style>
