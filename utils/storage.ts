import { storage } from '#imports'

export type ConnectionEnum = 'off' | 'loading' | 'on'

export const deviceIdStorage = storage.defineItem<string | undefined>('session:device_id')
export const usernameStorage = storage.defineItem<string | undefined>('session:username')
export const connectionStorage = storage.defineItem<ConnectionEnum>('session:connection', { init: () => 'off' })
