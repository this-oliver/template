<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

type Link = {
	label: string;
	url: string;
	type: "internal" | "external";
	color?: string;
};

const links = computed<Link[]>(() => {
	const list: Link[] = [
		{ label: "Features", url: "/features", type: "internal" },
		{
			label: "Source Code",
			url: "https://github.com/this-oliver/template",
			type: "external",
		},
	];

	if (!authStore.isAuthenticated) {
		list.push({
			label: "Login",
			url: "/auth/login",
			type: "internal",
			color: "secondary",
		});
	}

	return list;
});
</script>

<template>
  <div
    class="flex flex-col md:flex-row px-10 py-5 justify-center md:justify-between"
  >
    <div class="flex flex-row gap-2">
      <base-btn
        v-for="link in links"
        :key="link.url"
        class="mx-1 hover:underline"
        color="bg-transparent"
        :to="link.type === 'internal' ? link.url : undefined"
        :href="link.type === 'external' ? link.url : undefined"
        :target="link.type === 'external' ? '_blank' : undefined"
      >
        {{ link.label }}
      </base-btn>
    </div>

    <div class="flex place-items-center justify-center">
      <p>
        template made by
        <a
          href="www.oliverrr.net"
          target="_blank"
        >oliverrr 🤠</a>
      </p>
    </div>
  </div>
</template>
