<template>
	<el-card shadow="never">
		<scEcharts height="300px" :option="option"></scEcharts>
	</el-card>
</template>

<script>
import scEcharts from '@/components/scEcharts';

export default {
	title: "分布统计",
	icon: "el-icon-setting",
	description: "环形图分布统计",
	components: {
		scEcharts
	},
	data() {
		return {
			option: {
				tooltip: {
					trigger: 'item'
				},
				title: {
					text: '交易占比'
				},
				series: [
					{
						name: '交易占比',
						type: 'pie',
						radius: ['40%', '70%'],
						avoidLabelOverlap: false,
						labelLine: {
							show: true
						},
						data: [
							{ value: 1048, name: '微信' },
							{ value: 735, name: '支付宝' },
							{ value: 580, name: '云闪付' }
						]
					}
				]
			}
		}
	}
}
</script>

<style scoped>

</style>
