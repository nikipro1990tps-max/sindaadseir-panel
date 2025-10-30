import { FC } from 'react';

interface IconUpDownProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconUpDown: FC<IconUpDownProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            <svg className={className} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7l4 -4l4 4"></path>
                <path d="M8 17l4 4l4 -4"></path>
                <path d="M12 3l0 18"></path>
            </svg>
        </>
    )
}

export default IconUpDown;
