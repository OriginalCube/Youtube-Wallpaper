import Button from '../base/Button'
import PlayIcon from '../icons/PlayIcon'
import SkipBackIcon from '../icons/SkipBackIcon'
import SkipForwardIcon from '../icons/SkipForwardIcon'

type PropsType = {
	toggleVideoPlayback: () => void
}

function PlayerDashboard(props: PropsType) {
	return (
		<div className="bg-base-100 relative h-28 w-full rounded-t-md">
			<div className="absolute top-0 -mt-2 w-full">
				<input type="range" className="w-full" />
			</div>

			<div className="flex h-20 w-full items-center justify-between px-2">
				{/* Player */}
				<div className="flex h-full gap-2">
					<div className="flex items-center gap-4">
						<Button variants="icon" className="btn-ghost size-10">
							<SkipBackIcon />
						</Button>
						<Button
							variants="icon"
							className="btn-primary size-12"
							onClick={() => props.toggleVideoPlayback()}
						>
							<PlayIcon />
						</Button>
						<Button variants="icon" className="btn-ghost size-10">
							<SkipForwardIcon />
						</Button>
					</div>

					<span className="bg-primary my-auto h-8 w-0.5" />

					<div className="flex h-full items-center text-sm">
						<p>1:00 / 1:59</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PlayerDashboard
