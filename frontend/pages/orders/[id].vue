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
    <div
      v-if="order"
      class="flex flex-col gap-4"
    >
      <base-card
        :title="order.customer.email"
        :subtitle="`Order: ${order._id}`"
      />

      <order-items-card
        :items="order.items"
        :currency="order.currency"
      />
    </div>
  </base-page>
</template>