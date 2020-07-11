<template>
    <el-dialog title="查看控销商品" :visible.sync="show" :close-on-click-modal="false" append-to-body class="el-win-member-control-product">
        <div class="app-table">
            <search-bar ref="refSearch" class="search-bar" :search-data="searchData" :auto-load="false" @search="query">
                <template slot="leftBtn">
                    <el-button size="small" @click="addProduct">增加商品</el-button>
                </template>
                <template slot="right">
                    <el-radio-group v-model="searchParams.controlType" size="small" @change="search">
                        <el-radio-button :label="2" name="controlType">可销</el-radio-button>
                        <el-radio-button :label="0" name="controlType">不可销</el-radio-button>
                        <el-radio-button :label="1" name="controlType">只可销</el-radio-button>
                    </el-radio-group>
                </template>
            </search-bar>
            <el-table
                ref="table"
                v-loading="tableLoading"
                :data="tableData"
                :height="450"
                @select="handleSelect"
            >
                <el-table-column prop="erpProductCode" label="商品ID" min-width="250" align="left" fixed show-overflow-tooltip>
                    <template slot-scope="scope">
                        <template v-if="scope.row.type==='add'">
                            <el-select
                                ref="refSearchTypeKeyword"
                                v-model="currentProduct"
                                filterable
                                remote
                                reserve-keyword
                                value-key="sid"
                                placeholder="请输入商品ID、助记码、商品名称搜索"
                                :remote-method="fetchProduct"
                                :loading="fetchProductLoading"
                                class="search-type-keyword"
                                size="small"
                                popper-append-to-body
                                @change="changeProduct"
                            >
                                <el-option
                                    v-for="item in productData"
                                    :key="item.sid"
                                    :label="item.commodityName"
                                    :value="item"
                                >
                                    <div class="select-porduct-prop-li">
                                        <span class="fl" :title="item.commodityName">{{ item.commodityName }}</span>
                                        <span class="fr" :title="item.spec">{{ item.spec }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </template>
                        <template v-else>
                            {{ scope.row.erpProductCode }}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="commodityName" label="商品名称" min-width="200" align="left" fixed show-overflow-tooltip />
                <el-table-column prop="manufacturer" label="生产厂家" min-width="120" align="left" show-overflow-tooltip />
                <el-table-column label="操作" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="scope.row.type==='add'">
                            <el-button type="text" @click="tableData.splice(scope.$index,1)">取消</el-button>
                        </template>
                        <template v-else>
                            <template v-if="searchParams.controlType===2">
                                <el-button type="text" @click="updateProductStatus(scope.row,0)">不可销</el-button>
                                <el-button type="text" @click="updateProductStatus(scope.row,1)">只可销</el-button>
                                <el-button type="text" @click="removeProduct(scope.row)">移除</el-button>
                            </template>
                            <template v-else-if="searchParams.controlType===0">
                                <el-button type="text" @click="updateProductStatus(scope.row,2)">可销</el-button>
                                <el-button type="text" @click="updateProductStatus(scope.row,1)">只可销</el-button>
                                <el-button type="text" @click="removeProduct(scope.row)">移除</el-button>
                            </template>
                            <template v-else-if="searchParams.controlType===1">
                                <el-button type="text" @click="updateProductStatus(scope.row,2)">可销</el-button>
                                <el-button type="text" @click="updateProductStatus(scope.row,0)">不可销</el-button>
                                <el-button type="text" @click="removeProduct(scope.row)">移除</el-button>
                            </template>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="app-pagination">
                <el-pagination 
                    layout="total, prev, pager, next, jumper"
                    small
                    :current-page="searchData.page.current"
                    :page-size="searchData.page.size"
                    :total="page.total"
                    @size-change="sizeChange"
                    @current-change="pageChange"
                />
            </div>
        </div>

        <!--选择商品-->
        <select-product ref="refProduct" :multiple="true" :huddle-disabled="true" :club-disabled="true" />

    </el-dialog>
</template>
<script>
import { fetchControlList, addObj, putObj, delObj } from '@/api/config'
import searchBar from '@/components/searchBar/index'
import selectProduct from '@/components/selectProduct/index'

export default {
    name: "WinMemberListProduct",
    components: {
        searchBar,
        selectProduct
    },
    data() {
        return {
            edit: false,
            loading: false,
            searchData: {
                quickList: [
                    { label: '按商品编号', value: 'productCode' },
                    { label: '按商品名称', value: 'commodityName' },
                    { label: '按生产厂家', value: 'manufacturer' }
                ],
                searchList: [
                    {
                        prop: 'club',
                        placeholder: '所属俱乐部',
                        type: 'select',
                        defaultValue: '',
                        list: [
                            { label: '乐赛仙', value: 1 },
                            { label: '佐安堂', value: 2 },
                            { label: '初心', value: 3 }
                        ]
                    }
                ],
                page: {
                    size: 20,
                    current: 1
                }
            },
            searchParams: {
                userInfoSid: '',
                controlType: 2
            },
            tableData: [],
            tableLoading: false,
            page: {
                total: 0
            },
            currentProduct: {},
            fetchProductLoading: false,
            show: false
        };
    },
    watch: {

    },
    created() {

    },
    methods: {
        open(item, fn) {
            this.edit = true;
            this.loading = false;
            this.callback = fn;
            this.searchParams.userInfoSid = item.sid
            this.searchData.searchList[0].list = []
            item.clubs.forEach(element => {
                this.searchData.searchList[0].list.push({
                    label: element === 1 ? '乐赛仙' : element === 2 ? '佐安堂' : '初心',
                    value: element
                })
            });
            this.searchData.searchList[0].defaultValue = item.clubs[0]
            this.show = true;
            this.$nextTick(() => {
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
        search(){
            this.$refs['refSearch'].search()
        },
        /**
         * 查询上架中的商品
         */
        query(searchParams) {
            this.tableLoading = true
            this.tableData = []
            searchParams = Object.assign({}, searchParams, this.searchParams)
            fetchControlList(searchParams).then(response => {
                this.tableData = response.data.data.records || []
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
         * 增加商品
         */
        addProduct(){
            const searchParams = this.$refs['refSearch'].getParams()
            this.$refs['refProduct'].open((products) => {
                const list = []
                products.forEach(product => {
                    list.push({
                        productSid: product.sid,
                        club: this.$refs['refSearch'].searchParams.club,
                        controlType: this.searchParams.controlType,
                        userInfoSid: this.searchParams.userInfoSid
                    })
                });
                this.addAction(list)
            }, {
                club: searchParams.club
            })
        },
        /**
         * 新增用户控销
         */
        addAction(list){
            addObj({
                userInfoSid: this.searchParams.userInfoSid,
                list: list
            }).then(res => {
                this.$refs['refSearch'].search()
            })
        },
        /**
         * 更新商品状态
         */
        updateProductStatus(item, status) {
            const tips = status === 0 ? '不可销' : status === 1 ? '只可销' : '可销'
            this.$confirm('是否确认将商品"' + item.commodityName + '"状态改为"' + tips + '"吗?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return putObj({
                    sid: item.sid,
                    productSid: item.productSid,
                    club: this.$refs['refSearch'].searchParams.club,
                    controlType: status,
                    userInfoSid: this.searchParams.userInfoSid
                })
            }).then(() => {
                this.$refs['refSearch'].search()
                this.$message({
                    showClose: true,
                    message: '修改成功',
                    type: 'success'
                })
            }).catch(() => { })
        },
        removeProduct(row){
            this.$confirm('是否确认将"' + row.commodityName + '"从控销列表移除?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return delObj({
                    sid: row.sid
                })
            }).then(() => {
                this.$refs['refSearch'].search()
                this.$message({
                    showClose: true,
                    message: '移除成功',
                    type: 'success'
                })
            }).catch(() => { })
        }
    }
};
</script>
<style lang="scss">
.el-win-member-control-product {
    .el-dialog {
        width: 1000px;
        .el-dialog__body {
            padding: 0 0 0 0;
        }
        .app-table {
            .search-bar {
                padding: 10px 15px;
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
                .search-type-keyword {
                    width: 100%;
                }
            }
            .app-pagination {
                padding: 10px 15px;
            }
        }
    }
}
</style>
