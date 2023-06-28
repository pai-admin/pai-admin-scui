<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="right">
			<el-form-item label="头像" prop="avatar">
				<sc-upload v-model="form.avatar" title="上传头像" :cropper="true" :compress="1" :aspectRatio="1/1"></sc-upload>
			</el-form-item>
			<el-form-item label="账号" prop="username">
				<el-input v-model="form.username" placeholder="用于登录系统" clearable></el-input>
			</el-form-item>
			<el-form-item label="登录密码" prop="password">
				<el-input type="password" v-model="form.password" clearable show-password></el-input>
			</el-form-item>
			<el-form-item label="所属部门" prop="deptId">
				<el-cascader ref="dept" v-model="form.deptId" :options="depts" :props="deptsProps" clearable style="width: 100%;"></el-cascader>
			</el-form-item>
			<el-form-item label="所属角色" prop="roles">
				<el-select v-model="form.roles" multiple filterable style="width: 100%">
					<el-option v-for="item in groups" :key="item.roleId" :label="item.roleName" :value="item.roleId"/>
				</el-select>
			</el-form-item>
			<el-form-item label="是否有效" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
export default {
	emits: ['success', 'closed'],
	data() {
		return {
			mode: "add",
			titleMap: {
				add: '新增',
				edit: '编辑',
				show: '查看'
			},
			visible: false,
			isSaveing: false,
			//表单数据
			form: {
				accountId:null,
				username: "",
				avatar: "",
				password: "",
				deptId: 0,
				roles: [],
				status: 1
			},
			//验证规则
			rules: {
				username: [
					{required: true, message: '请输入登录账号'}
				],
				deptId: [
					{required: true, message: '请选择所属部门'}
				],
				roles: [
					{required: true, message: '请选择所属角色', trigger: 'change'}
				]
			},
			//所需数据选项
			groups: [],
			depts: [],
			deptsProps: {
				value: "deptId",
				label: "deptName",
				checkStrictly: true
			}
		}
	},
	mounted() {
		this.getGroup()
	},
	methods: {
		//显示
		open(mode='add'){
			this.mode = mode;
			this.visible = true;
			return this
		},
		//加载树数据
		async getGroup(){
			const res = await this.$API.system.role.list();
			this.groups = res.data;
		},
		//表单提交方法
		async submit(){
			// 校验登录
			const validate = await this.$refs.dialogForm.validate().catch(() => {});
			if(!validate){ return false }
			// 部门获取最后一项
			this.form.deptId = this.$refs.dept.getCheckedNodes()[0].data.deptId
			if (this.form.password) this.form.password = this.$TOOL.crypto.MD5(this.form.password)
			this.isSaveing = true;
			const res = this.form.accountId ? await this.$API.system.account.edit(this.form) : await this.$API.system.account.add(this.form);
			this.isSaveing = false;
			this.$emit('success')
			this.visible = false;
			this.$message.success(res.msg)
		},
		//表单注入数据
		setData(data){
			Object.assign(this.form, data)
			this.form.roles = data.roles.map(item => item.roleId)
		},
		setDeptOption(data) {
			this.depts = data
			return this;
		}
	}
}
</script>

<style>
</style>
