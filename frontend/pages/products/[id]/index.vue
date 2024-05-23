<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useProductStore, useOrderStore } from '~/stores/shop';
import type { Product, Image } from '~/types';

const route = useRoute();
const authStore = useAuthStore();
const orderStore = useOrderStore();
const productStore = useProductStore();

const product = ref<Product>();

const images = computed<Image[]>(() => {
	const getRandomImage = () => `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/600`;
	
	return product.value && product.value.images.length > 0
		? product.value.images
		: [
			{ src: getRandomImage(), alt: 'Random image for testing purposes' },
			{ src: getRandomImage(), alt: 'Random image for testing purposes' },
			{ src: getRandomImage(), alt: 'Random image for testing purposes' }
		];
});

const cartCount = computed<number>(() => {
	const index = orderStore.cartItems.findIndex(
		(item) => item.product._id === product.value?._id
	);

	if (index < 0) {
		return 0;
	} else {
		return orderStore.cartItems[index].quantity;
	}
});

onMounted(async () => {
	const id = route.params.id as string;
	product.value = await productStore.getProduct(id);
});
</script>

<template>
  <base-page v-if="product">
    <base-btn
      v-if="authStore.isAuthenticated "
      :to="`/products/${product.slug}`"
      class="mb-4"
      color="bg-warning"
    >
      Edit
    </base-btn>

    <div class="flex md:grid md:grid-cols-2 gap-2">
      <div class="flex flex-col">
        <h1 class="text-xl font-bold">
          {{ product.name }}
        </h1>
        <h2 class="text-lg">
          {{ product.price }} <small class="text-grey-darken-1">{{ productStore.currency }}</small>
        </h2>
        <p>{{ product.description }}</p>

        <div class="mt-2 flex">
          <base-btn
            class="text-sm"
            color="bg-warning"
            :disabled="cartCount === 0"
            @click="orderStore.removeFromCart(product)"
          >
            <span class="i-mdi-minus" />
          </base-btn>

          <p
            class="text-center basis-1/4"
            style="width: 100%"
          >
            {{ cartCount }}
          </p>

          <base-btn
            class="text-sm"
            color="bg-success"
            :disabled="product.quantity === 0"
            @click="orderStore.addToCart(product)"
          >
            <span class="i-mdi-plus" />
          </base-btn>
        </div>
      </div>

      <base-carousel :images="images" />
    </div>
  </base-page>
  
  <base-page v-else>
    <h1>Fetching product...</h1>
  </base-page>
</template>
