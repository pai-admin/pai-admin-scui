<template>
	<el-dialog :title="message.title" v-model="visible" :width="800" destroy-on-close @closed="$emit('closed')" :close-on-click-modal="false">
		<div v-html="message.body"></div>
		<template #footer>
			<el-button @click="visible=false">关 闭</el-button>
		</template>
	</el-dialog>
</template>

<script>
import { defineAsyncComponent } from 'vue';
const scEditor = defineAsyncComponent(() => import('@/components/scEditor/index.vue'));

	export default {
		emits: ['success', 'closed'],
		components: {
			scEditor
		},
		data() {
			return {
				visible: false,
				message: {
					title: '',
					body: ''
				}
			}
		},
		methods: {
			//显示
			open(){
				this.visible = true;
				return this
			},
			//表单注入数据
			async setData(data) {
				console.log(data)
				// const res = await this.$API.home.message.get({accept_id: data.accept_id})
				// this.message = res.data
			}
		}
	}
</script>

<style>
</style>
