<script setup lang="ts">

const props = defineProps({
	value: {
		type: [File, Array] as PropType<File[]>,
		default: undefined
	},
	color: {
		type: String,
		default: 'primary'
	},
	disabled: {
		type: Boolean,
		default: false
	},
	label: {
		type: String,
		default: 'Upload'
	},
	multiple: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits([ 'input' ]);

const files = ref<File[]>(props.value || []);

watch(files, (newFiles) => {
	if (newFiles.length > 0) {
		if(props.multiple){
			emit('input', newFiles);
		}else{
			emit('input', newFiles[0]);
		}

		// remove files after emit
		files.value = [];
	}
});

</script>

<template>
  <v-file-input
    v-model="files"
    :label="props.label"
    :multiple="props.multiple"
    :show-size="true"
  />
</template>
