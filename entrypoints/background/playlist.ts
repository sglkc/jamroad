import { onMessage } from '@/utils/messaging'
import { playlistStorage } from '@/utils/storage'

export default async function initPlaylistBackground() {
  let playlist = await playlistStorage.getValue()

  // Watch for external changes in the playlist storage
  playlistStorage.watch((newPlaylist) => {
    playlist = newPlaylist
  })

  onMessage('add', async ({ data }) => {
    await playlistStorage.setValue([...playlist, data])

    return true
  })

  onMessage('delete', async ({ data }) => {
    const index = playlist.findIndex((song) => song.link === data)
    if (index === -1) return false

    playlist.splice(index, 1)
    await playlistStorage.setValue(playlist)

    return true
  })

  onMessage('clear', async () => {
    await playlistStorage.setValue([])

    return true
  })
}
