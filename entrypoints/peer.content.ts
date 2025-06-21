import { defineContentScript } from '#imports'
import Peer, { DataConnection } from 'peerjs'
import { sendMessage, createToast, onMessage } from '@/utils/messaging'
import { createPeer, PEER_ID_PREFIX } from '@/utils/p2p'
import { usernameStorage } from '@/utils/storage'


export default defineContentScript({
  matches: ['https://open.spotify.com/*'],
  async main() {
    console.debug('Registered peer content script')

    let peer: Peer

    onMessage('join', ({ data }) =>
      new Promise((res) => {
        createToast(`Joining ${data}...`)
        peer.connect(`jamroad-${data}`)
          .once('open', () => {
            sendMessage('addPeer', data)
            createToast(`Joined ${data}`)
            res(true)
          })
          .once('error', () => res(false))
          .once('close', () => res(false))
      })
    )

    onMessage('removePeer', ({ data }) => {
      const connection = (peer.connections as Record<string, [DataConnection] | undefined>)[PEER_ID_PREFIX + data]

      if (!connection || !connection[0]) return false

      createToast(`Removing ${data}...`)
      connection[0].close({ flush: true })
      return true
    })

    usernameStorage.getValue().then(tryCreatePeer)
    usernameStorage.watch(tryCreatePeer)

    async function tryCreatePeer(username?: string) {
      if (!username) {
        if (peer && !peer.disconnected) peer.destroy()
        return
      }

      console.debug('username changed', username)

      peer = await createPeer(username)
    }

    // // Get Spotify username from page (UNUSED (YET))
    // let username: string = ''
    //
    // await new Promise<void>((resolve) => {
    //   const observer = new MutationObserver(() => {
    //     const profile = document.querySelector<HTMLDivElement>('[data-testid="user-widget-avatar"]')
    //     if (!profile) return
    //
    //     username = profile.title
    //     // userImage = profile.querySelector('img')?.src
    //
    //     observer.disconnect()
    //     resolve()
    //   })
    //
    //   observer.observe(document.querySelector('#main') ?? document.body, { childList: true })
    // })
  }
})
