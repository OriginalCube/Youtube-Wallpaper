import { formatSeconds } from '@/composables/useTimeHelpers'
import Button from '@/components/base/button/Button'
import IconFileMusic from '@/components/icons/IconFileMusic'
import IconPause from '@/components/icons/IconPause'
import IconPlay from '@/components/icons/IconPlay'
import IconSkipBack from '@/components/icons/IconSkipBack'
import IconSkipForward from '@/components/icons/IconSkipForward'
import IconVolume from '@/components/icons/IconVolume'
import IconRepeat from '@/components/icons/IconRepeat'
import IconSettings from '@/components/icons/IconSettings'
import Dialog from '@/components/base/dialog/Dialog'
import { useEffect, useRef } from 'react'
import { useApp } from '../store/useApp'

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
	const theme = useApp((state) => state.theme)
	const setTheme = useApp((state) => state.setTheme)

	const openModal = () => {
		if (!modalRef || !modalRef.current) return
		modalRef.current?.showModal()
	}

	const THEMES = [
		{ label: 'Dark mode', value: 'text', disable: true },
		{ label: 'Night', value: 'night' },
		{ label: 'Synthwave', value: 'synthwave' },
		{ label: 'Light mode', value: 'text', disable: true },
		{ label: 'Light', value: 'light' },
		{ label: 'Cupcake', value: 'cupcake' },
	]

	const updateTheme = (ev: string) => {
		setTheme(ev)
	}

	useEffect(() => {
		console.log(theme)
		document.body.setAttribute('data-theme', theme)
	}, [theme])

	return (
		<div className="bg-base-100 relative flex h-30 w-full justify-between rounded-t-md">
			<Dialog modalRef={modalRef}>
				<p className="mb-4 text-xl">Customize</p>
				<p className="mb-1 font-bold">Theme</p>
				<select
					defaultValue="Select Theme"
					className="select w-full"
					onChange={(ev) => updateTheme(ev.target.value)}
				>
					{THEMES.map((th) => (
						<option value={th.value} disabled={th.disable ?? false}>
							{th.label}
						</option>
					))}
				</select>
			</Dialog>
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

					<span className="bg-primary my-auto h-8 w-0.5" />

					<div className="text-base-content flex h-full items-center text-sm">
						<p>
							{formatSeconds(props.currentTime)} / {formatSeconds(props.playerInfo.duration)}
						</p>
					</div>
				</div>
			</div>

			<div className="group flex h-20 w-1/3 items-center justify-center gap-4">
				{/* Details	*/}
				<div className="text-base-content group-hover:text-primary size-10">
					<IconFileMusic />
				</div>

				<div className="group-hover:text-primary text-base-content flex flex-col">
					<p className="max-w-[400px] overflow-hidden text-lg text-wrap text-ellipsis whitespace-nowrap">
						{props.playerInfo.videoTitle}{' '}
					</p>
					<p className="text-sm"> {props.playerInfo.videoAuthor} </p>
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
					<Button variants="icon" className="btn-ghost size-10">
						<IconVolume />
					</Button>
				</div>
				<Button variants="icon" className="btn-ghost size-10">
					<IconRepeat />
				</Button>
				<Button variants="icon" className="btn-ghost size-10" onClick={() => openModal()}>
					<IconSettings />
				</Button>
			</div>
		</div>
	)
}

export default PlayerDashboard
