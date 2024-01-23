<script setup lang="ts">
import { useProductStore, useOrderStore } from '~/stores/shop';

const productStore = useProductStore();
const orderStore = useOrderStore();

</script>

<template>
  <v-navigation-drawer
    v-model="orderStore.showCart"
    class="pa-2"
    temporary
    location="right"
    width="400"
  >
    <template #prepend>
      <h1 class="ma-1">
        Cart
      </h1>
    </template>

    <order-items-card
      :items="orderStore.cartItems"
      :currency="productStore.currency"
    />
  
    <template #append>
      <base-btn
        class="ma-1"
        color="success"
        size="large"
        block
        to="/orders/checkout"
      >
        Checkout
      </base-btn>
    </template>
  </v-navigation-drawer>
</template>