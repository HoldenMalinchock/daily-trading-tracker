<template>
  <div class="chart-wrapper">
    <UCard class="flex flex-col p-4">
      <template #header>
        <div class="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Portfolio Value
        </div>
      </template>

      <div
        v-if="error"
        class="flex items-center justify-center py-8 text-red-400"
      >
        Failed to load portfolio data. Please try again.
      </div>

      <template v-else>
        <div class="flex items-start justify-between mb-6">
          <div class="flex flex-col gap-1">
            <div class="text-3xl font-bold tracking-tight">
              {{ formattedEquity }}
            </div>
            <div class="flex items-center gap-3 text-sm">
              <span
                :class="changeColor"
                class="font-medium"
              >
                {{ changeDisplay }} all-time
              </span>
              <span
                :class="periodPnlColor"
                class="font-medium"
              >
                {{ formattedPeriodPnl }} this period
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
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

        <ag-charts :options="options" />
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { AgCharts } from "ag-charts-vue3"
import type {
  AgChartOptions,
  AgAreaSeriesTooltipRendererParams,
  AgAxisLabelFormatterParams,
  AgCrosshairLabelRendererParams,
} from "ag-charts-community"
import type { PortfolioHistoryType } from "~/utils/types/Alpaca"

const timeframes = ["1M", "7D", "14D", "21D"]
const timeframe = ref(timeframes[0])

const { data: accountPerformance } = await useFetch("/api/allTimePercent")

const { data: portfolioHistory, refresh, status, error } = await useFetch<PortfolioHistoryType>("/api/getAccountHistory", {
  query: { period: timeframe },
})

// ── Data normalization ────────────────────────────────────────────────────────

type ChartDatum = { date: Date, equity: number }

const chartData = computed(() =>
  portfolioHistory.value?.timestamp.map((timestamp, index) => ({
    date: new Date(parseInt(timestamp) * 1000),
    equity: Math.round(portfolioHistory.value!.equity[index]),
  })) ?? [],
)

// ── Derived stats ─────────────────────────────────────────────────────────────

const currentEquity = computed<number>(() => {
  const arr = portfolioHistory.value?.equity
  return arr && arr.length > 0 ? arr[arr.length - 1] : 0
})

const formattedEquity = computed(() =>
  currentEquity.value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
)

const changeValue = computed(() => parseFloat(accountPerformance.value?.change ?? "0"))
const isPositive = computed(() => changeValue.value >= 0)
const changeDisplay = computed(() => `${isPositive.value ? "+" : ""}${changeValue.value.toFixed(2)}%`)
const changeColor = computed(() => isPositive.value ? "text-green-500" : "text-red-500")

const periodPnl = computed<number>(() => {
  const base = portfolioHistory.value?.base_value ?? 0
  return currentEquity.value - base
})

const formattedPeriodPnl = computed(() => {
  const val = periodPnl.value
  const formatted = Math.abs(val).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
  return val >= 0 ? `+${formatted}` : `-${formatted}`
})

const periodPnlColor = computed(() => periodPnl.value >= 0 ? "text-green-500" : "text-red-500")

const chartColor = computed(() =>
  currentEquity.value >= (portfolioHistory.value?.base_value ?? 0) ? "#00C16A" : "#ef4444",
)

// ── Axis step ─────────────────────────────────────────────────────────────────

const axisStep = computed((): number => {
  const steps: Record<string, number> = { "7D": 1, "14D": 2, "21D": 3, "1M": 5 }
  return steps[timeframe.value] ?? 5
})

// ── ag-charts options ─────────────────────────────────────────────────────────

const options = computed<AgChartOptions>(() => ({
  data: chartData.value,
  theme: "ag-default-dark",
  background: { visible: false },
  padding: { top: 20, right: 40, bottom: 20, left: 20 },
  axes: [
    {
      type: "time",
      position: "bottom",
      nice: false,
      interval: { step: { unit: "day", step: axisStep.value } },
      label: {
        autoRotate: true,
        formatter: ({ value }: AgAxisLabelFormatterParams) =>
          (value as Date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      },
      crosshair: {
        enabled: true,
        stroke: "#6b7280",
        strokeWidth: 1,
        lineDash: [4, 4],
        label: {
          enabled: true,
          renderer: ({ value }: AgCrosshairLabelRendererParams) => ({
            text: (value as Date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            backgroundColor: "#374151",
            color: "#f9fafb",
          }),
        },
      },
    },
  ],
  series: [
    {
      type: "area",
      xKey: "date",
      yKey: "equity",
      stroke: chartColor.value,
      fill: chartColor.value,
      fillOpacity: 0.15,
      strokeWidth: 2,
      marker: { enabled: false },
      tooltip: {
        renderer: ({ datum }: AgAreaSeriesTooltipRendererParams<ChartDatum>) => ({
          title: datum.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          data: [
            {
              label: "Portfolio Value",
              value: datum.equity.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
            },
          ],
        }),
      },
    },
  ],
}))
</script>
