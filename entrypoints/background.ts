import { defineBackground } from '#imports'

export default defineBackground(() => {
  console.log('Hello background!', { id: chrome.runtime.id })
})
