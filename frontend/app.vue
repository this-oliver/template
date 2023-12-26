<script setup lang="ts">
import { useAuthStore } from './stores/auth';

const title = ref<string>('Nuxt Template');
const description = ref<string>('A Nuxt template for quickly starting a new project');

useSeoMeta({
	title,
	ogTitle: title,
	description,
	ogDescription: description
});

onMounted(() => {
	useAuthStore().init();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
