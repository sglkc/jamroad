import { defineContentScript } from '#imports'
import { sendMessage, onMessage } from '@/utils/messaging'
import { SongMetadata } from '@/utils/types'

export default defineContentScript({
  matches: ['https://open.spotify.com/*'],
  main() {
    console.debug('Registered song content script')

    // Peak url hijacking to force user play song
    // Its possible to use the official api but its risky
    onMessage('play', ({ data }) => {
      playSong(data)
      return true
    })

    // Testing add song
    onMessage('add', ({ data }) => {
      console.debug('playing song', data, 'in 5 seconds')
      setTimeout(() => playSong(data), 5000)
      return true
    })

    let loadingSong = false

    async function playSong({ artist, link, title }: SongMetadata): Promise<boolean> {
      if (loadingSong) return false

      const toastId = await sendMessage('toast', {
        text: `Playing "${title}" by ${artist}`,
        duration: -1,
      })

      loadingSong = true

      // Save current user url to restore state
      const pathname = location.pathname

      // Change tab url without refreshing
      history.replaceState(null, '', link)
      // Trigger react app refresh
      location.replace('#refresh')

      // Play the song! (if the button is found)
      let intervalId: NodeJS.Timeout | undefined

      await new Promise<void>((resolve) => {
        let tries = 0

        // Lets try in 10 secs
        intervalId = setInterval(() => {
          if (tries > 10) resolve()

          const button = document.querySelector<HTMLButtonElement>(
            '[data-testid="track-page"] [data-testid="action-bar-row"] [data-testid="play-button"]'
          )

          console.debug(tries, button)

          if (button) {
            button.click()
            resolve()
          } else {
            console.debug('Song play button not found')
          }

          tries++
        }, 500)
      })

      clearInterval(intervalId)

      // Restore user url
      if (pathname) {
        history.replaceState(null, '', pathname)
        location.replace('#refresh')
      }

      sendMessage('destroyToast', toastId)
      loadingSong = false

      return true
    }
  }
})
