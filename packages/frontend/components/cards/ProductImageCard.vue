<script setup lang="ts">
const props = defineProps({
	src: {
		type: String,
		required: true
	},
	alt: {
		type: String,
		default: ''
	},
});

const emit = defineEmits(['update', 'delete']);

const form = reactive<{ src: string; alt: string }>({
	src: props.src,
	alt: props.alt
});

const showAltForm = ref<boolean>(false);

const options = computed<{label: string, icon: string, color: string, action: () => void}[]>(() => {
	const update = showAltForm.value 
		? { label: 'Update', icon: 'i-mdi-check', color: 'bg-success', action: () => { emit('update', form); showAltForm.value = false; } }
		: { label: 'Update', icon: 'i-mdi-pencil-outline', color: 'bg-warning', action: () => showAltForm.value = true };
  
	return [
		update,
		{
			label: 'Delete',
			icon: 'mdi-trash-can-outline',
			color: 'error',
			action: () => emit('delete')
		}
	];
});
</script>

<template>
  <base-card>
    <base-image
      :src="form.src"
      :alt="form.alt"
      aspect-ratio="1"
      cover
    />
  
    <input-text
      v-model="form.alt"
      class="mt-2"
      label="Alt text"
      placeholder="Image description"
      :disabled="!showAltForm"
    />
  
    <base-btn
      v-for="option in options"
      :key="option.label"
      class="mx-1"
      :color="option.color"
      @click="option.action"
    >
      <span :class="`${option.icon}`" />
    </base-btn>
  </base-card>
</template>