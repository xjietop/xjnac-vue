<template>
    <el-dialog title="选择商品" :visible.sync="show" :close-on-click-modal="false" append-to-body class="el-win-select-product">
        <div class="app-table">
            <search-bar ref="refSearch" class="search-bar" :search-data="searchData" :auto-load="false" @search="query">
                <template slot="left">
                    <div class="search-item dib">
                        <el-select v-model="searchParams.huddle" placeholder="是否抱团" size="small" :disabled="huddleDisabled" @change="changeHuddle">
                            <el-option v-for="option in huddleData" :key="option.value" v-bind="option" />
                        </el-select>
                    </div>
                    <div class="search-item dib">
                        <el-select v-model="searchParams.club" placeholder="俱乐部" size="small" clearable :disabled="clubDisabled" @change="changeClub">
                            <el-option v-for="option in clubData" :key="option.value" v-bind="option" />
                        </el-select>
                    </div>
                    <div class="search-item dib">
                        <el-tree-select
                            ref="refTreeSelect"
                            v-model="classId"
                            :clearable="true"
                            :data="treeData" 
                            :props="defaultProps"
                            size="small"
                            :accordion="true"
                            @change="changeClass"
                        />
                    </div>
                </template>
                <template v-if="multiple" slot="right">
                    <el-button type="primary" size="small" @click="batchAdd">批量添加</el-button>
                </template>
            </search-bar>

            <div v-show="multiple">
                <el-table
                    ref="table"
                    v-loading="tableLoading"
                    :data="tableData"
                    :height="450"
                    @select-all="handleSelect"
                    @select="handleSelect"
                >
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="productCode" label="商品编号" min-width="120" align="left" show-overflow-tooltip />
                    <el-table-column prop="commodityName" label="商品名称" min-width="150" align="left" show-overflow-tooltip />
                    <el-table-column prop="remark" label="商品品种" min-width="80" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.huddle === 1 ? '抱团' : '尚划算' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="club" label="所属俱乐部" min-width="120" align="center">
                        <template slot-scope="scope">
                            <template v-for="item in scope.row.businessAttrList">
                                <span v-if="item.club!==0" :key="item.club" class="club-tag">{{ item.club===1?'乐赛仙' : item.club===2 ? '佐安堂' : '初心' }}</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="spec" label="商品规格" min-width="150" align="left" />
                    <el-table-column prop="manufacturer" label="生产厂家" min-width="120" align="left" show-overflow-tooltip />
                </el-table>
            </div>
            <div v-show="!multiple">
                <el-table
                    ref="table"
                    v-loading="tableLoading"
                    :data="tableData"
                    :height="450"
                    @select-all="handleSelect"
                    @select="handleSelect"
                >
                    <el-table-column prop="productCode" label="商品编号" min-width="120" align="left" show-overflow-tooltip />
                    <el-table-column prop="commodityName" label="商品名称" min-width="150" align="left" show-overflow-tooltip />
                    <el-table-column prop="remark" label="商品品种" min-width="80" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.huddle === 1 ? '抱团' : '尚划算' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="club" label="所属俱乐部" min-width="120" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.huddle === 1">
                                <span v-for="item in scope.row.businessAttrList" :key="item.club" class="club-tag">{{ item.club===1?'乐赛仙' : item.club===2 ? '佐安堂' : '初心' }}</span>
                            </template>
                            <template v-else>
                                -
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="spec" label="商品规格" min-width="150" align="left" />
                    <el-table-column prop="manufacturer" label="生产厂家" min-width="120" align="left" show-overflow-tooltip />
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="choseItem(scope.row)">添加</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="app-pagination">
                <el-pagination 
                    layout="total, sizes, prev, pager, next, jumper"
                    small
                    :current-page="searchData.page.current"
                    :page-size="searchData.page.size"
                    :page-sizes="[ 50, 100, 200, 500]"
                    :total="page.total"
                    @size-change="sizeChange"
                    @current-change="pageChange"
                />
            </div>
        </div>
    </el-dialog>
</template>
<script>
import { fetchList } from '@/api/user'
import { fetchProductClass } from '@/api/common'
import searchBar from '@/components/searchBar/index'
import elTreeSelect from "@/components/TreeSelect/treeSelect";

