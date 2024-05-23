<script setup lang="ts">
const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	visible: {
		type: Boolean,
		default: false,
	},
});

const show = ref(false);

const emits = defineEmits(["close"]);

watch(
	() => props.visible,
	(value) => {
		show.value = value;

		if (value === false) {
			emits("close");
		}
	}
);

watch(show, (value) => {
	if (value === false) {
		emits("close");
	}
});

onMounted(() => {
	show.value = props.visible;
});
</script>

<template>
  <div class="drawer">
    <input
      :id="props.id"
      type="checkbox"
      class="drawer-toggle"
      v-model="show"
    >
    <div class="drawer-side">
      <label
        :for="props.id"
        aria-label="close sidebar"
        class="drawer-overlay"
      />

      <div class="w-full h-full flex flex-col bg-background">
        <base-btn
          class="max-w-20 text-4xl font-semibold"
          @click="show = false"
          color="bg-transparent"
        >
          <span class="i-mdi-close" />
        </base-btn>

        <div class="pa-2">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
