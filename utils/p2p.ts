import { Peer } from 'peerjs'
import { createToast } from './messaging'

const PEER_ID_PREFIX = 'jamroad-'
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

export async function createPeer(id: string) {
  if (!credentials) {
    console.debug('Fetching TURN credentials...')
    await getCredentials()
  }

  return new Peer(PEER_ID_PREFIX + id, {
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
}
