import Swal from 'sweetalert2';
import { useEffect } from 'react';

interface ConfirmModalOptions {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    icon?: 'warning' | 'success' | 'error' | 'info' | 'question';
    onConfirm?: () => void;
    onCancel?: () => void;
}

const ConfirmModal = (props: ConfirmModalOptions) => {
    const {
        title = 'Are you sure?',
        text = "You won't be able to revert this!",
        confirmButtonText = 'Delete',
        cancelButtonText = 'Cancel',
        icon = 'warning',
        onConfirm = () => { },
        onCancel = () => { },
    } = props;

    useEffect(() => {
        Swal.fire({
            icon,
            title,
            text,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            padding: '2em',
            buttonsStyling: true,
            customClass: {
                confirmButton: 'btn btn-danger cursor-pointer mx-1',
                cancelButton: 'btn btn-outline-danger cursor-pointer'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                onConfirm();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                onCancel();
            }
        });

    }, []);

    return <></>; // This component doesn't render anything visible
}

export default ConfirmModal;