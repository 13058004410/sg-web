<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col gap-16 p-16">
    <div class="text-[18px] font-500">
      1.邀请好友帮忙提现
    </div>
    <AppApplicationSharing share-text="https://baidu.com" />
    <AppCopyLine msg="aaa" />
    <div class="text-[18px] font-500">
      2.向随机玩家发送帮助邀请
    </div>
    <div class="text-tg-secondary-light grid grid-cols-3 justify-items-center gap-y-12 rounded-[4px] bg-[#0F212E] py-12">
      <div v-for="i in 9" :key="i">
        5511948798660
      </div>
    </div>
    <div class="grid grid-cols-2 gap-12">
      <BaseButton class="btn-receive" bg-style="secondary">
        WhatsApp发送
      </BaseButton>
      <BaseButton class="btn-receive" bg-style="secondary">
        短信发送
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
