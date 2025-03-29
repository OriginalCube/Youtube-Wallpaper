import { formatSeconds } from '../../composables/useTimeHelpers'
import Button from '../base/Button'
import FileMusicIcon from '../icons/FileMusicIcon'
import PauseIcon from '../icons/PauseIcon'
import PlayIcon from '../icons/PlayIcon'
import SkipBackIcon from '../icons/SkipBackIcon'
import SkipForwardIcon from '../icons/SkipForwardIcon'
import VolumeIcon from '../icons/VolumeIcon'

type PropsType = {
	toggleVideoPlayback: () => void
	currentTime: number
	seekTo: (sec: number, skip: boolean) => void
	playerInfo: PlayerInfo
	isPlayerOn: boolean
	setVolume: (val: number) => void
	changeMusic: (skip: boolean) => void
}

function PlayerDashboard(props: PropsType) {
	return (
		<div className="bg-base-100 relative flex h-30 w-full justify-between rounded-t-md">
			<div className="absolute top-0 -mt-2 w-full">
				<input
					type="range"
					className="w-full"
					min={0}
					max={props.playerInfo.duration}
					value={props.currentTime}
					onChange={(e) => props.seekTo(Number(e.target.value), true)}
				/>
			</div>

			<div className="flex h-20 w-1/3 items-center justify-between px-4">
				{/* Player */}
				<div className="flex h-full gap-2">
					<div className="flex items-center gap-4">
						<Button variants="icon" className="btn-ghost size-10" onClick={() => props.changeMusic(false)}>
							<SkipBackIcon />
						</Button>
						<Button
							variants="icon"
							className="btn-primary size-12"
							onClick={() => props.toggleVideoPlayback()}
						>
							{props.isPlayerOn ? <PauseIcon /> : <PlayIcon />}
						</Button>
						<Button variants="icon" className="btn-ghost size-10" onClick={() => props.changeMusic(true)}>
							<SkipForwardIcon />
						</Button>
					</div>

					<span className="bg-primary my-auto h-8 w-0.5" />

					<div className="flex h-full items-center text-sm">
						<p>
							{formatSeconds(props.currentTime)} / {formatSeconds(props.playerInfo.duration)}
						</p>
					</div>
				</div>
			</div>

			<div className="group flex h-20 w-1/3 items-center justify-center gap-4">
				{/* Details	*/}
				<div className="text-base-content group-hover:text-secondary size-10">
					<FileMusicIcon />
				</div>

				<div className="group-hover:text-secondary text-base-content flex flex-col">
					<p className="whitespace-wrap max-w-[250px] text-lg text-nowrap text-ellipsis">
						{JSON.stringify(props.playerInfo.videoTitle)}{' '}
					</p>
					<p className="text-sm"> Youtube Wallpaper </p>
				</div>
			</div>

			<div className="flex h-20 w-1/3 items-center justify-end gap-2 px-4">
				<div className="group flex items-center gap-2">
					<input
						className="range range-xs range-primary w-32 opacity-0 duration-300 ease-in-out group-hover:opacity-100"
						type="range"
						value={props.playerInfo.volume}
						min={0}
						max={100}
						step={10}
						onChange={(e) => props.setVolume(Number(e.target.value))}
					/>
					<div className="group-hover:text-primary size-8">
						<VolumeIcon />
					</div>
				</div>
			</div>
		</div>
	)
}

export default PlayerDashboard
