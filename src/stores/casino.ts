import { acceptHMRUpdate, defineStore } from 'pinia'
import type { CasinoProviderItem } from '~/apis/types'

export const useCasinoStore = defineStore('casino', () => {
  const { t } = useI18n()
  const isSidebarHasProvider = ref(false)
  const { VITE_OFFICIAL_NAME } = getEnv()
  const currentCasinoNav = ref('')
  const firstCasinoNav = ref('')

  const { list: bigPlats } = useList(ApiMemberPlatformList, {
    manual: false,
  })
  /** 游戏提供商数据(PG,EVO,...) */
  const { list: venueList } = useList(ApiMemberPlatformVenueList, {
    manual: false,
  })
  const platformList = computed(() => {
    const arr: CasinoProviderItem[] = []
    for (let i = 0; i < venueList.value.length; i++) {
      if (!arr.find(a => a.venue_id === venueList.value[i].venue_id))
        arr.push(venueList.value[i])
    }
    return arr
  })
  // 厂商列表读取/member/game/cate?cid=5
  const { data: cateProviderData } = useRequest(() => ApiMemberGameCate({ cid: '5' }), { manual: false })

  // 大厅总数据接口
  const { data, runAsync: runAsyncGameLobby } = useRequest(ApiMemberGameLobby, {
    manual: false,
    onSuccess(res) {
      if (res.navs && res.navs.length > 0) {
        // 修改大厅的ty
        res.navs.forEach((item, index) => {
          if (item.ty === 1 && item.cid === '1') {
            res.navs[index].ty = -1
            res.navs[index].cid = 'all'
            res.navs[index].platform_id = 'all'
          }
        })
        firstCasinoNav.value = res.navs[0].ty === 1 ? res.navs[0].cid : res.navs[0].platform_id
        currentCasinoNav.value = res.navs[0].ty === 1 ? res.navs[0].cid : res.navs[0].platform_id
      }

      if (res.sidebars && res.sidebars.find(a => a.cid === '5'))
        isSidebarHasProvider.value = true
    },
  })
  // 横向菜单
  const casinoNav = computed(() => {
    if (data.value) {
      if (data.value.navs) {
        const _navs: {
          ty: number
          cid: string
          platform_id: string
          name: string
          icon: string
          background: string
          useCloudImg: boolean
        }[] = cloneDeep(data.value.navs)

        for (let i = 0; i < _navs.length; i++)
          _navs[i].useCloudImg = true

        // TODO:临时写死小游戏入口
        _navs.splice(1, 0, {
          cid: 'mini',
          name: t('casino_origin_game', { site: VITE_OFFICIAL_NAME }),
          ty: 99,
          platform_id: 'mini',
          icon: 'chess-original-game',
          background: '',
          useCloudImg: false,
        })
        return _navs.map((a) => {
          return {
            ...a,
            label:
             a.name,
            value: a.ty === 1 ? a.cid : a.platform_id,
          }
        })
      }
      return null
    }
    return []
  })
  // 大厅游戏列表
  const casinoGameList = computed(() => {
    if (data.value && data.value.litems) {
      return data.value.litems.map(a => ({
        ...a,
        title: a.name,
        list: [],
        path: a.ty === 1
          ? `/casino/group/category?cid=${a.cid}`
          : `/casino/group/provider?pid=${a.platform_id}`,
        useCloudImg: true,
      }))
    }
    return []
  })
  // 左侧边栏
  const casinoSidebar = computed(() => {
    if (data.value && data.value.sidebars) {
      return data.value.sidebars.filter(b => b.cid !== '5').map(a => ({
        ...a,
        title: a.name,
        list: [],
        path: a.ty === 1
          ? `/casino/group/category?cid=${a.cid}`
          : `/casino/group/provider?pid=${a.platform_id}`,
        useCloudImg: true,
      }))
    }
    return []
  })
  // 推荐游戏
  const casinoRecData = computed(() => {
    if (data.value && data.value.bottoms) {
      const obj = data.value.bottoms[0]
      return {
        ...obj,
        path: `/casino/group/category?cid=${obj.cid}`,
        useCloudImg: true,
      }
    }

    return {
      ty: 1,
      total: 0,
      platform_id: '0',
      name: t('casino_games_recommend'),
      icon: 'uni-rec-games',
      games: [],
      path: '',
      cid: '',
      useCloudImg: false,
    }
  })

  function getBg(cid: string) {
    if (data.value) {
      const navs = data.value.navs ?? []
      const sidebars = data.value.sidebars ?? []
      const bottoms = data.value.bottoms ?? []
      const arr = [...navs, ...sidebars, ...bottoms]
      const str = arr.find(a => a.cid === cid)?.background ?? ''
      return str
    }
    return ''
  }
  function getTitleByCid(cid: string) {
    if (cid == '16')
      return t('game_type_rec')

    if (data.value) {
      const navs = data.value.navs ?? []
      const sidebars = data.value.sidebars ?? []
      const items = data.value.items ?? []
      const bottoms = data.value.bottoms ?? []
      const arr = [...navs, ...sidebars, ...items, ...bottoms]
      const str = arr.find(a => a.cid === cid)?.name ?? ''
      return str
    }
    return ''
  }
  function getTitleByVid(vid: string) {
    if (venueList.value)
      return venueList.value.find(a => a.venue_id === vid)?.name ?? ''

    return ''
  }

  return {
    bigPlats,
    allPlatformList: venueList,
    platformList,
    casinoNav,
    casinoGameList,
    casinoSidebar,
    cateProviderData,
    lobbyBdata: data,
    isSidebarHasProvider,
    casinoRecData,
    currentCasinoNav,
    firstCasinoNav,
    runAsyncGameLobby,
    getBg,
    getTitleByCid,
    getTitleByVid,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCasinoStore, import.meta.hot))
