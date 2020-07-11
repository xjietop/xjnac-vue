import request from '@/utils/request'
import { baseURL } from '@/utils/urls'

export function fetchList(query) {
    return request({
        baseURL,
        url: '/config/list',
        method: 'get',
        params: query
    })
}

export function createConfig(DataId, CDesc, Content) {
    return request({
        baseURL,
        url: '/config/add',
        method: 'get',
        params: { DataId, CDesc, Content }
    })
}

export function fetchDetail(query) {
    return request({
        baseURL,
        url: '/config/view',
        method: 'get',
        params: query
    })
}

export function updateConfig(Id, DataId, CDesc, Content) {
    return request({
        baseURL,
        url: '/config/update',
        method: 'get',
        params: { Id, DataId, CDesc, Content }
    })
}

export function deleteConfig(Id) {
    return request({
        baseURL,
        url: '/config/delete',
        method: 'get',
        params: { Id }
    })
}

export function bindUser(params) {
    return request({
        baseURL,
        url: `/member/admin/userInfo/bindUser/${params.sid}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'put',
        params
    })
}

export function fetchControlList(query) {
    return request({
        baseURL,
        url: `/member/admin/spuControl/page/${query.userInfoSid}`,
        method: 'get',
        params: query
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

