import { useApp } from '@/store/useApp'
import { useEffect, useState, useRef, RefObject, useMemo, useCallback } from 'react'
import { getQueryParamValue, removeString } from '@/composables/useHelpers'

export function usePlayer(playerContainerRef: RefObject<HTMLDivElement | null>) {
	const youtube_wallpaper = localStorage.getItem('youtube-wallpaper')
		? JSON.parse(localStorage.getItem('youtube-wallpaper') as string)
		: null
	const volume = useApp((state) => state.volume)
	const repeat = useApp((state) => state.repeat)
	const shuffle = useApp((state) => state.shuffle)
	const setImage = useApp((state) => state.setImage)
	const setVolumeApp = useApp((state) => state.setVolume)
	const [playlist, setPlaylist] = useState(
		youtube_wallpaper.playlist.length ? youtube_wallpaper.playlist : ['lA9FONoiuFA'],
	)
	const [isPlayerOn, setPlayerOn] = useState(true)
	const [player, setPlayer] = useState<any | null>(null)
	const [currentTime, setCurrentTime] = useState<number>(0)
	const [songId, setSongId] = useState(0)
	const intervalRef = useRef<null | number>(null)
	const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
		videoTitle: '',
		videoAuthor: '',
		duration: 0,
	})
	const appState = useMemo(() => {
		return { repeat, shuffle }
	}, [repeat, shuffle])

	const onPlayerReady = (event: any) => {
		event.target.setVolume(volume)
		const videoData = event.target.getVideoData()
		setPlayerInfo({
			...playerInfo,
			videoTitle: videoData.title,
			videoAuthor: 'Youtube Wallpaper',
			duration: event.target.getDuration(),
		})
	}

	const onYouTubeIframeAPIReady = (id: string) => {
		if (player) player.destroy()
		if (playerContainerRef.current) {
			const ytPlayer = new window.YT.Player(playerContainerRef.current, {
				videoId: '-FwuyzOZuS0',
				playerVars: {
					autoplay: 1,
					controls: 0,
					modestbranding: 1,
					rel: 0,
					fs: 0,
				},
				events: {
					onReady: (event: any) => onPlayerReady(event),
					onStateChange: onPlayerStateChange,
				},
			})
			setPlayer(ytPlayer)
		}
	}

	const setVolume = (val: number) => {
		if (player) {
			setVolumeApp(val)
			player.setVolume(val)
		}
	}

	const toggleVideoPlayback = () => {
		if (player) {
			const state = player.getPlayerState()
			if (state === window.YT.PlayerState.PLAYING) {
				player.pauseVideo()
			} else {
				player.playVideo()
			}
		}
	}

	const seekTo = (sec: number, skip = false) => {
		if (player) {
			const skipTo = skip ? sec : player.getCurrentTime() + sec
			player.seekTo(skipTo)
			setCurrentTime(skipTo)
			if (window.YT.PlayerState.PAUSED) player.playVideo()
		}
	}

	const getRandomSongId = (currentSongId: number) => {
		let randomId = currentSongId
		while (randomId === currentSongId) {
			randomId = Math.floor(Math.random() * playlist.length)
		}
		return randomId
	}

	const changeMusic = (skip = false) => {
		if (appState.shuffle) {
			setSongId(getRandomSongId(songId))
		} else if (skip) {
			setSongId((prev) => (prev < playlist.length - 1 ? prev + 1 : 0))
		} else {
			if (currentTime > 5) {
				seekTo(0, true)
			} else {
				setSongId((prev) => (prev === 0 ? playlist.length - 1 : prev - 1))
			}
		}
	}

	const loadVideoById = (vidId: string) => {
		if (player) {
			player.loadVideoById(vidId)
			player.addEventListener('onStateChange', function (event: any) {
				if (event.data === window.YT.PlayerState.PLAYING) {
					const videoData = player.getVideoData()
					setPlayerInfo({
						...playerInfo,
						videoTitle: videoData.title,
						videoAuthor: videoData.author,
						duration: player.getDuration(),
					})
				}
			})
		}
	}

	// Called when the player state changes
	const onPlayerStateChange = (event: any) => {
		switch (event.data) {
			case window.YT.PlayerState.PLAYING:
				setPlayerOn(true)
				break
			case window.YT.PlayerState.PAUSED:
				setPlayerOn(false)
				break
			case window.YT.PlayerState.ENDED:
				changeMusic(true)
				break
			default:
				break
		}
	}

	const handleUpdateSongId = useCallback(() => {
		loadVideoById(playlist[songId])
	}, [playlist, songId])

	useEffect(() => {
		handleUpdateSongId()
	}, [handleUpdateSongId])

	useEffect(() => {
		if (playerContainerRef) {
			if (!window.YT) {
				const script = document.createElement('script')
				script.src = 'https://www.youtube.com/iframe_api'
				script.onload = () => {
					// Initialize the player
					window.onYouTubeIframeAPIReady = () => onYouTubeIframeAPIReady(playlist[0])
				}

				document.body.appendChild(script)
			} else {
				onYouTubeIframeAPIReady(playlist[0])
			}
			return () => {
				// Clean up when the component unmounts
				const script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
				if (script) {
					script.remove()
				}
			}
		}
	}, [playerContainerRef])

	useEffect(() => {
		const repeatVideo = (vidDuration: number, vidCurrent: number) => {
			if (vidDuration - vidCurrent < 1.99 && appState.repeat) seekTo(0, true)
		}
		if (player) {
			if (!intervalRef.current) {
				// @ts-expect-error wallpaper engine prod
				intervalRef.current = setInterval(() => {
					repeatVideo(player.getDuration(), player.getCurrentTime())
					setCurrentTime(player.getCurrentTime())
				}, 1000)
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}
	}, [player, appState.repeat])

	useEffect(() => {
		const handleBeforeUnload = () => {
			player.destroy()
		}

		window.addEventListener('beforeunload', handleBeforeUnload)

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [])

	// @ts-expect-error wallpaper engine event
	window.wallpaperPropertyListener = {
		applyUserProperties: (properties: any) => {
			if (properties.youtube_links) {
				const videoLinks: string[] = []
				const result = removeString(properties.youtube_links.value).split(',')
				for (const yt_link of result) {
					try {
						const vid = getQueryParamValue(yt_link, 'v')
						if (vid?.length) videoLinks.push(vid)
					} catch {
						console.error('Link is not working')
					}
				}
				if (videoLinks.length) {
					youtube_wallpaper.playlist = videoLinks
					localStorage.setItem('youtube-wallpaper', JSON.stringify(youtube_wallpaper))
					setPlaylist(videoLinks)
					if (songId === 0) loadVideoById(videoLinks[0])
					else setSongId(0)
				}
			}

			if (properties.image) {
				if (properties.image.value) setImage(`file:///${properties.image.value}`)
				else setImage('')
			}
		},
	}

	return { toggleVideoPlayback, currentTime, seekTo, playerInfo, isPlayerOn, setVolume, changeMusic }
}
