<script setup lang="ts">

const props = defineProps({
	value: {
		type: String,
		default: ''
	},
	label: {
		type: String,
		default: undefined
	},
	placeHolder: {
		type: String,
		default: undefined
	},
	type: {
		type: String,
		default: 'text',
		validator: (value: string) => {
			return ['text', 'password'].includes(value);
		}
	},
	outlined: {
		type: Boolean,
		default: true
	},
	isValid: {
		type: Boolean || null,
		default: null
	},
	color: {
		type: String,
		default: undefined
	},
	disabled: {
		type: Boolean,
		default: false
	}
});

const emits = defineEmits(['input']);

const data = reactive({
	input: null as unknown as string,
	showDateMenu: false,
	showPassword: false
});

function setData (value: string) {
	data.input = value;
}

watch(
	() => data.input,
	(newInput) => {
		emits('input', newInput);
	}
);

watch(
	() => props.value,
	(newValue) => {
		setData(newValue);
	}
);
</script>

<template>
  <v-text-field
    v-if="type === 'password'"
    v-model="data.input"
    :label="label"
    :color="color"
    :placeholder="placeHolder"
    :type="data.showPassword ? 'text' : 'password'"
    :outlined="outlined"
    :disabled="disabled"
    :success="isValid === true"
    :error="isValid === false"
  >
    <template #append-inner>
      <base-btn
        size="small"
        color="grey"
        :hide-from-tab="true"
        @click="data.showPassword = !data.showPassword"
      >
        {{ data.showPassword ? 'hide' : 'show' }}
      </base-btn>
    </template>
  </v-text-field>

  <v-text-field
    v-else
    v-model="data.input"
    :label="label"
    :color="color"
    :placeholder="placeHolder"
    :type="type"
    :outlined="outlined"
    :disabled="disabled"
    :success="isValid === true"
    :error="isValid === false"
  />
</template>
