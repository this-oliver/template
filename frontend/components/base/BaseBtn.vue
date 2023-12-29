<script setup lang="ts">

import type { PropType } from 'vue';

type ButtonSize = 'small' | 'medium' | 'large'

const props = defineProps({
	color: {
		type: String,
		default: undefined
	},
	block: { 
		type: Boolean, 
		default: undefined 
	},
	size: {
		type: String as PropType<ButtonSize>,
		default: undefined
	},
	flat: { 
		type: Boolean, 
		default: undefined 
	},
	outlined: { 
		type: Boolean, 
		default: undefined 
	},
	text: { 
		type: Boolean, 
		default: undefined 
	},
	plain: { 
		type: Boolean, 
		default: undefined 
	},
	tonal: { 
		type: Boolean, 
		default: undefined 
	},
	rounded: { 
		type: String, 
		default: undefined 
	},
	to: { 
		type: String, 
		default: undefined 
	},
	disabled: { 
		type: Boolean, 
		default: undefined 
	},
	hideFromTab: { 
		type: Boolean, 
		default: undefined 
	}
});

const emit = defineEmits([ 'click' ]);

type ButtonStyle = 'outlined' | 'tonal' | 'plain' | 'text' | 'flat'
const getButtonStyle = computed<ButtonStyle | undefined>(() => {
	if (props.outlined === true) {
		return 'outlined';
	} else if (props.text === true) {
		return 'text';
	} else if (props.plain === true) {
		return 'plain';
	} else if (props.tonal === true) {
		return 'tonal';
	} else {
		return 'flat';
	}
});

function handleClick() {
	// emit click event
	emit('click');
}
</script>

<template>
  <v-btn
    :variant="getButtonStyle"
    :color="props.color"
    :size="props.size"
    :block="props.block"
    :rounded="props.rounded"
    :disabled="props.disabled"
    :to="props.to"
    class="pa-2"
    @click="handleClick()"
  >
    <slot />
  </v-btn>
</template>
