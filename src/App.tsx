import { useState, useRef } from 'react'
import PlayerDashboard from './components/player/PlayerDashboard'
import { usePlayer } from './composables/usePlayer'

function App() {
	const [isPlayerOn, setPlayerOn] = useState(true)
	const playerContainerRef = useRef<HTMLDivElement>(null)

	const { toggleVideoPlayback } = usePlayer(playerContainerRef)

	return (
		<div className="flex flex-col">
			{/* Iframe */}
			<div
				ref={playerContainerRef}
				className={`pointer-events-none w-full ${isPlayerOn ? 'min-h-[calc(100vh-7rem)]' : 'min-h-dvh'}`}
			/>

			{isPlayerOn && <PlayerDashboard toggleVideoPlayback={() => toggleVideoPlayback()} />}
		</div>
	)
}

export default App
