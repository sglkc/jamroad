import { defineExtensionMessaging } from '@webext-core/messaging'
import { SongMetadata } from './types'

export interface ToastMessage {
  text: string
  duration?: number
}

export interface ContentProtocolMap {
  add(song: SongMetadata): boolean
  play(song: SongMetadata): boolean
  delete(link: SongMetadata['link']): boolean
  clear(placeholder: true): boolean

  addPeer(username: string): boolean
  removePeer(username: string): boolean

  toast(data: ToastMessage): number
  destroyToast(id: number): boolean
}

export async function createToast(data: ToastMessage | string): Promise<number> {
  let message = data
  if (typeof message === 'string') message = { text: message }
  return await sendMessage('toast', message)
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ContentProtocolMap>()
