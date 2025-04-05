import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AppType = {
	theme: string
	volume: number
	repeat: boolean
	shuffle: boolean
	playlist: string[]
	setTheme: (daisyTheme: string) => void
	setVolume: (vol: number) => void
	setRepeat: (rep: boolean) => void
	setShuffle: (shuf: boolean) => void
}

export const useApp = create<AppType>()(
	persist(
		(set) => ({
			theme: 'night',
			volume: 80,
			repeat: false,
			shuffle: false,
			playlist: ['4QePrv24TBU', 'jWQx2f-CErU', 'jJxMlmf58SM', 'wSTbdqo-j74', 'a4na2opArGY'],

			setTheme: (daisyTheme) => set({ theme: daisyTheme }),
			setVolume: (vol) => set({ volume: vol }),
			setRepeat: (rep) => set({ repeat: rep, shuffle: false }),
			setShuffle: (shuf) => set({ shuffle: shuf, repeat: false }),
		}),
		{
			name: 'Youtube-Wallpaper',
		},
	),
)
