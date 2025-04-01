import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AppType = {
	theme: string
	setTheme: (daisyTheme: string) => void
}

export const useApp = create<AppType>()(
	persist(
		(set) => ({
			theme: 'night',
			setTheme: (daisyTheme: string) => set({ theme: daisyTheme }),
		}),
		{
			name: 'Youtube-Wallpaper',
		},
	),
)
