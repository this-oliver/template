<script setup lang="ts">
import { useProductStore, useOrderStore } from '~/stores/shop';
import type { Product, Image } from '~/types';

const productStore = useProductStore();
const orderStore = useOrderStore();

function getThumbnail(product: Product): Image {
	return product.images.length > 0
		? product.images[0]
		: { src: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/600`, alt: 'Random image for testing purposes' };
}
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
  
    <v-list density="compact">
      <v-list-item
        v-for="item in orderStore.cart"
        :key="item.product._id"
        :prepend-avatar="getThumbnail(item.product).src"
      >
        <div class="list-item-layout">
          <div>{{ item.product.name }}</div>
          <div>{{ `${item.quantity} x ${item.product.price} ${productStore.currency}` }}</div>
        </div>
      </v-list-item>

      <v-divider class="mt-2" />

      <v-list-item class="mt-2">
        <div class="list-item-layout">
          <div>Total</div>
          <div style="font-weight: bold;">
            {{ orderStore.totalCartCost }} {{ productStore.currency }}
          </div>
        </div>
      </v-list-item>
    </v-list>

    <template #append>
      <base-btn
        class="ma-1"
        color="success"
        size="large"
        block
      >
        Checkout
      </base-btn>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.list-item-layout {
  display: flex; /* Ensures flexbox is used */
  justify-content: space-between; /* Aligns children at each end */
}
</style>