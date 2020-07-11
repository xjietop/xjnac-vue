<template>
    <div class="el-image-upload">
        <template v-if="multiple">
            <span v-for="(file,index) in fileList" :key="index">
                <el-image :src="file.url" fit="contain" />
            </span>
        </template>
        <el-upload
            ref="upload"
            class="image-uploader"
            :action="baseURL + '/public/api/file/upload'"
            :headers="headers"
            accept="image/*"
            :file-list="fileList"
            :show-file-list="false"
            :multiple="multiple"
            :before-upload="handleBeforeUpload"
            :on-change="handleChange"
            :on-success="handleSuccess"
        >
            <template v-if="multiple===false">
                <span v-for="(file,index) in fileList" :key="index">
                    <el-image :src="file.status==='success' ? ossURL + file.url : file.imagePreview" fit="contain" />
                    <el-progress v-show="file.status==='ready'" :percentage="file.percentage" />
                    <el-progress v-show="file.status==='error'" :percentage="file.percentage" status="exception" />
                </span>
            </template>
            <slot v-if="fileList.length===0" name="tips">
                <div class="tips"> 
                    <i class="el-icon-upload image-uploader-icon" />
                    <p>点击上传图片</p>
                </div>
            </slot>
        </el-upload>
    </div>
</template>
<script>
import { baseURL } from '@/utils/urls'

export default {
    name: 'ImageUpload',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: {
            type: [String, Array],
            default: ''
        },
        multiple: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            baseURL: baseURL,
            ossURL: this.$store.getters.oss_url,
            headers: {
                Authorization: 'Bearer ' + this.$store.getters.access_token
            },
            fileList: []
        }
    },
    watch: {
        'value': function(val) {
            this.fileList = []
            if (!this.multiple && val !== ''){
                this.fileList = [{ status: 'success', percentage: 100, url: val }]
            }
        }
    },
    methods: {
        handleChange(file, fileList){
            if (!this.multiple && fileList.length > 1) {
                fileList.splice(0, 1);
            }
            this.$set(file, 'imagePreview', URL.createObjectURL(file.raw))
            this.fileList = fileList;
        },
        handleSuccess(res, file, fileList){
            if (res.code === 0){
                if (!this.multiple){
                    this.$emit('change', res.data[0])
                    this.$message({
                        message: '图片上传成功！',
                        type: 'success'
                    })
                }
            } else {
                this.$emit('change', '')
                this.$message({
                    message: '图片上传失败，请重试！',
                    type: 'error'
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.image-uploader {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    width: 356px;
    height: 180px;
    text-align: center;
    color: #c0c4cc;
    cursor: pointer;
    line-height: 1;
    position: relative;
    .el-image {
        width: 354px;
        height: 178px;
    }
    .tips {
        padding: 45px 0;
        .image-uploader-icon {
            font-size: 46px;
        }
    }
    &:hover {
        color: #409eff;
        border-color: #409eff;
    }
}
</style>
