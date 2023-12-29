<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import { useShopStore } from './stores/shop';

const title = ref<string>('Nuxt Template');
const description = ref<string>('A Nuxt template for quickly starting a new project');

const { notify } = useNotification();

useSeoMeta({
	title,
	ogTitle: title,
	description,
	ogDescription: description
});

onMounted(async () => {
	try {
		useAuthStore().init();
		await useShopStore().init();
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
