import Layout from '@/layout'
export default {
    path: '/erp',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, 
    name: 'erp',
    meta: {
        title: 'HTTP服务',
        icon: 'member',
        roles: ['/b2b']
    },
    children: [
        {
            path: 'customerlist',
            component: () => import('@/views/httplist'),
            name: 'PageErpCustomerList',
            meta: {
                title: 'HTTP服务列表',
                roles: ['/b2b'] 
            }
        }       
    ]
};
