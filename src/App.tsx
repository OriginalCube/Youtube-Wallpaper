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
	const [playerInfo, setPlayerInfo] = useState<{ videoTitle: ''; currentTime: number; duration: number }>({
		videoTitle: '',
		currentTime: 0,
		duration: 0,
	})
	const playerContainerRef = useRef<HTMLDivElement | null>(null)

	const onPlayerReady = (event: any) => {
		setPlayerInfo({ ...playerInfo, videoTitle: event.target.videoTitle })
	}

	const onYouTubeIframeAPIReady = () => {
		if (playerContainerRef.current) {
			const ytPlayer = new window.YT.Player(playerContainerRef.current, {
				videoId: 'BxqYUbNR-c0', // Replace with your desired video ID
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
			console.log(ytPlayer.getDuration())
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

	useEffect(() => {
		if (!window.YT) {
			const script = document.createElement('script')
			script.src = 'https://www.youtube.com/iframe_api'
			script.onload = () => {
				// Initialize the player
				window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
			}

			document.body.appendChild(script)
		}
		return () => {
			// Clean up when the component unmounts
			const script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
			if (script) {
				script.remove()
			}
		}
	}, [])
	return (
		<div className="relative">
			<div ref={playerContainerRef} className="pointer-events-none min-h-dvh min-w-dvw"></div>

			<div className="absolute bottom-0 flex min-h-32 w-full items-center justify-center">
				{isPlayerOn ? (
					<div className="animate-fade-up animate-duration-800 relative mb-12 flex h-40 w-1/2 flex-col items-center justify-center gap-4 overflow-hidden rounded-xl">
						<p className="text-red-500">{playerInfo.videoTitle} </p>
						<p className="text-red-500">{playerInfo.currentTime} </p>
						<input type="range" className="w-2/3" max={player.getDuration()} />
						<div className="flex items-center justify-center gap-4">
							<p>back</p>
							<p onClick={() => playPauseVideo()}>pause/play</p>
							<p>skip</p>
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
