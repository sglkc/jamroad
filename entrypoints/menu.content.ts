import { defineContentScript } from '#imports'
import { Content } from '@/utils/messaging'

export default defineContentScript({
  matches: ['https://open.spotify.com/*'],
  main() {
    console.log('Registered context menu script.')

    const observer = new MutationObserver(bodyObserver)
    observer.observe(document.body, { childList: true })

    function bodyObserver() {
      const menu = document.querySelector<HTMLDivElement>('#context-menu > ul')
      if (!menu) return
      if (document.querySelector('#add-jamify')) return

      // Get song element
      const song = document.querySelector<HTMLDivElement>('[data-testid="tracklist-row"][data-context-menu-open="true"]')
      if (!song) return console.debug('song element not found')

      // Get list container for prepending and add to playlist item
      const item = menu.querySelector('li')?.cloneNode(true) as HTMLLIElement
      if (!item) return console.debug('list or item element not found')

      // Remove dropdown arrow icon
      item.querySelector('button > span')?.remove()

      // Change label, set id, goldify
      const label = item.querySelector('span')!
      label.textContent = 'Add to shared playlist'

      item.id = 'add-jamify'
      item.style = 'filter: sepia(1) saturate(5);'
      item.addEventListener('click', () => addToPlaylist(song))

      menu.insertAdjacentElement('afterbegin', item as HTMLElement)
    }

    // TODO: handle first song on search with big ahh element
    function addToPlaylist(song: HTMLElement): void {
      const titleElement = song.querySelector<HTMLAnchorElement>('[href^="/track"]')!
      const title = titleElement.textContent!
      const link = titleElement.href!

      let artist = titleElement.nextElementSibling?.textContent

      // In artist page, the song artist doesnt show
      if (!artist) {
        // document.querySelector('[data-testid="artist-page"]')
        artist = document.querySelector('[data-testid="adaptiveEntityTitle"]')?.textContent!
      }

      Content.sendMessage('add', { title, artist, link })
      console.log(`Added song "${title}" by ${artist} (${link})`)

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
