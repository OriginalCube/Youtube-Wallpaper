import { useState, useEffect, useRef } from 'react'
import MusicIcon from './components/MusicIcon'

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		YT: any
		onYouTubeIframeAPIReady: () => void
	}
}

function App() {
	const [isPlayerOn, setPlayerOn] = useState(false)
	const [player, setPlayer] = useState<any | null>(null)
	const [currentTime, setCurrentTime] = useState<number>(0)
	const intervalRef = useRef(null)
	const [playerInfo, setPlayerInfo] = useState<{ videoTitle: ''; currentTime: number; duration: number }>({
		videoTitle: '',
		currentTime: 0,
		duration: 0,
	})
	const playerContainerRef = useRef<HTMLDivElement | null>(null)
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
	const playPauseVideo = () => {
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
	}, [videoId])

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

	return (
		<div className="relative">
			<div ref={playerContainerRef} className="pointer-events-none min-h-dvh min-w-dvw"></div>

			<div className="absolute bottom-0 flex min-h-32 w-full items-center justify-center">
				{isPlayerOn ? (
					<div className="h-32 w-full bg-[#212121]">
						<input
							type="range"
							className="absolute -top-2 w-full"
							value={currentTime}
							min={0}
							max={playerInfo.duration}
							step={1}
							onChange={(e) => seekTo(parseFloat(e.target.value), true)}
						/>
						<div className="flex h-full w-full items-center justify-between">
							<div className="flex w-1/3 items-center justify-center gap-4">
								<p onClick={() => seekTo(-10)}>back</p>
								<p onClick={() => playPauseVideo()}>pause/play</p>
								<p onClick={() => seekTo(10)}>skip</p>
								<p
									onClick={() =>
										setVideoId(videoId === 'BxqYUbNR-c0' ? '2pU-ojVwGUU' : 'BxqYUbNR-c0')
									}
								>
									change song
								</p>
							</div>
							<div className="w-1/3">
								<p className="text-2xl font-semibold text-white">{playerInfo.videoTitle} </p>
							</div>
							<div className="w-1/3"></div>
						</div>
					</div>
				) : (
					<button
						className="relative size-12 overflow-hidden rounded-full text-white hover:scale-115"
						onClick={() => setPlayerOn(!isPlayerOn)}
					>
						<div className="absolute top-0 size-full animate-spin bg-gradient-to-r from-[#36D1DC] to-[#5B86E5]" />
						<div className="absolute top-0 p-2">
							<MusicIcon />
						</div>
					</button>
				)}
			</div>
		</div>
	)
}

export default App
