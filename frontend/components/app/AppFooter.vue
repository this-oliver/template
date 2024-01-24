<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

type Link = {label: string, url: string, type: 'internal' | 'external', color?: string};

const links = computed<Link[]>(() => {
	const list: Link[] = [
		{ label: 'Features', url: '/features', type: 'internal' },
		{ label: 'Source Code', url: 'https://github.com/this-oliver/template', type: 'external' }
	];

	if (!authStore.isAuthenticated) {
		list.push({ label: 'Login', url: '/auth/login', type: 'internal', color: 'secondary' });
	}

	return list;
});

</script>

<template>
  <v-footer>
    <v-row
      justify="center"
      no-gutters
    >
      <base-btn
        v-for="link in links"
        :key="link.url"
        class="mx-1"
        text
        size="small"
        :color="link.color"
        :to="link.type === 'internal' ? link.url : undefined"
        :href="link.type === 'external' ? link.url : undefined"
        :target="link.type === 'external' ? '_blank' : undefined"
      >
        {{ link.label }}
      </base-btn>

      <v-col
        class="text-center mt-2"
        cols="12"
      >
        <p>
          template made by <a
            href="www.oliverrr.net"
            target="_blank"
          >oliverrr 🤠</a>
        </p>
      </v-col>
    </v-row>
  </v-footer>
</template>
