import { HttpClient } from 'feie-ui'
import { i18n } from '~/modules/i18n'
import { router } from '~/modules/router'

const { VITE_HTTP_TIMEOUT, PROD } = getEnv()

interface IResponse<T> {
  status: boolean
  data: T
}

const { t } = i18n.global
const { openNotify } = useNotify()
const { openLoginDialog } = useLoginDialog()

const dataIsTokenHandler = debounce((responseStatus: any, response: any) => {
  const appStore = useAppStore()
  const { closeRightSidebar, rightIsExpand } = useRightSidebar()
  const { setCloseAllDialog } = useDialogList()
  setCloseAllDialog(true)
  appStore.removeToken()
  appStore.removeUserInfo()
  appStore.setMqttConnectedFalse()
  socketClient.connect('token失效 重新连接')
  if (rightIsExpand.value)
    closeRightSidebar()

  openNotify({
    type: 'error',
    code: `${responseStatus}`,
    message: `
              ${isTestEnv() ? `Url: ${response.config.url}<br />` : ''}
              ${t('login_fail_tip')}
            `,
  })
  if (router.currentRoute.value.path !== '/') {
    router.push('/')
    openLoginDialog()
  }
}, 4000, {
  leading: true,
  trailing: false,
})

function getDevice() {
  const isMobile = window.innerWidth <= 768
  if (isMobile)
    return 25
  else return 24
}

export const httpClient = new HttpClient({
  baseURL: PROD ? '' : '/api',
  timeout: VITE_HTTP_TIMEOUT,
  isEncryption: false,
  isSign: true,
  // showConsole: getEnv().MODE !== 'production',
  showConsole: true,
  requestInterceptors: [
    // 设置token和dn
    (config: any) => {
      const isAuth = config.method === 'get' ? config.params?.auth : config.data?.auth
      if (isAuth !== false) {
        const appStore = useAppStore()
        const token = appStore.getToken()
        if (token)
          config.headers.t = token
      }

      config.headers.dn = application.getDeviceNumber()

      return config
    },
    // 设置全局header
    (config: any) => {
      config.headers.d = getDevice()
      config.headers.lang = getCurrentLanguageForBackend()
      return config
    },
  ],
  responseInterceptors: [
    // 处理后端status为false的情况
    (response: any) => {
      const { status, data } = response.data as IResponse<any>
      const responseStatus = response.status

      if (!status) {
        // 如果后端返回token，关闭所有请求，清除token
        if (data === 'token') {
          dataIsTokenHandler(responseStatus, response)
        }
        else {
          if (!response.config.params?.noNotify) {
            // 打印请求参数
            openNotify({
              type: 'error',
              code: `${responseStatus}`,
              message: `
                ${isTestEnv() ? `Url: ${response.config.url}<br />` : ''}
                ${data || t('sys_error')}
              `,
            })
          }
        }

        // 直接抛出错误，不再执行后续操作
        return Promise.reject(new Error(`${response.config.url}发生错误：status: ${status}, data: ${JSON.stringify(data)}`))
      }
      return response
    },
  ],
  responseErrorHandle: (error: any) => {
    const status = error.response.status
    openNotify({
      type: 'error',
      code: `${status}`,
      message: `
        ${isTestEnv() ? `Url: ${error.config.url}<br />` : ''}
        ${t('find_error')}：${status}
      `,
    })
  },
})