export default {
    name: "WinProductListAddRelation",
    components: {
        searchBar,
        elTreeSelect
    },
    props: {
        multiple: {
            type: Object,
            default: () => {
                return false
            }
        },
        huddleDisabled: {
            type: Boolean,
            default: () => {
                return false
            }
        },
        clubDisabled: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    data() {
        return {
            edit: false,
            loading: false,
            searchData: {
                quickList: [
                    { label: '按商品编号', value: 'productCode' },
                    { label: '按商品名称', value: 'commodityName' },
                    { label: '按生产厂家', value: 'manufacture' }
                ],
                searchList: [],
                page: {
                    size: 50,
                    current: 1
                }
            },
            searchParams: {
                isReady: 1,
                status: 2,
                huddle: 1,
                club: 1
            },
            defaultProps: {
                children: 'childrenList',
                label: "className",
                value: 'sid'
            },
            huddleData: [
                { label: '抱团', value: 1 },
                { label: '尚划算', value: 0 }
            ],
            clubData: [
                { label: '乐赛仙', value: 1 },
                { label: '佐安堂', value: 2 },
                { label: '初心', value: 3 }
            ],
            classId: '',
            tableData: [],
            tableLoading: false,
            page: {
                total: 0
            },
            selection: [],
            show: false
        };
    },
    created() {

    },
    methods: {
        open(fn, defaultParams) {
            this.edit = true;
            this.loading = false;
            this.callback = fn;
            this.show = true;
            if (defaultParams){
                for (const key in defaultParams){
                    this.searchParams[key] = defaultParams[key]
                }
            }
            this.$nextTick(() => {
                this.fetchProductClass()
                this.$refs['table'].doLayout()
                this.$refs['refSearch'].search()
            });
        },
        choseItem(item) {
            this.callback(item);
            this.show = false;
        },
        close() {
            this.show = false;
        },
        /**
         * 查询上架中的商品
         */
        query(searchParams) {
            this.tableLoading = true
            fetchList(Object.assign({}, searchParams, this.searchParams)).then(response => {
                this.tableData = response.data.data.records || []
                this.page.total = response.data.data.total
                this.tableLoading = false
            })
        },
        /**
         * 查询商品分类树形
         */
        fetchProductClass(){
            this.searchParams.secondClassSid = ''
            this.searchParams.firstClassSid = ''
            fetchProductClass({
                parentSid: 0,
                club: this.searchParams.club
            }).then(({ data: { data }}) => {
                data.records && data.records.forEach(element => {
                    element.childrenList && element.childrenList.forEach(element => {
                        delete element.childrenList
                    });
                });
                this.treeData = data.records || []
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
         * 选择商品
         */
        handleSelect(selection){
            this.selection = selection
        },
        /**
         * 切换是否抱团
         */
        changeHuddle(val){
            if (val === 1) {
                this.searchParams.club = 1
            } else {
                this.searchParams.club = ''
            }
            this.$refs['refTreeSelect'].clearHandle()
            this.$nextTick(() => {
                this.fetchProductClass()
                this.$refs['refSearch'].search()
            })
        },
        /**
         * 切换俱乐部
         */
        changeClub(val){
            this.$refs['refTreeSelect'].clearHandle()
            this.$nextTick(() => {
                this.fetchProductClass()
                this.$refs['refSearch'].search()
            })
        },
        /**
         * 选择分类
         */
        changeClass(id, node){
            if (node){
                if (node.parentSid === 0){
                    this.searchParams.secondClassSid = ''
                    this.searchParams.firstClassSid = id
                } else {
                    this.searchParams.firstClassSid = ''
                    this.searchParams.secondClassSid = id
                }
            }
            this.$refs['refTreeSelect'].blur()
            this.$refs['refSearch'].search()
        },
        /**
         * 批量添加
         */
        batchAdd(){
            this.callback(this.selection);
            this.show = false;
        }
    }
};
</script>
<style lang="scss">
.el-win-select-product {
    .el-dialog {
        width: 1100px !important;
        .el-dialog__body {
            padding: 0 0 0 0;
        }
        .app-table {
            .search-bar {
                padding: 10px 15px;
                .search-item {
                    &:nth-child(2), &:nth-child(3){
                        .el-select {
                            width: 100px;
                            .el-input {
                                width: 100px;
                            }
                        }
                    }
                }
            }
            .table-title {
                font-size: 14px;
                padding-bottom: 10px;
            }
            .el-table {
                border-radius: 0px;
                &.el-table--medium {
                    th {
                        padding: 8px 0;
                    }
                    td {
                        padding: 8px 0;
                    }
                }
            }
            .app-pagination {
                padding: 10px 15px;
                .el-pagination__sizes {
                    margin-top: -3px;
                }
            }
        }
    }
}
</style>
