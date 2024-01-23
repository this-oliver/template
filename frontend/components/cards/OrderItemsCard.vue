<script setup lang="ts">
import type { OrderItem, Product, Image } from '~/types';

const props = defineProps({
	items: {
		type: Array as PropType<OrderItem[]>,
		required: true
	},
	currency: {
		type: String,
		required: true
	}
});

const orderTotal = computed<number>(() => {
	return props.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
});

function getThumbnail(product: Product): Image {
	return product.images.length > 0
		? product.images[0]
		: { src: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/600`, alt: 'Random image for testing purposes' };
}
</script>

<template>
  <base-card>
    <v-list density="compact">
      <v-list-item
        v-for="item in props.items"
        :key="item.product._id"
        :prepend-avatar="getThumbnail(item.product).src"
      >
        <div class="list-item-layout">
          <div>{{ item.product.name }}</div>
          <div>{{ `${item.quantity} x ${item.product.price} ${props.currency}` }}</div>
        </div>
      </v-list-item>

      <v-divider class="mt-2" />

      <v-list-item class="mt-2">
        <div class="list-item-layout">
          <div>Total</div>
          <div style="font-weight: bold;">
            {{ orderTotal }} {{ props.currency }}
          </div>
        </div>
      </v-list-item>
    </v-list>
  </base-card>
</template>

<style scoped>
.list-item-layout {
  display: flex; /* Ensures flexbox is used */
  justify-content: space-between; /* Aligns children at each end */
}
</style>