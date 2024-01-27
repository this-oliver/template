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

type statusOption = {value: OrderStatus, color: string};
const statusOptions = computed<statusOption[]>(() => {
	return [
		{ value: 'pending', color: 'warning' },
		{ value: 'shipped', color: 'info' },
		{ value: 'completed', color: 'success' },
		{ value: 'cancelled', color: 'error' }
	];
});

function isStatusAvailable(status: OrderStatus) {
	if(props.order.status === 'pending') {
		return status === 'shipped' || status === 'cancelled';
	} else if(props.order.status === 'shipped') {
		return status === 'completed';
	} else {
		return false;
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
        :color="statusOptions.find(option => option.value === props.order.status)?.color || 'grey'"
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
      >
        Update Status

        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="option in statusOptions"
              :key="option.value"
              :color="!isStatusAvailable(option.value) ? 'grey lighten-2' : option.color"
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
