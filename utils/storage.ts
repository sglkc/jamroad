import { storage } from '#imports'
import { ConnectionStatus, SongMetadata } from './types'

export const deviceIdStorage = storage.defineItem<string | undefined>('session:device_id')
export const usernameStorage = storage.defineItem<string | undefined>('session:username', { fallback: undefined })
export const peersStorage = storage.defineItem<string[]>('session:peers', { init: () => [] })
export const statusStorage = storage.defineItem<ConnectionStatus>('session:status', { init: () => 'off' })
export const playlistStorage = storage.defineItem<SongMetadata[]>('local:playlist', { init: () => [] })
