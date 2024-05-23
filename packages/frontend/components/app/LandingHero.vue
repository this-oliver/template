<script setup lang="ts">
import { useShopStore } from "~/stores/shop";

const shopStore = useShopStore();

const title = computed<string>(() => {
	return shopStore.getShopName;
});

const description = computed<string>(() => {
	return shopStore.getShopDescription;
});
</script>

<template>
  <div class="flex flex-col gap-5 justify-center align-middle">
    <h1 class="text-6xl text-center font-bold">
      {{ title }}
    </h1>
    <h2 class="text-3xl text-center font-semibold">
      {{ description }}
    </h2>
  </div>
</template>

