import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const AdminList = lazy(() => import('../pages/admin/adminList'));
const RoleList = lazy(() => import('../pages/admin/roleList'));
const UserList = lazy(() => import('../pages/users/userList'));
const Profile = lazy(() => import('../pages/profile'));


const routes= [
    // dashboard
    {
        name: 'dashboard',
        path: '/',
        element: <Index />,
        layout: 'default',
    },

    {
        name: 'admins',
        path: '/admins',
        element: <AdminList />,
        permissions: ["users-manage", "user-list"],

    },
    {
        name: 'roles',
        path: '/roles',
        element: <RoleList />,
        permissions: ["roles-manage", "role-list"],
    },
    {
        name: 'users',
        path: '/users',
        element: <UserList />,
        permissions: ["users-manager", "user-list"],
    },

    {
        name: 'profile',
        path: '/user-profile',
        element: <Profile />,
    },

];

const FindRouteByName = (name: string)  => {
    return routes.find(x => x.name == name) || {}
}

export { routes, FindRouteByName };
