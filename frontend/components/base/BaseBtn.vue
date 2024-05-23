<script setup lang="ts">
const props = defineProps({
	to: {
		type: String,
		default: undefined,
	},
	href: {
		type: String,
		default: undefined,
	},
	target: {
		type: String,
		default: "_blank",
	},
	color: {
		type: String,
		default: "bg-primary text-white",
	},
	disabled: {
		type: Boolean,
		default: undefined,
	},
	text: {
		type: Boolean,
		default: false,
	}
});

const emit = defineEmits(["click"]);

const getClass = computed(() => {
	const classes = [];

	// disability
	if (props.disabled) {
		classes.push("disabled");
		classes.push("cursor-not-allowed");
	} 
  
	// add color
	classes.push(props.color);

	// add some padding
	classes.push("py-1 px-2");

	// add rounded corners
	classes.push("rounded");

	return classes.join(" ");
});
</script>

<template>
  <nuxt-link
    v-if="props.to"
    :class="getClass"
    :to="props.disabled ? undefined : props.to"
    @click="emit('click')"
  >
    <slot />
  </nuxt-link>

  <nuxt-link
    v-else-if="props.href"
    :class="getClass"
    :disabled="props.disabled"
    :href="props.href"
    :target="props.target"
    @click="emit('click')"
  >
    <slot />
  </nuxt-link>

  <button
    v-else
    :class="getClass"
    :disabled="props.disabled"
    :href="props.to"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
