<template>
	<el-container>
		<el-aside width="300px" v-loading="showDicloading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="dicFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="dic" class="menu" node-key="typeId" :data="dicList" :props="dicProps"
							 :highlight-current="true" :expand-on-click-node="false" :filter-node-method="dicFilterNode"
							 @node-click="dicClick">
						<template #default="{node, data}">
							<span class="custom-tree-node">
								<span class="label">{{ node.label }}</span>
								<span class="code">{{ data.flag }}</span>
								<span class="do">
									<el-button-group>
										<el-button icon="el-icon-edit" size="small"
												   @click.stop="dicEdit(data)"></el-button>
										<el-button icon="el-icon-delete" size="small"
												   @click.stop="dicDel(node, data)"></el-button>
									</el-button-group>
								</span>
							</span>
						</template>
					</el-tree>
				</el-main>
				<el-footer style="height:51px;">
					<el-button type="primary" size="small" icon="el-icon-plus" style="width: 100%;" @click="addDic">
						字典分类
					</el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-container class="is-vertical">
			<el-header>
				<div class="left-panel">
					<el-button type="primary" icon="el-icon-plus" @click="addInfo"></el-button>
					<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0"
							   @click="batch_del"></el-button>
				</div>
			</el-header>
			<el-main class="nopadding">
				<scTable ref="table" :apiObj="listApi" :params="listApiParams"
						 @selection-change="selectionChange" stripe :paginationLayout="'prev, pager, next'">
					<el-table-column type="selection" width="50"></el-table-column>
					<el-table-column label="名称" prop="name"></el-table-column>
					<el-table-column label="键值" prop="content"></el-table-column>
					<el-table-column label="是否有效" prop="status">
						<template #default="scope">
							<el-tag v-if="scope.row.status===1" type="success">启用</el-tag>
							<el-tag v-if="scope.row.status===0" type="danger">停用</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" align="right" width="120">
						<template #default="scope">
							<el-button-group>
								<el-button text type="primary" size="small"
										   @click="table_edit(scope.row, scope.$index)">编辑
								</el-button>
								<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
									<template #reference>
										<el-button text type="primary" size="small">删除</el-button>
									</template>
								</el-popconfirm>
							</el-button-group>
						</template>
					</el-table-column>
				</scTable>
			</el-main>
		</el-container>
	</el-container>
	<dic-dialog v-if="dialog.dic" ref="dicDialog" @success="handleDicSuccess" @closed="dialog.dic=false"></dic-dialog>
	<list-dialog v-if="dialog.list" ref="listDialog" @success="handleListSuccess"
				 @closed="dialog.list=false"></list-dialog>
</template>

<script>
import dicDialog from './dic'
import listDialog from './list'

