<script setup lang="ts">
import type { OrderItem, Product, Image, Currency } from '~/types';

const props = defineProps({
	items: {
		type: Array as PropType<OrderItem[]>,
		required: true
	},
	currency: {
		type: String as PropType<Currency>,
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
    <div class="flex flex-col gap-2">
      <div
        v-for="item in props.items"
        :key="item.product._id"
        class="flex justify-between"
      >
        <base-image
          :src="getThumbnail(item.product).src"
          :alt="getThumbnail(item.product).alt"
          width="100px"
          height="auto"
        />

        <div>{{ item.product.name }}</div>
        <div>{{ `${item.quantity} x ${item.product.price} ${props.currency}` }}</div>
      </div>

      <div class="flex justify-end gap-2">
        <div>Total</div>
        <div class="font-semibold">
          {{ orderTotal }} {{ props.currency }}
        </div>
      </div>
    </div>
  </base-card>
</template>