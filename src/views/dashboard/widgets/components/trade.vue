<template>
	<el-card shadow="never">
		<scEcharts height="400px" :option="option"></scEcharts>
	</el-card>
</template>

<script>
import scEcharts from '@/components/scEcharts';

export default {
	title: "交易统计",
	icon: "el-icon-setting",
	description: "折线统计",
	components: {
		scEcharts
	},
	data() {
		return {
			option: {
				title: {
					text: '交易统计'
				},
				tooltip: {
					trigger: 'axis'
				},
				grid: {
					top: '15%',
					left: '3%',
					right: '4%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
						'16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
				},
				yAxis: {
					type: 'value'
				},
				series: [
					{
						name: '交易金额',
						type: 'line',
						stack: 'Total',
						data: [240000, 235000, 320000, 280000, 230000, 295000, 360000, 280000, 330000, 310000, 260000,
							280000, 315000, 300000, 345000, 360000, 355000, 320000, 365000, 391000, 402000, 380000,
							410000, 395000, 420000,385000, 378000, 440000, 430000, 420000]
					}
				]
			}
		}
	}
}
</script>

<style scoped>

</style>
