<script setup lang="ts">
import { useProductStore, useOrderStore } from "~/stores/shop";

const productStore = useProductStore();
const orderStore = useOrderStore();

onMounted(() => {
	if (process.client) {
		// close the cart sidebar when the checkout button is clicked
		document.getElementById("checkout-btn")?.addEventListener("click", () => {
			orderStore.showCart = false;
		});
	}
});
</script>

<template>
  <base-sidebar
    id="app-sidebar"
    :visible="orderStore.showCart"
    @close="orderStore.showCart = false"
  >
    <div class="flex flex-col">
      <h1 class="ma-1 text-2xl font-semibold">
        Cart
      </h1>

      <order-items-card
        :items="orderStore.cartItems"
        :currency="productStore.currency"
      />

      <base-btn
        id="checkout-btn"
        class="w-full ma-1 text-xl"
        color="bg-success"
        to="/checkout"
      >
        Checkout
      </base-btn>
    </div>
  </base-sidebar>
</template>
