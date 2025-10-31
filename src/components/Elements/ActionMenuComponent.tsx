import { useState, useRef } from 'react';
import IconVerticalAction from '../Icon/IconVerticalAction';
import Protector from '../Protector';

function ActionMenuComponent({ row, handleActionClick }: { row: any, handleActionClick: (action: string, row: any) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                type="button" 
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                <IconVerticalAction />
            </button>
            
            {isOpen && (
                <div className="absolute z-50 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 min-w-[120px]">
                    <ul className="py-1">
                        <Protector requiredPermissions={['role-manager']}>
                            <li>
                                <button
                                    type="button"
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => {
                                        handleActionClick("update", row);
                                        setIsOpen(false);
                                    }}
                                >
                                    Edit
                                </button>
                            </li>
                        </Protector>
                        <Protector requiredPermissions={['role-manager']}>
                            <li>
                                <button
                                    type="button"
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => {
                                        handleActionClick("delete", row);
                                        setIsOpen(false);
                                    }}
                                >
                                    Delete
                                </button>
                            </li>
                        </Protector>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ActionMenuComponent