import { render } from 'preact'
import App, { AppProps } from './App.tsx'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import { statusStorage, playlistStorage, usernameStorage } from '@/utils/storage.ts'

async function init() {
  const props: AppProps = {
    status: await statusStorage.getValue(),
    username: await usernameStorage.getValue(),
    playlist: await playlistStorage.getValue(),
  }

  render(<App {...props} />, document.body)
}

init()
