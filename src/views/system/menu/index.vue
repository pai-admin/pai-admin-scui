<template>
	<el-container>
		<el-aside width="300px" v-loading="menuloading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="menuFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="menu" class="menu" node-key="id" :data="menuList" :props="menuProps" highlight-current :expand-on-click-node="false" check-strictly show-checkbox :filter-node-method="menuFilterNode" @node-click="menuClick">
						<template #default="{node, data}">
							<span class="custom-tree-node el-tree-node__label">
								<span class="label">
									{{ node.label }}
									<el-button v-if="data.type == 0" link size="small" style="color: #e6a23c;margin-left: 5px;">菜单</el-button>
									<el-button v-if="data.type == 1" link size="small" style="color: #79bbff;margin-left: 5px;">按钮</el-button>
									<el-button v-if="data.type == 2" link size="small" style="color: #67c23a;margin-left: 5px;">接口</el-button>
								</span>
								<span class="do">
									<el-button v-auth="'menu:add'" icon="el-icon-plus" size="small" @click.stop="add(node, data)"></el-button>
									<el-button v-auth="'menu:del'" icon="el-icon-delete" size="small" @click.stop="del(node, data)"></el-button>
								</span>
							</span>
						</template>
					</el-tree>
				</el-main>
				<el-footer style="height:51px;">
					<el-button v-auth="'menu:add'" type="primary" size="small" icon="el-icon-plus" @click="add()"></el-button>
					<el-button v-auth="'menu:del'" type="danger" size="small" plain icon="el-icon-delete" @click="delMenu"></el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-container>
			<el-main class="nopadding" style="padding:20px;" ref="main">
				<save ref="save" :menu="menuList"></save>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	let newMenuIndex = 1;
	import save from './save'

	export default {
		name: "systemMenu",
		components: {
			save
		},
		data(){
			return {
				menuloading: false,
				menuList: [],
				menuProps: {
					label: (data)=>{
						return data.title
					}
				},
				menuFilterText: ""
			}
		},
		watch: {
			menuFilterText(val){
				this.$refs.menu.filter(val);
			}
		},
		mounted() {
			this.getMenu();
		},
		methods: {
			//加载树数据
			async getMenu(){
				this.menuloading = true
				var res = await this.$API.system.menu.list();
				this.menuloading = false
				this.menuList = this.$TOOL.makeTreeData(res.data, 0, "menuId");
			},
			//树点击
			menuClick(data){
				this.$refs.save.setData(data)
				this.$refs.main.$el.scrollTop = 0
			},
			//树过滤
			menuFilterNode(value, data){
				if (!value) return true;
				var targetText = data.title;
				return targetText.indexOf(value) !== -1;
			},
			//增加
			async add(node, data){
				var newMenuName = "未命名" + newMenuIndex++;
				var newMenuData = {
					menuId: "",
					parentId: data ? data.menuId : 0,
					name: newMenuName,
					icon: "",
					path: "",
					title: newMenuName,
					type: 0,
					rank: 1
				}
				this.menuloading = true
				this.menuloading = false
				this.$refs.menu.append(newMenuData, node)
				this.$refs.menu.setCurrentKey(newMenuData.menuId)
				this.$refs.save.setData(newMenuData)
			},
			async del(node, data) {
				this.menuloading = true
				var res = await this.$API.system.menu.del({ids: data.menuId})
				if(node == null){
					this.reload()
				}else if (node.isCurrent){
					this.$refs.save.setData({})
				}
				this.$refs.menu.remove(node)
				this.menuloading = false
				this.$message.success(res.msg)
			},
			//删除菜单
			async delMenu(){
				var CheckedNodes = this.$refs.menu.getCheckedNodes()
				if(CheckedNodes.length == 0){
					this.$message.warning("请选择需要删除的项")
					return false;
				}
				var confirm = await this.$confirm('确认删除已选择的菜单吗？','提示', {
					type: 'warning',
					confirmButtonText: '删除',
					cancelButtonText: '取消',
					confirmButtonClass: 'el-button--danger'
				}).catch(() => {})
				if(confirm != 'confirm'){
					return false
				}
				this.menuloading = true
				var ids = CheckedNodes.map(item => item.menuId)
				var res = await this.$API.system.menu.del({ids: ids.toString()})
				this.menuloading = false
				this.$message.success(res.msg)
				CheckedNodes.forEach(item => {
					var node = this.$refs.menu.getNode(item)
					if(node == null){
						this.reload()
					}else if (node.isCurrent){
						this.$refs.save.setData({})
					}
					this.$refs.menu.remove(item)
				})
			},
			reload() {
				this.getMenu()
				this.$refs.save.setData(this.menuList[0])
				this.$refs.main.$el.scrollTop = 0
			}
		}
	}
</script>

<style scoped>
	.custom-tree-node {display: flex;flex: 1;align-items: center;justify-content: space-between;font-size: 14px;padding-right: 24px;height:100%;}
	.custom-tree-node .label {display: flex;align-items: center;;height: 100%;}
	.custom-tree-node .label .el-tag {margin-left: 5px;}
	.custom-tree-node .do {display: none;}
	.custom-tree-node .do i {margin-left:5px;color: #999;}
	.custom-tree-node .do i:hover {color: #333;}

	.custom-tree-node:hover .do {display: inline-block;}
</style>
