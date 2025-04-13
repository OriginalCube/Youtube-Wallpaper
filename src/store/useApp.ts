import { create } from 'zustand'

type AppType = {
	theme: string
	volume: number
	repeat: boolean
	shuffle: boolean
	image: string
	setTheme: (daisyTheme: string) => void
	setVolume: (vol: number) => void
	setRepeat: (rep: boolean) => void
	setShuffle: (shuf: boolean) => void
	setImage: (img: string) => void
}

const initial_state = {
	theme: 'night',
	volume: 80,
	repeat: false,
	shuffle: false,
	playlist: ['lA9FONoiuFA'],
}

export const useApp = create<AppType>((set) => {
	const youtube_storage = localStorage.getItem('youtube-wallpaper')
		? JSON.parse(localStorage.getItem('youtube-wallpaper') as string)
		: null

	const saveStorage = (conf: any) => {
		localStorage.setItem('youtube-wallpaper', JSON.stringify(conf))
	}

	if (!youtube_storage) {
		localStorage.setItem('youtube-wallpaper', JSON.stringify(initial_state))
		return {
			theme: 'night',
			volume: 80,
			repeat: false,
			shuffle: false,
			image: './images/anime-jam.gif',
			playlist: ['lA9FONoiuFA'],

			setTheme: (daisyTheme) => set({ theme: daisyTheme }),
			setVolume: (vol) => set({ volume: vol }),
			setRepeat: (rep) => set({ repeat: rep, shuffle: false }),
			setShuffle: (shuf) => set({ shuffle: shuf, repeat: false }),
			setImage: (img) => set({ image: img }),
		}
	}

	return {
		theme: youtube_storage.theme,
		volume: youtube_storage.volume,
		repeat: youtube_storage.repeat,
		shuffle: youtube_storage.shuffle,
		image: youtube_storage.image,
		playlist: youtube_storage.playlist,

		setTheme: (daisyTheme) =>
			set(() => {
				youtube_storage.theme = daisyTheme
				saveStorage(youtube_storage)
				return { theme: daisyTheme }
			}),
		setVolume: (vol) =>
			set(() => {
				youtube_storage.volume = vol
				saveStorage(youtube_storage)
				return { volume: vol }
			}),
		setRepeat: (rep) =>
			set(() => {
				youtube_storage.repeat = rep
				youtube_storage.shuffle = false
				saveStorage(youtube_storage)
				return { repeat: rep, shuffle: false }
			}),
		setShuffle: (shuf) =>
			set(() => {
				youtube_storage.shuffle = shuf
				youtube_storage.repeat = false
				saveStorage(youtube_storage)
				return { shuffle: shuf, repeat: false }
			}),
		setImage: (img) =>
			set(() => {
				youtube_storage.image = img
				saveStorage(youtube_storage)
				return { image: img }
			}),
	}
})
