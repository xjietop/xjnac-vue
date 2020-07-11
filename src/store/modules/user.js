import { login, refreshToken, getInfo } from '@/api/user'
import { logout } from '@/api/user'
import { getStore, setStore } from '@/utils/store'
import router, { resetRouter } from '@/router'
// import { encryption } from '@/utils/util'

const state = {
    userInfo: {},
    roles: [],
    menu: getStore({
        name: 'menu'
    }) || [],
    menuAll: [],
    expires_in: getStore({
        name: 'expires_in'
    }) || '',
    access_token: getStore({
        name: 'access_token'
    }) || '',
    refresh_token: getStore({
        name: 'refresh_token'
    }) || '',
    oss_url: getStore({
        name: 'oss_url'
    }) || ''
}

const mutations = {
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_ACCESS_TOKEN: (state, access_token) => {
        state.access_token = access_token
        setStore({
            name: 'access_token',
            content: state.access_token,
            type: 'session'
        })
    },
    SET_EXPIRES_IN: (state, expires_in) => {
        state.expires_in = expires_in
        setStore({
            name: 'expires_in',
            content: state.expires_in,
            type: 'session'
        })
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
        state.refresh_token = rfToken
        setStore({
            name: 'refresh_token',
            content: state.refresh_token,
            type: 'session'
        })
    },
    SET_USERIFNO: (state, userInfo) => {
        state.userInfo = userInfo
    },
    SET_MENU: (state, menu) => {
        state.menu = menu
        setStore({
            name: 'menu',
            content: state.menu,
            type: 'session'
        })
    },
    SET_MENU_ALL: (state, menuAll) => {
        state.menuAll = menuAll
    },
    SET_PERMISSIONS: (state, permissions) => {
        const list = {}
        for (let i = 0; i < permissions.length; i++) {
            list[permissions[i]] = true
        }
        state.permissions = list
    },
    SET_OSS_URL: (state, oss_url) => {
        state.oss_url = oss_url
        setStore({
            name: 'oss_url',
            content: state.oss_url,
            type: 'session'
        })
    }
}

const actions = {

    /**
     * 用户登录
     */
    login({ commit }, userInfo) {
        const user = userInfo;
        // 加密
        // const user = encryption({
        //     data: userInfo,
        //     key: 'pigxpigxpigxpigx',
        //     param: ['password']
        // })
        return new Promise((resolve, reject) => {
            console.log(userInfo)
            login(user.username, user.password, user.type, user.code, user.randomStr, user.captchaid).then(response => {
                const data = response.data.data
                commit('SET_ACCESS_TOKEN', data.access_token)
                commit('SET_REFRESH_TOKEN', data.refresh_token)
                commit('SET_EXPIRES_IN', data.expires_in)
                commit('SET_OSS_URL', data.ossServerAddress)
                commit('CLEAR_LOCK')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**
     * 获取用户信息
     */
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo().then((response) => {
                const { data } = response.data
                const { roles, sysUser, permissions } = data || {}
                commit('SET_USERIFNO', sysUser)
                commit('SET_ROLES', roles || [])
                commit('SET_PERMISSIONS', permissions || [])
                if (permissions.length > 0){
                    resolve(data)
                } else {
                    router.push('/401')
                }
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**
     * 退出登录
     */
    logout({ commit }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_MENU', [])
                commit('SET_PERMISSIONS', [])
                commit('SET_USER_INFO', {})
                commit('SET_ACCESS_TOKEN', '')
                commit('SET_REFRESH_TOKEN', '')
                commit('SET_EXPIRES_IN', '')
                commit('SET_ROLES', [])
                commit('DEL_ALL_TAG')
                commit('CLEAR_LOCK')
                resolve()
            }).catch(error => {
                commit('SET_MENU', [])
                commit('SET_PERMISSIONS', [])
                commit('SET_USER_INFO', {})
                commit('SET_ACCESS_TOKEN', '')
                commit('SET_REFRESH_TOKEN', '')
                commit('SET_EXPIRES_IN', '')
                commit('SET_ROLES', [])
                commit('DEL_ALL_TAG')
                commit('CLEAR_LOCK')
                reject(error)
            })
        })
    },

    /**
     * 刷新Token
     */
    refreshToken({ commit }) {
        return new Promise((resolve, reject) => {
            refreshToken(state.refresh_token).then(response => {
                const data = response.data
                commit('SET_ACCESS_TOKEN', data.access_token)
                commit('SET_REFRESH_TOKEN', data.refresh_token)
                commit('SET_EXPIRES_IN', data.expires_in)
                commit('CLEAR_LOCK')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    /**
     * 注销Token
     */
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_MENU', [])
            commit('SET_PERMISSIONS', [])
            commit('SET_USER_INFO', {})
            commit('SET_ACCESS_TOKEN', '')
            commit('SET_REFRESH_TOKEN', '')
            commit('SET_ROLES', [])
            commit('DEL_ALL_TAG')
            commit('CLEAR_LOCK')
            resolve()
        })
    },

    // dynamically modify permissions
    changeRoles({ commit, dispatch }, role) {
        return new Promise(async resolve => {
            const token = role + '-token'

            commit('SET_TOKEN', token)

            const { roles } = await dispatch('getInfo')

            resetRouter()

            // generate accessible routes map based on roles
            const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

            // dynamically add accessible routes
            router.addRoutes(accessRoutes)

            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
