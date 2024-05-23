<script setup lang="ts">
import type { DropDownItem } from '~/types';

const props = defineProps({
	color: {
		type: String,
		default: undefined,
	},
	items: {
		type: Object as PropType<DropDownItem[]>,
		required: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	}
});

function isDisabled(value: boolean | undefined): boolean {
	if (value === undefined) {
		return false;
	}
	return value;
}

function runAction(item: DropDownItem): void {
	if (isDisabled(item.disabled) || !item.action) {
		return;
	}

	item.action();
}
</script>

<template>
  <div class="dropdown dropdown-end">
    <base-btn
      tabindex="0"
      role="button"
      :color="props.color"
      :disabled="props.disabled"
    >
      <slot />
    </base-btn>

    <ul
      tabindex="0"
      class="mt-2 dropdown-content z-[1] menu shadow bg-slate-200 rounded w-52 divide-y divide-slate-300"
    >
      <li
        v-for="(item, index) in props.items"
        :key="item.label + index"
        :class="`${isDisabled(item.disabled) ? 'disabled' : ''} ${item.color ?? ''} my-1 cursor-pointer`"
        @click="runAction(item)"
      >
        <nuxt-link
          v-if="item.to"
          :to="item.to"
        >
          {{ item.label }}
        </nuxt-link>
        <span v-else>
          {{ item.label }}
        </span>
      </li>
    </ul>
  </div>
</template>
