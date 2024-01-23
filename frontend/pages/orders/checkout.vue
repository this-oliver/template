<script setup lang="ts">
import { useOrderStore } from '~/stores/shop';

const router = useRouter();
const orderStore = useOrderStore();

</script>

<template>
  <base-page title="Checkout">
    <order-form
      :items="orderStore.cartItems"
      @created="order => router.push(`/orders/${order._id}`)"
    />
  </base-page>
</template>