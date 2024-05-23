<script setup lang="ts">
import { useProductStore, useOrderStore } from "~/stores/shop";
import type { Product, ActionItem } from "~/types";

const props = defineProps({
	product: {
		type: Object as PropType<Product>,
		required: true,
	},
	admin: {
		type: Boolean,
		default: false,
	},
});

const productStore = useProductStore();
const orderStore = useOrderStore();

const cartCount = computed<number>(() => {
	const index = orderStore.cartItems.findIndex(
		(item) => item.product._id === props.product._id
	);

	if (index < 0) {
		return 0;
	} else {
		return orderStore.cartItems[index].quantity;
	}
});

const quantity = computed<string>(() => {
	return props.product.quantity > 0
		? `Only ${props.product.quantity} left!`
		: "Out of stock";
});

const options = computed<ActionItem[]>(() => {
	const adminOptions: ActionItem[] = [
		{
			label: "Edit",
			color: "bg-warning",
			to: `/products/${props.product.slug}/edit`,
		},
		{
			label: "Delete",
			color: "bg-error",
			action: () => productStore.deleteProduct(props.product._id),
		},
	];

	return props.admin ? [...adminOptions] : [];
});

type Image = { src: string; alt: string };
const thumbnail = computed<Image>(() => {
	const seed = Math.floor(Math.random() * 1000);
	const randomImage = `https://picsum.photos/seed/${seed}/800/600`;

	return {
		src: props.product.images[0]?.src || randomImage,
		alt: props.product.images[0]?.alt || "Product image",
	};
});
</script>

<template>
  <base-card
    :actions="options"
    class="flex-col gap-2"
  >
    <nuxt-link :to="`/products/${props.product.slug}`">
      <base-image
        :src="thumbnail.src"
        :alt="thumbnail.alt"
        height="300px"
        width="100%"
      />
    </nuxt-link>

    <h3 class="text-lg font-semibold">
      {{ props.product.name }}
      <small
        :class="props.product.quantity === 0 ? 'text-error' : 'text-current'"
      >{{ quantity }}</small>
    </h3>
    <h4>
      {{ props.product.price }} <small>{{ productStore.currency }}</small>
    </h4>

    <div class="flex">
      <base-btn
        class="text-sm basis-1/4"
        color="bg-warning"
        :disabled="cartCount === 0"
        @click="orderStore.removeFromCart(props.product)"
      >
        <span class="i-mdi-minus" />
      </base-btn>

      <p
        class="text-center"
        style="width: 100%"
      >
        {{ cartCount }}
      </p>

      <base-btn
        class="text-sm basis-1/4"
        color="bg-success"
        :disabled="props.product.quantity === 0"
        @click="orderStore.addToCart(props.product)"
      >
        <span class="i-mdi-plus" />
      </base-btn>
    </div>
  </base-card>
</template>
