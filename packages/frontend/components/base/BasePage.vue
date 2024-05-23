<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		default: undefined,
	},
});
</script>

<template>
  <div class="flex flex-col py-10 px-5">
    <div v-if="props.title">
      <h1 class="text-2xl font-bold">
        {{ props.title }}
      </h1>
    </div>

    <div class="flex flex-col">
      <slot />
    </div>
  </div>
</template>
