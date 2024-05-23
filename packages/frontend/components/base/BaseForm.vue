<script setup lang="ts">
import type { ActionItem } from '~/types';

const props = defineProps({
	title: {
		type: String,
		default: undefined,
	},
	subtitle: {
		type: String,
		default: undefined,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	actions: {
		type: Array as PropType<ActionItem[]>,
		default: () => [],
	},
});

const getActions = computed<ActionItem[]>(() => {
	return props.actions.map((item: ActionItem) => {
		return {
			...item,
			action: () => {
				if (item.action) {
					item.action();
				}
			},
		};
	});
});
</script>

<template>
  <div class="pa-2 flex flex-col">
    <slot
      id="form-header"
      name="header"
    >
      <h3
        v-if="props.title"
        class="text-lg font-bold"
      >
        {{ props.title }}
      </h3>
      <h4 v-if="props.subtitle">
        {{ props.subtitle }}
      </h4>
    </slot>

    <slot id="form-main" />

    <slot
      id="form-action"
      name="action"
    >
      <div class="flex justify-end gap-2">
        <base-btn
          v-for="item in getActions"
          :key="item.label"
          class="mt-2"
          :color="item.color"
          :loading="props.loading"
          :disabled="item.disabled"
          :to="item.to"
          @click="item.action"
        >
          {{ item.label }}
        </base-btn>
      </div>
    </slot>
  </div>
</template>
