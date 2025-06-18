import { useEffect, useState } from 'preact/hooks'
import Button from './components/Button'
import Form from './components/Form'
import Playlist from './components/Playlist'
import { sendMessage } from '@/utils/messaging'
import { ConnectionStatus, SongMetadata } from '@/utils/types'
import { statusStorage, playlistStorage, usernameStorage } from '@/utils/storage'

export interface AppProps {
  status: ConnectionStatus
  username?: string
  playlist: SongMetadata[]
}

/**
 * TODO: open song link in active tab?
 * TODO: components!
 */
export default function App(props: AppProps) {
  const [status, setStatus] = useState<ConnectionStatus>(props.status)
  const [playlist, setPlaylist] = useState<SongMetadata[]>(props.playlist)
  const [message, setMessage] = useState<string>(
    props.status === 'on' ? `Connected, send to your partner to start sharing!` : ''
  )

  const clearPlaylist = () => sendMessage('clear', true)

  useEffect(() => {
    const unwatchConnection = statusStorage.watch(async (connection) => {
      setStatus(connection)

      if (connection === 'loading') {
        setMessage('Connecting...')
      }
      if (connection === 'on') {
        setMessage('Connected as ' + await usernameStorage.getValue())
      }
      if (connection === 'off') {
        setMessage('Disconnected')
      }
    })

    const unwatchPlaylist = playlistStorage.watch((playlist) => setPlaylist(playlist))

    // TODO: idk if this is the best way to handle this since the cleanup wont
    // be called when the popup is closed, but it works for now
    return () => {
      unwatchConnection()
      unwatchPlaylist()
    }
  }, [])

  return (
    <main class="grid gap-4">
      <Form status={status} username={props.username} message={message} />
      { status === 'on' &&
        <div class="grid gap-4">
          <h2 class="text-lg font-bold">Playlist</h2>
          <Playlist playlist={playlist} />
          { playlist.length > 0 &&
            <Button type="button" onClick={clearPlaylist}>
              Clear Playlist
            </Button>
          }
        </div>
      }
    </main>
  )
}
