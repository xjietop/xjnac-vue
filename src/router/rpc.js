import Layout from '@/layout'
export default {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, 
    name: 'System',
    meta: {
        title: 'RPC服务',
        icon: 'sysset',
        roles: ['/b2b']
    },
    children: [
        {
            path: 'userlist',
            component: () => import('@/views/rpclist'),
            name: 'PageSystemUserList',
            meta: {
                title: 'RPC服务列表',
                roles: ['/b2b'] 
            }
        }        
    ]
};
