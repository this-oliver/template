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
    temporary
    location="right"
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
        :title="item.product.name"
        :subtitle="`${item.quantity} x ${item.product.price} ${productStore.currency}`"
      />
    </v-list>

    <template #append>
      <h3 class="ma-1">
        Total: {{ orderStore.totalCartCost }} {{ productStore.currency }}
      </h3>
    </template>
  </v-navigation-drawer>
</template>