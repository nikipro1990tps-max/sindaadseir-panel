import { useTranslation } from 'react-i18next';
import { FindRouteByName } from '../../router/routes';
import { NavLink } from 'react-router-dom';
import AnimateHeight from 'react-animate-height';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import Protector from '../Protector';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { ReactNode, useEffect, useMemo, useState } from 'react';

interface SidebarElementsProps {
    currentMenu: string;
    toggleMenu: (menuName: string) => void;
}

const SidebarElements: React.FC<SidebarElementsProps> = (props) => {
    const { currentMenu, toggleMenu = (menu) => { } } = props;
    const { t } = useTranslation(["sidebar"]);

    const user = useSelector((state: IRootState) => state.appConfig.user);

    const SideBarItems = [
        {
            title: t('sidebar:dashboard'),
            icon: <IconMenuDashboard className="group-hover:!text-primary shrink-0" />,
            ...FindRouteByName('dashboard'),
         
        },
        {
            title: t('sidebar:admin.title'),
            icon: <IconMenuDashboard className="group-hover:!text-primary shrink-0" />,
            children: [
                {
                    title: t('sidebar:admin.adminList'),
                    subLevel: 1,
                    ...FindRouteByName('admins'),
                },
                {
                    title: t('sidebar:admin.roleList'),
                    subLevel: 1,
                    ...FindRouteByName('roles'),
                },
            ]
        },
        {
            title: t('sidebar:users.title'),
            icon: <IconMenuDashboard className="group-hover:!text-primary shrink-0" />,
            ...FindRouteByName('users'),
         
        },
    ]


    const hasChildren = (item: any) => {
        return !!item.children?.[0];
    };

    // Check user access safely
    if (!user?.access || !['manager', 'admin'].includes(user.access)) {
        return <ul className="relative font-semibold space-y-0.5 p-4 py-0" />
    }


    return (
        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
            {SideBarItems.map((item: any, index: number) => (
                hasChildren(item) ? (
                    <li key={`${item.name}-${index}`} className="menu nav-item">
                        <button
                            type="button"
                            className={`${currentMenu === item.name ? 'active' : ''} nav-link group w-full`}
                            onClick={() => toggleMenu(item.name)}
                        >
                            <div className="flex items-center">
                                {item.icon}
                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                    {item.title}
                                </span>
                            </div>

                            <div className={currentMenu !== item.name ? 'rtl:rotate-90 -rotate-90' : ''}>
                                <IconCaretDown />
                            </div>
                        </button>

                        <AnimateHeight duration={300} height={currentMenu === item.name ? 'auto' : 0}>
                            <ul className="sub-menu text-gray-500">
                                {item.children.map((child: any, childIndex: number) => (
                                    <Protector
                                        key={`${child.name}-${childIndex}`}
                                        requiredPermissions={child.permissions || []}
                                    >
                                        <li>
                                            <NavLink
                                                to={child.path}

                                            >
                                                {child.title}
                                            </NavLink>
                                        </li>
                                    </Protector>
                                ))}
                            </ul>
                        </AnimateHeight>
                    </li>
                ) : (
                    <li key={`${item.name}-${index}`} className="nav-item">
                        <NavLink to={item.path || ""} className="group">

                            <div className="flex items-center">
                                {item.icon}
                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                    {item.title}
                                </span>
                            </div>
                        </NavLink>
                    </li>
                )
            ))}
        </ul>
    );
};

export default SidebarElements;