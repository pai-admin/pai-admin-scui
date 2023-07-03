<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode==='show'" ref="dialogForm" label-width="100px" label-position="right">
			<el-form-item label="名称" prop="roleName">
				<el-input v-model="form.roleName" clearable></el-input>
			</el-form-item>
			<el-form-item label="权限" prop="alias">
				<el-tree style="width: 100%;" ref="menu" node-key="menuId" :data="menu.list" :default-checked-keys="menu.checked"
						 :props="menu.props" show-checkbox check-strictly></el-tree>
			</el-form-item>
			<el-form-item label="标识" prop="flag">
				<el-input v-model="form.flag" clearable></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="rank">
				<el-input-number v-model="form.rank" controls-position="right" :min="1" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" clearable type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!=='show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
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
				roleId: null,
				roleName: "",
				menus: [],
				checkedMenus: "",
				rank: 1,
				status: 1,
				remark: "",
				flag: ""
			},
			menu: {
				list: [],
				props: {
					label: (data)=>{
						return data.title
					}
				},
				checked: []
			},
			//验证规则
			rules: {
				roleName: [
					{required: true, message: '请输入角色名称'}
				],
				flag: [
					{required: true, message: '请输入角色标识'}
				],
				rank: [
					{required: true, message: '请输入排序', trigger: 'change'}
				],
			}
		}
	},
	mounted() {
		this.getMenu()
	},
	methods: {
		async getMenu(){
			const res = await this.$API.system.menu.list();
			this.menu.list = this.$TOOL.makeTreeData(res.data, 0, "menuId");
		},
		//显示
		open(mode='add'){
			this.mode = mode;
			this.visible = true;
			return this
		},
		//表单提交方法
		async submit(){
			let checked = this.$refs.menu.getCheckedNodes().map(item => item.menuId);
			let allChecked = checked.concat(this.$refs.menu.getHalfCheckedNodes().map(item => item.menuId))
			if (allChecked.length <= 0) return this.$message.error("请至少权限")
			this.form.menus = allChecked
			this.form.checkedMenus = checked.toString()
			// 校验登录
			const validate = await this.$refs.dialogForm.validate().catch(() => {});
			if(!validate){ return false }
			this.isSaveing = true;
			const res = this.form.roleId ? await this.$API.system.role.edit(this.form) : await this.$API.system.role.add(this.form);
			this.isSaveing = false;
			this.$emit('success', this.form, this.mode)
			this.visible = false;
			this.$message.success(res.msg)
		},
		//表单注入数据
		setData(data){
			Object.assign(this.form, data)
			if (data.checkedMenus) {
				this.menu.checked = data.checkedMenus.split(",")
			}
		}
	}
}
</script>

<style>
</style>
