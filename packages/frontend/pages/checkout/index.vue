<script setup lang="ts">
import { useOrderStore } from '~/stores/shop';
import type { Order } from '~/types';

const router = useRouter();
const orderStore = useOrderStore();

function processOrder(order: Order): void {
	// send user to external checkout page
	if(order.payment){
		window.open(order.payment.url, '_self');
	} else {
		router.push(`/orders/${order._id}`);
	}
}
</script>

<template>
  <base-page title="Checkout">
    <order-form
      :items="orderStore.cartItems"
      @created="processOrder"
    />
  </base-page>
</template>