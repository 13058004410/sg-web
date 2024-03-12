<script setup lang='ts'>
import type { INoticeItem } from '~/apis/types'

interface Props {
  data: INoticeItem[]
}
const props = defineProps<Props>()

const { isLogin } = storeToRefs(useAppStore())
const lang = getCurrentLanguageForBackend()
const { setCurrentNoticeId } = useDialogSiteAnnouncementList()

const tab = ref(props.data[0].id)

const tabList = computed(() => {
  return props.data.map((a) => {
    return { ...a, label: a.title[lang], value: a.id }
  })
})
const currentNotice = computed(() => tabList.value.find(a => a.id === tab.value))
const isText = computed(() => currentNotice.value?.pop_up_type === 1)
const isImg = computed(() => currentNotice.value?.pop_up_type === 2)
const textContent = computed(() => currentNotice.value?.content[lang] || currentNotice.value?.content.default || '')
const imgUrl = computed(() => currentNotice.value?.image_url[lang] ?? '')

const { run: runNoticeRead } = useRequest(() => ApiMemberNoticeReadInsert({ id: tab.value }))

function onTabChange(v: string) {
  setCurrentNoticeId(v)
  if (isLogin.value && currentNotice.value?.is_read === 2)
    runNoticeRead()
}

onMounted(() => {
  setCurrentNoticeId(tab.value)
  if (isLogin.value && currentNotice.value?.is_read === 2)
    runNoticeRead()
})
</script>

<template>
  <div class="flex flex-col px-12 pb-18">
    <div v-if="tabList.length > 1" class="fade-bg">
      <BaseTab v-model="tab" :list="tabList" :center="false" @change="onTabChange" />
    </div>
    <div class="bg-tg-secondary-dark relative w-full rounded-[4px] pt-[78.125%]">
      <div class="scroll-y absolute left-0 top-0 h-full w-full">
        <!-- 文字 -->
        <div v-if="isText" class="text-tg-secondary-light p-[10px] leading-[1.5]" v-html="textContent" />
        <!-- 图片 -->
        <BaseImage v-if="isImg" class="h-full w-full" :url="imgUrl" is-network />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.fade-bg{
  position: relative;
  margin-bottom: 15px;
  &::after{
    content: '';
    display: block;
    width: 100%;
    height: 54px;
    background-color: var(--tg-secondary-dark);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 100px;
    z-index: -1;
  }
}
</style>
