<script setup lang="ts">
import { useOrderStore } from "~/stores/shop";

const props = defineProps({
	compact: {
		type: Boolean,
		default: false,
	},
});

const orderStore = useOrderStore();
const cartItemCount = computed<string>(() =>
	orderStore.totalCartItems > 0 ? `(${orderStore.totalCartItems})` : ""
);
</script>

<template>
  <base-btn @click="orderStore.showCart = !orderStore.showCart">
    <span v-if="props.compact">
      <span class="i-mdi-cart" />
      {{ cartItemCount }}
    </span>
    <span v-else> Cart {{ cartItemCount }} </span>
  </base-btn>
</template>
