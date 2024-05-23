<script setup lang="ts">
import { useShopStore } from '~/stores/shop';
import type { Shop, ActionItem } from '~/types';

const props = defineProps({
	shop: {
		type: Object as PropType<Shop>,
		default: undefined
	}
});

const emit = defineEmits(['created', 'updated']);

const shopStore = useShopStore();
const { notify } = useNotification();

const form = reactive<Partial<Shop>>({
	name: props.shop?.name || '',
	description: props.shop?.description || ''
});

const validForm = computed(() => {
	return form.name !== '' && form.description !== '';
});

const options = computed<ActionItem[]>(() => {
	return props.shop
		? [
			{
				label: 'Updated',
				disabled: !validForm.value,
				color: validForm.value ? 'bg-success' : undefined,
				action: async () => {
					try {
						const shop: Shop = await shopStore.updateShop(props.shop!._id, form);
						emit('updated', shop);
					} catch (error) {
						notify('Shop Error', (error as Error).message, 'error');
					}
				}
			}
		]
		: [
			{
				label: 'Create',
				disabled: !validForm.value,
				color: validForm.value ? 'bg-success' : undefined,
				action: async () => {
					try {
						const shop: Shop = await shopStore.createShop(form);
						emit('created', shop);
					} catch (error) {
						notify('Shop Error', (error as Error).message, 'error');
					}
				}
			}
		];
});
</script>

<template>
  <base-form
    title="Shop Form"
    :actions="options"
  >
    <input-text
      v-model="form.name"
      label="Name"
    />
    <input-text
      v-model="form.description"
      label="Description"
    />
  </base-form>
</template>