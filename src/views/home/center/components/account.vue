<template>
	<el-card shadow="never" header="个人信息">
		<el-form ref="form" :model="form" label-width="120px" style="margin-top:20px;">
			<el-form-item label="账号">
				<el-input v-model="form.username" disabled></el-input>
				<div class="el-form-item-msg">账号信息用于登录，系统不允许修改</div>
			</el-form-item>
			<el-form-item label="头像" prop="avatar">
				<sc-upload v-model="form.avatar" title="头像" :cropper="true" :compress="1"
						   :aspectRatio="1/1"></sc-upload>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="save">保存</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
export default {
	data() {
		return {
			form: {
				username: "admin",
				avatar: ""
			}
		}
	},
	mounted() {
		this.form = this.$TOOL.data.get("USER_INFO")
	},
	methods: {
		async save() {
			const [res, err] = await this.$TOOL.go(this.$API.auth.saveAccountInfo({avatar: this.form.avatar}))
			if (!err) {
				this.$message.success(res.msg)
				this.$TOOL.data.set("USER_INFO", this.form)
			}
		}
	}
}
</script>

<style>
</style>
