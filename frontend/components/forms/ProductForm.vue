<script setup lang="ts">
import { useProductStore } from '~/stores/shop';
import type { Product, NewImage, ActionItem } from '~/types';

const props = defineProps({
	product: {
		type: Object as PropType<Product>,
		default: undefined
	}
});

const emit = defineEmits(['created', 'updated', 'deleted']);

const productStore = useProductStore();
const { notify } = useNotification();

// product form without _id, shop and slug fields
const form = reactive<Omit<Product, '_id' | 'shop' | 'slug'>>({
	name: props.product?.name || '',
	description: props.product?.description || '',
	price: props.product?.price || 0,
	quantity: props.product?.quantity || 0,
	images: props.product?.images || []
});

// uploaded images
const newImages = ref<NewImage[]>([]);

// convert files to images
function convertFilesToImages(files: File[]): NewImage[] {
	return files.map((file) => ({ src: URL.createObjectURL(file), alt: file.name, file }));
}

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
				color: validForm.value ? 'bg-success' : undefined,
				action: async () => {
					try {
						const product: Product = await productStore.updateProduct(props.product!._id, form, newImages.value);
						emit('updated', product);
					} catch (error) {
						notify('Product Error', (error as Error).message, 'error');
					}
				}
			},
			{
				label: 'Delete',
				color: 'bg-error',
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
				color: validForm.value ? 'bg-success' : undefined,
				action: async () => {
					try {
						const product: Product = await productStore.createProduct(form, newImages.value);
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
  <base-form :actions="options">
    <div class="flex flex-col md:grid md:grid-cols-2 md:gap-2">
      <input-text
        v-model="form.name"
        label="Name"
      />

      <input-text
        v-model="form.description"
        label="Description"
      />
    
      <input-text
        v-model="form.price"
        label="Price"
      />
    
      <input-text
        v-model="form.quantity"
        label="Quantity"
      />

      <div class="md:col-span-2 flex flex-col gap-2">
        <input-text
          label="Images"
          type="file"
          :multiple="true"
          @input="(files: File[]) => newImages = convertFilesToImages(files)"
        />

        <product-image-card
          v-for="image in newImages"
          :key="image.src"
          :src="image.src"
          :alt="image.alt"
          @delete="form.images.splice(form.images.indexOf(image), 1)"
        />

        <product-image-card
          v-for="image in form.images"
          :key="image.src"
          :src="image.src"
          :alt="image.alt"
          @delete="form.images.splice(form.images.indexOf(image), 1)"
        />
      </div>
    </div>
  </base-form>
</template>
