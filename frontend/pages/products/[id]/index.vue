<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useProductStore } from '~/stores/shop';
import type { Product, Image } from '~/types';

const route = useRoute();
const authStore = useAuthStore();
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
    >
      Edit
    </base-btn>
  
    <v-row
      id="product-container"
      align="center"
    >
      <v-col
        cols="12"
        md="5"
      >
        <h1>{{ product.name }}</h1>
        <h2 class="text-grey-darken-2">
          {{ product.price }} <small class="text-grey-darken-1">{{ productStore.currency }}</small>
        </h2>
        <p>{{ product.description }}</p>
      </v-col>

      <v-col
        cols="12"
        md="7"
      >
        <v-carousel>
          <v-carousel-item
            v-for="image in images"
            :key="image.src"
            :src="image.src"
            :alt="image.alt"
            width="100%"
            cover
          />
        </v-carousel>
      </v-col>
    </v-row>
  </base-page>
  
  <base-page v-else>
    <h1>Fetching product...</h1>
  </base-page>
</template>

<style scoped>
#product-container {
  margin-top: 2rem;
}
</style>