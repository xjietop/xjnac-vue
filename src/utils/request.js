import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getStore } from '@/utils/store'
import errorCode from '@/const/errorCode'
import router from './../router'

// create an axios instance
const service = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    // timeout: 15000, // request timeout
    timeout: 180000, // request timeout
    validateStatus: (status) => {
        return status >= 200 && status <= 500
    }
})

// request interceptor
service.interceptors.request.use(config => {
    const TENANT_ID = getStore({ name: 'tenantId' })
    const token = store.getters.access_token
    const isToken = (config.headers || {}).isToken === false
    if (token && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + token // token
    }
    if (TENANT_ID) {
        config.headers['TENANT_ID'] = TENANT_ID // 租户ID
    }
    return config
}, error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use(
    /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

    /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
    response => {
        const status = Number(response.status) || 200
        const message = response.data.msg || errorCode[status] || errorCode['default']
        if (response.config.responseType === 'blob'){
            return response
        }
        if (status === 401 || response.data.code === 181006) {
            router.push("/account/login")
        }        
        if (status === 200 && response.data.code === 0) {
        // if (status === 200 && (response.data.code === 0 || response.data.code === 1)) {
            return response
        } else if (response.data.code !== 181006) {
            Message({
                message: message,
                type: 'error'
            })
            return Promise.reject(new Error(message))
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
