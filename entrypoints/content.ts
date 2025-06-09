import { defineContentScript } from '#imports'

export default defineContentScript({
  matches: ['https://open.spotify.com/*'],
  main() {
    console.log('Hello Spotify.')
  },
})
