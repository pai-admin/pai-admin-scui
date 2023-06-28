<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="400" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" ref="dialogForm" label-width="100px" label-position="left">
			<el-form-item label="所属字典" prop="typeId">
				<el-cascader v-model="form.typeId" :options="dic" :props="dicProps" :show-all-levels="false" clearable></el-cascader>
			</el-form-item>
			<el-form-item label="项名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="键值" prop="content">
				<el-input v-model="form.content" clearable></el-input>
			</el-form-item>
			<el-form-item label="是否有效" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item label="排序" prop="rank">
				<el-input-number v-model="form.rank" controls-position="right" :min="1" :max="9999" style="width: 100%;"></el-input-number>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
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
				add: '新增项',
				edit: '编辑项'
			},
			visible: false,
			isSaveing: false,
			form: {
				dataId: "",
				typeId: "",
				name: "",
				content: "",
				status: 1,
				rank: 1
			},
			rules: {
				typeId: [
					{required: true, message: '请选择所属字典'}
				],
				name: [
					{required: true, message: '请输入项名称'}
				],
				content: [
					{required: true, message: '请输入键值'}
				]
			},
			dic: [],
			dicProps: {
				value: "typeId",
				label: "typeName",
				emitPath: false,
				checkStrictly: true
			}
		}
	},
	mounted() {
		this.getDic()
	},
	methods: {
		//显示
		open(mode='add'){
			this.mode = mode;
			this.visible = true;
			return this;
		},
		//获取字典列表
		async getDic(){
			var res = await this.$API.common.dict_type.list();
			this.dic = res.data;
		},
		//表单提交方法
		async submit(){
			// 校验登录
			const validate = await this.$refs.dialogForm.validate().catch(() => {});
			if(!validate){ return false }
			this.isSaveing = true;
			const res = this.form.dataId ? await this.$API.common.dict_data.edit(this.form) : await this.$API.common.dict_data.add(this.form);
			this.isSaveing = false;
			this.$emit('success', this.form, this.mode)
			this.visible = false;
			this.$message.success(res.msg)
		},
		//表单注入数据
		setData(data){
			Object.assign(this.form, data)
		}
	}
}
</script>

<style>
</style>
