import { defineContentScript } from '#imports'
import { Content } from '@/utils/messaging'

export default defineContentScript({
  matches: ['https://open.spotify.com/*'],
  main() {
    console.debug('Registered context menu script.')

    const observer = new MutationObserver(bodyObserver)
    observer.observe(document.body, { childList: true })

    function bodyObserver() {
      const menu = document.querySelector<HTMLDivElement>('#context-menu > ul')
      if (!menu) return
      if (document.querySelector('#add-to-jamroad')) return

      // Get song element
      let song = document.querySelector<HTMLDivElement>(
        '[data-context-menu-open="true"]:has([href^="/track"])'
      )

      // Song might be the top search result
      if (!song) return console.debug('song element not found')

      // Get list container for prepending and add to playlist item
      const item = menu.querySelector('li')?.cloneNode(true) as HTMLLIElement
      if (!item) return console.debug('list or item element not found')

      // Remove dropdown arrow icon
      item.querySelector('button > span')?.remove()

      // Change label, set id, goldify
      const label = item.querySelector('span')!
      label.textContent = 'Add to Jamroad'

      item.id = 'add-to-jamroad'
      item.style = 'filter: sepia(1) saturate(5);'
      item.addEventListener('click', () => addToPlaylist(song))

      menu.insertAdjacentElement('afterbegin', item as HTMLElement)
    }

    // TODO: handle first song on search with big ahh element
    function addToPlaylist(song: HTMLElement) {
      const titleElement = song.querySelector<HTMLAnchorElement>('[href^="/track"]')!
      const title = titleElement.textContent!
      const link = titleElement.href!

      let image = song.querySelector<HTMLImageElement>('img')?.src
      let artist = titleElement.nextElementSibling?.querySelector('[href^="/artist"]')?.textContent

      // In artist page, the song artist doesnt show in the row
      if (!artist) {
        // [data-testid="artist-page"]'
        artist = document.querySelector('[data-testid="adaptiveEntityTitle"]')?.textContent!
      }

      // In album page, the song image doesnt show in the row
      if (!image) {
        // [data-testid="album-page"]
        image = document.querySelector<HTMLImageElement>('[aria-label*="album"] img')?.src!
      }

      // Ignore errors because cant receive any response here
      Content.sendMessage('add', { title, artist, link, image })
      Content.sendMessage('toast', {
        text: `Added "${title}" by ${artist}`
      })

      // Destroy context menu, details in the script
      // injectScript('/destroy-tippy.js')
      // Nah this function errors because it uses browser instead of chrome
      // Gotta do the longest way
      const script = document.createElement('script')
      script.src = chrome.runtime.getURL('/destroy-tippy.js')
      script.onload = () => script.remove()
      document.head.append(script)
    }
  },
})
