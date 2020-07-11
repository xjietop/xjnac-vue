
import request from '@/utils/request'
import { baseURL } from '@/utils/urls'

export function upload(params) {
    return request({
        baseURL,
        url: '/public/api/file/upload',
        method: 'post',
        params: params
    })
}

export function fetchProductClass(query) {
    return request({
        baseURL,
        url: '/product/admin/productClass/industryClass/all',
        method: 'get',
        params: query
    })
}
