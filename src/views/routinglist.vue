<template>
    <div class="app-container app-other-banner">
        <search-bar ref="refSearch" :search-data="searchData" :auto-load="true" @search="query">
            <template slot="right">
                <div class="app-search-right">
                    <el-button class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="create">添加</el-button>
                </div>
            </template>
        </search-bar>
        <div class="app-table">
            <el-table v-loading="tableLoading" :data="tableData" :height="height" stripe>
                <el-table-column type="index" label="序号" width="50" align="center" />
                <el-table-column prop="title" label="标题" min-width="200" align="center" show-overflow-tooltip />
                <el-table-column label="封面" min-width="150" align="center">
                    <template slot-scope="scope">
                        <el-image v-viewer :src="ossURL + scope.row.thumbnails" fit="contain" />
                    </template>
                </el-table-column>
                <el-table-column prop="clubName" label="展示俱乐部" min-width="180" align="center" />
                <el-table-column prop="type" label="资讯类型" min-width="80" align="center">
                    <template slot-scope="scope">
                        {{ typeData.filter(item => item.value === scope.row.type)[0].label }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" min-width="150" align="center" />
                <el-table-column prop="createUser" label="创建人" min-width="120" align="center" />
                <el-table-column prop="statusName" label="发布状态" min-width="120" align="center" />
                <el-table-column prop="issuerUser" label="发布人" min-width="120" align="center" />
                <el-table-column prop="issuerTime" label="发布时间" min-width="150" align="center" />
                <el-table-column label="操作" fixed="right" min-width="280" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="update(scope.row)">编辑</el-button>
                        <el-button type="text" :disabled="scope.row.status==='NOMAL'" @click="publish(scope.row)">发布</el-button>
                        <el-button type="text" :disabled="scope.row.status==='CLOSE'" @click="cancel(scope.row)">作废</el-button>
                        <el-button type="text" @click="remove(scope.row)">删除</el-button>
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

        <!--添加编辑资讯-->
        <win-news ref="refNews" />
    </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj } from '@/api/routing'
import { mapGetters } from 'vuex'
import searchBar from '@/components/searchBar/index'
import WinNews from './dialog/index'

export default {
    name: 'PageNewsList',
    components: {
        WinNews,
        searchBar
    },
    data() {
        return {
            ossURL: this.$store.getters.oss_url + '/',
            searchData: {
                quickList: [
                    { label: '按资讯标题', value: 'title' }
                ],
                searchList: [
                    {
                        prop: 'club',
                        placeholder: '展示俱乐部',
                        type: 'select',
                        clearable: true,
                        list: [
                            { label: '乐赛仙', value: '1' },
                            { label: '佐安堂', value: '2' },
                            { label: '初心', value: '3' },
                            { label: '尚划算', value: '4' }
                        ]
                    }
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
            },
            typeData: [
                { label: '公告', value: 1 },
                { label: '新闻', value: 2 },
                { label: '活动', value: 3 },
                { label: '其它', value: 4 }
            ]
        }
    },
    computed: {
        ...mapGetters(['permissions']),
        height() {
            return this.$store.getters.winHeight - 205;
        }
    },
    methods: {
        /**
         * 查询
         */
        query(searchParams) {
            this.tableLoading = true
            fetchList(Object.assign({}, searchParams)).then(response => {
                this.tableData = response.data.data.records
                this.page.total = response.data.data.total
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
         * 添加
         */
        create() {
            this.$refs['refNews'].add(res => {
                addObj(res).then(() => {
                    this.$refs['refNews'].loading = false
                    this.$refs['refNews'].close()
                    this.$refs['refSearch'].search()
                    this.$notify({
                        title: '成功',
                        message: '创建成功',
                        type: 'success',
                        duration: 2000
                    })
                }).catch(() => {
                    this.$refs['refNews'].loading = false
                });
            });
        },
        /**
         * 删除
         */
        remove(row) {
            this.$confirm('是否确认删除标题为"' + row.title + '"的资讯?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return delObj(row)
            }).then(() => {
                this.$refs['refSearch'].search()
                this.$message({
                    showClose: true,
                    message: '删除成功',
                    type: 'success'
                })
            }).catch(() => { })
        },
        /**
         * 发布
         */
        publish(row) {
            this.$confirm('是否确认发布标题为"' + row.title + '"的资讯?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return putObj({
                    sid: row.sid,
                    status: 0
                })
            }).then(() => {
                this.$refs['refSearch'].search()
                this.$message({
                    showClose: true,
                    message: '发布成功',
                    type: 'success'
                })
            }).catch(() => { })
        },
        /**
         * 作废
         */
        cancel(row) {
            this.$confirm('是否确认作废标题为"' + row.title + '"的资讯?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return putObj({
                    sid: row.sid,
                    status: 1
                })
            }).then(() => {
                this.$refs['refSearch'].search()
                this.$message({
                    showClose: true,
                    message: '作废成功',
                    type: 'success'
                })
            }).catch(() => { })
        },
        /**
         * 编辑
         */
        update(row) {
            this.$refs['refNews'].update(row, res => {
                putObj(res).then(() => {
                    this.$refs['refSearch'].search()
                    this.$refs['refNews'].loading = false;
                    this.$refs['refNews'].close()
                    this.$notify({
                        title: '成功',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    })
                }).catch(() => {
                    this.$refs['refNews'].loading = false;
                });
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.app-other-banner {
    .el-image {
        width: 100px;
        height: 60px;
        cursor: pointer;
    }
}
</style>

