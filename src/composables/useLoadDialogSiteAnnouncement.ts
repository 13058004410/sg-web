export function useLoadDialogSiteAnnouncement() {
  const { isLogin } = storeToRefs(useAppStore())
  // 弹窗公告相关
  const {
    clearYesterdayNoticeCache,
    checkIsNoMore,
    hideNoMoreTipIds,
    noticeList,
  } = useDialogSiteAnnouncementList()
  // 未登录状态的公告弹框和跑马灯
  useRequest(ApiMemberNoticeAllList, {
    manual: false,
    onBefore() {
      clearYesterdayNoticeCache()
    },
    onSuccess(data) {
      if (data.notice && data.notice.length > 0 && !isLogin.value) {
      // 过滤已经勾选不再显示的公告
        const arr = data.notice.filter(a => !checkIsNoMore(a.id))
        // 保存所有隐藏‘今日不再提示’的id
        hideNoMoreTipIds.value = arr.map((a) => {
          if ((a.bounce_frequency === 2 && a.bounce_frequency_limit < 3) || a.is_limit === 2)
            return a.id
          return ''
        }).filter(b => !!b)

        if (arr.length > 0) {
          noticeList.value = arr.slice(0, 4)
          const { openDialogSiteAnnouncement } = useDialogSiteAnnouncement()
          openDialogSiteAnnouncement(noticeList.value)
        }
      }
    },
  })
  // 登录后的公告接口
  useRequest(() => ApiMemberNoticeList({ types: '1' }), {
    ready: isLogin,
    manual: false,
    onSuccess(res) {
      if (res) {
        // 保存所有隐藏‘今日不再提示’的id
        hideNoMoreTipIds.value = res.map((a) => {
          if ((a.bounce_frequency === 2 && a.bounce_frequency_limit < 3) || a.is_limit === 2)
            return a.id
          return ''
        }).filter(b => !!b)
      }

      if (res.length > 0) {
        noticeList.value = res.slice(0, 4)
        const { openDialogSiteAnnouncement } = useDialogSiteAnnouncement()
        openDialogSiteAnnouncement(noticeList.value)
        // 记录弹窗频率
        ApiMemberNoticeLimitCount({ types: 1, is_check: 1, ids: noticeList.value.filter(b => b.bounce_frequency === 2).map(a => a.id) })
      }
    },
  })
}
