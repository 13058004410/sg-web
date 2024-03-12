import AppDialogInviteFriendHelp from '~/components/AppDialogInviteFriendHelp.vue'

export function useDialogInviteFriendHelp() {
  // const { t } = useI18n()
  const {
    openDialog: openInviteFriendHelpDialog,
    closeDialog: closeInviteFriendHelpDialog,
  } = useDialog({
    // title: '1.邀请好友帮忙提现',
    // icon: 'uni-roulette',
    default: () => h(AppDialogInviteFriendHelp),
  })

  return {
    openInviteFriendHelpDialog,
    closeInviteFriendHelpDialog,
  }
}
