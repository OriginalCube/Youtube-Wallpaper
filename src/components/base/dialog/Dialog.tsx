import Button from '@/components/base/button/Button'
import IconClose from '@/components/icons/IconClose'

type ModalType = {
	modalRef: React.Ref<HTMLDialogElement> | undefined
	children?: React.ReactNode
}

function Dialog(props: ModalType) {
	return (
		<dialog ref={props.modalRef} className="modal">
			<div className="modal-box">
				<form method="dialog" className="absolute top-2 right-2">
					<Button variants="icon" className="btn-ghost size-8">
						<IconClose />
					</Button>
				</form>
				{props.children}
			</div>
		</dialog>
	)
}

export default Dialog
