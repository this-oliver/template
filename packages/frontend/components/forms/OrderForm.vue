<script setup lang="ts">
import { useOrderStore, useProductStore } from '~/stores/shop';
import type { Order, OrderItem, ActionItem } from '~/types';

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

const form = reactive<Omit<Order, '_id' | 'payment'>>({
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
			color: 'bg-success',
			action: async () => {
				try {
					// create url that will be used to redirect the user after payment
					const returnUrl: string = window.location.origin + '/checkout/session';

					// create order
					const order: Order = await orderStore.createOrder(form, returnUrl);
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
  <base-form :actions="options">
    <input-text
      v-model="form.customer.email"
      label="Customer Email"
      :valid="validEmail"
    />

    <div class="p-2">
      <order-items-card
        :items="form.items"
        :currency="form.currency"
      />
    </div>
  </base-form>
</template>