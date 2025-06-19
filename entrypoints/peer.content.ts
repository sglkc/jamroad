import { defineContentScript } from '#imports'
import Peer, { DataConnection } from 'peerjs'
import { sendMessage, ContentProtocolMap, createToast, onMessage } from '@/utils/messaging'
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
      const connection = (peer.connections as Record<string, [DataConnection] | undefined>)[data]

      if (!connection) return false

      createToast(`Removing ${data}...`)
      connection[0].close({ flush: true })
      return true
    })

    usernameStorage.watch(async (username) => {
      console.debug('username changed', username)

      if (!username) {
        if (peer && !peer.disconnected) peer.destroy()
        return
      }

      peer = await createPeer(username)

      peer
        .on('open', (id) => {
          createToast(`Connected as ${username}`)
          console.debug('Connected as', id)
          statusStorage.setValue('on')
        })
        .on('connection', (connection) => {
          const id = connection.peer.replace('jamroad-', '')

          createToast(`${id} joined`)
          sendMessage('addPeer', id)

          connection.on('data', (unk) => {
            if (!unk || typeof unk !== 'object' || !('type' in unk) || !('data' in unk)) return

            const { type, data } = unk as PeerData
            createToast(`Received message ${type} from ${id}`)
            sendMessage(type, data)
          })

          connection.on('error', (err) => console.error(`connection ${id} error`, err))

          connection.on('close', () => {
            createToast(`${id} left`)
            sendMessage('removePeer', id)
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
