import { defineContentScript } from '#imports'
import Peer from 'peerjs'
import { sendMessage, ContentProtocolMap, createToast } from '@/utils/messaging'
import { createPeer } from '@/utils/p2p'
import { statusStorage, usernameStorage } from '@/utils/storage'

interface PeerData<T extends keyof ContentProtocolMap = keyof ContentProtocolMap> {
  type: T
  data: Parameters<ContentProtocolMap[T]>[0]
}

export default defineContentScript({
  matches: ['https://open.spotify.com/*'],
  async main() {
    console.debug('Registered peer content script')

    let peer: Peer

    usernameStorage.watch(async (username) => {
      if (!username) return
      if (peer && !peer.disconnected) {
        peer.destroy()
      }

      peer = await createPeer(username)

      peer
        .on('open', (id) => {
          createToast(`Connected`)
          console.debug('Connected as', id)
          statusStorage.setValue('on')
        })
        .on('connection', (connection) => {
          const id = connection.peer.replace('jamroad-', '')
          createToast(`${id} joined`)

          connection.on('data', (unk) => {
            if (!unk || typeof unk !== 'object' || !('type' in unk) || !('data' in unk)) return

            const { type, data } = unk as PeerData
            createToast(`Received message ${type} from ${id}`)
            sendMessage(type, data)
          })

          connection.on('error', (err) => console.error(`connection ${id} error`, err))

          connection.on('close', () => {
            createToast(`${id} left`)
          })
        })
        .on('disconnected', () => {
          createToast('Disconnected, reconnecting...')
          peer.reconnect()
        })
        .on('error', (err) => {
          createToast(`Error: ${err}`)
          console.error('Peer connection error', err)
          statusStorage.setValue('off')
        })
    })

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
