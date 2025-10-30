import { FC } from 'react';

interface IconDownProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconDown: FC<IconDownProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            <svg className={className} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5l0 14"></path>
                <path d="M18 11l-6 -6"></path>
                <path d="M6 11l6 -6"></path>
            </svg>
        </>
    )
}

export default IconDown;
