<template>
  <div class="chart-wrapper">
    <UCard class="flex flex-col p-4">
      <LineChart
        :data="TableData"
        :categories="categories"
        :height="900"
        :x-formatter="xFormatter"
        x-label="Month"
        y-label="Amount"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { LineChart } from "vue-chrts"
import type { PortfolioHistoryType } from "~/utils/types/Alpaca"

const { data: portfolioHistory } = await useFetch<PortfolioHistoryType>("/api/getAccountHistory")

const TableData = computed(() => {
  return portfolioHistory.value
    ? portfolioHistory.value.timestamp.map((timestamp, index) => {
      return {
        date: new Date(parseInt(timestamp) * 1000).toLocaleString(), // Convert to milliseconds
        equity: portfolioHistory.value ? Math.round(portfolioHistory.value.equity[index]) : 0,
      }
    })
    : []
})

const categories = {
  equity: {
    name: "Account Equity",
    color: "#00DC82",
  },
}

const xFormatter = i => TableData.value[i].date

// We need to make this component take data from the API and display it in the chart
// Ideally we inject the data and try to fetch it on a cron with a provide/inject pattern
</script>
