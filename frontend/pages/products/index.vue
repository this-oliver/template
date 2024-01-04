<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useProductStore } from '~/stores/shop';

const authStore = useAuthStore();
const productStore = useProductStore();

onMounted(() => {
	productStore.init();
});

</script>

<template>
  <base-page>
    <base-btn
      v-if="authStore.isAuthenticated"
      class="mb-2"
      color="primary"
      to="/products/create"
    >
      Create Product
    </base-btn>
    
    <v-row>
      <v-col
        v-for="product in productStore.products"
        :key="product._id"
        cols="12"
        md="6"
      >
        <product-card
          :product="product"
          :admin="authStore.isAuthenticated"
        />
      </v-col>
    </v-row>
  </base-page>
</template>