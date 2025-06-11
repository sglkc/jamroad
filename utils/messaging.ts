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

interface ContentProtocolMap {
  add(song: SongMessage): boolean
  play(song: SongMessage): boolean
  toast(data: ToastMessage): number
  destroyToast(id: number): boolean
}

export const Content = defineCustomEventMessaging<ContentProtocolMap>({ namespace: 'song' })
