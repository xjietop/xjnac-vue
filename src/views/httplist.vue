// 金蝶客户列表
<template>
    <div class="app-container app-member-list">
        <search-bar ref="refSearch" :search-data="searchData" :auto-load="true" @search="query" />
        <div class="app-table">
            <el-table ref="refTable" v-loading="tableLoading" :data="tableData" :height="height" stripe highlight-current-row>
                <el-table-column type="index" label="序号" width="50" align="center" />
                <el-table-column prop="Name" label="服务" width="150" align="center" />
                <el-table-column prop="Url" label="地址" width="200" align="center" />
                <el-table-column prop="Val.Weight" label="权重" width="80" align="center" />
                <el-table-column prop="Val.Status" label="状态" width="100" align="center" >
                    <template slot-scope="scope">
                        {{ scope.row.Val.Status == 1 ? '在线' : '离线' }}
                    </template>
                </el-table-column>                
                <el-table-column prop="Val.Health" label="健康" width="100" align="center" >
                    <template slot-scope="scope">
                        {{ scope.row.Val.Health == 1 ? '正常' : '不通' + scope.row.Val.Health }}
                    </template>
                </el-table-column>                
                <el-table-column prop="Val.Metadata" label="元数据" width="400" align="center" />
                <el-table-column prop="Val.StartTime" label="开始时间" width="150" align="center" />
                <el-table-column prop="Val.UpdateTime" label="更新时间" width="150" align="center" />
                <el-table-column label="操作" fixed="right" min-width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="check(scope.row)">检查</el-button>
                        <el-button v-if="scope.row.Val.Status != 1" type="text" @click="enable(scope.row)">上线</el-button>
                        <el-button v-if="scope.row.Val.Status == 1" type="text" @click="disable(scope.row)">下线</el-button>
                        <el-button type="text" @click="del(scope.row)">删除</el-button>
                        <!-- <el-dropdown @command="handleCommand">
                            <span class="el-dropdown-link">
                                <el-button type="text">更多<i class="el-icon-arrow-down el-icon--right" /></el-button>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{row:scope.row,id:1}">删除</el-dropdown-item>
                                <el-dropdown-item :command="{row:scope.row,id:2}">检查冻结</el-dropdown-item>
                                <el-dropdown-item :command="{row:scope.row,id:3}">临时授信</el-dropdown-item>
                                <el-dropdown-item :command="{row:scope.row,id:4}">新增账户</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown> -->
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
import { fetchList, health, del, disable, enable, setClubs, setBillType } from '@/api/http'
import { mapGetters } from 'vuex'
import searchBar from '@/components/searchBar/index'
import WinRelation from './dialog/index'
import WinPassword from './dialog/password'
import WinControlProduct from './dialog/controlProduct'
import WinSetClub from './dialog/setClub'
import WinSetGeneral from './dialog/setGeneral'

export default {
    name: 'PageErpCustomerList',
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
                quickList: [
                    { label: '服务', value: 'where' }
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
        检查
         */
        check(row){
            // alert(row.Url)
            health(row.Name, row.Url).then(res => {
                // alert(res.data.data)                
                this.query()
            }).catch(() => {
                // alert("出错了!")
                this.query()
            })
        },
        /**
        删除
         */
        del(row){
            // alert(row.Name + row.Url)
            this.$confirm("删除服务, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                del(row.Name, row.Url).then(res => {
                    alert("删除成功!")
                    this.query()
                }).catch(() => {
                    // alert("出错了!")
                })
            });
            
        },
        /**
        服务下线
         */
        disable(row){
            this.$confirm("服务下线, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                disable(row.Name, row.Url).then(res => {
                    alert("服务下线成功!")
                    this.query()
                }).catch(() => {
                    // alert("出错了!")
                })
            });
            
        },
        /**
        服务上线
         */
        enable(row){
            this.$confirm("服务上线, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                enable(row.Name, row.Url).then(res => {
                    alert("服务上线成功!")
                    this.query()
                }).catch(() => {
                    // alert("出错了!")
                })
            });
            
        },
        /**
         * 更多操作
         */
        handleCommand(command){
            this.$refs['refTable'].setCurrentRow(command.row)
            switch (command.id) {
                case 1:
                    this.resetPassword(command.row)
                    break;
                case 2:
                    this.setClub(command.row)
                    break;
                case 3:
                    if (command.row.clubs.length > 0){
                        this.controlProduct(command.row)
                    } else {
                        this.$message({
                            message: '该会员没有设置俱乐部，请先设置俱乐部',
                            type: 'warning'
                        })
                    }
                    break;
                case 4:
                    this.setGeneral(command.row);
                    break;
            }
        },
        /**
         * 查看会员
         */
        detail(row) {
            this.$router.push({
                path: '/member/detail',
                query: {
                    id: row.sid
                }
            })
        },
        /**
         * 重置密码
         */
        resetPassword(row) {
            this.$refs['refPassword'].update(row, res => {
                reSetPwd(res).then(() => {
                    this.$refs['refPassword'].loading = false
                    this.$refs['refPassword'].close()
                    this.$notify({
                        title: '成功',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    })
                }).catch(() => {
                    this.$refs['refPassword'].loading = false
                });
            });
        },
        /**
         * 关联账户
         */
        relation(row) {
            this.$refs['refRelation'].update(row, res => {
                res.sid = row.sid
                bindUser(res).then(() => {
                    this.$refs['refSearch'].search()
                    this.$refs['refRelation'].loading = false;
                    this.$refs['refRelation'].close()
                    this.$notify({
                        title: '成功',
                        message: '关联成功',
                        type: 'success',
                        duration: 2000
                    })
                }).catch(() => {
                    this.$refs['refRelation'].loading = false;
                });
            })
        },
        /**
         * 设置控销商品
         */
        controlProduct(row){
            this.$refs['refControl'].open(row, res => {})
        },
        /**
         * 设置俱乐部
         */
        setClub(row){
            this.$refs['refClub'].update(row, res => {
                setClubs({
                    userSid: res.sid,
                    clubs: res.clubs.join(',')
                }).then(res => {
                    this.$refs['refSearch'].search()
                    this.$refs['refClub'].loading = false;
                    this.$refs['refClub'].close()
                    this.$notify({
                        title: '成功',
                        message: '俱乐部成功',
                        type: 'success',
                        duration: 2000
                    })
                }).catch(() => {
                    this.$refs['refClub'].loading = false
                });
            })
        },
        /**
         * 设置发票类型
         */
        setGeneral(row) {
            this.$refs['refGeneral'].update(row, res => {
                setBillType(res).then(res => {
                    this.$refs['refSearch'].search()
                    this.$refs['refGeneral'].loading = false;
                    this.$refs['refGeneral'].close()
                    this.$notify({
                        title: '成功',
                        message: '设置成功',
                        type: 'success',
                        duration: 2000
                    })
                }).catch(() => {
                    this.$refs['refGeneral'].loading = false
                });
            })
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

