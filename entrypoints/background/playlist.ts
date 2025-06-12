import { onMessage } from '@/utils/messaging'
import { playlistStorage } from '@/utils/storage'

export default async function initPlaylistBackground() {
  const playlist = await playlistStorage.getValue()

  onMessage('add', async ({ data }) => {
    playlist.push(data)
    playlistStorage.setValue(playlist)

    return true
  })

  onMessage('delete', async ({ data }) => {
    const index = playlist.findIndex((song) => song.link === data)
    if (index === -1) return false

    playlist.splice(index, 1)
    playlistStorage.setValue(playlist)

    return true
  })
}
