import { defineContentScript } from '#imports'
import Toastify from 'toastify-js'
import StartToastifyInstance from 'toastify-js'
import { Content, ToastMessage } from '@/utils/messaging'
import 'toastify-js/src/toastify.css'

export default defineContentScript({
  matches: ['https://open.spotify.com/*'],
  main() {
    console.debug('Registered toast content script')

    const toasts = new Map<number, ReturnType<typeof StartToastifyInstance>>()

    function createToast({ text, duration }: ToastMessage): number {
      const id = Math.round(Math.random() * 999_999)
      const toast = Toastify({
        text,
        duration,
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: false,
        offset: {
          x: 0,
          y: '5rem'
        },
        style: {
          background: '#e6efcd',
          color: '#1d230b'
        },
      })

      toasts.set(id, toast)
      toast.showToast()

      if (duration && duration > 0) {
        setTimeout(() => toasts.has(id) && toasts.delete(id), duration)
      }

      return id
    }

    function destroyToast(id: number): boolean {
      if (!toasts.has(id)) return false

      toasts.get(id)?.hideToast()
      toasts.delete(id)

      return true
    }

    Content.onMessage('toast', ({ data }) => createToast(data))
    Content.onMessage('destroyToast', ({ data }) => destroyToast(data))
  },
})
