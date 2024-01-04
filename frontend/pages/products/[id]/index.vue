<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useProductStore } from '~/stores/shop';
import type { Product } from '~/types';

const route = useRoute();
const authStore = useAuthStore();
const productStore = useProductStore();

const product = ref<Product>();

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
  
    <h1>{{ product.name }}</h1>
    <h2>{{ product.price }}</h2>
    <p>{{ product.description }}</p>
  </base-page>
  
  <base-page v-else>
    <h1>Fetching product...</h1>
  </base-page>
</template>