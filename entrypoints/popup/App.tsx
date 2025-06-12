import { useEffect, useRef, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { statusStorage, playlistStorage, usernameStorage } from '@/utils/storage'
import { ConnectionStatus, SongMetadata } from '@/utils/types'
import Playlist from './components/Playlist'

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
  const [message, setMessage] = useState<string>(props.username ? `Connected as ${props.username}` : '')
  const input = useRef<HTMLInputElement>(null)

  const onSubmit: JSX.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    // TODO: alert!
    if (!e.currentTarget.checkValidity()) return

    statusStorage.setValue('loading')
    usernameStorage.setValue(input.current!.value)
  }

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

    const unwatchPlaylist = playlistStorage.watch(setPlaylist)

    // TODO: idk if this is the best way to handle this since the cleanup wont
    // be called when the popup is closed, but it works for now
    return () => {
      unwatchConnection()
      unwatchPlaylist()
    }
  }, [])

  return (
    <main class="grid gap-4">
      <form class="grid gap-2" onSubmit={onSubmit}>
        <h2 class="text-lg font-bold">Connect to the internet</h2>
        <div class="flex gap-2">
          <input
            ref={input}
            class="p-2 w-full bg-dark-200 b-1 b-black invalid:b-red-600 invalid:outline-red-600 disabled:opacity-75"
            maxlength={16}
            pattern="[A-Za-z0-9\-_]+"
            placeholder="Enter username for sharing"
            disabled={status !== 'off'}
            defaultValue={props.username}
            spellcheck={false}
            required
          />
          <button
            class="px-4 py-2 bg-light-800 text-dark-800 b-1 b-black disabled:opacity-75"
            type="submit"
            disabled={status !== 'off'}
          >
            Start!
          </button>
        </div>
        <p>{message || 'alphanumeric, max. length 16 chars'}</p>
      </form>
      <div>
        <h2 class="text-lg font-bold">Playlist</h2>
        <Playlist playlist={playlist} />
      </div>
    </main>
  )
}
