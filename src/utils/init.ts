let sportsMaintainedStatus: Promise<boolean> | null = null

interface GlobalInitMap {
  /** 体育馆维护状态 */
  isSportsMaintained: boolean | null
  /** 体育馆维护开始时间 */
  sportsMaintainedStartTime: number | null
  /** 体育馆维护结束时间 */
  sportsMaintainedEndTime: number | null
  /** 默认跳转首页 */
  defaultRedirect: string
}

/** 全局初始化数据 */
const globalInitMap: GlobalInitMap = {
  isSportsMaintained: null,
  sportsMaintainedStartTime: null,
  sportsMaintainedEndTime: null,
  defaultRedirect: 'casino',
}

/**
 * 设置体育馆维护状态
 * @param status
 */
export function setIsSportsMaintained(status: boolean) {
  globalInitMap.isSportsMaintained = status
}

/**
 * 设置体育馆维护开始时间和结束时间
 * @param time
 */
export function setSportsMaintainedTime(startTime: number, endTime: number) {
  globalInitMap.sportsMaintainedStartTime = startTime * 1000
  globalInitMap.sportsMaintainedEndTime = endTime * 1000
}

/**
 * 获取体育馆维护状态
 * @returns {Promise<boolean>}
 */
export async function getSportsMaintainedStatus(): Promise<boolean> {
  if (sportsMaintainedStatus === null) {
    sportsMaintainedStatus = new Promise((resolve, reject) => {
      ApiMemberPlatformList({ game_type: 4, auth: false, page: 1, page_size: 10 }).then((res) => {
        if (res.d.length === 0) {
          setIsSportsMaintained(false)
          resolve(globalInitMap.isSportsMaintained as boolean)
        }
        else {
          const currentProvider = res.d[0].id
          const sportsObj = res.d.find(a => a.id === currentProvider)
          setIsSportsMaintained(sportsObj?.maintained === '2')
          setSportsMaintainedTime(sportsObj?.maintained_st, sportsObj?.maintained_et)

          resolve(globalInitMap.isSportsMaintained as boolean)
        }
      }).catch((err) => {
        console.error('err', err)
        reject(err)
      })
    })
  }

  return sportsMaintainedStatus
}

/**
 * 请求页面初始化跳转
 * @returns void
 */
export function requestPageInitRedirect() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      ApiMemberChannelNavLocation().then((res) => {
        // 1首页，2娱乐城，3体育，4联盟中心
        if (res === 1 || res === 2)
          globalInitMap.defaultRedirect = 'casino'
        else if (res === 3)
          globalInitMap.defaultRedirect = 'sports/401'
        else if (res === 4)
          globalInitMap.defaultRedirect = 'affiliate/promotion-tutorial'

        resolve(true)
      }).catch((err: any) => {
        console.error('er123r', err)
        reject(err)
      })
    }, 1000)
  })
}

export function globalInit() {
  return Promise.all([
    getSportsMaintainedStatus(),
    requestPageInitRedirect(),
  ])
}

export {
  globalInitMap,
}
