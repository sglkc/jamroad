import { render } from 'preact'
import App, { AppProps } from './App.tsx'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import { connectionStorage, usernameStorage } from '@/utils/storage.ts'

async function init() {
  const props: AppProps = {
    connection: await connectionStorage.getValue(),
    username: await usernameStorage.getValue()
  }

  render(<App {...props} />, document.body)
}

init()
