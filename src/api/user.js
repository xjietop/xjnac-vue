import request from '@/utils/request'
import { baseURL } from '@/utils/urls'
const scope = 'server'

/**
 * 登录
 * @param {*} username
 * @param {*} password
 * @param {*} code
 * @param {*} randomStr
 */
export function login(username, password,  type, code, randomStr, captchaid) {
    const grant_type = 'password'
    return request({
        baseURL,
        url: '/user/login',
        headers: {
            isToken: false,
            'TENANT_ID': '1',
            'Authorization': 'Basic YWRtaW46YWRtaW4='
        },
        method: 'get',
        params: { username, password, randomStr, captchaid, code, type, grant_type, scope }
    })
}
/**
 * 获取用户信息
 */
export function getInfo() {
    return request({
        baseURL,
        url: '/user/info',
        method: 'get'
    })
}
/**
 * 登出
 */
export function logout() {
    return request({
        baseURL,
        url: '/user/logout',
        method: 'delete'
    })
}
/**
 * 刷新Token
 * @param {*} refresh_token 
 */
export function refreshToken(refresh_token) {
    const grant_type = 'refresh_token'
    return request({
        baseURL,
        url: '/auth/oauth/token',
        headers: {
            'isToken': false,
            'TENANT_ID': '1',
            'Authorization': 'Basic YWRtaW46YWRtaW4='
        },
        method: 'post',
        params: { refresh_token, grant_type, scope }
    })
}
/**
 * 获取用户列表
 */
export function fetchList(query) {
    return request({
        baseURL,
        url: '/xjie/user/userlist',
        method: 'get',
        params: query
    })
}
/**
 * 获取用户组列表
 */
export function fetchGroupList(query) {
    return request({
        baseURL,
        url: '/xjie/user/usergrouplist',
        method: 'get',
        params: query
    })
}
/**
 * 禁用用户
 */
export function disableUser(Fid) {
    return request({
        baseURL,
        url: '/xjie/user/disable',        
        method: 'get',
        params: { Fid }
    })
}
/**
 * 启用用户
 */
export function enableUser(Fid) {
    return request({
        baseURL,
        url: '/xjie/user/enable',        
        method: 'get',
        params: { Fid }
    })
}

