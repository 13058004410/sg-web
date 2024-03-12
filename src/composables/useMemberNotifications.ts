import { i18n } from '~/modules/i18n'
import AppMemberNotificationsMessage from '~/components/AppMemberNotificationsMessage.vue'

export function useMemberNotifications(data: any) {
  console.log('收到mqtt通知了,useMemberNotifications====>', data)
  const token = Local.get<string | undefined>(STORAGE_TOKEN_KEY)?.value
  if (!token)
    return
  const { title } = data
  const { t } = i18n.global
  const { openNotify } = useNotify()
  const isSuccess = title.includes('success')
  const isFail = title.includes('fail')

  const content = JSON.parse(data.payload)
  const amount = isSuccess ? content.finally_amount : (content.pay_amount ?? content.finally_amount)
  const currencyType = content.currency_name

  let lastWord = ''
  if (isSuccess)
    lastWord = t(`${title}_received`)
  else if (isFail)
    lastWord = t(title)
  else
    lastWord = t(`${title}_now`)

  openNotify({
    type: isFail ? 'error' : 'wallet',
    title: t(title),
    message: () => h(AppMemberNotificationsMessage, { amount, currencyType, lastWord }),
  })
}
