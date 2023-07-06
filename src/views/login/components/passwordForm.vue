<template>
	<el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large">
		<el-form-item prop="username">
			<el-input v-model="form.username" prefix-icon="el-icon-user" clearable :placeholder="$t('login.userPlaceholder')"></el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input v-model="form.password" prefix-icon="el-icon-lock" clearable show-password :placeholder="$t('login.PWPlaceholder')"></el-input>
		</el-form-item>
		<el-form-item prop="verifyCode">
			<el-input v-model="form.verifyCode" prefix-icon="el-icon-iphone" clearable :placeholder="$t('login.codePlaceholder')">
				<template #append>
					<el-image :src="verImage" @click="getCode" style="padding: 1px;"/>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item style="margin-bottom: 10px;">
			<el-col :span="12">
				<el-checkbox :label="$t('login.rememberMe')" v-model="form.autologin"></el-checkbox>
			</el-col>
			<el-col :span="12" class="login-forgot">
				<router-link to="/reset_password">{{ $t('login.forgetPassword') }}？</router-link>
			</el-col>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" style="width: 100%;" :loading="islogin" round @click="login">{{ $t('login.signIn') }}</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
export default {
	data() {
		return {
			form: {
				username: "",
				password: "",
				verifyCode: "",
				verifyId: "",
				autologin: false
			},
			verImage: '',
			rules: {
				username: [
					{required: true, message: this.$t('login.userError'), trigger: 'blur'}
				],
				password: [
					{required: true, message: this.$t('login.PWError'), trigger: 'blur'}
				],
				verifyCode: [
					{required: true, message: this.$t('login.codeError'), trigger: 'blur'}
				]
			},
			islogin: false,
		}
	},
	mounted() {
		this.getCode()
		this.rememberMe()
	},
	methods: {
		rememberMe() {
			const data = this.$TOOL.data.get("ACCOUNT")
			if (data) {
				this.form.username = data.username
				this.form.password = data.password
				this.form.autologin = true
			}
		},
		async getCode() {
			const res = await this.$API.auth.verify();
			this.form.verifyId = res.data.verifyId
			this.verImage = res.data.base64Content
			this.form.verifyCode = "";
		},
		async login(){
			// 校验登录
			const validate = await this.$refs.loginForm.validate().catch(() => {});
			if(!validate){ return false }

			this.islogin = true
			const data = {
				username: this.form.username,
				password: this.$TOOL.crypto.MD5(this.form.password),
				verifyId: this.form.verifyId,
				verifyCode: this.form.verifyCode
			};
			// 登录接口
			const [res, err] = await this.$TOOL.go(this.$API.auth.token(data))
			this.islogin = false
			if (err) {
				await this.getCode();
				return false;
			}
			this.$TOOL.data.set("TOKEN", res.data.token)
			// 记住密码
			if (this.form.autologin) {
				this.$TOOL.data.set("ACCOUNT", {
					username: this.form.username,
					password: this.form.password
				})
			}
			// 获取账号信息
			await this.getInfo()
			// 获取菜单信息
			await this.getMenu()
		},
		async getInfo() {
			const [res, err] = await this.$TOOL.go(this.$API.auth.getAccountInfo())
			if (err) {
				return false
			}
			this.$TOOL.data.set("USER_INFO", res.data)
		},
		async getMenu() {
			const [res, err] = await this.$TOOL.go(this.$API.auth.getMenuInfo())
			if (err) {
				return false
			}
			if(res.data.menus.length===0){
				this.islogin = false
				this.$alert("当前用户无任何菜单权限，请联系系统管理员", "无权限访问", {
					type: 'error',
					center: true
				})
				return false
			}
			this.$TOOL.data.set("MENU", this.makeMenu(res.data.menus, 0))
			this.$TOOL.data.set("PERMISSIONS", res.data.buttons)
			this.$TOOL.data.set("ROLE", res.data.roles)
			// 登录成功跳转首页
			this.$router.replace({
				path: '/'
			})
			this.$message.success("Login Success 登录成功")
		},
		makeMenu(menus, parentId = 0) {
			const arr = [];
			for (let item of menus) {
				if(item.parentId === parentId){
					// 数据格式处理
					const tmp = {
						name: item['name'],
						path: '/' + item['path'],
						component: item['path'],
						meta: {
							'title': item['title'],
							'icon': item['icon'],
							'hidden': item['hidden'],
							'type': 'menu'
						}
					};
					const children = this.makeMenu(menus, item.menuId);
					if (children.length > 0) {
						tmp['children'] = children
					}
					arr.push(tmp)
				}
			}
			return arr
		}
	}
}
</script>

<style scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
	padding: 0;
}
</style>
