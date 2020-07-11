<template>
    <div class="login-container">
        <div class="login-box" :style="{'min-height':height - 120 +'px'}">
            <div class="login-inner clearfix">
                <div class="top-bar clearfix">
                    <router-link class="logo" to="/" :style="{'min-height': (height - 480) / 2 +'px'}" />
                </div>
                <div class="login-main clearfix">
                    <div class="image-box" />
                    <div class="login-form">
                        <div class="title">用户登录</div>
                        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="0px">
                            <el-form-item prop="username">
                                <el-input ref="username" v-model="form.username" placeholder="请输入用户名" name="username" type="text" tabindex="1" auto-complete="on" />
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input ref="password" v-model="form.password" type="password" placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" />
                            </el-form-item>
                            <el-form-item prop="code">
                                <el-input ref="code" v-model="form.code" :maxlength="code.len" type="text" placeholder="请输入图片验证码" tabindex="3" @keyup.enter.native="handleLogin">
                                    <template slot="append">
                                        <span v-if="code.type == 'text'" class="login-code-img" @click="refreshCode">{{ code.value }}</span>
                                        <img v-else :src="imageSrc" class="login-code-img" @click="refreshCode">
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item class="checkbox-row">
                                <el-checkbox v-model="remember" label="记住密码" name="type" />
                                <router-link class="link-forgot" to="/account/forget">忘记密码？</router-link>
                            </el-form-item>
                            <el-form-item>
                                <el-button class="btn-login" type="primary" :disabled="loading" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <div class="copyright">
            <p>xjie-nac © 版权所有 </p>
        </div>
    </div>
</template>

<script>
import { randomLenNum, compile, uncompile } from "@/utils/util";
import { baseURL } from '@/utils/urls'
import axios from 'axios'

