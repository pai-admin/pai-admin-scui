<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="search.title" placeholder="搜索标题" clearable style="width: 200px;"></el-input>
					<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="apiObj" @selection-change="selectionChange" stripe>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="#" type="index" width="50"></el-table-column>
				<el-table-column label="信息标题" prop="title"></el-table-column>
				<el-table-column label="接收时间" prop="create_time"></el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="180">
					<template #default="scope">
						<el-button-group>
							<el-button text type="primary" size="small" @click="table_show(scope.row, scope.$index)">详情</el-button>
							<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
								<template #reference>
									<el-button v-auth="'message:del'" text type="danger" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</el-button-group>
					</template>
				</el-table-column>
			</scTable>
		</el-main>
	</el-container>
	<show-dialog v-if="dialog.show" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.show=false"></show-dialog>
</template>

<script>
import showDialog from './show.vue'

export default {
	name: "homeMessage",
	components: {
		showDialog
	},
	data() {
		return {
			dialog: {
				show: false,
			},
			apiObj: this.$API.home.message.list,
			selection: [],
			search: {
				title: null,
			}
		}
	},
	mounted() {

	},
	methods: {
		//查看
		table_show(row){
			this.dialog.show = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open().setData(row)
			})
		},
		//删除
		async table_del(row){
			const loading = this.$loading();
			var res = await this.$API.home.message.del({accept_id: row.accept_id});
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
				const res = await this.$API.home.message.del({accept_id: this.selection.map(item => item.accept_id).toString()});
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

<style scoped>

</style>
