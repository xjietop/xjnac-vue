import Layout from '@/layout'
export default {
    path: '/news',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, 
    name: 'News',
    meta: {
        title: '路由管理',
        icon: 'news',
        roles: ['/b2b']
    },
    children: [
        {
            path: 'list',
            component: () => import('@/views/routinglist'),
            name: 'PageNewsList',
            meta: {
                title: '路由列表',
                roles: ['/b2b'] 
            }
        }
    ]
};
