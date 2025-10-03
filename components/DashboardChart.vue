<template>
  <div class="chart-wrapper">
    <UCard class="flex flex-col p-4">
      <ag-charts
        :options="options"
        class="rounded-lg"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { AgCharts } from "ag-charts-vue3"
import type { PortfolioHistoryType } from "~/utils/types/Alpaca"

const { data: portfolioHistory } = await useFetch<PortfolioHistoryType>("/api/getAccountHistory")

const TableData = computed(() => {
  return portfolioHistory.value
    ? portfolioHistory.value.timestamp.map((timestamp, index) => {
      return {
        date: new Date(parseInt(timestamp) * 1000), // Convert to milliseconds
        equity: portfolioHistory.value ? Math.round(portfolioHistory.value.equity[index]) : 0,
      }
    })
    : []
})
const options = ref({
  // Data: Data to be displayed in the chart
  data: TableData.value,
  theme: "ag-default-dark",
  axes: [
    {
      type: "time",
      nice: false,
      position: "bottom",
      interval: {
        step: { unit: "day", step: 10 },
      },
      label: {
        autoRotate: true,
      },
    },
  ],
  padding: {
    top: 20,
    right: 40,
    bottom: 20,
    left: 20,
  },
  // Series: Defines which chart type and data to use
  series: [{ type: "line", xKey: "date", yKey: "equity" }],
})
</script>
