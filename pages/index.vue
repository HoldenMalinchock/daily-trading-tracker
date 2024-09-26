<template>
    <div class="flex justify-center">
        Welcome to the home page where I will track my trading bot progress publicly.
        <div>
            {{ account }}
        </div>
    </div>
</template>

<script setup lang="ts">
const { data: account } = useFetch("/api/getAccount")
</script>