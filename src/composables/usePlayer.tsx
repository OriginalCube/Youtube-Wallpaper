import { useEffect, useState, useRef, RefObject } from 'react'

export function usePlayer(playerContainerRef: RefObject<HTMLDivElement | null>) {
	const [isPlayerOn, setPlayerOn] = useState(true)
	const [player, setPlayer] = useState<any | null>(null)
	const [currentTime, setCurrentTime] = useState<number>(0)
	const [songId, setSongId] = useState(0)
	const intervalRef = useRef<null | number>(null)
	const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
		videoTitle: '',
		duration: 0,
		volume: 80,
	})
	// testing
	const playlist = ['gXlpa2M7BRk', 'g2t7utfVD50', 'xKk655CDFn8']
	const [videoId, setVideoId] = useState(playlist[songId])

	const onPlayerReady = (event: any) => {
		event.target.setVolume(playerInfo.volume)
		setPlayerInfo({ ...playerInfo, videoTitle: event.target.videoTitle, duration: event.target.getDuration() })
	}

	const onYouTubeIframeAPIReady = (id: string) => {
		if (player) player.destroy()
		if (playerContainerRef.current) {
			const ytPlayer = new window.YT.Player(playerContainerRef.current, {
				videoId: id, // Replace with your desired video ID
				playerVars: {
					autoplay: 1,
					controls: 0,
					modestbranding: 1,
					rel: 0,
					fs: 0,
					listType: 'playlist',
				},
				events: {
					onReady: (event: any) => onPlayerReady(event),
					onStateChange: onPlayerStateChange,
				},
			})
			setPlayer(ytPlayer)
		}
	}

	// Called when the player state changes
	const onPlayerStateChange = (event: any) => {
		switch (event.data) {
			case window.YT.PlayerState.PLAYING:
				setPlayerOn(true)
				console.log('Video is playing')
				break
			case window.YT.PlayerState.PAUSED:
				setPlayerOn(false)
				console.log('Video is paused')
				break
			case window.YT.PlayerState.ENDED:
				break
			default:
				console.log('Video state changed')
				break
		}
	}

	const setVolume = (val: number) => {
		if (player) {
			setPlayerInfo({ ...playerInfo, volume: val })
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
		}
	}

	const changeMusic = (skip = false) => {
		if (skip) {
			if (songId < playlist.length - 1) {
				setSongId(songId + 1)
			} else {
				setSongId(0)
			}
		} else {
			if (currentTime > 5) {
				seekTo(0, skip)
			} else {
				if (songId === 0) {
					setSongId(playlist.length - 1)
				} else {
					setSongId(songId - 1)
				}
			}
		}
	}

	useEffect(() => {
		setVideoId(playlist[songId])
	}, [songId])

	useEffect(() => {
		if (playerContainerRef) {
			if (!window.YT) {
				const script = document.createElement('script')
				script.src = 'https://www.youtube.com/iframe_api'
				script.onload = () => {
					// Initialize the player
					window.onYouTubeIframeAPIReady = () => onYouTubeIframeAPIReady(videoId)
				}

				document.body.appendChild(script)
			} else {
				onYouTubeIframeAPIReady(videoId)
			}
			return () => {
				// Clean up when the component unmounts
				const script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
				if (script) {
					script.remove()
				}
			}
		}
	}, [videoId, playerContainerRef])

	useEffect(() => {
		if (player) {
			if (!intervalRef.current) {
				intervalRef.current = setInterval(() => {
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
	}, [player])

	return { toggleVideoPlayback, currentTime, seekTo, playerInfo, isPlayerOn, setVolume, changeMusic }
}
