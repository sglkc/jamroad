import { defineContentScript } from '#imports'
import { Content, ContentProtocolMap, createToast } from '@/utils/messaging'
import { createPeer } from '@/utils/p2p'

interface PeerData<T extends keyof ContentProtocolMap = keyof ContentProtocolMap> {
  type: T
  data: Parameters<ContentProtocolMap[T]>[0]
}

export default defineContentScript({
  matches: ['https://open.spotify.com/*'],
  async main() {
    console.debug('Registered peer content script')

    // TODO: input peer id
    const peer = await createPeer(chrome.runtime.id)

    peer
      .on('open', (id) => {
        createToast(`Connected`)
        console.debug('Connected as', id)
      })
      .on('connection', (connection) => {
        const id = connection.peer.replace('jamroad-', '')
        createToast(`${id} joined`)

        connection.on('data', (unk) => {
          if (!unk || typeof unk !== 'object' || !('type' in unk) || !('data' in unk)) return

          const { type, data } = unk as PeerData
          createToast(`Received message ${type} from ${id}`)
          Content.sendMessage(type, data)
        })

        connection.on('close', () => {
          createToast(`${id} left`)
        })
      })
      .on('disconnected', () => {
        createToast('Disconnected')
      })
      .on('error', (err) => {
        createToast(`Error: ${err}`)
        console.error(err)
      })
  }
})