export default {
    name: 'Login',
    data() {
        return {
            loading: false,
            form: {
                username: '',
                password: '',
                redirect: undefined,
                type: 2,
                code: "",
                randomStr: "",
                captchaid: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                code: [
                    {
                        required: true,
                        message: '请输入图片验证码',
                        trigger: 'blur'
                    }
                ]
            },
            remember: true,
            codeUrl: baseURL + "/code",
            code: {
                src: '',
                value: "",
                len: 4,
                type: "image"
            },
            imageSrc: ''
        }
    },
    computed: {
        height() {
            return this.$store.getters.winHeight < 600 ? 600 : this.$store.getters.winHeight
        }
    },
    watch: {
        $route: {
            handler: function(route) {
                this.redirect = route.query && route.query.redirect
                this.refreshCode()
                this.init()
            },
            immediate: true
        }
    },
    mounted() {
        if (this.form.username === '') {
            this.$refs.username.focus()
        } else if (this.form.password === '') {
            this.$refs.password.focus()
        } else if (this.form.imageCode === '') {
            this.$refs.imageCode.focus()
        }
        this.$store.dispatch('app/setWindowHeight', document.body.clientHeight)
        window.addEventListener('resize', this.setHeight)
    },
    destroyed() {
        if (window.removeEventListener) {
            window.removeEventListener('resize', this.setHeight);
        } else if (window.detachEvent) {
            window.detachEvent('resize', this.setHeight);
        }
    },
    methods: {
        init() {
            let accountInfo = localStorage.getItem('accountInfo')
            if (accountInfo) {
                accountInfo = JSON.parse(accountInfo)
                this.form.username = accountInfo.name
                this.form.password = uncompile(accountInfo.pass)
                this.remember = true
            } else {
                this.form.username = ''
                this.form.password = ''
            }
        },
        /**
         * 刷新验证码
         */
        refreshCode() {
            this.form.code = ''
            this.form.randomStr = randomLenNum(this.code.len, true)
            this.code.type === 'text'
                ? (this.code.value = randomLenNum(this.code.len))
                : (this.code.src = `${this.codeUrl}?randomStr=${this.form.randomStr}`)
            axios.get(this.code.src, { responseType: 'blob' }).then(res => {
                var blob = res.data;
                this.form.captchaid = res.headers.captchaid
                this.imageSrc = window.URL.createObjectURL(blob);
            })
        },
        /**
         * 设置高度自适应
         */
        setHeight() {
            this.$store.dispatch('app/setWindowHeight', document.body.clientHeight)
        },
        /**
         * 登录
         */
        handleLogin() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$store.dispatch('user/login', this.form)
                        .then(() => {
                            // console.log("1")
                            if (this.remember) {
                                // console.log("2")
                                const accountInfo = {
                                    name: this.form.username,
                                    pass: compile(this.form.password)
                                }
                                localStorage.setItem('accountInfo', JSON.stringify(accountInfo))
                            } else {
                                // console.log("3")
                                localStorage.removeItem('accountInfo')
                            }
                            // console.log("4")
                            this.$router.push({ path: this.redirect || '/' })
                            this.loading = false
                            // console.log("5")
                        })
                        .catch(() => {
                            this.refreshCode()
                            this.loading = false
                        })
                } else {
                    return false
                }
            })
        },
        handleLoad(e) {
            console.log(e)
        }
    }
}
</script>
<style lang="scss">
.login-container {
    .login-inner {
        width: 1000px;
        margin: auto;
    }
    .login-box {
        width: 100%;
        min-width: 1200px;
        background: url(../../assets/images/login-bg.png) bottom center
            no-repeat;
        .top-bar {
            position: relative;
            margin-bottom: 15px;
            .logo {
                display: block;
                height: 50px;
                width: 100%;
                background: url(../../assets/images/login-logo.png) left bottom
                    no-repeat;
            }
        }

        .login-main {
            .image-box {
                float: left;
                width: 610px;
                height: 360px;
                background: url(../../assets/images/login-banner.png) bottom
                    center no-repeat;
            }
            .login-form {
                float: right;
                border-style: solid;
                border-width: 1px;
                border-color: rgb(218, 219, 221);
                border-radius: 4px;
                background-color: rgb(255, 255, 255);
                width: 355px;
                height: 360px;
                .title {
                    font-size: 16px;
                    color: rgb(20, 35, 62);
                    line-height: 50px;
                    height: 50px;
                    padding: 0 20px;
                    border-bottom: 1px solid rgb(218, 219, 221);
                }
                .el-form {
                    padding: 20px;
                    .el-input-group__append,
                    .el-input-group__prepend {
                        padding: 0 0;
                        border: 0;
                        background: transparent;
                        overflow: hidden;
                        img {
                            width: 80px;
                            height: 38px;
                        }
                    }
                }
                .checkbox-row {
                    margin-top: -3px;
                    .el-form-item__content {
                        line-height: 20px;
                    }
                    .el-checkbox__label {
                        font-size: 12px;
                        color: #666;
                    }
                    .link-forgot {
                        float: right;
                        font-size: 12px;
                        color: #666;
                        &:hover {
                            color: #326bf3;
                        }
                    }
                }
                .link-row {
                    .el-form-item__content {
                        line-height: 20px;
                    }
                    .link-l,
                    .link-r {
                        color: #666;
                        &:hover {
                            color: #326bf3;
                        }
                    }
                    .link-r {
                        float: right;
                    }
                }
                .el-input__inner {
                    border-radius: 4px;
                    background-color: rgb(243, 243, 243);
                    height: 38px;
                    border: 1px solid rgb(243, 243, 243);
                    &:active,
                    &:focus {
                        border-color: #326bf3;
                    }
                }
                .el-button {
                    width: 100%;
                    &.btn-login {
                        margin-top: -3px;
                        font-weight: bold;
                        padding: 12px 20px;
                    }
                }
            }
        }
    }
    .copyright {
        min-width: 1200px;
        margin: auto;
        text-align: center;
        font-size: 12px;
        height: 120px;
        padding: 40px 0;
        line-height: 1;
        color: #999999;
        background: #f4f5f6;
    }
}
</style>
