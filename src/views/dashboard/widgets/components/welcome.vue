<template>
	<el-card shadow="hover">
		<div class="welcome">
			<div class="part1">
				<div class="avatar">
					<el-avatar :size="64" :src="account.avatar">{{ account.userNameF }}</el-avatar>
				</div>
				<div class="name">
					<h1>欢迎 {{ account.username}}，有朋自远方来，不亦乐乎。</h1>
					<p style="font-size: 13px;">高性能/精致/优雅。基于Vue3 + Element-Plus 的中后台前端解决方案，如果喜欢就点个星星支持一下。</p>
				</div>
			</div>
			<div class="part2">
				<el-button type="primary" @click="goDoc" icon="el-icon-check">文档</el-button>
			</div>
		</div>
	</el-card>
</template>

<script>
export default {
	title: "欢迎模块",
	icon: "el-icon-setting",
	description: "基础信息展示",
	data() {
		return {
			account: {
				usernameF: ""
			}
		}
	},
	mounted() {
		this.account = this.$TOOL.data.get("USER_INFO")
		this.account.usernameF = this.account.username.substring(0,1)
	},
	methods: {
		goDoc() {
			window.open("https://github.com/pai-admin/pai-admin-scui")
		}
	}
}
</script>

<style lang="scss" scoped>
.welcome {
	height: 64px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.part1 {
		display: flex;
		align-items: center;
		.name {
			margin-left: 20px;
			line-height: 30px;
		}
	}

}
</style>
