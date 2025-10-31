import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, ReactNode, useEffect } from 'react';
import IconXCircle from '../Icon/IconXCircle';
import IconX from '../Icon/IconX';
import { MyToast } from './MyToast';

// Define TypeScript interfaces
interface ModalProps {
    title?: string;
    size?: 'sm' | 'lg' | 'xlg';
    children: ReactNode;
    onSubmit?: () => void;
    onClose?: () => void;
    isStatic?: boolean;
    isOpen?: boolean;
    showActions?: boolean;
    submitText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const MyModal: React.FC<ModalProps> = (props) => {
    const {
        isStatic = false,
        title = "Show information",
        size = "sm",
        children,
        onSubmit = () => { },
        onClose = () => { },
        showActions = true,
        isOpen = true,
        isLoading = false,
        submitText = "Save",
        cancelText = "Discard",
    } = props;

    const [state, setState] = useState({ isOpen: true, isLoading: false })

    useEffect(() => {
        setState({ isOpen, isLoading })
    }, [isOpen, isLoading])

    // Modal size mapping
    const modalSizeMap = {
        "xlg": "max-w-5xl",
        "lg": "max-w-xl",
        "sm": "max-w-sm"
    } as const;

    const modalSize = modalSizeMap[size];

    const handleSubmit = () => {
        onSubmit();

    };

    const closeIfStatic = () => {

        if (isStatic){
            setState({...state, isOpen : true})
        }else{
            handleClose()
        }
    }

    const handleClose = () => {
        if (state.isLoading) {
            MyToast.info("لطفا کمی صبر کنید")
            return
        }
        onClose();

    };

    return (
        <Transition appear show={state.isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={()=>closeIfStatic}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={`panel border-0 p-0 rounded-lg overflow-hidden w-full ${modalSize} my-8 text-black dark:text-white-dark"`}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white">
                                        {title}
                                    </Dialog.Title>
                                    <button
                                        onClick={handleClose}
                                        type="button"
                                        disabled={false}
                                        className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                                    >
                                        <IconX />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="mb-6">
                                        {children}
                                    </div>

                                    {/* Actions */}
                                    {showActions && (
                                        <div className="flex justify-end items-center gap-3">
                                            <button
                                                onClick={handleClose}
                                                type="button"
                                                disabled={state.isLoading}
                                                className="btn btn-outline-danger disabled:opacity-50"
                                            >
                                                {cancelText}
                                            </button>


                                            <button disabled={state.isLoading}
                                                type="button" className="btn btn-secondary btn-lg" onClick={handleSubmit}>
                                                {state.isLoading && <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>}
                                                {submitText}
                                            </button>



                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default MyModal;