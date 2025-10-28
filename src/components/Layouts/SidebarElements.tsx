import { useTranslation } from 'react-i18next';
import { findRouteByName } from '../../router/routes';
import { NavLink } from 'react-router-dom';
import AnimateHeight from 'react-animate-height';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import Protector from '../Protector';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { ReactNode, useEffect, useState } from 'react';


interface SidebarChildItem {
    title: string;
    name: string;
    subLevel: number;
    permissions?: string[];
    url: string;
}

interface SidebarItem {
    title: string;
    name: string;
    icon?: ReactNode;
    url?: string;
    permissions?: string[];
    children?: SidebarChildItem[];
}

interface SidebarElementsProps {
    currentMenu: string;
    toggleMenu: (menuName: string) => void;
}

const SidebarElements: React.FC<SidebarElementsProps> = (props) => {
    const { currentMenu, toggleMenu = (menu) => { } } = props;
    const { t } = useTranslation();

    const user = useSelector((state: IRootState) => state.appConfig.user);

    const SideBarItems: SidebarItem[] = [
        {
            title: t('dashboard'),
            name: 'dashboard',
            icon: <IconMenuDashboard className="group-hover:!text-primary shrink-0" />,
            children: [
                {
                    title: t('sales'),
                    name: 'sale',
                    subLevel: 1,
                    permissions: ["ad"],
                    url: findRouteByName('analytics'),
                },
                {
                    title: t('sales'),
                    name: 'sale',
                    subLevel: 1,
                    permissions: ['user-list'],
                    url: findRouteByName("sales"),
                },
            ]
        },
        {
            title: t('chat'),
            name: 'chat',
            url: findRouteByName('chat'),
            icon: <IconMenuChat className="group-hover:!text-primary shrink-0" />
        }
    ];

    console.log(9999999999, SideBarItems)


    const hasChildren = (item: SidebarItem): item is SidebarItem & { children: SidebarChildItem[] } => {
        return !!item.children && item.children.length > 0;
    };

    // Check user access safely
    if (!user?.access || !['manager', 'admin'].includes(user.access)) {
        return <ul className="relative font-semibold space-y-0.5 p-4 py-0" />
    }


    return (
        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
            {SideBarItems.map((item, index) => (
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
                                {item.children.map((child, childIndex) => (
                                    <Protector
                                        key={`${child.name}-${childIndex}`}
                                        requiredPermissions={child.permissions || []}
                                    >
                                        <li>
                                            <NavLink
                                                to={child.url}

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
                        <NavLink to={item.url || ""} className="group">

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