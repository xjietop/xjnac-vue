<template>    
    <div class="app-container app-member-list">
        <el-button size="small" icon="el-icon-back" @click="goBack">返回列表</el-button>
        <el-divider content-position="left">配置信息</el-divider>
        <div class="content-box">
            <el-form ref="ruleForm" :model="form" :rules="rules" size="medium" :inline-message="true" label-width="0px">
                <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
                    <table cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td class="td-title" width="140">配置Id</td>
                            <td>
                                <el-input v-model="detail.DataId" size="small" readonly="true" />
                            </td>
                        </tr>
                        <tr>
                            <td class="td-title" width="140">描述</td>
                            <td>
                                <el-input v-model="detail.CDesc" size="small" readonly="true" />
                            </td>
                        </tr>
                        <tr>
                            <td class="td-title" width="140">内容</td>
                            <td>
                                <el-input v-model="detail.Content" type="textarea" rows="28" readonly="true" />
                            </td>
                        </tr>
                    </table>
                </div>
            </el-form>
        </div>    

        <!--关联账户-->
        <win-relation ref="refRelation" />
        <!--修改密码-->
        <win-password ref="refPassword" />
        <!--查看控销商品-->
        <win-control-product ref="refControl" />
        <!--设置俱乐部-->
        <win-set-club ref="refClub" />
        <!--设置开票类型-->
        <win-set-general ref="refGeneral" />
    </div>
</template>

<script>
import { fetchDetail } from '@/api/config'
import { mapGetters } from 'vuex'
import WinRelation from './dialog/index'
import WinPassword from './dialog/password'
import WinControlProduct from './dialog/controlProduct'
import WinSetClub from './dialog/setClub'
import WinSetGeneral from './dialog/setGeneral'

export default {
    name: 'PageConfigView',
    components: {
        WinPassword,
        WinRelation,
        WinControlProduct,
        WinSetClub,
        WinSetGeneral
    },
    data() {
        return {    
            Id: this.$route.query.Id,
            detail: {
                
            },
            loading: false     
        }
    },
    computed: {
        ...mapGetters(['permissions']),
        height() {
            return this.$store.getters.winHeight - 205;
        }
    },
    activated() {
        this.$refs['refTable'].doLayout()
    },
    created(){
        this.getDetail()
    },
    methods: {
        /**
         * 获取配置详情
         */
        getDetail() {
            this.loading = true;
            fetchDetail({
                Id: this.Id
            }).then(({ data: { data }}) => {
                this.detail = data;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            })
        },
        /**
         * 返回列表
         */
        goBack(){
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
.app-member-list {
    .el-image {
        width: 150px;
        height: 60px;
        cursor: pointer;
    }
    .el-table {
        .link {
            color: #1890ff;
            cursor: pointer;
            &:hover {
                color: #46a6ff;
            }
        }
        .el-dropdown {
            margin-left: 10px;
        }
    }
}
.el-table {
    margin-top: 20px;
    table {
        width: 100%;
        td {
            padding: 12px 10px;
            height: 56px;
            &.td-title {
                font-weight: bold;
            }
            .el-select {
                width: 400px;
            }
        }
    }
}
</style>

