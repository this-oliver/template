<script setup lang="ts">
import { useProductStore } from '~/stores/shop';
import type { Product } from '~/types';
import type { ActionItem } from '~/components/base/BaseCard.vue';

const props = defineProps({
	product: {
		type: Object as PropType<Product>,
		required: true
	},
	admin: {
		type: Boolean,
		default: false
	}
});

const productStore = useProductStore();

const quantity = computed<string>(() => {
	return props.product.quantity > 0 
		? `Only ${props.product.quantity} left!`
		: 'Out of stock';
});

const options = computed<ActionItem[]>(() => {
	return props.admin
		? [
			{
				label: 'Edit',
				color: 'warning',
				to: `/products/${props.product.slug}/edit`
			},
			{
				label: 'Delete',
				color: 'error',
				action: () => productStore.deleteProduct(props.product._id)
			}
		]
		: [];
});

type Image = { src: string; alt: string };
const thumbnail = computed<Image>(() => {
	const seed = Math.floor(Math.random() * 1000);
	const randomImage = `https://picsum.photos/seed/${seed}/800/600`;
  
	return {
		src: props.product.images[0]?.url || randomImage,
		alt: props.product.images[0]?.alt || 'Product image'
	};
});
</script>

<template>
  <base-card :actions="options">
    <nuxt-link :to="`/products/${props.product.slug}`">
      <v-img
        :src="thumbnail.src"
        :alt="thumbnail.alt"
      />
    </nuxt-link>
    
    <v-card-title>
      {{ props.product.name }}
      <small :class="props.product.quantity === 0 ? 'text-error' : 'text-primary'">{{ quantity }}</small>
    </v-card-title>
    <v-card-subtitle>
      {{ props.product.price }}
    </v-card-subtitle>
    <v-card-text>
      {{ props.product.description }}
    </v-card-text>
  </base-card>
</template>
