<template>
	<el-container>
		<el-aside width="200px" v-loading="showGrouploading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="groupFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="group" class="menu" node-key="dept_id" :data="group" :props="groupsProps" :current-node-key="''" :highlight-current="true" :expand-on-click-node="false" :filter-node-method="groupFilterNode" @node-click="groupClick"></el-tree>
				</el-main>
			</el-container>
		</el-aside>
		<el-container>
			<el-header>
				<div class="left-panel">
					<el-button v-auth="'account:add'" type="primary" icon="el-icon-plus" @click="add"></el-button>
					<el-button v-auth="'account:del'" type="danger" plain icon="el-icon-delete" :disabled="selection.length===0" @click="batch_del"></el-button>
				</div>
				<div class="right-panel">
					<div class="right-panel-search">
						<el-input v-model="search.username" placeholder="登录账号" clearable style="width: 200px;"></el-input>
						<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
					</div>
				</div>
			</el-header>
			<el-main class="nopadding">
				<scTable ref="table" :apiObj="apiObj" @selection-change="selectionChange" stripe remoteSort remoteFilter>
					<el-table-column type="selection" width="50"></el-table-column>
					<el-table-column label="ID" prop="accountId" width="100"></el-table-column>
					<el-table-column label="账号" prop="username"></el-table-column>
					<el-table-column label="部门" prop="deptName"></el-table-column>
					<el-table-column label="头像">
						<template #default="scope">
							<el-avatar :src="scope.row.avatar" size="small"></el-avatar>
						</template>
					</el-table-column>
					<el-table-column label="角色" prop="roleLists">
						<template #default="scope">
							{{scope.row.roles.map(item=>item.roleName).toString()}}
						</template>
					</el-table-column>
					<el-table-column label="状态" prop="status" width="150">
						<template #default="scope">
							<el-tag v-if="scope.row.status===1" type="success">启用</el-tag>
							<el-tag v-if="scope.row.status===0" type="danger">停用</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="创建时间" prop="createTime"></el-table-column>
					<el-table-column label="操作" fixed="right" align="right" width="160">
						<template #default="scope">
							<el-button-group>
								<el-button text type="primary" size="small" @click="table_show(scope.row, scope.$index)">查看</el-button>
								<el-button v-auth="'account:edit'" text type="primary" size="small" @click="table_edit(scope.row, scope.$index)">编辑</el-button>
								<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
									<template #reference>
										<el-button v-auth="'account:del'" text type="primary" size="small">删除</el-button>
									</template>
								</el-popconfirm>
							</el-button-group>
						</template>
					</el-table-column>
				</scTable>
			</el-main>
		</el-container>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSuccess" @closed="dialog.save=false"></save-dialog>

</template>

<script>
import saveDialog from './save'

export default {
	name: 'systemAccount',
	components: {
		saveDialog
	},
	data() {
		return {
			dialog: {
				save: false
			},
			showGrouploading: false,
			groupFilterText: '',
			group: [],
			groupsProps: {
				value: "deptId",
				label: "deptName",
				emitPath: false,
				checkStrictly: true
			},
			apiObj: this.$API.system.account.list,
			selection: [],
			search: {
				username: null
			}
		}
	},
	watch: {
		groupFilterText(val) {
			this.$refs.group.filter(val);
		}
	},
	mounted() {
		this.getGroup()
	},
	methods: {
		//添加
		add(){
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open().setDeptOption(this.group)
			})
		},
		//编辑
		table_edit(row){
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open('edit').setDeptOption(this.group).setData(row)
			})
		},
		//查看
		table_show(row){
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open('show').setDeptOption(this.group).setData(row)
			})
		},
		//删除
		async table_del(row){
			const loading = this.$loading();
			var res = await this.$API.system.account.del({ids: row.accountId});
			this.$refs.table.refresh()
			loading.close();
			this.$message.success(res.msg)
		},
		//批量删除
		async batch_del(){
			this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？如果删除项中含有子集将会被一并删除`, '提示', {
				type: 'warning'
			}).then(async () => {
				const loading = this.$loading();
				const res = await this.$API.system.account.del({ids: this.selection.map(item => item.accountId).toString()});
				this.$refs.table.refresh()
				loading.close();
				this.$message.success(res.msg)
			})
		},
		//表格选择后回调事件
		selectionChange(selection){
			this.selection = selection;
		},
		//加载树数据
		async getGroup(){
			this.showGrouploading = true;
			const res = await this.$API.system.dept.list();
			this.showGrouploading = false;
			this.group = this.$TOOL.makeTreeData(res.data, 0, "deptId");
		},
		//树过滤
		groupFilterNode(value, data){
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		//树点击事件
		groupClick(data){
			var params = {
				deptId: data.deptId
			}
			this.$refs.table.reload(params)
		},
		//搜索
		upsearch(){
			this.$refs.table.upData(this.search)
		},
		//本地更新数据
		handleSuccess(){
			this.$refs.table.reload()
		}
	}
}
</script>

<style>
</style>
