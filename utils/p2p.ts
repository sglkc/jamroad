import { Peer } from 'peerjs'
import { ContentProtocolMap, createToast, sendMessage } from './messaging'
import { statusStorage } from './storage'

interface PeerData<T extends keyof ContentProtocolMap = keyof ContentProtocolMap> {
  type: T
  data: Parameters<ContentProtocolMap[T]>[0]
}

export const PEER_ID_PREFIX = 'jamroad-'

let credentials: { username: string, credential: string }

async function getCredentials() {
  try {
    const res = await fetch('https://speed.cloudflare.com/turn-creds')
    const json = await res.json()

    credentials = json
  } catch (error) {
    createToast('Failed connecting to outside world :(')
    console.error(error)
  }
}

export async function createPeer(id: string): Promise<Peer> {
  if (!credentials) {
    console.debug('Fetching TURN credentials...')
    await getCredentials()
  }

  const peer = new Peer(PEER_ID_PREFIX + id, {
    secure: true,
    debug: 3,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:turn.speed.cloudflare.com:50000',
          ...credentials,
        },
      ],
    },
  })

  peer
    .on('open', () => {
      createToast(`Connected as ${id}`)
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

  return peer
}
