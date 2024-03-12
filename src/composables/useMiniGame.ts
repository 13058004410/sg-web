import WujieVue from 'wujie-vue3'

type GameType = 'dice' | 'plinko' | 'limbo'

export function useMiniGame(gameName: GameType) {
  const { bus } = WujieVue
  const { DEV, VITE_MINIGAME_BASEURL, VITE_CASINO_IMG_CLOUD_URL } = getEnv()
  const origin = location.origin
  const appStore = useAppStore()
  const router = useLocalRouter()
  const { isLogin, currentGlobalCurrency, currentGlobalCurrencyBalance } = storeToRefs(appStore)
  const { logoAndIcoAndLoading } = storeToRefs(useAppStore())
  const { openRegisterDialog } = useRegisterDialog()
  const { openDialogBetSlipOriginalGame } = useDialogBetSlipOriginalGame()
  const { openNotify } = useNotify()
  const { getRate } = useExchangeRate()
  const { bool: showProvablyFair } = useBoolean(false)
  const initVerifyGame = ref('')

  const gameProps = computed(() => {
    const p: {
      staticDomain: string
      logoUrl: string
      currencyId: string
      currency: string
      lang: string
      backendLang: string
      getBalanceData: () => void
      openNotify: (msg: any) => void
      balance?: number
      token?: string
      /** 汇率 */
      rate: string
      /** 货币符号 */
      currencyPrefix: string
      /** 小数位数 */
      decimalNum: number
    } = {
      staticDomain: VITE_CASINO_IMG_CLOUD_URL,
      logoUrl: logoAndIcoAndLoading.value.logo_white,
      currencyId: getCurrencyConfig(currentGlobalCurrency.value).cur,
      currency: currentGlobalCurrency.value,
      lang: getCurrentLanguageForFrontend(),
      backendLang: getCurrentLanguageForBackend(),
      balance: currentGlobalCurrencyBalance.value,
      rate: application.isVirtualCurrency(currentGlobalCurrency.value) ? getRate(currentGlobalCurrency.value, 'USDT')?.targetNum ?? '1' : '1',
      currencyPrefix: application.isVirtualCurrency(currentGlobalCurrency.value) ? 'US$' : currencyConfig[currentGlobalCurrency.value].prefix,
      decimalNum: application.getCurrencySuffixLength(currentGlobalCurrency.value),
      getBalanceData: appStore.getBalanceData,
      openNotify,
    }
    if (isLogin.value)
      p.token = appStore.getToken()

    return p
  })

  const gameUrl = computed(() => {
    const _url = getMiniGameUrl()
    return `${_url}/`
  })

  function getMiniGameUrl() {
    let _base = ''
    if (DEV)
      _base = VITE_MINIGAME_BASEURL
    else
      _base = `${origin}/minigame/${gameName}`
    return _base
  }

  function openRegister() {
    openRegisterDialog()
  }

  function jumpToProvably() {
    router.push('/provably-fair/overview')
  }
  /** 打开公平性弹窗 */
  function onOpenProvablyFair(game: string) {
    initVerifyGame.value = game
    showProvablyFair.value = true
  }
  /** 打开投注记录弹窗 */
  function onOpenDialogBetRecord(data: { id: string;game: string }) {
    openDialogBetSlipOriginalGame(data)
  }

  onMounted(() => {
    bus.$on('openRegister', openRegister)
    bus.$on('scrollToTop', scrollMainContentToTop)
    bus.$on('jumpProvably', jumpToProvably)
    bus.$on('openProvablyFair', onOpenProvablyFair)
    bus.$on('openDialogBetRecord', onOpenDialogBetRecord)
  })

  onUnmounted(() => {
    bus.$off('openRegister', openRegister)
    bus.$off('openRegister', openRegister)
    bus.$off('scrollToTop', scrollMainContentToTop)
    bus.$off('jumpProvably', jumpToProvably)
    bus.$off('openProvablyFair', onOpenProvablyFair)
    bus.$off('openDialogBetRecord', onOpenDialogBetRecord)
  })

  watch(currentGlobalCurrencyBalance, (v) => {
    setTimeout(() => {
      bus.$emit('channelMessageWujie', {
        balance: v,
      })
    }, 1500)
  })

  watch(currentGlobalCurrency, (v) => {
    bus.$emit('channelMessageWujie', {
      currency: v,
      currencyId: getCurrencyConfig(v).cur,
      rate: application.isVirtualCurrency(v) ? getRate(v, 'USDT')?.targetNum ?? '1' : '1',
      currencyPrefix: application.isVirtualCurrency(v) ? 'US$' : currencyConfig[v].prefix,
      decimalNum: application.getCurrencySuffixLength(v),
    })
  })

  watch(isLogin, (v) => {
    bus.$emit('channelMessageWujie', {
      token: v ? appStore.getToken() : undefined,
    })
  })

  watch(logoAndIcoAndLoading, (v) => {
    setTimeout(() => {
      bus.$emit('channelMessageWujie', {
        logoUrl: v.logo_white,
      })
    }, 1500)
  })

  return {
    gameUrl,
    gameProps,
    showProvablyFair,
    initVerifyGame,
  }
}
