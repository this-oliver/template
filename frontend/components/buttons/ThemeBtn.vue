<script setup lang="ts">
import { useTheme } from '~/composables/useTheme';

const { dark } = useTheme();

const props = defineProps({
	listMode: {
		type: Boolean,
		default: false
	}
});

const icon = computed<string>(() => {
	return dark.value ? 'mdi-white-balance-sunny' : 'mdi-weather-night';
});

function toggleTheme() {
	dark.value = !dark.value;
}

</script>

<template>
  <v-list-item
    v-if="props.listMode"
    @click="toggleTheme"
  >
    <v-list-item-title>
      Theme
    </v-list-item-title>

    <template #prepend>
      <v-icon :icon="icon" />
    </template>
  </v-list-item>

  <base-btn
    v-else
    plain
    @click="toggleTheme"
    class="mx-1"
  >
    <v-icon :icon="icon" />
  </base-btn>
</template>