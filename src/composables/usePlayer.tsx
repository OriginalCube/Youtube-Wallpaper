import { useEffect, useState, useRef, RefObject } from 'react'

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		YT: any
		onYouTubeIframeAPIReady: () => void
	}
}

export function usePlayer(playerContainerRef: RefObject<HTMLDivElement | null>) {
	const [player, setPlayer] = useState<any | null>(null)
	const [currentTime, setCurrentTime] = useState<number>(0)
	const intervalRef = useRef<null | number>(null)
	const [playerInfo, setPlayerInfo] = useState<{ videoTitle: ''; currentTime: number; duration: number }>({
		videoTitle: '',
		currentTime: 0,
		duration: 0,
	})
	const [videoId, setVideoId] = useState('2pU-ojVwGUU')

	const onPlayerReady = (event: any) => {
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
				console.log('Video is playing')
				break
			case window.YT.PlayerState.PAUSED:
				console.log('Video is paused')
				break
			case window.YT.PlayerState.ENDED:
				console.log('Video has ended')
				break
			default:
				console.log('Video state changed')
				break
		}
	}

	// Skip 10 seconds ahead
	// const skipTenSeconds = () => {
	// 	if (player) {
	// 		const currentTime = player.getCurrentTime()
	// 		player.seekTo(currentTime + 10)
	// 	}
	// }

	// Play/Pause the video
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
	useEffect(() => {
		console.log(playerContainerRef)
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
			// Set interval to update the current time every second
			if (!intervalRef.current) {
				intervalRef.current = setInterval(() => {
					setCurrentTime(player.getCurrentTime()) // Use getCurrentTime method to get the current time
				}, 1000)
			}
		}

		// Cleanup interval on component unmount or when player changes
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current) // Clear the existing interval
				intervalRef.current = null // Reset the reference
			}
		}
	}, [player])

	return { toggleVideoPlayback }
}
