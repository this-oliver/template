<script setup lang="ts">
import { useOrderStore, useProductStore } from '~/stores/shop';
import type { Order, OrderItem } from '~/types';
import type { ActionItem } from '~/components/base/BaseCard.vue';

const props = defineProps({
	items: {
		type: Array as PropType<OrderItem[]>,
		required: true
	}
});

const emit = defineEmits(['created', 'updated']);

const orderStore = useOrderStore();
const productStore = useProductStore();
const { notify } = useNotification();

const form = reactive<Omit<Order, '_id'>>({
	status: 'pending',
	currency: productStore.currency,
	customer: { email: '' },
	items: props.items,
});

const validEmail = computed<boolean>(() => {
	const regx = /[a-zA-Z0-9-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]+/;
	return regx.test(form.customer.email);
});

const validForm = computed<boolean>(() => {
	return (
		form.customer.email.length > 0 &&
    validEmail.value &&
    form.items.length > 0
	);
});

const options = computed<ActionItem[]>(() => {
	return [
		{
			label: 'Create',
			disabled: !validForm.value,
			color: 'success',
			action: async () => {
				try {
					const order: Order = await orderStore.createOrder(form);
					emit('created', order);
				} catch (error) {
					notify('Order Error', (error as Error).message, 'error');
				}
			}
		}
	];
});

</script>

<template>
  <base-card :actions="options">
    <input-text
      v-model="form.customer.email"
      label="Customer Email"
      :is-valid="validEmail"
    />

    <order-items-card
      :items="form.items"
      :currency="form.currency"
    />
  </base-card>
</template>