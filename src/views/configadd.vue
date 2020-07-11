<template>    
    <div class="app-container app-member-list">
        <el-button size="small" icon="el-icon-back" @click="goBack">返回列表</el-button>
        <el-button size="small" icon="el-icon-check" type="primary" @click="save">保存</el-button>    
        <el-divider content-position="left">配置信息</el-divider>
        <div class="content-box">
            <el-form ref="ruleForm" :model="form" :rules="rules" size="medium" :inline-message="true" label-width="0px">
                <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
                    <table cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td class="td-title" width="140">配置Id</td>
                            <td>
                                <el-input v-model="DataId" size="small" />
                            </td>
                        </tr>
                        <tr>
                            <td class="td-title" width="140">描述</td>
                            <td>
                                <el-input v-model="CDesc" size="small" />
                            </td>
                        </tr>
                        <tr>
                            <td class="td-title" width="140">内容</td>
                            <td>
                                <el-input v-model="Content" type="textarea" rows="28" />
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
import { createConfig } from '@/api/config'
import { mapGetters } from 'vuex'
import WinRelation from './dialog/index'
import WinPassword from './dialog/password'
import WinControlProduct from './dialog/controlProduct'
import WinSetClub from './dialog/setClub'
import WinSetGeneral from './dialog/setGeneral'

export default {
    name: 'PageConfigAdd',
    components: {
        WinPassword,
        WinRelation,
        WinControlProduct,
        WinSetClub,
        WinSetGeneral
    },
    data() {
        return {    
            DataId: '',
            CDesc: '',
            Content: '',        
            searchData: {
                visibleAddbtn: true,
                quickList: [],
                searchList: [],                
                page: {
                    size: 20,
                    current: 1
                }
            },
            tableData: [],
            tableLoading: false,
            page: {
                total: 0
            }            
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
    methods: {
        /**
         * 每页显示
         */
        sizeChange(size) {
            this.$refs['refSearch'].search({ size: size })
        },
        /**
         * 切换页面
         */
        pageChange(current) {
            this.$refs['refSearch'].search({ current: current })
        },
        /**
         * 保存
         */
        save(){
            // alert("save")
            this.$confirm('是否要保存配置吗?', '确定', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.submiting = true;
                createConfig(this.DataId, this.CDesc, this.Content).then((res) => {
                    this.$notify({
                        title: '成功',
                        message: '配置创建成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.$store.dispatch('tagsView/delView', this.$route)
                    this.$router.go(-1)   
                }).catch({

                });
            }).catch({

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

