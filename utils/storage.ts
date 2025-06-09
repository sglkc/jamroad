import { storage } from '#imports'

export const deviceIdStorage = storage.defineItem<string | undefined>('session:device_id')
