import AppDialogBetSlipOriginalGame from '~/components/AppDialogBetSlipOriginalGame.vue'
import { i18n } from '~/modules/i18n'

export function useDialogBetSlipOriginalGame() {
  const { t } = i18n.global
  const title = computed(() => t('menu_title_settings_bets'))
  const {
    openDialog: openDialogBetSlipOriginalGame,
    closeDialog: closeDialogBetSlipOriginalGame,
  } = useDialog({
    title: title.value,
    icon: 'uni-checklist',
    default: (data: { id: string;game: string }) => h(AppDialogBetSlipOriginalGame, { data }),
  })

  return {
    openDialogBetSlipOriginalGame,
    closeDialogBetSlipOriginalGame,
  }
}
