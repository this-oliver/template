<script setup lang="ts">
import { useOrderStore } from '~/stores/shop';
import type { Order, OrderStatus, DropDownItem } from '~/types';

const props = defineProps({
	order: {
		type: Object as PropType<Order>,
		required: true
	},
	admin: {
		type: Boolean,
		default: false
	}
});

const orderStore = useOrderStore();
const { notify } = useNotification();

const expand = ref(false);
const loading = ref(false);

const total = computed<string>(() => {
	const total = props.order.items.reduce((acc, item) => acc + item.product.price, 0);
	return `${total.toFixed(2)} ${props.order.currency || 'n/a'}`;
});

const paymentPending = computed<boolean>(() => {
	return props.order.status === 'pending' && props.order.payment?.url !== undefined;
});

const statusOptions = computed<DropDownItem[]>(() => {
	const options: OrderStatus[] = ["shipped", "completed", "cancelled"];

	return options.map(option => {
		return {
			label: option,
			color: getStatusColor(option),
			disabled: !isStatusAvailable(option),
			action: () => updateStatus(option)
		} as DropDownItem;
	});
});

function isStatusAvailable(status: OrderStatus) {
	if(props.order.status === 'pending') {
		return status === 'cancelled';
	} else if(props.order.status === 'paid') {
		return status === 'shipped';
	} else if(props.order.status === 'shipped') {
		return status === 'completed';
	} else {
		return false;
	}
}

function isOrderComplete(status: OrderStatus): boolean {
	return status === 'completed' || status === 'cancelled' || status === 'failed';
}

function getStatusColor(status: OrderStatus) {
	switch(status) {
	case 'pending':
		return 'bg-warning';
	case 'paid':
		return 'bg-success';
	case 'shipped':
		return 'bg-blue-400';
	case 'completed':
		return 'bg-success';
	case 'cancelled':
		return 'bg-error';
	default:
		return 'bg-slate-600';
	}
}

async function updateStatus(status: OrderStatus) {
	try {
		loading.value = true;
		await orderStore.updateOrder(props.order._id, { ...props.order, status });
		loading.value = false;
    
		notify('Order Status Updated', `Order status updated to ${status}`, 'success');
	} catch (error) {
		notify('Order Status Error', (error as Error).message, 'error');
	}
}

</script>

<template>
  <base-card class="p-2 outline outline-1">
    <template #header>
      <div class="flex flex-col">
        <div class="flex justify-between">
          <h3 class="text-lg font-semibold">
            {{ props.order.customer.email }}
          </h3>
          <span :class="`p-1 text-sm text-center rounded ${getStatusColor(props.order.status)}`">{{ props.order.status }}</span>
        </div>

        <div class="flex justify-between">
          <h4>ID {{ props.order._id }}</h4>
          <h4>{{ total }}</h4>
        </div>
      </div>
    </template>

    <order-items-card
      v-if="expand"
      class="mt-2"
      :items="props.order.items"
      :currency="props.order.currency"
    />

    <template #action>
      <div class="flex gap-2">
        <base-btn
          class="text-sm"
          color="bg-slate-200"
          @click="expand = !expand"
        >
          Details
        </base-btn>

        <base-dropdown
          v-if="props.admin"
          :disabled="isOrderComplete(props.order.status)"
          :items="statusOptions"
        >
          Update Status
        </base-dropdown>

        <base-btn
          v-if="paymentPending"
          class="text-sm"
          color="bg-success"
          :href="props.order.payment?.url"
        >
          Pay Now
        </base-btn>
      </div>
    </template>
  </base-card>
</template>
