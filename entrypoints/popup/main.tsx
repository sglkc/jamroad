import { render } from 'preact'
import { statusStorage, playlistStorage, usernameStorage } from '@/utils/storage.ts'
import App, { AppProps } from './App.tsx'
import '@fontsource-variable/radio-canada'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

async function init() {
  const props: AppProps = {
    status: await statusStorage.getValue(),
    username: await usernameStorage.getValue(),
    playlist: await playlistStorage.getValue(),
  }

  render(<App {...props} />, document.body)
}

init()
