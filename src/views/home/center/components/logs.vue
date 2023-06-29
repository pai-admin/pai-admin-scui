<template>
	<el-card shadow="never" header="个人操作记录">
		<scTable ref="table" :apiObj="apiObj" height="auto" paginationLayout="total, prev, pager, next" hideDo>
			<sc-table-column label="序号" prop="logId" width="80"></sc-table-column>
			<sc-table-column label="业务名称" prop="title" width="160"></sc-table-column>
			<sc-table-column label="操作状态" prop="code" width="100">
				<template #default="scope">
					<el-tag v-if="scope.row.code==200" type="success">成功</el-tag>
					<el-tag v-else type="warning">失败</el-tag>
				</template>
			</sc-table-column>
			<el-table-column label="浏览器" prop="ua">
				<template #default="scope">
					{{$TOOL.browser(scope.row.ua)}}
				</template>
			</el-table-column>
			<sc-table-column label="IP" prop="ip"></sc-table-column>
			<sc-table-column label="操作时间" prop="createTime"></sc-table-column>
		</scTable>
	</el-card>
</template>

<script>
	export default {
		data() {
			return {
				apiObj: this.$API.auth.log,
			}
		}
	}
</script>

<style>
</style>
