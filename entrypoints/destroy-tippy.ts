import { defineUnlistedScript } from '#imports'

/**
 * Tippy, aka the context menu or popup wont destroy automatically after
 * clicking any element, content script doesn't have access to JS context
 * used to store the destroy method, so have to do it the long way
 */
export default defineUnlistedScript(() => {
  const tippy = document.querySelector('body > [data-tippy-root]:has(#context-menu)')
  if (!tippy) return
  // @ts-expect-error internal attribute
  tippy?._tippy?.destroy?.()
})
