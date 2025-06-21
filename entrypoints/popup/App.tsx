import { useEffect, useState } from 'preact/hooks'
import { statusStorage } from '@/utils/storage'
import { ConnectionStatus, SongMetadata } from '@/utils/types'
import Form from './components/Form'
import PeerList from './components/PeerList'
import Playlist from './components/Playlist'

export interface AppProps {
  status: ConnectionStatus
  username?: string
  playlist: SongMetadata[]
  peers: string[]
}

/**
 * TODO: open song link in active tab?
 * TODO: components!
 */
export default function App(props: AppProps) {
  const [status, setStatus] = useState<ConnectionStatus>(props.status)
  const [username, setUsername] = useState<string | undefined>(props.username)

  useEffect(() => {
    // TODO: idk if this is the best way to handle this since the cleanup wont
    // be called when the popup is closed, but it works for now
    return statusStorage.watch((connection) => setStatus(connection))
  }, [])

  return (
    <main class="grid gap-4">
          <Form status={status} setUsername={setUsername} />
      { status !== 'on' &&
        <>
        </>
      }
      { status === 'on' &&
        <>
          <PeerList peers={props.peers} username={username} status={status} />
          <h2 class="text-lg font-bold">Playlist</h2>
          <Playlist playlist={props.playlist} />
        </>
      }
    </main>
  )
}
