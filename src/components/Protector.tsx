import { useSelector } from 'react-redux';
import { IRootState } from '../store';
import { ReactNode } from 'react';

interface ProtectorProps {
    requiredPermissions?: string[];
    children: ReactNode;
    fallback?: ReactNode;
}

function Protector(props: ProtectorProps) {
    const {
        requiredPermissions = [],
        children,
        fallback = null
    } = props;

    const user = useSelector((state: IRootState) => state.appConfig.user);

    // Safe permission check
    const hasRequiredPermissions = requiredPermissions.length === 0 ||
        requiredPermissions.some(permission =>
            user.permissions?.includes(permission)
        );

    // Allow access if user is manager OR has required permissions
    const hasAccess = user.access === "manager" || hasRequiredPermissions;

    if (hasAccess) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}

export default Protector;