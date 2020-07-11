import request from '@/utils/request'
import { baseURL } from '@/utils/urls'

export function fetchList(query) {
    return request({
        baseURL,
        url: '/cms/admin/news/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        baseURL,
        url: '/cms/admin/news/',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        baseURL,
        url: `/cms/admin/news/${id}`,
        method: 'get'
    })
}

export function delObj(row) {
    return request({
        baseURL,
        url: `/cms/admin/news/${row.sid}`,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        baseURL,
        url: `/cms/admin/news`,
        method: 'put',
        data: obj
    })
}
