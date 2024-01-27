<script setup lang="ts">
import { useOrderStore } from '~/stores/shop';
import type { Order, OrderStatus } from '~/types';

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

type statusOption = {value: OrderStatus};
const statusOptions = computed<statusOption[]>(() => {
	return [
		{ value: 'shipped' },
		{ value: 'completed' },
		{ value: 'cancelled' }
	];
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
		return 'warning';
	case 'paid':
		return 'success';
	case 'shipped':
		return 'info';
	case 'completed':
		return 'primary';
	case 'cancelled':
		return 'error';
	default:
		return 'grey';
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
  <base-card>
    <v-card-title class="container">
      <div>{{ props.order.customer.email }}</div>
      <v-chip
        size="small"
        :color="getStatusColor(props.order.status)"
      >
        {{ props.order.status }}
      </v-chip>
    </v-card-title>
    <v-card-subtitle>
      {{ total }}
    </v-card-subtitle>

    <v-card-text v-if="expand">
      <order-items-card
        class="mt-2"
        :items="props.order.items"
        :currency="props.order.currency"
      />
    </v-card-text>

    <v-card-actions>
      <base-btn
        class="mx-1"
        outlined
        size="small"
        @click="expand = !expand"
      >
        Toggle Details
      </base-btn>

      <v-spacer />

      <base-btn
        v-if="paymentPending"
        class="mx-1"
        color="success"
        size="small"
        :href="props.order.payment?.url"
      >
        Pay Now
      </base-btn>
      
      <base-btn
        v-if="props.admin"
        class="mx-1"
        color="secondary"
        size="small"
        :disabled="isOrderComplete(props.order.status)"
      >
        Update Status

        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="option in statusOptions"
              :key="option.value"
              :color="!isStatusAvailable(option.value) ? 'grey lighten-2' : getStatusColor(option.value)"
              :disabled="!isStatusAvailable(option.value) || loading"
              active
              @click="updateStatus(option.value)"
            >
              <v-list-item-title>
                <!-- strike through if status is current -->
                <span v-if="isStatusAvailable(option.value)">
                  {{ option.value }}
                </span>
                <span v-else>
                  <s>{{ option.value }}</s>
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </base-btn>
    </v-card-actions>
  </base-card>
</template>

<style scoped>
.container {
  /* add space between divs */
  display: flex;
  justify-content: space-between;
}
</style>
