import { useMemo } from 'react'
import Dialog from '../base/dialog/Dialog'
import { useApp } from '@/store/useApp'

type UserSettingsType = {
	modalRef: React.Ref<HTMLDialogElement> | undefined
	updateTheme: (ev: string) => void
	THEMES: { label: string; value: string; disable?: boolean }[]
	theme: string
	volume: number
	setVolume: (ev: number) => void
	CONFIGURATIONS: { label: string; action: () => void; key: 'shuffle' | 'repeat' }[]
}

function UserSettings(props: UserSettingsType) {
	const shuffle = useApp((state) => state.shuffle)
	const repeat = useApp((state) => state.repeat)
	const configState = useMemo(() => {
		return { shuffle, repeat }
	}, [repeat, shuffle])
	return (
		<Dialog modalRef={props.modalRef}>
			<p className="mb-4 text-xl">Customize</p>
			<p className="mb-1 font-bold">Theme</p>
			<select
				defaultValue="Select Theme"
				className="select mb-2 w-full"
				value={props.theme}
				onChange={(ev) => props.updateTheme(ev.target.value)}
			>
				{props.THEMES.map((th) => (
					<option value={th.value} disabled={th.disable ?? false}>
						{th.label}
					</option>
				))}
			</select>
			<p className="mb-1 font-bold">Volume</p>
			<input
				type="range"
				className="range range-xs range-secondary mb-2 w-full"
				max={100}
				step={10}
				value={props.volume}
				onChange={(ev) => props.setVolume(Number(ev.target.value))}
			/>
			<p className="mb-1 font-bold"> Configs </p>
			<div className="grid grid-cols-3">
				{props.CONFIGURATIONS.map((config) => (
					<div className="flex items-center gap-2 px-2" onClick={() => config.action()}>
						<p className="text-sm">{config.label}</p>
						<input type="checkbox" className="toggle toggle-primary" checked={configState[config.key]} />
					</div>
				))}
			</div>
		</Dialog>
	)
}

export default UserSettings
