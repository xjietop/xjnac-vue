import Layout from '@/layout'
export default {
    path: '/config',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, 
    name: 'config',
    meta: {
        title: '配置管理',
        icon: 'product',
        roles: ['/b2b']
    },
    children: [
        {
            path: 'list',
            component: () => import('@/views/configlist'),
            name: 'PageConfigList',
            meta: {
                title: '配置列表',
                roles: ['/b2b'] 
            }
        },   
        {
            path: 'add',
            component: () => import('@/views/configadd'),
            name: 'PageConfigAdd',
            hidden: true,
            meta: {
                title: '配置新增',
                roles: ['/b2b'] 
            }
        },  
        {
            path: 'view',
            component: () => import('@/views/configview'),
            name: 'PageConfigView',
            hidden: true,
            meta: {
                title: '配置查看',
                roles: ['/b2b'] 
            }
        },     
        {
            path: 'modify',
            component: () => import('@/views/configmodify'),
            name: 'PageConfigModify',
            hidden: true,
            meta: {
                title: '配置修改',
                roles: ['/b2b'] 
            }
        }         
    ]
};
