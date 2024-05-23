<script setup lang="ts">
import { useShopStore } from "~/stores/shop";

const shopStore = useShopStore();

const getStyle = computed<string>(() => {
	return "text-2xl font-semibold";
});
</script>

<template>
  <span>
    <h1
      v-if="shopStore.shop"
      :class="getStyle"
    >{{ shopStore.getShopName }}</h1>
    <h1
      v-else
      :class="getStyle"
    >Nuxt Template</h1>
  </span>
</template>
