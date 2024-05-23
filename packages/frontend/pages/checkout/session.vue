<script setup lang="ts">
import { useOrderStore } from '~/stores/shop';
import type { Order } from '~/types';

const route = useRoute();
const orderStore = useOrderStore();

const order = ref<Order>();
const loading = ref<boolean>(false);

onMounted(async () => {
	const id = route.query.order as string | undefined;

	if (id) {
		try {
			loading.value = true;
			order.value = await orderStore.getOrder(id);
		} catch (error) {
			console.error(error);
		} finally {
			loading.value = false;
		}
	}
});

</script>

<template>
  <base-page title="Order">
    <order-card
      v-if="order"
      :order="order"
    />
  </base-page>
</template>