<template>
    <el-dialog title="关联账户" :visible.sync="show" :close-on-click-modal="false" class="el-win-member-list-relation">
        <el-form ref="ruleForm" :model="form" :rules="rules" size="medium" label-width="100px">
            <el-form-item prop="userCode" label="会员编号">
                <el-input v-model="form.userCode" type="text" disabled placeholder="请输入会员编号" />
            </el-form-item>
            <el-form-item prop="name" label="会员名称">
                <el-input v-model="form.name" type="text" disabled placeholder="请输入会员名称" />
            </el-form-item>
            <el-form-item prop="phone" label="会员电话">
                <el-input v-model.trim="form.phone" type="text" placeholder="请输入会员电话" />
            </el-form-item>
            <el-form-item prop="email" label="会员邮箱">
                <el-input v-model="form.email" type="text" placeholder="请输入会员邮箱" />
            </el-form-item>
            <!-- <el-form-item prop="areaSid" label="会员区域">
                <el-input v-model="form.areaSid" type="text" disabled placeholder="请输入会员区域" />
            </el-form-item> -->
            <el-form-item prop="account" label="会员区分码">
                <el-input v-model.trim="form.account" type="text" placeholder="请输入会员区分码" />
            </el-form-item>
            <el-form-item prop="businessType" label="会员类型">
                <el-radio v-model="form.businessType" :label="2">诊所</el-radio>
                <el-radio v-model="form.businessType" :label="1">药店</el-radio>
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
    name: "WinMemberListRelation",
    data() {
        return {
            edit: false,
            loading: false,
            form: {
                userCode: '',
                name: '',
                phone: '',
                email: '',
                account: '',
                businessType: 1
            },
            rules: {
                phone: [
                    { required: true, message: "请输入会员电话", trigger: "blur" }
                ],
                email: [
                    // { required: true, message: "请输入会员邮箱", trigger: "blur" }
                ],
                account: [
                    // { required: true, message: "请输入会员区分码", trigger: "blur" }
                ],
                businessType: [
                    { required: true, message: "请选择会员类型", trigger: "change" }
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
            this.loading = false;
            this.callback = fn;
            this.show = true;
            this.$nextTick(() => {
                this.$refs["ruleForm"].resetFields();
                for (const key in this.form) {
                    this.form[key] = item[key];
                }
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
.el-win-member-list-relation {
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
