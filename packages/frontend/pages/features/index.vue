<script setup lang="ts">
import { useSidebarStore } from "~/stores/app";
import type { ActionItem } from '~/types';

useSeoSetup();

const { notify } = useNotification();
const sidebarStore = useSidebarStore();

const features: ActionItem[] = [
	{
		label: "Sidebar",
		hint: "Toggle the sidebar",
		action: () => sidebarStore.toggle(),
	},
	{
		label: "Authentication",
		hint: "Basic authentication",
		to: "/auth/login",
	},
	{
		label: "Forms",
		hint: "Form examples",
		to: "/features/form",
	},
	{
		label: "Notifications",
		hint: "Trigger notifications",
		action: () => notify("Hello", "This is a notification"),
	},
];
</script>

<template>
  <base-page>
    <div class="flex flex-col md:grid md:grid-cols-3 gap-2">
      <base-card
        v-for="feature in features"
        :key="feature.label"
        :title="feature.label"
        :subtitle="feature.hint"
        :actions="[
          { label: feature.label, to: feature.to, action: feature.action },
        ]"
        class="p-2 bg-slate-200"
      />
    </div>
  </base-page>
</template>
