import { useEffect, useRef, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { ConnectionEnum, connectionStorage, usernameStorage } from '@/utils/storage'

export default function App() {
  const [status, setStatus] = useState<ConnectionEnum>('off')
  const [message, setMessage] = useState<string>()
  const input = useRef<HTMLInputElement>(null)

  const onSubmit: JSX.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    // TODO: alert!
    if (!e.currentTarget.checkValidity()) return

    connectionStorage.setValue('loading')
    usernameStorage.setValue(input.current!.value)
  }

  useEffect(() => {
    // TODO: idk if this is the best way to handle this since the cleanup wont
    // be called when the popup is closed, but it works for now
    return connectionStorage.watch(async (connection) => {
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
  }, [])

  return (
    <main class="p-8 bg-blue-200 w-72 grid gap-4">
      <h1 class="text-lg font-bold">Connect to the internet</h1>
      <form class="grid gap-2" onSubmit={onSubmit}>
        <div class="flex gap-2">
          <input
            ref={input}
            class="p-2 w-full b-1 b-black invalid:b-red invalid:outline-red disabled:bg-gray-200"
            maxlength={16}
            pattern="[A-Za-z0-9\-_]+"
            placeholder="Enter username (anything)"
            disabled={status !== 'off'}
            required
          />
          <button
            class="px-4 py-2 b-1 b-black disabled:bg-gray-200"
            type="submit"
            disabled={status !== 'off'}
          >
            Set!
          </button>
        </div>
        <p>{ message ?? 'alphanumeric, max. length 16 chars' }</p>
      </form>
    </main>
  )
}
