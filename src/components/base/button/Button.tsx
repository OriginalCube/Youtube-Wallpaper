import buttonVariants from './index'

type PropsType = {
	variants: 'icon'
	className?: HTMLElement['className']
	onClick?: () => any
	children?: React.ReactNode
}

function Button(props: PropsType) {
	return (
		<button
			className={`${buttonVariants.main} ${buttonVariants.variants[props.variants]} ${props.className}`}
			onClick={() => (props.onClick ? props.onClick() : '')}
		>
			{props.children}
		</button>
	)
}

export default Button
