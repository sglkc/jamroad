import { useCallback, useRef } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { statusStorage, usernameStorage } from '@/utils/storage'
import { ConnectionStatus } from '@/utils/types'
import Button from './Button'

export interface FormProps {
  status: ConnectionStatus
  message: string
  username?: string
}

export default function Form({ status, message, username }: FormProps) {
  const input = useRef<HTMLInputElement>(null)

  const onSubmit: JSX.SubmitEventHandler<HTMLFormElement> = useCallback((e) => {
    e.preventDefault()

    // TODO: alert!
    if (!e.currentTarget.checkValidity()) return

    if (status === 'off') {
      statusStorage.setValue('loading')
      usernameStorage.setValue(input.current!.value)
    } else {
      statusStorage.setValue('off')
      usernameStorage.removeValue()
    }
  }, [status])

  return (
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
          defaultValue={username}
          spellcheck={false}
          autofocus
          required
        />
        <Button
          class={status === 'on' ? 'bg-red-500/75!' : 'bg-green-500!'}
          type="submit"
          disabled={status === 'loading'}
        >
          {status === 'on' ? 'Disconnect' : 'Connect'}
        </Button>
      </div>
      <p>{message || 'alphanumeric, max. length 16 chars'}</p>
    </form>
  )
}
