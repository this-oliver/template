<script setup lang="ts">
import type { DropDownItem } from '~/types';

const i18n = useI18n();

const supportedLanguages = computed<DropDownItem[]>(() => {
	return i18n.availableLocales.map((locale) => {
		return {
			label: locale.toUpperCase(),
			action: () => {
				i18n.locale.value = locale;
			}
		};
	});
});
</script>

<template>
  <base-dropdown :items="supportedLanguages">
    {{ $t("global.language") }}
  </base-dropdown>
</template>
