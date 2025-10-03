<template>
  <div class="flex justify-center">
    <UCard class="max-h-full overflow-y-auto">
      <template #header>
        <div class="flex text-lg font-semibold">
          Recent Trades
        </div>
        <UTable
          :rows="activities ?? []"
          :columns="columns"
          class="max-h-full overflow-y-auto p-4"
        />
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { AccountActivityType } from "~/utils/types/Alpaca"

const { data: activities } = await useFetch<AccountActivityType[]>("/api/getAccountActivities", {
  transform: (activities) => {
    return activities.filter(activity => activity.activity_type !== "FEE")
  },
})
const columns = [
  { key: "symbol", label: "Symbol" },
  { key: "type", label: "Type" },
  { key: "qty", label: "Quantity" },
  { key: "side", label: "Side" },
]
</script>
