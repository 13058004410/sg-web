import AppDialogFreeGetMany from '~/components/AppDialogFreeGetMany.vue'

export function useDialogFreeGetMany() {
  // const { t } = useI18n()
  const {
    openDialog: openFreeGetManyDialog,
    closeDialog: closeFreeGetManyDialog,
  } = useDialog({
    title: '免费获得 100 钱币',
    icon: 'uni-roulette',
    default: () => h(AppDialogFreeGetMany),
  })

  return {
    openFreeGetManyDialog,
    closeFreeGetManyDialog,
  }
}
