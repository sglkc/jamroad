import { defineExtensionMessaging } from '@webext-core/messaging'

export interface ToastMessage {
  text: string
  duration?: number
}

export interface SongMessage {
  title: string
  artist: string
  link: string
}

export interface ContentProtocolMap {
  add(song: SongMessage): boolean
  play(song: SongMessage): boolean
  toast(data: ToastMessage): number
  destroyToast(id: number): boolean
}

export async function createToast(data: ToastMessage | string): Promise<number> {
  let message = data
  if (typeof message === 'string') message = { text: message }
  return await Content.sendMessage('toast', message)
}

export const Content = defineExtensionMessaging<ContentProtocolMap>()
