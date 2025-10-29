import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const Analytics = lazy(() => import('../pages/test1'));
const Sales = lazy(() => import('../pages/test2'));
const Chat = lazy(() => import('../pages/test3'));


const routes= [
    // dashboard
    {
        name: 'dashboard',
        path: '/',
        element: <Index />,
        layout: 'default',
    },

    {
        name: 'analytics',
        path: '/analytics',
        element: <Analytics />,
        permissions: ["ad"],

    },
    {
        name: 'sales',
        path: '/sales',
        element: <Sales />,
        permissions: ["user-list"],
    },
    {
        name: 'chat',
        path: '/app/chat',
        element: <Chat />,
    },

];

const findRouteByName = (name: string)  => {
    return routes.find(x => x.name == name) || {}
}

export { routes, findRouteByName };
