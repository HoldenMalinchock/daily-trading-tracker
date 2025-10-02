<template>
  <div class="flex justify-center">
    <UCard>
      <UTable
        :rows="activities"
        :columns="columns"
        caption=""
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { data: activities } = await useFetch("/api/getAccountActivities", {
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
