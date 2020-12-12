import request from '@/utils/request'
import { baseURL } from '@/utils/urls'

export function fetchList(query) {
    return request({
        baseURL,
        url: '/ServicesList',
        method: 'get',
        params: query
    })
}

export function health(name, url) {
    return request({
        baseURL,
        url: `/ServiceHealth`,
        method: 'get',
        params: { name: name, url: url }
    })
}

export function del(name, url) {
    return request({
        baseURL,
        url: `/ServiceDel`,
        method: 'delete',
        params: { name: name, url: url }
    })
}

//下线
export function disable(name, url) {
    return request({
        baseURL,
        url: `/ServiceDisable`,
        method: 'put',
        params: { name: name, url: url }
    })
}

//上线
export function enable(name, url) {
    return request({
        baseURL,
        url: `/ServiceEnable`,
        method: 'put',
        params: { name: name, url: url }
    })
}

export function reSetPwd(params) {
    return request({
        baseURL,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: `/member/admin/userInfo/reSetPwd/${params.sid}`,
        method: 'put',
        params
    })
}

export function setClubs(params) {
    return request({
        baseURL,
        url: `/member/admin/userInfo/openStatus/${params.userSid}`,
        method: 'put',
        params
    })
}

/**
 * 根据俱乐部获取商品分页列表
 */
export function fetchProduct(query) {
    return request({
        baseURL,
        url: '/product/admin/product/pageByClub',
        method: 'get',
        params: query
    })
}

/**
 * 新增用户控销
 */
export function addObj(obj) {
    return request({
        baseURL,
        url: `/member/admin/spuControl/${obj.userInfoSid}`,
        method: 'post',
        data: obj.list
    })
}

/**
 * 更新用户控销
 */
export function putObj(obj) {
    return request({
        baseURL,
        url: `/member/admin/spuControl/${obj.userInfoSid}`,
        method: 'put',
        data: obj
    })
}

/**
 * 删除用户控销
 */
export function delObj(obj) {
    return request({
        baseURL,
        url: `/member/admin/spuControl/${obj.sid}`,
        method: 'delete'
    })
}

/**
 * 设置会员发票类型
 */
export function setBillType(obj) {
    return request({
        baseURL,
        url: `/member/admin/userInfo/setBillType/${obj.sid}/${obj.billType}`,
        method: 'PUT',
        data: obj
    })
}

