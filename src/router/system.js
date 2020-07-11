import Layout from '@/layout'
export default {
    path: '/auth',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, 
    name: 'Auth',
    meta: {
        title: '系统管理',
        icon: 'auth',
        roles: ['/b2b']
    },
    children: [
        {
            path: 'menu',
            component: () => import('@/views/userlist'),
            name: 'PageAuthMenu',
            meta: {
                title: '用户管理',
                roles: ['/b2b'] 
            }
        }
    ]
};
