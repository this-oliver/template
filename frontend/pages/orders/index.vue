<script setup lang="ts">
import { useOrderStore } from '~/stores/shop';
import type { Order } from '~/types';

definePageMeta({ middleware: ['auth'] });

const orderStore = useOrderStore();
const { notify } = useNotification();

const orders = ref<Order[]>([]);

onMounted(async () => {
	try {
		orders.value = await orderStore.indexOrders();
	} catch (error) {
		notify('Orders Error', (error as Error).message, 'error');
	}
});
</script>

<template>
  <base-page title="Orders">
    <v-row justify="center">
      <v-col
        v-for="order in orders"
        :key="order._id"
        cols="12"
        md="8"
      >
        <order-card
          :order="order"
          :admin="true"
        />
      </v-col>
    </v-row>
  </base-page>
</template>
