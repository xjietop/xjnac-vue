import request from '@/utils/request'
import { baseURL } from '@/utils/urls'

export function rpcxList(query) {
    return request({
        baseURL,
        url: '/RpcxList',
        method: 'get',
        params: query
    })
}

