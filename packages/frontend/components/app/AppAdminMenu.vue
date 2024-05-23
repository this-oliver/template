<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import type { DropDownItem } from "~/types";

const authStore = useAuthStore();

const options = computed<DropDownItem[]>(() => {
	return [
		{ label: "Profile", to: "/profile" },
		{ label: "Shop", to: "/shop/edit" },
		{
			label: "Logout",
			color: "text-red-500",
			action: () => {
				console.log("logout");
				authStore.logout();
			},
		},
	];
});
</script>

<template>
  <div class="dropdown dropdown-end">
    <base-dropdown
      color="bg-warning"
      :items="options"
    >
      {{ authStore.user ? authStore.user.username : "Admin" }}
    </base-dropdown>
  </div>
</template>
