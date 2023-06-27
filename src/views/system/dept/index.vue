<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button v-auth="'dept:add'" type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button v-auth="'dept:del'" type="danger" plain icon="el-icon-delete" :disabled="selection.length===0" @click="batch_del"></el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="search.deptName" placeholder="部门名称" clearable style="width: 200px;"></el-input>
					<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="apiObj" row-key="deptId" @selection-change="selectionChange" hidePagination>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="部门名称" prop="deptName" width="250"></el-table-column>
				<el-table-column label="排序" prop="rank" width="150"></el-table-column>
				<el-table-column label="状态" prop="status" width="150">
					<template #default="scope">
						<el-tag v-if="scope.row.status===1" type="success">启用</el-tag>
						<el-tag v-if="scope.row.status===0" type="danger">停用</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
				<el-table-column label="备注" prop="remark" min-width="300"></el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="170">
					<template #default="scope">
						<el-button-group>
							<el-button text type="primary" size="small" @click="table_show(scope.row, scope.$index)">查看</el-button>
							<el-button v-auth="'dept:edit'" text type="primary" size="small" @click="table_edit(scope.row, scope.$index)">编辑</el-button>
							<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
								<template #reference>
									<el-button v-auth="'dept:del'" text type="danger" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</el-button-group>
					</template>
				</el-table-column>

			</scTable>
		</el-main>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.save=false"></save-dialog>

</template>

<script>
import saveDialog from './save'

export default {
	name: 'systemDept',
	components: {
		saveDialog
	},
	data() {
		return {
			dialog: {
				save: false
			},
			apiObj: this.$API.system.dept.list,
			selection: [],
			search: {
				deptName: null
			}
		}
	},
	methods: {
		//添加
		add(){
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open()
			})
		},
		//编辑
		table_edit(row){
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open('edit').setData(row)
			})
		},
		//查看
		table_show(row){
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open('show').setData(row)
			})
		},
		//删除
		async table_del(row){
			const res = await this.$API.system.dept.del({deptId: row.deptId});
			this.$refs.table.refresh()
			this.$message.success(res.msg)
		},
		//批量删除
		async batch_del(){
			this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？如果删除项中含有子集将会被一并删除`, '提示', {
				type: 'warning'
			}).then(async () => {
				const loading = this.$loading();
				const res = await this.$API.system.dept.del({deptId: this.selection.map(item => item.deptId).toString()});
				this.$refs.table.refresh()
				loading.close();
				this.$message.success(res.msg)
			})
		},
		//表格选择后回调事件
		selectionChange(selection){
			this.selection = selection;
		},
		//搜索
		upsearch(){
			this.$refs.table.upData(this.search)
		},
		//本地更新数据
		handleSaveSuccess(){
			this.$refs.table.refresh()
		}
	}
}
</script>

<style>
</style>
