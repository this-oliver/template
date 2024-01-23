<script setup lang="ts">
import { useOrderStore } from '~/stores/shop';
import type { Order } from '~/types';

const orderStore = useOrderStore();
const route = useRoute();

const order = ref<Order>();

onMounted(async () => {
	const id: string = route.params.id as string;

	if (id) {
		order.value = await orderStore.getOrder(id);
	}
});
</script>

<template>
  <base-page title="Order">
    <v-row v-if="order">
      <v-col
        cols="12"
        md="5"
      >
        <base-card
          :title="order.customer.email"
          :subtitle="`Order: ${order._id}`"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <order-items-card
          :items="order.items"
          :currency="order.currency"
        />
      </v-col>
    </v-row>
  </base-page>
</template>