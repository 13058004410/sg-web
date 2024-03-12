import FingerprintJS from '@fingerprintjs/fingerprintjs'

// Initialize an agent at application startup.
export const useFingerprint = createGlobalState(() => {
  const fpPromise = FingerprintJS.load()
  const visitorId = ref<string>('');
  (async () => {
    // Get the visitor identifier when you need it.
    const fp = await fpPromise
    visitorId.value = (await fp.get()).visitorId
  })()

  return visitorId
})
