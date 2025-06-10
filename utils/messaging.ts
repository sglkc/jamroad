import { defineCustomEventMessaging } from '@webext-core/messaging/page'

interface SongMessage {
  title: string
  artist: string
  link: string
}

interface ContentProtocolMap {
  add(song: SongMessage): boolean
  play(link: string): boolean
}

export const Content = defineCustomEventMessaging<ContentProtocolMap>({ namespace: 'song' })
