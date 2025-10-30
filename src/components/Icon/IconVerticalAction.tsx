import { FC } from 'react';

interface IconVerticalActionProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconVerticalAction: FC<IconVerticalActionProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 rotate-90 opacity-70">
                <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"></circle>
                <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"></circle>
                <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"></circle>
            </svg>
        </>
    )
}

export default IconVerticalAction;
