<template>
	<el-container>
		<el-main class="nopadding">
			<el-container>
				<el-header>
					<div class="left-panel">
						<el-button v-auth="'log:del'" type="danger" plain icon="el-icon-delete" :disabled="selection.length===0" @click="batch_del"></el-button>
					</div>
					<div class="right-panel">
						<div class="right-panel-search">
							<el-date-picker v-model="timeRange" type="datetimerange" range-separator="至" start-placeholder="开始时间"
											value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" end-placeholder="结束时间"
											style="width: 360px;" />
							<el-input v-model="search.title" placeholder="操作名称" clearable style="width: 200px;"></el-input>
							<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
						</div>
					</div>
				</el-header>
				<el-main class="nopadding">
					<scTable ref="table" :apiObj="apiObj" stripe highlightCurrentRow @selection-change="selectionChange" >
						<el-table-column type="selection" width="50"></el-table-column>
						<el-table-column label="ID" prop="logId" width="80"></el-table-column>
						<el-table-column label="用户" prop="username" width="120"></el-table-column>
						<el-table-column label="操作名称" prop="title" width="120"></el-table-column>
						<el-table-column label="请求接口" prop="flag" width="150"></el-table-column>
						<el-table-column label="请求方法" prop="method" width="100"></el-table-column>
						<el-table-column label="返回状态" prop="code" width="100">
							<template #default="scope">
								<el-tag v-if="scope.row.code==200" type="success">成功</el-tag>
								<el-tag v-else type="warning">失败</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="浏览器" prop="ua">
							<template #default="scope">
								{{$TOOL.browser(scope.row.ua)}}
							</template>
						</el-table-column>
						<el-table-column label="客户端IP" prop="ip"></el-table-column>
						<el-table-column label="日志时间" prop="createTime" width="180"></el-table-column>
					</scTable>
				</el-main>
			</el-container>
		</el-main>
	</el-container>
</template>

<script>

export default {
	name: 'commonLog',
	data() {
		return {
			apiObj: this.$API.common.log.list,
			selection: [],
			timeRange: [],
			search: {
				startTime: "",
				endTime: "",
				title: ""
			}
		}
	},
	methods: {
		upsearch(){
			if (this.timeRange && this.timeRange.length > 0) {
				this.search.endTime = this.timeRange[1]
				this.search.startTime = this.timeRange[0]
			}else {
				this.search.startTime = ""
				this.search.endTime = ""
			}
			this.$refs.table.upData(this.search)
		},
		//批量删除
		async batch_del(){
			this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？如果删除项中含有子集将会被一并删除`, '提示', {
				type: 'warning'
			}).then(async () => {
				const loading = this.$loading();
				const res = await this.$API.system.log.del({ids: this.selection.map(item => item.logId).toString()});
				this.$refs.table.refresh()
				loading.close();
				this.$message.success(res.msg)
			})
		},
		//表格选择后回调事件
		selectionChange(selection){
			this.selection = selection;
		}
	}
}
</script>

<style>
</style>
