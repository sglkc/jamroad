import { defineCustomEventMessaging } from '@webext-core/messaging/page'

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

export const noop = () => undefined

export async function createToast(data: ToastMessage | string): Promise<number> {
  let message = data
  if (typeof message === 'string') message = { text: message }
  return await Content.sendMessage('toast', message)
}

export const Content = defineCustomEventMessaging<ContentProtocolMap>({ namespace: 'song' })
