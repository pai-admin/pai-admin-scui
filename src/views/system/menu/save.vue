<template>
	<el-row :gutter="40">
		<el-col v-if="form.parentId===''">
			<el-empty description="请选择左侧菜单后操作" :image-size="100"></el-empty>
		</el-col>
		<template v-else>
			<el-col :lg="20">
				<h2>{{form.title || "新增菜单"}}</h2>
				<el-form :model="form" :rules="rules" ref="dialogForm" label-width="80px" label-position="left">
					<el-form-item label="显示名称" prop="title">
						<el-input v-model="form.title" clearable placeholder="菜单显示名字"></el-input>
					</el-form-item>
					<el-form-item label="上级菜单" prop="parentId">
						<el-cascader ref="parentId" v-model="form.parentId" :options="menuOptions" :props="menuProps" :show-all-levels="false" placeholder="顶级菜单" clearable></el-cascader>
					</el-form-item>
					<el-form-item label="类型" prop="type">
						<el-radio-group v-model="form.type">
							<el-radio-button :label="0">菜单</el-radio-button>
							<el-radio-button :label="1">按钮</el-radio-button>
							<el-radio-button :label="2">接口</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-if="form.type == 0" label="菜单图标" prop="icon">
						<sc-icon-select v-model="form.icon" clearable></sc-icon-select>
					</el-form-item>
					<el-form-item v-if="form.type == 0" label="页面名称" prop="name">
						<el-input v-model="form.name" clearable></el-input>
						<div class="el-form-item-msg">系统唯一且与内置组件名一致，否则导致缓存失效。如类型为Iframe的菜单，别名将代替源地址显示在地址栏</div>
					</el-form-item>
					<el-form-item v-if="form.type == 0" label="路由地址" prop="path">
						<el-input v-model="form.path" clearable></el-input>
						<div class="el-form-item-msg">首位不需要填写 "/"， 自动匹配页面路径</div>
					</el-form-item>
					<el-form-item v-if="form.type == 0" label="是否隐藏" prop="hidden">
						<el-checkbox v-model="form.hidden" :true-label="1" :false-label="0">隐藏菜单</el-checkbox>
					</el-form-item>
					<el-form-item v-if="form.type == 0" label="页面顺序" prop="rank">
						<el-input v-model="form.rank" clearable></el-input>
						<div class="el-form-item-msg">数值越大越靠前</div>
					</el-form-item>
					<el-form-item v-if="form.type == 2" label="请求方式" prop="method">
						<el-select v-model="form.method">
							<el-option
								v-for="item in methodOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item v-if="form.type == 1 || form.type == 2" label="权限标识" prop="flag">
						<el-input v-model="form.flag" clearable></el-input>
						<div class="el-form-item-msg">权限分隔符":"分割</div>
					</el-form-item>
					<el-form-item>
						<el-button v-auths="['menu:edit','menu:add']" type="primary" @click="save" :loading="loading">保 存</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</template>
	</el-row>

</template>

<script>
	import scIconSelect from '@/components/scIconSelect'

	export default {
		components: {
			scIconSelect
		},
		props: {
			menu: { type: Object, default: () => {} },
		},
		data(){
			return {
				form: {
					menuId: null,
					parentId: "",
					name: "",
					path: "",
					title: "",
					icon: "",
					type: 0,
					flag: "",
					hidden: "",
					method: "",
					rank: 1
				},
				menuOptions: [],
				menuProps: {
					value: 'menuId',
					label: 'title',
					checkStrictly: true
				},
				rules: [],
				loading: false,
				methodOptions: [
					{
						label: "get",
						value: "get"
					},
					{
						label: "post",
						value: "post"
					},
					{
						label: "put",
						value: "put"
					},
					{
						label: "delete",
						value: "delete"
					}
				]
			}
		},
		watch: {
			menu: {
				handler(){
					this.menuOptions = this.treeToMap(this.menu)
				},
				deep: true
			}
		},
		methods: {
			//简单化菜单
			treeToMap(tree){
				const map = []
				tree.forEach(item => {
					var obj = {
						menuId: item.menuId,
						parentId: item.parentId,
						title: item.title,
						children: item.children&&item.children.length>0 ? this.treeToMap(item.children) : null
					}
					map.push(obj)
				})
				return map
			},
			//保存
			async save(){
				this.loading = true
				if (Array.isArray(this.form.parentId)) {
					this.form.parentId = this.form.parentId[this.form.parentId.length - 1] ?? 0
				}
				const res = this.form.menuId == "" ? await this.$API.system.menu.add(this.form) :
					await this.$API.system.menu.edit(this.form);
				this.loading = false
				this.$message.success(res.msg)
				if (this.form.menuId == "") {
					this.form.menuId = res.data.menuId
				}
			},
			//表单注入数据
			setData(data){
				this.form = data
			}
		}
	}
</script>

<style scoped>
	h2 {font-size: 17px;color: #3c4a54;padding:0 0 30px 0;}
	.apilist {border-left: 1px solid #eee;}

	[data-theme="dark"] h2 {color: #fff;}
	[data-theme="dark"] .apilist {border-color: #434343;}
</style>
