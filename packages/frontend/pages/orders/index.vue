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
    <div class="flex flex-col gap-2">
      <order-card
        v-for="order in orders"
        :key="order._id"
        :order="order"
        :admin="true"
      />
    </div>
  </base-page>
</template>
