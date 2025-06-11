import { storage } from '#imports'
import { SongMessage } from './messaging'

export type ConnectionEnum = 'off' | 'loading' | 'on'

export const deviceIdStorage = storage.defineItem<string | undefined>('session:device_id')
export const usernameStorage = storage.defineItem<string | undefined>('session:username', { fallback: undefined })
export const connectionStorage = storage.defineItem<ConnectionEnum>('session:connection', { init: () => 'off' })
export const playlistStorage = storage.defineItem<SongMessage[]>('local:playlist', { init: () => [] })
