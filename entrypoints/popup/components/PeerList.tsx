import { useCallback, useEffect, useState } from 'preact/compat'
import { sendMessage } from '@/utils/messaging'
import { peersStorage } from '@/utils/storage'
import { ConnectionStatus } from '@/utils/types'

export interface PeerListProps {
  status: ConnectionStatus
  username?: string
  peers: string[]
}

const PeerItem = ({ username }: { username: string }) => {
  const removePeer = useCallback(() => sendMessage('removePeer', username), [username])

  return (
    <li class="hover:text-red hover:b-red-500 cursor-pointer b-1 p-2">
      <button onClick={removePeer}>
        { username }
      </button>
    </li>
  )
}

export default function PeerList({ username, peers: storedPeers }: PeerListProps) {
  const [peers, setPeers] = useState<string[]>(storedPeers)

  useEffect(() => peersStorage.watch((newPeers) => setPeers(newPeers)), [])

  return (
    <div class="grid gap-4">
      <h2 class="text-base">Connected as <strong>{ username }</strong></h2>
      <ul class="flex flex-wrap justify-center gap-4">
        { peers.map((peer) => <PeerItem key={peer} username={peer} />) }
      </ul>
    </div>
  )
}
