<script setup lang="ts">
import { useProductStore, useOrderStore } from '~/stores/shop';
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
const orderStore = useOrderStore();

const cartCount = computed<number>(()=> {
	const index = orderStore.cart.findIndex((item) => item.product._id === props.product._id);

	if(index < 0){
		return 0;
	} else {
		return orderStore.cart[index].quantity;
	}
});

const quantity = computed<string>(() => {
	return props.product.quantity > 0 
		? `Only ${props.product.quantity} left!`
		: 'Out of stock';
});

const options = computed<ActionItem[]>(() => {
	const adminOptions: ActionItem[] = [
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
	];

	return props.admin
		? [...adminOptions]
		: [];
});

type Image = { src: string; alt: string };
const thumbnail = computed<Image>(() => {
	const seed = Math.floor(Math.random() * 1000);
	const randomImage = `https://picsum.photos/seed/${seed}/800/600`;
  
	return {
		src: props.product.images[0]?.src || randomImage,
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
        height="300px"
        width="100%"
        cover
      />
    </nuxt-link>
    
    <v-card-title>
      {{ props.product.name }}
      <small :class="props.product.quantity === 0 ? 'text-error' : 'text-primary'">{{ quantity }}</small>
    </v-card-title>
    <v-card-subtitle>
      {{ props.product.price }} <small>{{ productStore.currency }}</small>
    </v-card-subtitle>
    
    <!--<v-card-text v-if="cartCount > 0">
      ({{ cartCount }})
    </v-card-text>-->

    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <v-input class="mt-1">
          <p
            class="text-center text-grey"
            style="width: 100%;"
          >
            {{ cartCount }}
          </p>
          
          <template #append>
            <base-btn
              color="success"
              size="small"
              :disabled="props.product.quantity === 0"
              @click="orderStore.addToCart(props.product)"
            >
              <v-icon icon="mdi-plus" />
            </base-btn>
          </template>
          <template #prepend>
            <base-btn
              color="error"
              size="small"
              :disabled="cartCount === 0"
              @click="orderStore.removeFromCart(props.product)"
            >
              <v-icon icon="mdi-minus" />
            </base-btn>
          </template>
        </v-input>
      </v-col>
    </v-row>
  </base-card>
</template>
