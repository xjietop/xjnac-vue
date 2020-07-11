<template>
    <div class="app-container app-member-list">
        <search-bar ref="refSearch" :search-data="searchData" :auto-load="true" @search="query" @addnew="addnew" />
        <div class="app-table">
            <el-table ref="refTable" v-loading="tableLoading" :data="tableData" :height="height" stripe highlight-current-row>
                <el-table-column type="index" label="序号" width="50" align="center" />
                <el-table-column prop="Id" label="Id" min-width="100" align="center" />
                <el-table-column prop="DataId" label="配置Id" min-width="100" align="center" show-overflow-tooltip />
                <el-table-column prop="CDesc" label="描述" min-width="120" align="center" />
                <el-table-column prop="Content" label="内容" min-width="200" align="center" />
                <el-table-column prop="UserCreate" label="创建人" min-width="80" align="center" />
                <el-table-column prop="GmtCreate" label="创建时间" min-width="120" align="center">
                    <template slot-scope="scope">
                        {{ formatTime(scope.row.GmtCreate) }}
                    </template>
                </el-table-column>
                <el-table-column prop="UserModified" label="修改人" min-width="80" align="center" />
                <el-table-column prop="GmtModified" label="修改时间" min-width="120" align="center">
                    <template slot-scope="scope">
                        {{ formatTime(scope.row.GmtModified) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="view(scope.row)">详情</el-button>
                        <el-button type="text" @click="modify(scope.row)">编辑</el-button>
                        <el-button type="text" @click="del(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="app-pagination">
            <el-pagination 
                layout="total, sizes, prev, pager, next, jumper"
                prev-text="上一页" 
                next-text="下一页"
                :page-sizes="[20, 50, 100, 200]"
                :current-page="searchData.page.current"
                :page-size="searchData.page.size"
                :total="page.total"
                @size-change="sizeChange"
                @current-change="pageChange"
            />
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
import { fetchList, deleteConfig } from '@/api/config'
import { mapGetters } from 'vuex'
import searchBar from '@/components/searchBar/index'
import WinRelation from './dialog/index'
import WinPassword from './dialog/password'
import WinControlProduct from './dialog/controlProduct'
import WinSetClub from './dialog/setClub'
import WinSetGeneral from './dialog/setGeneral'

export default {
    name: 'PageConfigList',
    components: {
        searchBar,
        WinPassword,
        WinRelation,
        WinControlProduct,
        WinSetClub,
        WinSetGeneral
    },
    data() {
        return {            
            searchData: {
                visibleAddbtn: true,
                quickList: [
                    { label: '配置Id', value: 'where' }
                ],
                searchList: [

                ],
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
         * 查询
         */
        query(searchParams) {
            this.tableLoading = true
            fetchList(searchParams).then(response => {
                this.tableData = response.data.data.records || []
                this.page.total = response.data.data.total
                this.tableLoading = false
            }).catch(() => {
                this.tableLoading = false
            })
        },
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
         * 新增配置
         */
        addnew(){
            // alert("add new")
            this.$router.push({
                path: '/config/add'
            })
        },
        /**
         * 查看配置
         */
        view(row) {
            this.$router.push({
                path: '/config/view',
                query: {
                    Id: row.Id
                }
            })
        },
        /**
         * 修改配置
         */
        modify(row) {
            this.$router.push({
                path: '/config/modify',
                query: {
                    Id: row.Id
                }
            })
        },
        /**
         * 删除配置
         */
        del(row) {
            // alert("delete ok")
            this.$confirm('是否要删除配置吗?', '确定', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.submiting = true;
                deleteConfig(row.Id).then((res) => {
                    this.$notify({
                        title: '成功',
                        message: '删除保存成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.query();
                }).catch({

                });
            }).catch({

            })
        },
        /**
         * 时间格式化
         */
        formatTime(str){
            return str.substring(0, 16).replace('T', ' ')
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
</style>