export default {
	name: 'commonDict',
	components: {
		dicDialog,
		listDialog
	},
	data() {
		return {
			dialog: {
				dic: false,
				info: false
			},
			showDicloading: true,
			dicList: [],
			dicFilterText: '',
			dicProps: {
				label: 'typeName'
			},
			listApi: null,
			listApiParams: {},
			selection: []
		}
	},
	watch: {
		dicFilterText(val) {
			this.$refs.dic.filter(val);
		}
	},
	mounted() {
		this.getDic()
	},
	methods: {
		setFirstNode() {
			//获取第一个节点,设置选中 & 加载明细列表
			var firstNode = this.dicList[0];
			if (firstNode) {
				this.$nextTick(() => {
					this.$refs.dic.setCurrentKey(firstNode.typeId)
				})
				this.listApiParams = {
					typeId: firstNode.typeId
				}
				this.listApi = this.$API.common.dict_data.list;
			}
		},
		//加载树数据
		async getDic() {
			var res = await this.$API.common.dict_type.list();
			this.showDicloading = false;
			this.dicList = this.$TOOL.makeTreeData(res.data, 0, "typeId");
			this.setFirstNode()
		},
		//树过滤
		dicFilterNode(value, data) {
			if (!value) return true;
			var targetText = data.typeName + data.flag;
			return targetText.indexOf(value) !== -1;
		},
		//树增加
		addDic() {
			this.dialog.dic = true
			this.$nextTick(() => {
				this.$refs.dicDialog.open()
			})
		},
		//编辑树
		dicEdit(data) {
			this.dialog.dic = true
			this.$nextTick(() => {
				var editNode = this.$refs.dic.getNode(data.typeId);
				var editNodeParentId = editNode.level == 1 ? undefined : editNode.parent.data.typeId
				data.parentId = editNodeParentId
				this.$refs.dicDialog.open('edit').setData(data)
			})
		},
		//树点击事件
		dicClick(data) {
			this.$refs.table.reload({
				typeId: data.typeId
			})
		},
		//删除树
		async dicDel(node, data) {
			this.$confirm(`确定删除 ${data.typeName} 项吗？`, '提示', {
				type: 'warning'
			}).then(async () => {
				this.showDicloading = true;
				const res = await this.$API.common.dict_type.del({ids: data.typeId});
				//删除节点是否为高亮当前 是的话 设置第一个节点高亮
				var dicCurrentKey = this.$refs.dic.getCurrentKey();
				this.$refs.dic.remove(data.typeId)
				if (dicCurrentKey === data.typeId) {
					this.setFirstNode()
				}
				this.showDicloading = false;
				this.$message.success(res.msg)
			}).catch(() => {
			})
		},
		//添加明细
		addInfo() {
			this.dialog.list = true
			this.$nextTick(() => {
				var dicCurrentKey = this.$refs.dic.getCurrentKey();
				this.$refs.listDialog.open().setData({typeId: dicCurrentKey})
			})
		},
		//编辑明细
		table_edit(row) {
			this.dialog.list = true
			this.$nextTick(() => {
				this.$refs.listDialog.open('edit').setData(row)
			})
		},
		//删除明细
		async table_del(row, index) {
			var res = await this.$API.common.dict_data.del({ids: row.dataId});
			this.$refs.table.tableData.splice(index, 1);
			this.$message.success(res.msg)
		},
		//批量删除
		async batch_del() {
			this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
				type: 'warning'
			}).then(async() => {
				const loading = this.$loading();
				const res = await this.$API.system.account.del({ids: this.selection.map(item => item.dataId).toString()});
				this.selection.forEach(item => {
					this.$refs.table.tableData.forEach((itemI, indexI) => {
						if (item.dataId === itemI.dataId) {
							this.$refs.table.tableData.splice(indexI, 1)
						}
					})
				})
				loading.close();
				this.$message.success(res.msg)
			}).catch(() => {

			})
		},
		//表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection;
		},
		//本地更新数据
		handleDicSuccess(data, mode) {
			if (mode == 'add') {
				data.id = new Date().getTime()
				if (this.dicList.length > 0) {
					this.$refs.table.upData({
						typeId: data.typeId
					})
				} else {
					this.listApiParams = {
						typeId: data.typeId
					}
					this.listApi = this.$API.dic.info;
				}
				this.$refs.dic.append(data, data.parentId[0])
				this.$refs.dic.setCurrentKey(data.typeId)
			} else if (mode == 'edit') {
				var editNode = this.$refs.dic.getNode(data.typeId);
				Object.assign(editNode.data, data)
			}
		},
		//本地更新数据
		handleListSuccess() {
			this.$refs.table.reload({typeId: this.$refs.dic.getCurrentKey()})
		}
	}
}
</script>

<style scoped>
.menu:deep(.el-tree-node__label) {
	display: flex;
	flex: 1;
	height: 100%;
}

.custom-tree-node {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 24px;
	height: 100%;
}

.custom-tree-node .code {
	font-size: 12px;
	color: #999;
}

.custom-tree-node .do {
	display: none;
}

.custom-tree-node:hover .code {
	display: none;
}

.custom-tree-node:hover .do {
	display: inline-block;
}
</style>
