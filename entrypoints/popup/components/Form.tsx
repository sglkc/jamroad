import { Dispatch, StateUpdater, useCallback, useRef } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { sendMessage } from '@/utils/messaging'
import { statusStorage, usernameStorage } from '@/utils/storage'
import { ConnectionStatus } from '@/utils/types'
import Button from './Button'

export interface FormProps {
  status: ConnectionStatus
  setUsername: Dispatch<StateUpdater<string | undefined>>
}

export default function Form({ status, setUsername }: FormProps) {
  const input = useRef<HTMLInputElement>(null)

  const onSubmit: JSX.SubmitEventHandler<HTMLFormElement> = useCallback(async (e) => {
    e.preventDefault()

    // TODO: alert!
    if (!e.currentTarget.checkValidity()) return

    const username = input.current!.value.trim()

    if (status === 'off') {
      await statusStorage.setValue('loading')
      await usernameStorage.setValue(username)
      setUsername(username)
      input.current!.value = ''
    } else {
      console.debug(
        'Joining to username',
        username,
        await sendMessage('join', username)
      )
    }
  }, [status])

  const disconnect = useCallback(async () => {
    await statusStorage.setValue('off')
    await usernameStorage.removeValue()
    setUsername(undefined)
    input.current!.value = ''
  }, [])

  return (
    <form class="grid gap-2" onSubmit={onSubmit}>
      <h2 class="text-lg font-bold">Connect to the internet</h2>
      <div class="flex gap-2">
        <input
          ref={input}
          class="p-2 w-full bg-dark-200 b-1 b-black invalid:b-red-600 invalid:outline-red-600 disabled:opacity-75 empty:b-0"
          maxlength={16}
          pattern="[A-Za-z0-9\-_]+"
          placeholder={status === 'on' ? 'Join by username...' : 'Enter your username'}
          disabled={status === 'loading'}
          spellcheck={false}
          autofocus
          required
        />
        <Button
          class="bg-green-500! disabled:opacity-50"
          type="submit"
          disabled={status === 'loading'}
        >
          {status === 'on' ? 'Join' : 'Connect'}
        </Button>
        { status === 'on' &&
          <Button
            class="bg-red-500 text-light"
            type="button"
            onClick={disconnect}
          >
            <div class="i-my:logout text-lg" />
          </Button>
        }
      </div>
      { status !== 'on' &&
        <p>{status === 'loading' ? 'Connecting...' : 'alphanumeric, max. length 16 chars'}</p>
      }
    </form>
  )
}
