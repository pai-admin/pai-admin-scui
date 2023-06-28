<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="380" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" ref="dialogForm" label-width="80px" label-position="left">
			<el-form-item label="父路径" prop="parentId">
				<el-cascader v-model="form.parentId" :options="dic" :props="dicProps" :show-all-levels="false"
							 clearable></el-cascader>
			</el-form-item>
			<el-form-item label="字典名称" prop="typeName">
				<el-input v-model="form.typeName" clearable placeholder="字典名称"></el-input>
			</el-form-item>
			<el-form-item label="字典编码" prop="flag">
				<el-input v-model="form.flag" clearable placeholder="字典编码"></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="rank">
				<el-input-number v-model="form.rank" controls-position="right" :min="1" :max="9999" style="width: 100%;"></el-input-number>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false">取 消</el-button>
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
				add: '新增字典',
				edit: '编辑字典'
			},
			visible: false,
			isSaveing: false,
			form: {
				typeId: "",
				parentId: 0,
				typeName: "",
				flag: "",
				rank: 1
			},
			rules: {
				flag: [
					{required: true, message: '请输入字典编码'}
				],
				typeName: [
					{required: true, message: '请输入字典名称'}
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
		open(mode = 'add') {
			this.mode = mode;
			this.visible = true;
			return this;
		},
		//获取字典列表
		async getDic() {
			var res = await this.$API.common.dict_type.list();
			this.dic = res.data;
		},
		//表单提交方法
		async submit() {
			// 校验登录
			const validate = await this.$refs.dialogForm.validate().catch(() => {});
			if(!validate){ return false }
			this.isSaveing = true;
			const res = this.form.typeId ? await this.$API.common.dict_type.edit(this.form) : await this.$API.common.dict_type.add(this.form);
			this.isSaveing = false;
			if (this.form.typeId == "") {
				this.form.typeId = res.data.typeId
			}
			this.$emit('success', this.form, this.mode)
			this.visible = false;
			this.$message.success(res.msg)
		},
		//表单注入数据
		setData(data) {
			Object.assign(this.form, data)
		}
	}
}
</script>

<style>
</style>
