import { useRef } from 'react'
import PlayerDashboard from './components/player/PlayerDashboard'
import { usePlayer } from './composables/usePlayer'

function App() {
	const playerContainerRef = useRef<HTMLDivElement>(null)

	const { toggleVideoPlayback, currentTime, seekTo, playerInfo, isPlayerOn, setVolume, changeMusic } =
		usePlayer(playerContainerRef)

	return (
		<div className="flex flex-col">
			{/* Iframe */}
			<div
				ref={playerContainerRef}
				className={`pointer-events-none w-full ${isPlayerOn ? 'min-h-[calc(100vh-7.5rem)]' : 'min-h-dvh'}`}
			/>

			<PlayerDashboard
				seekTo={seekTo}
				currentTime={currentTime}
				toggleVideoPlayback={() => toggleVideoPlayback()}
				playerInfo={playerInfo}
				isPlayerOn={isPlayerOn}
				setVolume={setVolume}
				changeMusic={changeMusic}
			/>
		</div>
	)
}

export default App
