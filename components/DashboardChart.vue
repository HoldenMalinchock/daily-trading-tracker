<template>
  <div class="chart-wrapper">
    <UCard class="flex flex-col p-4">
      <template #header>
        <div class="flex text-lg font-semibold">
          Your Account
        </div>
      </template>
      <div class="flex text-lg font-semibold mb-4 justify-between">
        <div class="flex space-x-2">
          <div>$ {{ portfolioHistory?.base_value }}</div>
          <div class="text-sm pt-1 text-green-500">
            +{{ accountPerformance?.change }}%
          </div>
        </div>
        <div class="flex space-x-2">
          <USelect
            v-model="timeframe"
            :options="timeframes"
            size="md"
          />
          <UButton
            icon="i-heroicons-arrow-path"
            size="md"
            color="primary"
            variant="solid"
            :loading="status === 'pending'"
            @click="refresh()"
          />
        </div>
      </div>
      <ag-charts

        :options="options"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { AgCharts } from "ag-charts-vue3"
import type { AgChartOptions } from "ag-charts-community"
import type { PortfolioHistoryType } from "~/utils/types/Alpaca"

const timeframes = ["1M", "7D", "14D", "21D"]

const timeframe = ref(timeframes[0])

const { data: accountPerformance } = await useFetch("/api/allTimePercent")

const { data: portfolioHistory, refresh, status } = await useFetch<PortfolioHistoryType>("/api/getAccountHistory", {
  query: { period: timeframe },
})

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

// Using computed value so chart is reactive to Period changes
const options = computed<AgChartOptions>(() => ({
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
  series: [{ type: "line", xKey: "date", yKey: "equity", stroke: "#00C16A", marker: { fill: "#00C16A", stroke: "#00C16A" } }],
}))
</script>
