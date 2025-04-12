import { formatSeconds } from '@/composables/useHelpers'
import Button from '@/components/base/button/Button'
import IconPause from '@/components/icons/IconPause'
import IconPlay from '@/components/icons/IconPlay'
import IconSkipBack from '@/components/icons/IconSkipBack'
import IconSkipForward from '@/components/icons/IconSkipForward'
import IconVolume from '@/components/icons/IconVolume'
import IconRepeat from '@/components/icons/IconRepeat'
import IconSettings from '@/components/icons/IconSettings'
import { useEffect, useRef } from 'react'
import { useApp } from '@/store/useApp'
import IconShuffle from '@/components/icons/IconShuffle'
import UserSettings from '@/components/dialog/UserSettings'
import IconMusicOff from '@/components/icons/IconMusicOff'

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
	const modalRef = useRef<HTMLDialogElement>(null)
	const volume = useApp((state) => state.volume)
	const theme = useApp((state) => state.theme)
	const repeat = useApp((state) => state.repeat)
	const shuffle = useApp((state) => state.shuffle)
	const setRepeat = useApp((state) => state.setRepeat)
	const setShuffle = useApp((state) => state.setShuffle)
	const setTheme = useApp((state) => state.setTheme)

	const openModal = () => {
		if (!modalRef || !modalRef.current) return
		modalRef.current?.showModal()
	}

	const updateTheme = (ev: string) => {
		setTheme(ev)
	}

	const updateRepeat = () => {
		setRepeat(!repeat)
	}

	const updateVolume = () => {
		if (volume >= 10) {
			props.setVolume(0)
		} else {
			props.setVolume(80)
		}
	}

	const updateShuffle = () => {
		setShuffle(!shuffle)
	}

	const CONFIGURATIONS: { label: string; action: () => void; key: 'shuffle' | 'repeat' }[] = [
		{ label: 'Shuffle', action: () => updateShuffle(), key: 'shuffle' },
		{ label: 'Repeat', action: () => updateRepeat(), key: 'repeat' },
	]

	const THEMES = [
		{ label: 'Dark mode', value: 'text', disable: true },
		{ label: 'Night', value: 'night' },
		{ label: 'Synthwave', value: 'synthwave' },
		{ label: 'Forest', value: 'forest' },
		{ label: 'Coffee', value: 'coffee' },
		{ label: 'Dracula', value: 'dracula' },
		{ label: 'Light mode', value: 'text', disable: true },
		{ label: 'Light', value: 'light' },
		{ label: 'Cupcake', value: 'cupcake' },
		{ label: 'Retro', value: 'retro' },
		{ label: 'Cyberpunk', value: 'cyberpunk' },
	]

	useEffect(() => {
		document.body.setAttribute('data-theme', theme)
	}, [theme])

	return (
		<div className="bg-base-100 relative flex h-30 w-full justify-between rounded-t-md">
			<UserSettings
				modalRef={modalRef}
				updateTheme={updateTheme}
				THEMES={THEMES}
				volume={volume}
				theme={theme}
				CONFIGURATIONS={CONFIGURATIONS}
				setVolume={props.setVolume}
			/>
			<div className="absolute top-0 -mt-3 w-full">
				<input
					type="range"
					className="range range-xs range-secondary w-full"
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
							<IconSkipBack />
						</Button>
						<Button
							variants="icon"
							className="btn-primary size-12"
							onClick={() => props.toggleVideoPlayback()}
						>
							{props.isPlayerOn ? <IconPause /> : <IconPlay />}
						</Button>
						<Button variants="icon" className="btn-ghost size-10" onClick={() => props.changeMusic(true)}>
							<IconSkipForward />
						</Button>
					</div>

					{props.playerInfo.duration < 1800 && (
						<>
							<span className="bg-primary my-auto h-8 w-0.5" />

							<div className="text-base-content flex h-full items-center text-sm">
								<p>
									{formatSeconds(props.currentTime)} / {formatSeconds(props.playerInfo.duration)}
								</p>
							</div>
						</>
					)}
				</div>
			</div>

			<div className="group flex h-20 w-1/3 items-center justify-center gap-4">
				{/* Details	*/}
				<div className="text-base-content group-hover:text-primary size-10">
					<img src="./images/anime-jam.gif" className="size-full" />
				</div>

				<div className="group-hover:text-primary text-base-content flex flex-col">
					<p className="max-w-[400px] overflow-hidden text-lg text-wrap text-ellipsis whitespace-nowrap">
						{props.playerInfo.videoTitle ?? 'Loading Video'}
					</p>
					<p className="text-sm"> {props.playerInfo.videoAuthor ?? 'Youtube Wallpaper'} </p>
				</div>
			</div>

			<div className="flex h-20 w-1/3 items-center justify-end gap-2 px-4">
				<div className="group flex items-center gap-2">
					<input
						className="range range-xs range-primary w-32 opacity-0 duration-300 ease-in-out group-hover:opacity-100"
						type="range"
						value={volume}
						min={0}
						max={100}
						step={10}
						onChange={(e) => props.setVolume(Number(e.target.value))}
					/>
					<div className="tooltip" data-tip="Volume">
						<Button variants="icon" className="btn-ghost size-10" onClick={() => updateVolume()}>
							{volume >= 10 ? <IconVolume /> : <IconMusicOff />}
						</Button>
					</div>
				</div>
				<div className="tooltip" data-tip="Shuffle">
					<Button
						variants="icon"
						className={`btn-ghost size-10 ${shuffle ? 'text-primary' : ''}`}
						onClick={() => updateShuffle()}
					>
						<IconShuffle />
					</Button>
				</div>
				<div className="tooltip" data-tip="Repeat">
					<Button
						variants="icon"
						className={`btn-ghost size-10 ${repeat ? 'text-primary' : ''}`}
						onClick={() => updateRepeat()}
					>
						<IconRepeat />
					</Button>
				</div>
				<div className="tooltip" data-tip="Settings">
					<Button variants="icon" className="btn-ghost size-10" onClick={() => openModal()}>
						<IconSettings />
					</Button>
				</div>
			</div>
		</div>
	)
}

export default PlayerDashboard
