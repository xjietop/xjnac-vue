import Vue from 'vue'
import Cookies from 'js-cookie'
import Viewer from 'v-viewer'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import 'viewerjs/dist/viewer.css'

import App from './App'
import store from './store'
import router from './router'
// import { getStore } from '@/utils/store'

import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters

Vue.use(Element, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.use(Viewer, {
    defaultOptions: {
        "navbar": false,
        "toolbar": false,
        "zIndex": 9999
    }
})

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// const access_token = getStore({
//     name: 'access_token'
// })

Vue.config.productionTip = false

if (process.env.NODE_ENV === 'development') {
    Vue.config.devtools = true;
} else {
    Vue.config.devtools = false;
}

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
