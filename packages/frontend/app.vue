<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import { useShopStore } from './stores/shop';

const title = ref<string>('Nuxt Template');
const description = ref<string>('A Nuxt template for quickly starting a new project');

const authStore = useAuthStore();
const shopStore = useShopStore();
const { notify } = useNotification();

useSeoMeta({
	title,
	ogTitle: title,
	description,
	ogDescription: description
});

onMounted(async () => {
	try {
		authStore.init();
		await shopStore.init();

		useSeoMeta({
			title: shopStore.shop?.name,
			ogTitle: shopStore.shop?.name,
			description: shopStore.shop?.description,
			ogDescription: shopStore.shop?.description
		});

	} catch (error) {
		notify('Setup Error', (error as Error).message, 'error');
	}
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
