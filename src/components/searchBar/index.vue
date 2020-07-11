<template>
    <div class="app-search-bar clearfix">
        <div class="app-search-left dib-wrap">
            <!--快捷搜索-->
            <div v-if="searchData.quickList.length>0" class="search-item dib">
                <el-input v-model="searchQuick.searchValue" size="small" placeholder="请输入关键字" clearable @clear="search" @keyup.enter.native="search">
                    <el-select slot="prepend" v-model="searchQuick.searchType" size="small">
                        <el-option v-for="(option,index) in searchData.quickList" :key="index" v-bind="option" />
                    </el-select>
                </el-input>
            </div>
            <div v-for="(searchItem,index) in searchData.searchList" :key="index" class="search-item dib">
                <!--下拉框-->
                <template v-if="searchItem.type==='select'">
                    <el-select v-model="searchParams[searchItem.prop]" :clearable="searchItem.clearable" :placeholder="searchItem.placeholder" :disabled="searchItem.disabled" size="small" @change="search()">
                        <el-option v-for="option in searchItem.list" :key="option.value" v-bind="option" />
                    </el-select>
                </template>
            </div>
            <slot name="left" />
            <div class="search-item dib">
                <el-button size="small" icon="el-icon-search" type="primary" @click="search">搜索</el-button>
                <el-button size="small" icon="el-icon-delete" @click="reset">重置</el-button>
                <el-button v-if="searchData.visibleAddbtn" size="small" icon="el-icon-circle-plus-outline" @click="addnew">新增</el-button>
                <slot name="leftBtn" />
            </div>
        </div>
        <div class="app-search-right dib-wrap">
            <slot name="right" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchBar',
    props: {        
        searchData: {
            type: Object,
            default: () => {
                return {
                    quickList: [],
                    searchList: [],
                    page: {
                        size: 20,
                        current: 1
                    }
                }
            }
        },
        autoLoad: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            searchQuick: {
                searchType: '',
                searchValue: ''
            },
            searchParams: {
                size: 20,
                current: 1
            }
        }
    },
    watch: {
        'searchData': {
            deep: true,
            handler: function(val, oldVal){
                this.initParams()
            }
        }
    },
    created(){
        this.initParams(() => {
            this.search()
        })
    },
    methods: {
        /**
         * 初始化
         */
        initParams(callback){
            this.searchData.searchList.forEach(element => {
                this.$set(this.searchParams, element.prop, element.defaultValue || '')
            });

            if (this.searchData.quickList.length > 0){
                this.searchQuick.searchType = this.searchData.quickList[0].value
            }

            this.searchParams.size =  this.searchData.page.size
            this.searchParams.current =  this.searchData.page.current

            callback && this.autoLoad && callback()
        },
        /**
         * 获取参数
         */
        getParams(){
            const searchParams = Object.assign({}, this.searchParams)
            if (this.searchData.quickList.length > 0) searchParams[this.searchQuick.searchType] = this.searchQuick.searchValue;
            return searchParams;
        },
        /**
         * 搜索
         */
        search(params){
            this.searchParams.current = 1
            let searchParams = this.getParams()
            if (params) searchParams = Object.assign({}, searchParams, params || {})
            this.$emit('search', searchParams)
        },
        /**
         * 清空
         */
        reset(){
            this.searchQuick.searchValue = ''
            this.$emit('reset')
            this.initParams()
            this.search()
        },
        /**
         * 清空不调用查询
         */
        resetSearch(){
            this.searchQuick.searchValue = ''
            this.$emit('reset')
            this.initParams()
        },
        /**
         * 新增
         */
        addnew(){
            this.$emit('addnew')
        }
    }
}
</script>

