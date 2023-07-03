<template>
	<el-card shadow="never">
		<scEcharts height="300px" :option="option"></scEcharts>
	</el-card>
</template>

<script>
import * as echarts from 'echarts';
import scEcharts from '@/components/scEcharts';

export default {
	title: "趋势分析",
	icon: "el-icon-setting",
	description: "渐变堆叠面积图趋势分析",
	components: {
		scEcharts
	},
	data() {
		return {
			option: {
				color: ['#80FFA5', '#00DDFF', 'rgb(255, 0, 135)'],
				title: {
					text: '交易趋势'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				legend: {
					data: ['支付宝', '微信', '云闪付']
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '微信',
						type: 'line',
						stack: 'Total',
						smooth: true,
						lineStyle: {
							width: 0
						},
						showSymbol: false,
						areaStyle: {
							opacity: 0.8,
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgb(128, 255, 165)'
								},
								{
									offset: 1,
									color: 'rgb(1, 191, 236)'
								}
							])
						},
						emphasis: {
							focus: 'series'
						},
						data: [180000, 175000, 220000, 135000, 198000, 248000, 179000]
					},
					{
						name: '支付宝',
						type: 'line',
						stack: 'Total',
						smooth: true,
						lineStyle: {
							width: 0
						},
						showSymbol: false,
						areaStyle: {
							opacity: 0.8,
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgb(0, 221, 255)'
								},
								{
									offset: 1,
									color: 'rgb(77, 119, 255)'
								}
							])
						},
						emphasis: {
							focus: 'series'
						},
						data: [120000, 135000, 115000, 210000, 220000, 170000, 160000]
					},
					{
						name: '云闪付',
						type: 'line',
						stack: 'Total',
						smooth: true,
						lineStyle: {
							width: 0
						},
						showSymbol: false,
						areaStyle: {
							opacity: 0.8,
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgb(255, 0, 135)'
								},
								{
									offset: 1,
									color: 'rgb(135, 0, 157)'
								}
							])
						},
						emphasis: {
							focus: 'series'
						},
						data: [12000, 19000, 19000, 17000, 16000, 19500, 18000]
					}
				]
			}
		}
	}
}
</script>

<style scoped>

</style>
