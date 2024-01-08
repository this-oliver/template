<script setup lang="ts">
import { useOrderStore } from '~/stores/shop';

const orderStore = useOrderStore();
const cartItemCount = computed<string>(() => orderStore.totalCartItems > 0 ? `(${orderStore.totalCartItems})` : '');

</script>

<template>
  <base-btn @click="orderStore.showCart = !orderStore.showCart">
    Cart {{ cartItemCount }}
  </base-btn>
</template>