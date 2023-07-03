<template>
	<el-card shadow="never">
		<scEcharts height="300px" :option="option"></scEcharts>
	</el-card>
</template>

<script>
import scEcharts from '@/components/scEcharts';

export default {
	title: "排行统计",
	icon: "el-icon-setting",
	description: "堆叠条形图排行统计",
	components: {
		scEcharts
	},
	data() {
		return {
			option: {
				title: {
					text: '交易排行'
				},
				xAxis: {
					type: 'value'
				},
				yAxis: {
					type: 'category',
					data: ['班尼特', '凌人', '海森', '钟离', '万叶', '锅巴', '影']
				},
				series: [
					{
						name: 'Direct',
						type: 'bar',
						stack: 'total',
						label: {
							show: true
						},
						emphasis: {
							focus: 'series'
						},
						data: [3200, 3020, 3010, 3340, 3900, 3300, 3200]
					}
				]
			}
		}
	}
}
</script>

<style scoped>

</style>
