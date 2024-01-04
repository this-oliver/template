<script setup lang="ts">
import { useProductStore } from '~/stores/shop';
import type { Product } from '~/types';

definePageMeta({ middleware: ['auth'] });

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();

const product = ref<Product>();

onMounted(async () => {
	const id = route.params.id as string;
	product.value = await productStore.getProduct(id);
});
</script>

<template>
  <base-page>
    <product-form
      v-if="product"
      :product="product"
      @updated="router.push('/products')"
    />
  </base-page>
</template>