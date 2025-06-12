import { memo } from 'preact/compat'
import { sendMessage } from '@/utils/messaging'
import { SongMetadata } from '@/utils/types'

const PlaylistItem = memo((song: SongMetadata & { index: number }) => {
  const playSong = () => sendMessage('play', song)

  const deleteSong = () => sendMessage('delete', song.link)

  return (
    <li class="group flex gap-2 items-center" key={song.link}>
      <div class="pr-2">{song.index+1}</div>
      <div class="min-w-8 max-w-8">
        <img src={song.image} />
      </div>
      <div class="grow">
        <p class="line-clamp-1 hover:line-clamp-none mr-auto">
          <a
            class="hover:underline underline-offset-4 underline-opacity-50"
            href={song.link}
            target="_blank"
          >
            {song.title}
          </a>
        </p>
        <p class="text-xs opacity-50">{song.artist}</p>
      </div>
      <div class="hidden group-hover:flex">
        <button
          class="hover:text-green-500 cursor-pointer"
          type="button"
          onClick={playSong}
        >
          <div class="p-3 i-my:play"></div>
        </button>
        <button
          class="hover:text-red-500 cursor-pointer"
          type="button"
          onClick={deleteSong}
        >
          <div class="p-3 i-my:letter-x"></div>
        </button>
      </div>
    </li>
  )
})

export default function Playlist({ playlist }: { playlist: SongMetadata[] }) {
  return (
    <ul class="grid gap-2">
      <li class="flex gap-4 text-center fw-semibold">
        <p class="pr-2">#</p>
        <p class="grow">Title</p>
      </li>
      { playlist.length ? playlist.map((song, i) => (
        <PlaylistItem index={i} {...song} />
      ))
        :
        <div>
          <p class="text-center">
            Right-click on a song and click "Add to Jamroad" to get started!
          </p>
        </div>
      }
    </ul>
  )
}
