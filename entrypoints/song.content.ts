import { defineContentScript } from '#imports'
import { Content } from '@/utils/messaging'

export default defineContentScript({
  matches: ['https://open.spotify.com/*'],
  main() {
    console.log('registered song content script')

    // Peak url hijacking to force user play song
    // Its possible to use the official api but its risky
    Content.onMessage('play', ({ data }) => playSong(data))

    // Testing add song
    Content.onMessage('add', ({ data }) => {
      console.log('playing song', data, 'in 5 seconds')
      setTimeout(() => playSong(data.link), 5000)
    })

    let loadingSong = false

    function playSong(link: string): boolean {
      console.log('trying to play song', link, loadingSong)
      if (loadingSong) return false

      loadingSong = true

      // Save current user state in case they're in lyrics page
      const isLyrics = location.pathname.startsWith('/lyrics')

      // Change tab url without refreshing
      history.pushState(null, '', link)
      // Trigger react app refresh
      location.hash = 'refresh'

      // Play the song! (if the button is found)
      let tries = 0

      // Lets try in 10 secs
      const timeoutId = setTimeout(() => {
        if (++tries > 20) clearTimeout(timeoutId)

        const button = document.querySelector<HTMLButtonElement>(
          '[data-testid="track-page"] [data-testid="action-bar-row"] [data-testid="play-button"]'
        )

        if (!button) return console.log('button not fund')

        button.click()
        clearTimeout(timeoutId)
      }, 500)

      // Restore user lyrics page
      if (isLyrics) {
        history.pushState(null, '', '/lyrics')
        location.hash = 'refresh'
      }

      loadingSong = false
      return true
    }
  }
})
