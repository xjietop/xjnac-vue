<template>
    <el-dialog title="重置密码" :visible.sync="show" :close-on-click-modal="false" class="el-win-member-list-password">
        <el-form ref="ruleForm" :model="form" :rules="rules" size="medium" label-width="80px">
            <el-form-item prop="pwd" label="新密码">
                <el-input v-model="form.pwd" type="password" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item prop="repeatPassword" label="确认密码">
                <el-input v-model="form.repeatPassword" type="password" placeholder="请重新输入新密码" />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">取 消</el-button>
            <el-button type="primary" :loading="loading" @click="save">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import Regex from '@/utils/regex'
export default {
    name: "WinPassword",
    data() {
        return {
            edit: false,
            loading: false,
            form: {
                pwd: '',
                repeatPassword: ''
            },
            rules: {
                pwd: [
                    { required: true, message: "请输入新密码", trigger: "blur" },
                    { pattern: Regex.passWord, message: "6至20个字符，支持数字，大小写字母和标点符号组合", trigger: "blur" }
                ],
                repeatPassword: [
                    { required: true, message: "请重新输入新密码", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            if (value === "") {
                                callback(new Error("请再次输入密码"));
                            } else if (value !== this.form.pwd) {
                                callback(new Error("两次输入密码不一致!"));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
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
                for (const key in this.form) {
                    this.form[key] = item[key];
                }
                this.form.sid = item.sid
            });
        },
        save() {
            this.$refs["ruleForm"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    const item = Object.assign({}, this.form);
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
.el-win-member-list-password {
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
