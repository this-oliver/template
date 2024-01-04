<script setup lang="ts">
import { useProductStore } from '~/stores/shop';
import type { Product } from '~/types';
import type { ActionItem } from '~/components/base/BaseCard.vue';

const props = defineProps({
	product: {
		type: Object as PropType<Product>,
		default: undefined
	}
});

const emit = defineEmits(['created', 'updated', 'deleted']);

const productStore = useProductStore();
const { notify } = useNotification();

// omit _id, shop and slug
type ProductForm = Omit<Product, '_id' | 'shop' | 'slug'>;

const form = reactive<ProductForm>({
	name: props.product?.name || '',
	description: props.product?.description || '',
	price: props.product?.price || 0,
	quantity: props.product?.quantity || 0,
	images: props.product?.images || []
});

const validForm = computed<boolean>(() => {
	return (
		form.name?.length > 0 &&
    form.price >= 0 &&
    form.quantity >= 0
	);
});

const options = computed<ActionItem[]>(() => {

	return props.product
		? [
			{
				label: 'Update',
				disabled: !validForm.value,
				color: validForm.value ? 'success' : undefined,
				action: async () => {
					try {
						const product: Product = await productStore.updateProduct(props.product!._id, form);
						emit('updated', product);
					} catch (error) {
						notify('Product Error', (error as Error).message, 'error');
					}
				}
			},
			{
				label: 'Delete',
				color: 'error',
				action: async () => {
					try {
						const product: Product = await productStore.deleteProduct(props.product!._id);
						emit('deleted', product);
					} catch (error) {
						notify('Product Error', (error as Error).message, 'error');
					}
				}
			}
		]
		: [
			{
				label: 'Create',
				disabled: !validForm.value,
				color: validForm.value ? 'success' : undefined,
				action: async () => {
					try {
						const product: Product = await productStore.createProduct(form);
						emit('created', product);
					} catch (error) {
						notify('Product Error', (error as Error).message, 'error');
					}
				}
			}
		];
});


</script>

<template>
  <base-card :actions="options">
    <v-row>
      <v-col cols="12">
        <input-text
          v-model="form.name"
          label="Name"
        />
      </v-col>
      <v-col cols="12">
        <input-text
          v-model="form.description"
          label="Description"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <input-text
          v-model="form.price"
          label="Price"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <input-text
          v-model="form.quantity"
          label="Quantity"
        />
      </v-col>
    </v-row>
  </base-card>
</template>
