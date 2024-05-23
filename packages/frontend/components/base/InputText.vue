<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
	modelValue: {
		type: String as PropType<string | number | File | File[]>,
		default: "",
	},
	label: {
		type: String,
		default: undefined,
	},
	placeHolder: {
		type: String,
		default: undefined,
	},
	type: {
		type: String,
		default: "text",
		validator: (value: string) => {
			return [
				"text",
				"password",
				"number",
				"date",
				"time",
				"file",
				"checkbox",
			].includes(value);
		},
	},
	multiple: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	valid: {
		type: Object as PropType<boolean | undefined>,
		default: undefined,
	},
});

const emits = defineEmits(["update:modelValue", "input"]);

const data = reactive({
	input: props.modelValue,
	showDateMenu: false,
	showPassword: false,
});

const files = ref<File[]>([]);

const getInputStyle = computed<string>(() => {
	const items = ["input", "input-bordered"];

	if(props.disabled){
		items.push("cursor-not-allowed");
	}

	return items.join(" ");
});

const getValidationStyle = computed<string>(() => {
	if (props.valid === undefined) {
		return "";
	}

	return props.valid ? "text-success i-mdi-check-circle" : "text-error i-mdi-alert-circle";
});

const getFileSize = computed<number>(() => {
	if (files.value.length === 0) {
		return 0;
	}

	return files.value.reduce((acc, file) => acc + file.size, 0);
});

function setData(value: string | number | File | File[]) {
	if (Array.isArray(value)) {
		files.value = value;
	} else if (value instanceof File) {
		files.value = [value];
	} else {
		data.input = value;
	}
}

function handleFiles(e: Event) {
	const target = e.target as HTMLInputElement;
	if (target.files) {
		files.value = Array.from(target.files);
	}
}

watch(
	() => data.input,
	(newInput) => {
		emits("update:modelValue", newInput);
		emits("input", newInput);
	},
	{ deep: true }
);

watch(
	() => props.modelValue,
	(newValue) => {
		setData(newValue);
	}
);

watch(files, (files) => {
	if (files.length > 0) {
		if (props.multiple) {
			emits("update:modelValue", files);
			emits("input", files);
		} else {
			emits("update:modelValue", files.slice(0, 1));
			emits("input", files.slice(0, 1));
		}
	}
});
</script>

<template>
  <label class="form-control">
    <div
      v-if="props.label"
      id="label"
      class="label"
    >
      <span class="label-text">{{ props.label }}</span>
    </div>

    <div
      id="input"
      class="flex gap-2 place-items-center"
    >
      <div
        v-if="type === 'password'"
        :class="`${getInputStyle} flex gap-2 w-full`"
      >
        <input
          v-model="data.input"
          :type="data.showPassword ? 'text' : 'password'"
          :placeholder="placeHolder"
          :disabled="props.disabled"
          class="w-full"
        >

        <span
          :class="`${data.showPassword ? 'i-mdi-eye-off' : 'i-mdi-eye'} text-lg self-center cursor-pointer`"
          @click="data.showPassword = !data.showPassword"
        />
      </div>

      <div
        v-else-if="type === 'file'"
        class="flex flex-col gap-2 w-full"
      >
        <div :class="`${getInputStyle} flex place-items-center`">
          <input
            class="w-full"
            type="file"
            :placeholder="placeHolder"
            :multiple="props.multiple"
            :disabled="props.disabled"
            @change="handleFiles"
          >
        </div>

        <p
          v-if="files.length > 0"
          class="text-sm"
        >
          <span>{{ files.length }} files selected</span>
          <span
            v-if="getFileSize > 0"
            class="ml-1"
          >
            ({{ getFileSize }} bytes)
          </span>
        </p>
      </div>

      <input
        v-else
        v-model="data.input"
        :class="`${getInputStyle} w-full`"
        :type="type"
        :placeholder="placeHolder"
        :disabled="props.disabled"
      >

      <div v-if="props.valid !== undefined">
        <span :class="`${ getValidationStyle } text-xl`" />
      </div>
    </div>

    
  </label>
</template>
