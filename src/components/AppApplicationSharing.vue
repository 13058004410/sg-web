<script setup lang="ts">
interface Props {
  /** 需要分享的内容 */
  shareText: string
}

const props = defineProps<Props>()

const router = useLocalRouter()

const socialData = [
  {
    label: 'Facebook',
    img: '/png/settings/social-facebook.png',
    link: 'https://www.facebook.com/sharer/sharer.php?u=',
  },
  {
    label: 'WhatsApp',
    img: '/png/settings/social-whatsapp.png',
    link: 'https://api.whatsapp.com/send?text=',
  },
  {
    label: 'Telegram',
    img: '/png/settings/social-telegram.png',
    link: 'https://t.me/share/url?url=',
  },
  {
    label: 'X',
    img: '/png/settings/social-x.png',
    link: 'https://twitter.com/intent/tweet?text%20&url=',
  },
  {
    label: 'Gmail',
    img: '/png/settings/social-gmail.png',
    link: 'Gmail',
  },
]

function openLink(link: string) {
  if (link === 'Gmail')
    window.location.href = `mailto:?subject=&body=${props.shareText}`
  else
    link && router.push(link + props.shareText)
}
</script>

<template>
  <div class="share-wrap">
    <div v-for="(item, index) in socialData" :key="index" class="social" @click="openLink(item.link)">
      <BaseImage :url="item.img" width="28px" height="28px" class="promotion-base-image" />
      {{ item.label }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.share-wrap{
  width: 100%;
  gap: var(--tg-spacing-12);
  justify-content: space-between;
  display: grid;
  grid-template-columns: repeat(auto-fit, 54px);
}
.social{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--tg-spacing-8);
  font-size: var(--tg-font-size-xs);
  cursor: pointer;
  .promotion-base-image{
    width: 28px;
    height: 28px;
    --tg-base-img-style-radius: var(--tg-radius-default);
  }
}
</style>
