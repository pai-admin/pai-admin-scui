<template>
	<el-container class="page-user">
		<el-aside style="width: 240px;">
			<el-container>
				<el-header style="height: auto;display: block;">
					<div class="user-info-top">
						<el-avatar :size="70" :src="account.avatar">{{account.usernameF}}</el-avatar>
						<h2>{{ account.userName }}</h2>
						<p><el-tag effect="dark" round size="large" disable-transitions>{{ account.deptName }}</el-tag></p>
					</div>
				</el-header>
				<el-main class="nopadding">
					<el-menu class="menu" :default-active="page">
						<el-menu-item-group v-for="group in menu" :key="group.groupName" :title="group.groupName">
							<el-menu-item v-for="item in group.list" :key="item.component" :index="item.component" @click="openPage">
								<el-icon v-if="item.icon"><component :is="item.icon"/></el-icon>
								<template #title>
									<span>{{item.title}}</span>
								</template>
							</el-menu-item>
						</el-menu-item-group>
					</el-menu>
				</el-main>
			</el-container>
		</el-aside>
		<el-main>
			<Suspense>
				<template #default>
					<component :is="page"/>
				</template>
				<template #fallback>
					<el-skeleton :rows="3" />
				</template>
			</Suspense>
		</el-main>
	</el-container>
</template>

<script>
	import { defineAsyncComponent } from 'vue'

	export default {
		name: 'homeCenter',
		components: {
			account: defineAsyncComponent(() => import('./components/account.vue')),
			seting: defineAsyncComponent(() => import('./components/seting.vue')),
			password: defineAsyncComponent(() => import('./components/password.vue')),
			logs: defineAsyncComponent(() => import('./components/logs.vue')),
		},
		data() {
			return {
				menu: [
					{
						groupName: "基本设置",
						list: [
							{
								icon: "el-icon-postcard",
								title: "账号信息",
								component: "account"
							},
							{
								icon: "el-icon-operation",
								title: "个人设置",
								component: "seting"
							},
							{
								icon: "el-icon-lock",
								title: "密码",
								component: "password"
							}
						]
					},
					{
						groupName: "数据管理",
						list: [
							{
								icon: "el-icon-clock",
								title: "操作日志",
								component: "logs"
							}
						]
					}
				],
				account: {
					avatar: "",
					username: "",
					usernameF: "",
					deptName: ""
				},
				page: "account"
			}
		},
		//路由跳转进来 判断from是否有特殊标识做特殊处理
		beforeRouteEnter (to, from, next){
			next((vm)=>{
				if(from.is){
					//删除特殊标识，防止标签刷新重复执行
					delete from.is
					//执行特殊方法
					vm.$alert('路由跳转过来后含有特殊标识，做特殊处理', '提示', {
						type: 'success',
						center: true
					}).then(() => {}).catch(() => {})
				}
			})
		},
		mounted() {
			this.account = this.$TOOL.data.get("USER_INFO")
			this.account.usernameF = this.account.username.substring(0,1);
		},
		methods: {
			openPage(item){
				this.page = item.index
			}
		}
	}
</script>
