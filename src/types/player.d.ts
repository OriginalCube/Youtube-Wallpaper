interface Window {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	YT: any
	onYouTubeIframeAPIReady: () => void
}

type PlayerInfo = {
	videoTitle: ''
	duration: number
	volume: number
}
