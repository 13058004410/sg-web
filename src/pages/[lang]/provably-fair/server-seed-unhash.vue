<script lang="ts" setup>
const { t } = useI18n()
const {
  value: serverSeedHash,
  errorMessage: seedMsg,
  validate: valiSeed,
} = useField<string>('seed', (v) => {
  if (!v)
    return t('this_field_is_required')
  return ''
})
const serverSeed = ref('N/A')

const { run, loading } = useRequest(() => ApiGameOriginalSeedDecryptHash(serverSeedHash.value), {
  onSuccess(res) {
    if (res.server_seed)
      serverSeed.value = res.server_seed
  },
})

async function handleUnhash() {
  serverSeed.value = 'N/A'
  await valiSeed()
  if (!seedMsg.value)
    run()
}
</script>

<template>
  <div class="layout-spacing reset gap-16">
    <BaseLabel :label="$t('server_seed_hash')">
      <BaseInput v-model="serverSeedHash" type="text" :msg="seedMsg" @on-right-button="handleUnhash">
        <template #right-button>
          <span class="text-tg-text-black">{{ $t('unhash') }}</span>
        </template>
      </BaseInput>
    </BaseLabel>
    <BaseLabel :label="$t('server_seed')">
      <AppCopyLine :loading="loading" :msg="serverSeed" />
    </BaseLabel>
  </div>
</template>

<style lang="scss" scoped>
.layout-spacing{
  --tg-base-input-right-button-bg: var(--tg-primary-success);
  --tg-base-input-right-button-hover-bg: var(--tg-primary-success);
}
</style>
