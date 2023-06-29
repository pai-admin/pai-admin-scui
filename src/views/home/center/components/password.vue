<template>
	<el-card shadow="never" header="修改密码">
		<el-alert title="密码更新成功后，您将被重定向到登录页面，您可以使用新密码重新登录。" type="info" show-icon style="margin-bottom: 15px;"/>
		<el-form ref="form" :model="form" :rules="rules" label-width="120px" style="margin-top:20px;">
			<el-form-item label="当前密码" prop="oldPassword">
				<el-input v-model="form.oldPassword" type="password" show-password placeholder="请输入当前密码"></el-input>
				<div class="el-form-item-msg">必须提供当前登录用户密码才能进行更改</div>
			</el-form-item>
			<el-form-item label="新密码" prop="newPassword">
				<el-input v-model="form.newPassword" type="password" show-password placeholder="请输入新密码"></el-input>
				<sc-password-strength v-model="form.newPassword"></sc-password-strength>
				<div class="el-form-item-msg">请输入包含英文、数字的8位以上密码</div>
			</el-form-item>
			<el-form-item label="确认新密码" prop="confirmNewPassword">
				<el-input v-model="form.confirmNewPassword" type="password" show-password placeholder="请再次输入新密码"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="save">保存密码</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import scPasswordStrength from '@/components/scPasswordStrength/index.vue'

	export default {
		components: {
			scPasswordStrength
		},
		data() {
			return {
				form: {
					oldPassword: "",
					newPassword: "",
					confirmNewPassword: ""
				},
				rules: {
					oldPassword: [
						{ required: true, message: '请输入当前密码'}
					],
					newPassword: [
						{ required: true, message: '请输入新密码'},
						{ min: 6, max: 30, message: '密码长度在6-30位之间' },
					],
					confirmNewPassword: [
						{ required: true, message: '请再次输入新密码'},
						{ min: 6, max: 30, message: '密码长度在6-30位之间' },
						{validator: (rule, value, callback) => {
							if (value !== this.form.newPassword) {
								callback(new Error('两次输入密码不一致'));
							}else{
								callback();
							}
						}}
					]
				}
			}
		},
		methods: {
			async save(){
				// 校验登录
				const validate = await this.$refs.form.validate().catch(() => {});
				if(!validate){ return false }
				const [res, err] = await this.$TOOL.go(this.$API.auth.editPassword({
					oldPassword: this.$TOOL.crypto.MD5(this.form.oldPassword),
					newPassword: this.$TOOL.crypto.MD5(this.form.newPassword)
				}))
				if (!err) {
					this.$message.success(res.msg)
					this.$TOOL.data.clear()
					this.$router.replace({ path: '/login' })
				}
			}
		}
	}
</script>

<style>
</style>
