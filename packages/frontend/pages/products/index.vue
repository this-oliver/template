<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useProductStore } from "~/stores/shop";

const authStore = useAuthStore();
const productStore = useProductStore();
const { notify } = useNotification();

onMounted(async () => {
	try {
		await productStore.init();
	} catch (error) {
		notify("Product", (error as Error).message, "error");
	}
});
</script>

<template>
  <base-page>
    <base-btn
      v-if="authStore.isAuthenticated"
      class="mb-2 w-fit"
      to="/products/create"
    >
      Create Product
    </base-btn>

    <div class="flex flex-col md:grid md:grid-cols-2 gap-5 md:gap-2">
      <product-card
        v-for="product in productStore.products"
        :key="product._id"
        :product="product"
        :admin="authStore.isAuthenticated"
      />
    </div>
  </base-page>
</template>
