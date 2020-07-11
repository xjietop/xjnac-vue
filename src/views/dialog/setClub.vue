<template>
    <el-dialog title="设置俱乐部" :visible.sync="show" :close-on-click-modal="false" class="el-win-member-club">
        <el-form ref="ruleForm" :model="form" :rules="rules" size="medium" label-width="0px">
            <el-form-item prop="clubs">
                <el-checkbox-group v-model="form.clubs">
                    <el-checkbox :label="1" name="clubs">乐赛仙</el-checkbox>
                    <el-checkbox :label="2" name="clubs">佐安堂</el-checkbox>
                    <el-checkbox :label="3" name="clubs">初心</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">取 消</el-button>
            <el-button type="primary" :loading="loading" @click="save">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    name: "WinSetClub",
    components: {
        
    },
    data() {
        return {
            edit: false,
            loading: false,
            form: {
                clubs: []
            },
            rules: {
                clubs: []
            },
            show: false
        };
    },
    watch: {

    },
    created() {

    },
    methods: {
        update(item, fn) {
            this.edit = true;
            this.loading = false;
            this.callback = fn;
            this.show = true;
            this.$nextTick(() => {
                this.$refs["ruleForm"].resetFields();
                this.form.clubs = item.clubs
                this.form.sid = item.sid
            });
        },
        save() {
            this.$refs["ruleForm"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    const item = Object.assign({}, this.form)
                    this.callback(item);
                } else {
                    return false;
                }
            });
        },
        close() {
            this.show = false;
        }
    }
};
</script>
<style lang="scss">
.el-win-member-club {
    .el-dialog {
        width: 500px;
        .el-dialog__body {
            padding: 30px 20px 0 20px;
        }
        .el-select {
            width: 100%;
        }
        .mce-branding {
            display: none;
        }
    }
}
</style>
